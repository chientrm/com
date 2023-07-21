import { validate2 } from '$lib/helpers/validate';
import { fail, redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions, PageServerLoad } from './$types';

export const load = (({ url }) => {
  const content = url.searchParams.get('content') ?? '';
  return { content };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, locals }) => {
    const { form, message } = await validate2(request, {
      content: string().required().max(5000)
    });
    if (message) {
      return fail(400, { message });
    }
    const { content } = form!;
    if (!locals.user) {
      throw redirect(303, `/auth?redirectTo=/ask/new?content=${content}`);
    }
    const { username } = locals.user!,
      result = await locals.D1.prepare(
        'insert into Com_Ask(username, content) values(?1, ?2) returning id'
      )
        .bind(username, content)
        .first<{ id: number }>(),
      { id } = result!;
    throw redirect(303, `/ask/${id}`);
  }
} satisfies Actions;
