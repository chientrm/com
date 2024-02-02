import { COOKIE_USER } from '$lib/constants/cookies';
import type { Cookies } from '@sveltejs/kit';
import { sign } from './sign';

const options = {
  path: '/',
  maxAge: 30 * 24 * 60 * 60
};

export const auth = async (cookies: Cookies, user: App.User) =>
  cookies.set(COOKIE_USER, await sign(user), options);

export const logout = async (cookies: Cookies) =>
  cookies.delete(COOKIE_USER, options);
