import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
  const { id } = params,
    { username, content, createdAt } = await locals.D1.prepare(
      'select username, content, createdAt from Com_Ask where id=?1'
    )
      .bind(id)
      .first<{ username: string; content: string; createdAt: Date }>();
  return { username, content, createdAt };
}) satisfies PageServerLoad;
