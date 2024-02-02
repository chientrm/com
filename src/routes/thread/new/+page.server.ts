import { validate2 } from '$lib/helpers/validate';
import { redirect } from '@sveltejs/kit';
import { string } from 'yup';

export const load = ({ url }) => {
  const content = url.searchParams.get('content') ?? '';
  return {
    content,
    title: 'new thread',
    description: 'new thread on chientrm.com.'
  };
};

export const actions = {
  default: async ({ request, locals }) => {
    const { form, message } = await validate2(request, {
      content: string().label('Content').required().max(5000)
    });
    if (message) {
      return {};
    }
    const { content } = form!;
    if (!locals.user) {
      throw redirect(303, `/auth?redirectTo=/thread/new?content=${content}`);
    }
    const { username } = locals.user!,
      result = await locals.D1.prepare(
        'insert into Com_Thread(username, content) values(?1, ?2) returning id'
      )
        .bind(username, content)
        .first<{ id: number }>(),
      { id } = result!;
    throw redirect(303, `/thread/${id}`);
  }
};
