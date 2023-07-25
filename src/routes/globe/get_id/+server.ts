import smallMap from '$lib/assets/geojson/small_map.json';
import { cartesianToPolar } from '$lib/helpers/coords';
import { validate } from '$lib/helpers/validate';
import { json } from '@sveltejs/kit';
import type { FeatureCollection } from 'geojson';
import PolygonLookup from 'polygon-lookup';
import { number } from 'yup';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
  const { x, y, z } = await validate(request, {
      x: number().required(),
      y: number().required(),
      z: number().required()
    }),
    polygonLookup = new PolygonLookup(smallMap as FeatureCollection),
    [lng, lat] = cartesianToPolar({ x, y, z }),
    feature = polygonLookup.search(-lng, lat);
  if (feature) {
    const { id, properties } = feature;
    return json({ id, properties });
  }
  return json({});
}) satisfies RequestHandler;
