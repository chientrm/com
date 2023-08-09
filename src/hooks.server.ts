import { building } from '$app/environment';
import { COOKIE_USER } from '$lib/constants/cookies';
import { verify } from '$lib/helpers/crypt';
import type { Handle } from '@sveltejs/kit';
import { createD1 } from 'cf-workers-proxy';
import { createServiceBinding } from 'cf-workers-proxy/src/worker';

export const handle = (async ({ event, resolve }) => {
  if (!building) {
    event.locals.D1 = event.platform?.env.D1 ?? createD1('D1');
    event.locals.WORKER =
      event.platform?.env.WORKER ?? createServiceBinding('WORKER');
    event.locals.tz = event.platform?.cf?.timezone ?? 'UTC';
    const userCookie = event.cookies.get(COOKIE_USER);
    if (userCookie) {
      const user = await verify<App.User>(userCookie);
      event.locals.user = user;
    }
  }
  return resolve(event);
}) satisfies Handle;
