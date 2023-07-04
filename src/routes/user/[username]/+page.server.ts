import { COOKIE_COLORMODE } from '$lib/constants/cookies';
import { validate } from '$lib/helpers/validate';
import { redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions, PageServerLoad } from './$types';

export const load = (({ locals }) => {
  const user = locals.user!,
    colorMode = locals.colorMode;
  return { user, colorMode };
}) satisfies PageServerLoad;

export const actions = {
  update: async ({ request, cookies }) => {
    const { colorMode } = await validate(request, {
      colorMode: string().required().oneOf(['os', 'dark', 'white'])
    });
    cookies.set(COOKIE_COLORMODE, colorMode, { path: '/' });
    throw redirect(303, '/');
  }
} satisfies Actions;
