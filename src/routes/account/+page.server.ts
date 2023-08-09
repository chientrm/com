import { COOKIE_USER } from '$lib/constants/cookies';
import { addFromNow } from '$lib/helpers/day';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const { username, email } = locals.user!,
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
  return { asks, username, email, createdAt, colorMode };
}) satisfies PageServerLoad;

export const actions = {
  logout: ({ cookies, locals }) => {
    cookies.delete(COOKIE_USER);
    locals.user = undefined;
    throw redirect(303, '/');
  }
} satisfies Actions;
