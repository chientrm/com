import { geoDistance, geoInterpolate } from 'd3-geo';
import earcut from 'earcut';
import type { FeatureCollection, Geometry, Position } from 'geojson';
import type { Plugin } from 'vite';

const fileRegex = /\.(geojson)$/;

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

const parse = (
  geometry: Geometry,
  radius: number,
  resolution: number,
  precision: number
) => {
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
  result.vertices = result.vertices.map(reduceToX(precision));
  return result;
};

function reduceToX(precision: number) {
  return (value: number) => parseFloat(value.toFixed(precision));
}

export const geoJson = (
  {
    radius,
    resolution,
    precision
  }: { radius: number; resolution: number; precision: number } = {
    radius: 150,
    resolution: 1,
    precision: 2
  }
): Plugin => {
  return {
    name: 'geoJson',
    transform(code, id, options) {
      if (fileRegex.test(id)) {
        const collection = JSON.parse(code) as FeatureCollection,
          object: Group[] = collection.features.map(({ geometry }) =>
            parse(geometry, radius, resolution, precision)
          ),
          json = JSON.stringify(object),
          result = { code: `export default ${json}`, map: null };
        return result;
      }
    }
  };
};
