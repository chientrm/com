import { fromNow } from '$lib/helpers/day';
import type { PageServerLoad } from '../$types';

export const load = (async ({ locals }) => {
  const result = await locals.D1.prepare(
      'select id, username, content, createdAt from Com_Ask where parentId is null order by createdAt DESC limit 10'
    ).all<{ id: number; username: string; content: string; createdAt: Date }>(),
    asks = (result.results ?? []).map((ask) => ({
      ...ask,
      fromNow: fromNow(ask.createdAt)
    }));
  return { asks };
}) satisfies PageServerLoad;
