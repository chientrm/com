import { changeLogs } from '$lib/constants/changelogs';
import { COOKIE_USER } from '$lib/constants/cookies';
import { addFromNow } from '$lib/helpers/day';
import type { Actions, PageServerLoad } from './$types';

export const load = (() => {
  const logs = changeLogs.map(addFromNow);
  return { logs };
}) satisfies PageServerLoad;

export const actions = {
  logout: ({ cookies, locals }) => {
    cookies.delete(COOKIE_USER);
    locals.user = undefined;
  }
} satisfies Actions;
