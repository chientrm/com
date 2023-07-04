import type { LayoutServerLoad } from './$types';

export const load = (({ locals, request }) => {
  const { user, colorMode } = locals,
    url = new URL(request.url),
    pathname = url.pathname;
  return { user, colorMode, pathname };
}) satisfies LayoutServerLoad;
