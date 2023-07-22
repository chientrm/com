import jsons from '$lib/assets/geojson/WB_countries_Admin0_lowres.geojson';
import type { PageServerLoad } from './$types';

export const load = (() => {
  const radius = 150;
  return { radius, jsons };
}) satisfies PageServerLoad;
