import type { Handle } from '@sveltejs/kit';

export const handle = (({ event, resolve }) => {
  event.locals.country = event.platform?.cf?.country === 'VN' ? 'VN' : 'US';
  return resolve(event);
}) satisfies Handle;
