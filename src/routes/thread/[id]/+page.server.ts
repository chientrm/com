import { addFromNow, fromNow } from '$lib/helpers/day';
import { validate2 } from '$lib/helpers/validate';
import { Threads } from '$lib/schema';
import { fail, redirect } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import { string } from 'yup';

export const load = async ({ params, locals, url }) => {
  const id = parseInt(params.id);
  const user = await locals.db.query.Threads.findFirst({
    columns: { username: true, parentId: true, content: true, createdAt: true },
    where: eq(Threads.id, id)
  });
  const { username, parentId, content, createdAt } = user!;
  const replies = await locals.db.query.Threads.findMany({
    columns: { id: true, username: true, content: true, createdAt: true },
    where: eq(Threads.parentId, id),
    orderBy: [asc(Threads.createdAt)]
  }).then((threads) => threads.map(addFromNow));
  const reply = url.searchParams.get('reply') ?? '';
  return {
    id,
    username,
    parentId,
    content,
    createdAt,
    fromNow: fromNow(createdAt),
    reply,
    replies,
    title: username,
    description: 'ask'
  };
};

export const actions = {
  reply: async ({ params, request, locals }) => {
    const { form, message } = await validate2(request, {
      reply: string().label('Reply').required().max(5000)
    });
    if (message) {
      return fail(400, { message });
    }
    const parentId = parseInt(params.id);
    const content = form!.reply;
    if (!locals.user) {
      throw redirect(
        303,
        `/auth?redirectTo=/thread/${parentId}?reply=${content}`
      );
    }
    const { username } = locals.user!;
    await locals.db.insert(Threads).values({ username, content, parentId });
  }
};
