import { logout } from '$lib/helpers/auth';
import { addFromNow } from '$lib/helpers/day';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const { username } = locals.user!,
    [threads, result] = await Promise.all([
      locals.D1.prepare(
        'select id, username, content, createdAt from Com_Thread where username != ?1 and parentId in (select id from Com_Thread where username=?1)'
      )
        .bind(username)
        .all<{
          id: number;
          username: string;
          content: string;
          createdAt: Date;
        }>()
        .then((result) => result.results ?? [])
        .then((threadss) => threadss.map(addFromNow)),
      locals.D1.prepare('select createdAt from Com_User where username=?1')
        .bind(username)
        .first<{ createdAt: Date }>()
    ]),
    { createdAt } = result!;
  return { threads, username, createdAt };
};

export const actions = {
  logout: ({ cookies, locals }) => {
    logout(cookies);
    throw redirect(303, '/');
  }
};
