import { validate } from '$lib/helpers/validate';
import { fail, redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions } from '../$types';

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/auth?redirectTo=/ask/new');
    }
    let id: number;
    try {
      const { username } = locals.user!,
        { content } = await validate(request, {
          content: string().required().min(6).max(5000)
        }),
        ask = await locals.D1.prepare(
          'insert into Com_Ask(username, content) values(?1, ?2) returning id'
        )
          .bind(username, content)
          .first<{ id: number }>();
      id = ask.id;
    } catch (e: any) {
      const message = e.message;
      return fail(400, { message });
    }
    throw redirect(303, `/ask/${id}`);
  }
} satisfies Actions;
