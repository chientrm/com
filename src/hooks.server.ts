import type { Handle } from '@sveltejs/kit';

export const handle = (({ event, resolve }) => {
  event.setHeaders({
    'Accept-CH': 'Sec-CH-Prefers-Color-Scheme',
    Vary: 'Sec-CH-Prefers-Color-Scheme',
    'Critical-CH': 'Sec-CH-Prefers-Color-Scheme'
  });
  return resolve(event);
}) satisfies Handle;
