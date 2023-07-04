import { building } from '$app/environment';
import { COOKIE_COLORMODE, COOKIE_USER } from '$lib/constants/cookies';
import { verify } from '$lib/helpers/crypt';
import type { Handle } from '@sveltejs/kit';
import { createD1 } from 'cf-workers-proxy';

export const handle = (async ({ event, resolve }) => {
  if (!building) {
    event.locals.D1 = event.platform?.env.D1 ?? createD1('D1');
    event.locals.tz = event.platform?.cf?.timezone ?? 'UTC';
    const userCookie = event.cookies.get(COOKIE_USER),
      colorMode = event.cookies.get(COOKIE_COLORMODE) as any;
    if (userCookie) {
      const user = await verify<App.User>(userCookie);
      event.locals.user = user;
    }
    event.locals.colorMode = colorMode ?? 'os';
  }
  return resolve(event);
}) satisfies Handle;
