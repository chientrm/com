import { addFromNow } from '$lib/helpers/day';
import { Threads } from '$lib/schema';
import { desc, isNull } from 'drizzle-orm';

export const load = async ({ locals }) => {
  const threads = await locals.db.query.Threads.findMany({
    columns: { id: true, username: true, content: true, createdAt: true },
    where: isNull(Threads.parentId),
    orderBy: [desc(Threads.createdAt)]
  }).then((threads) => threads.map(addFromNow));
  return { threads, title: 'thread', description: 'all threads.' };
};
