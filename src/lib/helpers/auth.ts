import { COOKIE_USER } from '$lib/constants/cookies';
import type { Cookies } from '@sveltejs/kit';
import { sign } from './sign';

export const auth = async (cookies: Cookies, user: App.User) =>
  cookies.set(COOKIE_USER, await sign(user), {
    path: '/',
    maxAge: 30 * 24 * 60 * 60
  });
