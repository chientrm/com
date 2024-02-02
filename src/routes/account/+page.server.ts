import { addFromNow } from '$lib/helpers/day';

export const load = async ({ locals }) => {
  const { username } = locals.user;
  const threads = await locals.D1.prepare(
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
    .then((threadss) => threadss.map(addFromNow));
  return { threads, username, title: 'account', description: username };
};
