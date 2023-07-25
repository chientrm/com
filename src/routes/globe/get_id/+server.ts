import countriesUrl from '$lib/assets/geojson/WB_countries_Admin0_lowres.json?url';
import { cartesianToPolar } from '$lib/helpers/coords';
import { validate } from '$lib/helpers/validate';
import { json } from '@sveltejs/kit';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import type { FeatureCollection } from 'geojson';
import { number } from 'yup';
import type { RequestHandler } from './$types';

export const POST = (async ({ request, fetch }) => {
  const { x, y, z } = await validate(request, {
      x: number().required(),
      y: number().required(),
      z: number().required()
    }),
    collection = await fetch(countriesUrl).then((res) =>
      res.json<FeatureCollection>()
    ),
    [lng, lat] = cartesianToPolar({ x, y, z });
  for (const feature of collection.features) {
    if (
      booleanPointInPolygon(
        [lng, lat],
        // @ts-ignore
        feature
      )
    ) {
      const id = feature.id!,
        properties = feature.properties;
      return json({ id, properties });
    }
  }
  return json({});
}) satisfies RequestHandler;
