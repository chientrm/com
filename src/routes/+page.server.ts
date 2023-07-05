import { COOKIE_USER } from '$lib/constants/cookies';
import type { Actions } from './$types';

export const actions = {
  logout: ({ cookies, locals }) => {
    cookies.delete(COOKIE_USER);
    locals.user = undefined;
  }
} satisfies Actions;
