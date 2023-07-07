import { addFromNow } from '$lib/helpers/day';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, '/auth?redirectTo=/counter');
  }
  const { username } = locals.user!,
    counters = await locals.D1.prepare(
      'select username, createdAt from Com_Counter order by createdAt desc'
    )
      .all<{
        username: string;
        createdAt: Date;
      }>()
      .then((result) => result.results ?? [])
      .then((counters) => counters.map(addFromNow)),
    counter = counters.find((counter) => counter.username === username);
  return { counter, counters };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ locals }) => {
    const { username } = locals.user!;
    await locals.D1.prepare('insert into Com_Counter(username) values(?1)')
      .bind(username)
      .run();
  }
} satisfies Actions;
