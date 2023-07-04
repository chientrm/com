import type { LayoutServerLoad } from './$types';

export const load = (({ locals }) => {
  const { user, colorMode } = locals;
  return { user, colorMode };
}) satisfies LayoutServerLoad;
