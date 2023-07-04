import { COOKIE_USER } from '$lib/constants/cookies';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
  logout: ({ cookies }) => {
    cookies.delete(COOKIE_USER);
    throw redirect(303, '/');
  }
} satisfies Actions;
