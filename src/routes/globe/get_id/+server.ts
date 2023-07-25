import { countries_data } from '$lib/constants/countries_data';
import { cartesianToPolar } from '$lib/helpers/coords';
import { validate } from '$lib/helpers/validate';
import { json } from '@sveltejs/kit';
import PolygonLookup from 'polygon-lookup';
import { number } from 'yup';
import type { RequestHandler } from './$types';

export const POST = (async ({ request, fetch }) => {
  const { x, y, z } = await validate(request, {
      x: number().required(),
      y: number().required(),
      z: number().required()
    }),
    polygonLookup = new PolygonLookup(countries_data),
    [lng, lat] = cartesianToPolar({ x, y, z }),
    newLng = -(lng + 180),
    feature =
      polygonLookup.search(newLng, lat) ??
      polygonLookup.search(newLng + 360, lat);
  if (feature) {
    const { id, properties } = feature;
    return json({ id, properties });
  }
  return json({});
}) satisfies RequestHandler;
