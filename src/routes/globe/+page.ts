import groupsUrl from '$lib/assets/geojson/WB_countries_Admin0_lowres.geojson';
import graticuleUrl from 'vite-geojson:graticule10.geojson';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  const [countries, graticule] = await Promise.all([
      fetch(groupsUrl).then((res) => res.json<Group[]>()),
      fetch(graticuleUrl).then((res) => res.json<Group[]>())
    ]),
    radius = 150;
  return { radius, countries, graticule };
}) satisfies PageLoad;
