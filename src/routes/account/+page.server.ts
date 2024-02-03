import { addFromNow } from '$lib/helpers/day';
import { Threads } from '$lib/schema';
import { and, eq, inArray } from 'drizzle-orm';

export const load = async ({ locals }) => {
  const { username } = locals.user;
  const ids = await locals.db.query.Threads.findMany({
    columns: { id: true },
    where: eq(Threads.username, username)
  }).then((threads) => threads.map(({ id }) => id));
  const threads = await locals.db.query.Threads.findMany({
    columns: { id: true, username: true, content: true, createdAt: true },
    where: and(eq(Threads.username, username), inArray(Threads.parentId, ids))
  }).then((threads) => threads.map(addFromNow));
  return { threads, username, title: 'account', description: username };
};
