import { fromNow } from '$lib/helpers/day';
import { validate2 } from '$lib/helpers/validate';
import { fail, redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params, locals, url }) => {
  const { id } = params,
    result = await locals.D1.prepare(
      'select username, parentId, content, createdAt from Com_Thread where id=?1'
    )
      .bind(id)
      .first<{
        username: string;
        parentId?: number;
        content: string;
        createdAt: Date;
      }>(),
    { username, parentId, content, createdAt } = result!,
    repliesResult = await locals.D1.prepare(
      'select id, username, content, createdAt from Com_Thread where parentId=?1 order by createdAt'
    )
      .bind(id)
      .all<{
        id: number;
        username: string;
        content: string;
        createdAt: Date;
      }>(),
    replies = (repliesResult.results ?? []).map((reply) => ({
      ...reply,
      fromNow: fromNow(reply.createdAt)
    })),
    reply = url.searchParams.get('reply') ?? '';
  return {
    id,
    username,
    parentId,
    content,
    createdAt,
    fromNow: fromNow(createdAt),
    reply,
    replies
  };
}) satisfies PageServerLoad;

export const actions = {
  reply: async ({ params, request, locals }) => {
    const { form, message } = await validate2(request, {
      reply: string().label('Reply').required().max(5000)
    });
    if (message) {
      return fail(400, { message });
    }
    const { id } = params,
      { reply } = form!;
    if (!locals.user) {
      throw redirect(303, `/auth?redirectTo=/thread/${id}?reply=${reply}`);
    }
    const { username } = locals.user!;
    await locals.D1.prepare(
      'insert into Com_Thread(username, content, parentId) values(?1, ?2, ?3) returning id'
    )
      .bind(username, reply, id)
      .first<{ id: number }>();
  }
} satisfies Actions;
