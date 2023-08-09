import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
  const { username } = params;
  if (username === locals.user?.username) {
    throw redirect(303, '/account');
  }
  const result = await locals.D1.prepare(
      'select createdAt from Com_User where username=?1'
    )
      .bind(username)
      .first<{ createdAt: Date }>(),
    { createdAt } = result!;
  return { username, createdAt };
}) satisfies PageServerLoad;
