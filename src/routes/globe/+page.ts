import countriesUrl from '$lib/assets/geojson/WB_countries_Admin0_lowres.geojson';
import graticuleUrl from 'vite-geojson:graticule10';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  const [countries, graticule] = await Promise.all([
      fetch(countriesUrl).then((res) => res.json<Country[]>()),
      fetch(graticuleUrl).then((res) => res.json<Group[]>())
    ]),
    radius = 150;
  return { radius, countries, graticule };
}) satisfies PageLoad;
