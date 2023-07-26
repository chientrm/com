import { cartesianToPolar } from '$lib/helpers/coords';
import { validate } from '$lib/helpers/validate';
import { json } from '@sveltejs/kit';
import PolygonLookup from 'polygon-lookup';
import map from 'vite-geoprop:smallmapwithproperties';
import { number } from 'yup';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
  const { x, y, z } = await validate(request, {
      x: number().required(),
      y: number().required(),
      z: number().required()
    }),
    polygonLookup = new PolygonLookup(map),
    [lng, lat] = cartesianToPolar({ x, y, z }),
    feature = polygonLookup.search(-lng, lat);
  if (feature) {
    const id = feature.id!,
      properties = feature.properties;
    return json({ id, properties });
  }
  return json({});
}) satisfies RequestHandler;
