import type { PageServerLoad } from './$types';

export const load = (({ platform }) => {
  const countryCode = platform?.cf?.country ?? 'US';
  return { countryCode };
}) satisfies PageServerLoad;
