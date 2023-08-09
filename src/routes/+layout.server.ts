import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, request }) => {
  const { user } = locals,
    url = new URL(request.url),
    pathname = url.pathname;
  if (user) {
    const { username } = user,
      result = await locals.D1.prepare(
        'select count(id) as count from Com_Thread where username != ?1 and parentId in (select id from Com_Thread where username=?1)'
      )
        .bind(username)
        .first<{ count: number }>(),
      { count } = result!;
    return { user, pathname, count };
  }
  return { user, pathname };
}) satisfies LayoutServerLoad;
