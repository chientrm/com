import { COOKIE_COLORMODE } from '$lib/constants/cookies';
import { addFromNow } from '$lib/helpers/day';
import { validate } from '$lib/helpers/validate';
import { redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const { username } = locals.user!,
    [asks, result] = await Promise.all([
      locals.D1.prepare(
        'select id, username, content, createdAt from Com_Ask where username != ?1 and parentId in (select id from Com_Ask where username=?1)'
      )
        .bind(username)
        .all<{
          id: number;
          username: string;
          content: string;
          createdAt: Date;
        }>()
        .then((result) => result.results ?? [])
        .then((asks) => asks.map(addFromNow)),
      locals.D1.prepare('select createdAt from Com_User where username=?1')
        .bind(username)
        .first<{ createdAt: Date }>()
    ]),
    { createdAt } = result!,
    colorMode = locals.colorMode;
  return { asks, username, createdAt, colorMode };
}) satisfies PageServerLoad;

export const actions = {
  update: async ({ request, cookies }) => {
    const { colorMode } = await validate(request, {
      colorMode: string().required().oneOf(['os', 'dark', 'white'])
    });
    cookies.set(COOKIE_COLORMODE, colorMode, {
      path: '/',
      maxAge: 365 * 24 * 3600
    });
    throw redirect(303, '/');
  }
} satisfies Actions;
