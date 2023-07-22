import { GeoJsonGeometry } from './src/lib/helpers/geo';
import type { FeatureCollection } from 'geojson';
import type { Plugin } from 'vite';

const fileRegex = /\.(geojson)$/;

export const geoJson = (): Plugin => {
  return {
    name: 'geoJson',
    transform(code, id, options) {
      if (fileRegex.test(id)) {
        return {
          code: compile(code),
          map: null
        };
      }
    }
  };
};

function compile(code: string): string | undefined {
  const radius = 150,
    featureCollection = JSON.parse(code) as FeatureCollection,
    object: ProcessedGeometry[] = featureCollection.features.map(
      ({ geometry }) => new GeoJsonGeometry({ geometry, radius }).toJson()
    ),
    json = JSON.stringify(object);
  return `export default ${json}`;
}
