import { COOKIE_USER } from '$lib/constants/cookies';
import type { Cookies } from '@sveltejs/kit';
import { sign } from './getPrivateKey';

export const auth = async (cookies: Cookies, user: App.User) =>
  cookies.set(COOKIE_USER, await sign(user), {
    path: '/',
    maxAge: 7 * 24 * 3600
  });
