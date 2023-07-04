import { COOKIE_COLOR_MODE } from '$lib/constants/cookies';
import type { LayoutServerLoad } from './$types';

export const load = (({ params, cookies, request }) => {
  const { lang } = params,
    l = lang as App.Language,
    c = (cookies.get(COOKIE_COLOR_MODE) ??
      request.headers.get('Sec-CH-Prefers-Color-Scheme') ??
      'dark') as App.ColorMode;
  return { l, c };
}) satisfies LayoutServerLoad;
