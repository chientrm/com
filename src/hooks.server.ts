import type { Handle } from '@sveltejs/kit';

export const handle = (({ event, resolve }) => {
  return resolve(event);
}) satisfies Handle;
