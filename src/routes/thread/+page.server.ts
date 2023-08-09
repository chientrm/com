import { fromNow } from '$lib/helpers/day';
import type { PageServerLoad } from '../$types';

export const load = (async ({ locals }) => {
  const result = await locals.D1.prepare(
      'select id, username, content, createdAt from Com_Thread where parentId is null order by createdAt DESC'
    ).all<{ id: number; username: string; content: string; createdAt: Date }>(),
    threads = (result.results ?? []).map((thread) => ({
      ...thread,
      fromNow: fromNow(thread.createdAt)
    }));
  return { threads };
}) satisfies PageServerLoad;
