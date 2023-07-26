import type { PageServerLoad } from './$types';

export const load = (({ platform }) => {
  const country = platform?.cf?.country ?? 'US';
  return { country };
}) satisfies PageServerLoad;
