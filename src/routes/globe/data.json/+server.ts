import _groups from '$lib/assets/geojson/WB_countries_Admin0_lowres.geojson';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET = (() => {
  const radius = 150;
  const groups = _groups.map(({ indices, vertices }) => ({
    indices: Array.from(
      new Uint16Array(Uint8Array.from(Buffer.from(indices, 'base64')).buffer)
    ),
    vertices: Array.from(
      new Float32Array(Uint8Array.from(Buffer.from(vertices, 'base64')).buffer)
    )
  }));
  return json({ radius, groups });
}) satisfies RequestHandler;
