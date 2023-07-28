import type { FeatureCollection, GeoJsonProperties } from 'geojson';
import type { Plugin, ResolvedConfig } from 'vite';
import lowresMap from '../src/lib/assets/geojson/WB_countries_Admin0_lowres.json';
import smallMap from '../src/lib/assets/geojson/small_map.json';

export const geoprop = (): Plugin => {
  let viteConfig: ResolvedConfig;

  const generatedGeoprop = new Map<string, string>(),
    smallmapwithproperties = 'smallmapwithproperties';
  const propertiesMap = new Map<string, GeoJsonProperties>();
  (lowresMap as FeatureCollection).features.forEach((feature) => {
    const id = feature.properties!.ISO_A2;
    propertiesMap.set(id, feature.properties);
  });
  (smallMap as FeatureCollection).features.forEach((feature) => {
    const id = feature.id! as string;
    feature.properties = propertiesMap.get(id) ?? {};
  });
  generatedGeoprop.set('smallmapwithproperties', JSON.stringify(smallMap));

  return {
    name: 'vite-geoprop',
    enforce: 'pre',
    configResolved(config) {
      viteConfig = config;
    },
    resolveId(source) {
      if (source.startsWith('vite-geoprop:')) {
        return source;
      }
    },
    load(id) {
      if (id === `vite-geoprop:${smallmapwithproperties}`) {
        const json = generatedGeoprop.get(smallmapwithproperties),
          result = `export default ${json}`;
        return result;
      }
    }
  };
};
