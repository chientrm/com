import countriesUrl from '$lib/assets/geojson/WB_countries_Admin0_lowres.geojson';
import graticuleUrl from 'vite-geograticule:graticule10';
import type { PageLoad } from './$types';

export const load = async ({ fetch, data: { countryCode } }) => {
  const [countries, graticule] = await Promise.all([
      fetch(countriesUrl).then((res) => res.json<Country[]>()),
      fetch(graticuleUrl).then((res) => res.json<Group[]>())
    ]),
    radius = 150,
    centerOfMass = countries.find((c) => c.id === countryCode)?.centerOfMass
      .geometry.coordinates ?? [0, 0];
  return {
    radius,
    countries,
    graticule,
    countryCode,
    centerOfMass,
    title: 'globe',
    description: 'globe on chientrm.com'
  };
};
