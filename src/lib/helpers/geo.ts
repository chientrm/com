import { BufferGeometry, Float32BufferAttribute } from 'three';

import earcut from 'earcut';

import { geoDistance, geoInterpolate } from 'd3-geo';
import type { Geometry, Position } from 'geojson';

type Result = { vertices: number[]; indices: number[] };

class GeoJsonGeometry extends BufferGeometry {
  radius: number;
  constructor(geometry: Geometry, radius = 1, resolution = 5) {
    super();
    this.radius = radius;

    const groups =
      geometry.type === 'LineString'
        ? genLineString(geometry.coordinates)
        : geometry.type === 'MultiLineString'
        ? genMultiLineString(geometry.coordinates)
        : geometry.type === 'Polygon'
        ? genPolygon(geometry.coordinates)
        : geometry.type === 'MultiPolygon'
        ? genMultiPolygon(geometry.coordinates)
        : null;
    if (groups === null) {
      throw new Error();
    }

    const indices: number[] = [],
      vertices: number[] = [];
    let groupCount = 0;
    groups.forEach((group) => {
      const prevIndCnt = indices.length;
      concatGroup({ indices, vertices }, group);
      this.addGroup(prevIndCnt, indices.length - prevIndCnt, groupCount++);
    });

    indices.length && this.setIndex(indices);
    vertices.length &&
      this.setAttribute('position', new Float32BufferAttribute(vertices, 3));

    function genLineString(line: Position[]) {
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

    function genMultiLineString(lines: Position[][]) {
      const result: Result = { vertices: [], indices: [] };

      lines
        .map((line) => genLineString(line))
        .forEach(([line]) => {
          concatGroup(result, line);
        });

      return [result];
    }

    function genPolygon(coords: Position[][]) {
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

    function genMultiPolygon(coords: Position[][][]) {
      const outer: Result = { vertices: [], indices: [] };
      const holes: Result = { vertices: [], indices: [] };

      coords
        .map((c) => genPolygon(c))
        .forEach(([newOuter, newHoles]) => {
          concatGroup(outer, newOuter);
          newHoles && concatGroup(holes, newHoles);
        });

      const groups = [outer];
      holes.vertices.length && groups.push(holes);

      return groups;
    }
  }
}

function concatGroup(main: Result, extra: Result) {
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

export { GeoJsonGeometry };
