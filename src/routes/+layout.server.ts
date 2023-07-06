import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, request }) => {
  const { user, colorMode } = locals,
    url = new URL(request.url),
    pathname = url.pathname;
  if (user) {
    const { username } = user,
      { count } = await locals.D1.prepare(
        'select count(id) as count from Com_Ask where username != ?1 and parentId in (select id from Com_Ask where username=?1)'
      )
        .bind(username)
        .first<{ count: number }>();
    return { user, colorMode, pathname, count };
  }
  return { user, colorMode, pathname };
}) satisfies LayoutServerLoad;
