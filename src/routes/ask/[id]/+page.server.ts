import { formatDate } from '$lib/helpers/day';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
  const { id } = params,
    { tz } = locals,
    { username, content, createdAt } = await locals.D1.prepare(
      'select username, content, createdAt from Com_Ask where id=?1'
    )
      .bind(id)
      .first<{ username: string; content: string; createdAt: Date }>(),
    date = formatDate(createdAt, tz, 'h:mm a - MMM DD YYYY');
  return { username, content, createdAt, date };
}) satisfies PageServerLoad;
