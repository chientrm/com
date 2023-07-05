import { solve } from '$lib/helpers/solve';
import { validate } from '$lib/helpers/validate';
import { fail, redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions, PageServerLoad } from './$types';

export const load = (({ url }) => {
  const content = url.searchParams.get('content') ?? '';
  return { content };
}) satisfies PageServerLoad;

export const actions = {
  default: ({ request, locals }) =>
    solve(async () => {
      try {
        const { content } = await validate(request, {
          content: string().required().min(6).max(5000)
        });
        if (!locals.user) {
          return redirect(303, `/auth?redirectTo=/ask/new?content=${content}`);
        }
        const { username } = locals.user!,
          { id } = await locals.D1.prepare(
            'insert into Com_Ask(username, content) values(?1, ?2) returning id'
          )
            .bind(username, content)
            .first<{ id: number }>();
        return redirect(303, `/ask/${id}`);
      } catch (e: any) {
        const message = e.message;
        return fail(400, { message });
      }
    })
} satisfies Actions;
