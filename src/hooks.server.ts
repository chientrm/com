import { COOKIE_USER } from '$lib/constants/cookies';
import { anonymousUsername } from '$lib/constants/string';
import { verify } from '$lib/helpers/verify';
import * as schema from '$lib/schema';
import { drizzle } from 'drizzle-orm/d1';
import { connectD1 } from 'wrangler-proxy';

export const handle = async ({ event, resolve }) => {
  const D1 = event.platform?.env.D1 ?? connectD1('D1');
  event.locals.db = drizzle(D1, { schema });
  const userCookie = event.cookies.get(COOKIE_USER);
  if (userCookie) {
    const user = await verify<App.User>(userCookie);
    event.locals.user = user;
  } else {
    event.locals.user = { username: anonymousUsername };
  }
  return resolve(event);
};
