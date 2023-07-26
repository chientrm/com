import { dataToEsm } from '@rollup/pluginutils';
import { geoDistance, geoGraticule10, geoInterpolate } from 'd3-geo';
import earcut from 'earcut';
import type { Geometry, Position } from 'geojson';
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

const parse = (geometry: Geometry, radius: number, resolution: number) => {
  const groups =
    geometry.type === 'LineString'
      ? genLineString(geometry.coordinates, radius, resolution)
      : geometry.type === 'MultiLineString'
      ? genMultiLineString(geometry.coordinates, radius, resolution)
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
  return (base?.replace(/\/$/, '') || '') + '/@vite-geograticule/';
}

export const geograticule = (
  { radius, resolution }: { radius: number; resolution: number } = {
    radius: 150,
    resolution: 1
  }
): Plugin => {
  let viteConfig: ResolvedConfig;
  let basePath: string;

  const generatedGraiticules = new Map<string, string>(),
    graticule10 = 'graticule10';
  generatedGraiticules.set(
    graticule10,
    JSON.stringify([parse(geoGraticule10(), radius, resolution)])
  );

  return {
    name: 'vite-geograticule',
    enforce: 'pre',
    configResolved(config) {
      viteConfig = config;
      basePath = createBasePath(viteConfig.base);
    },
    resolveId(source) {
      if (source.startsWith('vite-geograticule:')) {
        return source;
      }
    },
    load(id) {
      if (id === `vite-geograticule:${graticule10}`) {
        if (this.meta.watchMode) {
          return dataToEsm(basePath + graticule10);
        } else {
          const fileHandle = this.emitFile({
            name: `graticule10.json`,
            source: generatedGraiticules.get(graticule10),
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
            graticule = generatedGraiticules.get(id)!;
          res.setHeader('Content-Type', `application/json`);
          res.setHeader('Cache-Control', 'max-age=360000');
          res.end(graticule);
        } else {
          next();
        }
      });
    }
  };
};
