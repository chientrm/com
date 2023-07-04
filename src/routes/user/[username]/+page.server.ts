import type { PageServerLoad } from './$types';

export const load = (({ locals }) => {
  const user = locals.user!;
  return { user };
}) satisfies PageServerLoad;
