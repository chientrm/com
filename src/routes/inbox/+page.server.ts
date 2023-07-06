import { addFromNow, fromNow } from '$lib/helpers/day';
import type { PageServerLoad } from '../$types';

export const load = (async ({ locals }) => {
  const { username } = locals.user!,
    result = await locals.D1.prepare(
      'select id, username, content, createdAt from Com_Ask where username != ?1 and parentId in (select id from Com_Ask where username=?1)'
    )
      .bind(username)
      .all<{
        id: number;
        username: string;
        content: string;
        createdAt: Date;
      }>(),
    asks = (result.results ?? []).map(addFromNow);
  return { asks };
}) satisfies PageServerLoad;
