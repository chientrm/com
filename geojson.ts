import { dataToEsm } from '@rollup/pluginutils';
import { createHash } from 'crypto';
import { geoDistance, geoGraticule10, geoInterpolate } from 'd3-geo';
import earcut from 'earcut';
import fs from 'fs';
import type { FeatureCollection, Geometry, Position } from 'geojson';
import { basename, extname } from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';

function interpolateLine(positions: Position[] = [], maxDegDistance = 1) {
  const result: Position[] = [];

  let prevPosition: Position | null = null;
  positions.forEach((position) => {
    if (prevPosition) {
      const pos = position as [number, number],
        prevPos = prevPosition as [number, number];
      const dist = (geoDistance(pos, prevPos) * 180.0) / Math.PI;
      if (dist > maxDegDistance) {
        const interpol = geoInterpolate(prevPos, pos);
        const tStep = 1.0 / Math.ceil(dist / maxDegDistance);

        let t = tStep;
        while (t < 1) {
          result.push(interpol(t));
          t += tStep;
        }
      }
    }
    result.push((prevPosition = position));
  });

  return result;
}

function concatGroup(main: Group, extra: Group) {
  const prevVertCnt = Math.round(main.vertices.length / 3);
  concatArr(main.vertices, extra.vertices);
  concatArr(
    main.indices,
    extra.indices.map((index) => index + prevVertCnt)
  );
}

function concatArr<T>(target: T[], src: T[]) {
  for (const e of src) target.push(e);
}

function polar2Cartesian(lat: number, lng: number, r = 0) {
  const phi = ((90.0 - lat) * Math.PI) / 180.0;
  const theta = ((90.0 - lng) * Math.PI) / 180.0;
  return [
    r * Math.sin(phi) * Math.cos(theta), // x
    r * Math.cos(phi), // y
    r * Math.sin(phi) * Math.sin(theta) // z
  ];
}

function genLineString(line: Position[], radius: number, resolution: number) {
  const coords3d = interpolateLine(line, resolution).map(([lng, lat]) =>
      polar2Cartesian(lat, lng, radius)
    ),
    { vertices } = earcut.flatten([coords3d]),
    numPoints = Math.round(vertices.length / 3),
    indices: number[] = [];

  for (let i = 1; i < numPoints; i++) {
    indices.push(i - 1, i);
  }

  return [{ vertices, indices }];
}

function genMultiLineString(
  lines: Position[][],
  radius: number,
  resolution: number
) {
  const result: Group = { vertices: [], indices: [] };

  lines
    .map((line) => genLineString(line, radius, resolution))
    .forEach(([line]) => {
      concatGroup(result, line);
    });

  return [result];
}

function genPolygon(coords: Position[][], radius: number, resolution: number) {
  const coords3d = coords.map((coordsSegment) =>
    interpolateLine(coordsSegment, resolution).map(([lng, lat]) =>
      polar2Cartesian(lat, lng, radius)
    )
  );

  // Each point generates 3 vertice items (x,y,z).
  const { vertices, holes } = earcut.flatten(coords3d);

  const firstHoleIdx = holes[0] || Infinity;
  const outerVertices = vertices.slice(0, firstHoleIdx * 3);
  const holeVertices = vertices.slice(firstHoleIdx * 3);

  const holesIdx = new Set(holes);

  const numPoints = Math.round(vertices.length / 3);

  const outerIndices = [],
    holeIndices = [];
  for (let vIdx = 1; vIdx < numPoints; vIdx++) {
    if (!holesIdx.has(vIdx)) {
      if (vIdx < firstHoleIdx) {
        outerIndices.push(vIdx - 1, vIdx);
      } else {
        holeIndices.push(vIdx - 1 - firstHoleIdx, vIdx - firstHoleIdx);
      }
    }
  }

  const groups = [{ indices: outerIndices, vertices: outerVertices }];

  if (holes.length) {
    groups.push({ indices: holeIndices, vertices: holeVertices });
  }

  return groups;
}

function genMultiPolygon(
  coords: Position[][][],
  radius: number,
  resolution: number
) {
  const outer: Group = { vertices: [], indices: [] };
  const holes: Group = { vertices: [], indices: [] };

  coords
    .map((c) => genPolygon(c, radius, resolution))
    .forEach(([newOuter, newHoles]) => {
      concatGroup(outer, newOuter);
      newHoles && concatGroup(holes, newHoles);
    });

  const groups = [outer];
  holes.vertices.length && groups.push(holes);

  return groups;
}

const parse = (geometry: Geometry, radius: number, resolution: number) => {
  const groups =
    geometry.type === 'LineString'
      ? genLineString(geometry.coordinates, radius, resolution)
      : geometry.type === 'MultiLineString'
      ? genMultiLineString(geometry.coordinates, radius, resolution)
      : geometry.type === 'Polygon'
      ? genPolygon(geometry.coordinates, radius, resolution)
      : geometry.type === 'MultiPolygon'
      ? genMultiPolygon(geometry.coordinates, radius, resolution)
      : null;
  if (groups === null) {
    throw new Error();
  }
  const result: Group = { vertices: [], indices: [] };
  groups.forEach((group) => {
    concatGroup(result, group);
  });
  return result;
};

function createBasePath(base?: string) {
  return (base?.replace(/\/$/, '') || '') + '/@vite-geojson/';
}

function parseURL(rawURL: string) {
  return new URL(rawURL.replace(/#/g, '%23'), 'file://');
}

function generateId(url: URL) {
  const baseURL = url.host
    ? new URL(url.origin + url.pathname)
    : new URL(url.protocol + url.pathname);

  return createHash('sha1').update(baseURL.href).digest('hex');
}

export const geoJson = (
  { radius, resolution }: { radius: number; resolution: number } = {
    radius: 150,
    resolution: 1
  }
): Plugin => {
  let viteConfig: ResolvedConfig;
  let basePath: string;

  const generatedGeojson = new Map<string, string>(),
    graticule10 = 'graticule10';
  generatedGeojson.set(
    graticule10,
    JSON.stringify([parse(geoGraticule10(), radius, resolution)])
  );

  return {
    name: 'vite-geojson',
    enforce: 'pre',
    configResolved(config) {
      viteConfig = config;
      basePath = createBasePath(viteConfig.base);
    },
    resolveId(source, importer, options) {
      if (source.startsWith('vite-geojson:')) {
        return source;
      }
    },
    load(id, options) {
      if (!/\.geojson$/.test(id)) {
        return null;
      }
      if (id === `vite-geojson:${graticule10}.geojson`) {
        if (this.meta.watchMode) {
          return dataToEsm(basePath + graticule10);
        } else {
          const fileHandle = this.emitFile({
            name: `graticule10.json`,
            source: generatedGeojson.get(graticule10),
            type: 'asset'
          });
          return dataToEsm(`__VITE_ASSET__${fileHandle}__`);
        }
      } else {
        const srcURL = parseURL(id),
          raw = fs.readFileSync(srcURL).toString('utf-8'),
          collection = JSON.parse(raw) as FeatureCollection,
          groups: Group[] = collection.features.map(({ geometry }) =>
            parse(geometry, radius, resolution)
          ),
          groupsString = JSON.stringify(groups);
        if (this.meta.watchMode) {
          const id = generateId(srcURL);
          generatedGeojson.set(id, groupsString);
          return dataToEsm(basePath + id);
        } else {
          const fileHandle = this.emitFile({
            name: basename(srcURL.pathname, extname(srcURL.pathname)) + `.json`,
            source: JSON.stringify(groups),
            type: 'asset'
          });
          return dataToEsm(`__VITE_ASSET__${fileHandle}__`);
        }
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith(basePath)) {
          const [, id] = req.url.split(basePath),
            geojson = generatedGeojson.get(id)!;
          res.setHeader('Content-Type', `application/json`);
          res.setHeader('Cache-Control', 'max-age=360000');
          res.end(geojson);
        } else {
          next();
        }
      });
    }
  };
};
