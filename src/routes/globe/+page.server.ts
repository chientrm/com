import groupsUrl from '$lib/assets/geojson/WB_countries_Admin0_lowres.geojson';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const groups = await fetch(groupsUrl).then((res) => res.json<Group[]>()),
    radius = 150;
  return { radius, groups };
}) satisfies PageServerLoad;
