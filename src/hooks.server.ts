import { building } from '$app/environment';
import { COOKIE_USER } from '$lib/constants/cookies';
import { verify } from '$lib/helpers/crypt';
import type { Handle } from '@sveltejs/kit';
import { createD1 } from 'cf-workers-proxy';

export const handle = (async ({ event, resolve }) => {
  if (!building) {
    event.locals.D1 = event.platform?.env.D1 ?? createD1('D1');
    event.locals.tz = event.platform?.cf?.timezone ?? 'UTC';
    const cookie = event.cookies.get(COOKIE_USER);
    if (cookie) {
      const user = await verify<App.User>(cookie);
      event.locals.user = user;
    }
  }
  return resolve(event);
}) satisfies Handle;
