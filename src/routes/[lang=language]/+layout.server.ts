import type { LayoutServerLoad } from './$types';

export const load = (({ params, locals }) => {
  const { lang } = params;
  locals.lang = lang as App.Language;
}) satisfies LayoutServerLoad;
