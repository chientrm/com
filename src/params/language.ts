import { languages } from '$lib/constants/languages';
import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param): param is App.Language => {
  return languages.includes(param as App.Language);
}) satisfies ParamMatcher;
