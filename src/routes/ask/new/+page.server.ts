import { validate } from '$lib/helpers/validate';
import { fail, redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions } from '../$types';

export const actions = {
  default: async ({ request, locals }) => {
    try {
      const { username } = locals.user!,
        { content } = await validate(request, {
          content: string().required().min(6).max(5000)
        }),
        { id } = await locals.D1.prepare(
          'insert into Com_Ask(username, content) values(?1, ?2) returning id'
        )
          .bind(username, content)
          .first<{ id: number }>();
      console.log({ id });
      throw redirect(303, `/ask/${id}`);
    } catch (e: any) {
      const message = e.message;
      return fail(400, { message });
    }
  }
} satisfies Actions;
