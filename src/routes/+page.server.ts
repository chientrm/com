import { changeLogs } from '$lib/constants/changelogs';
import { COOKIE_USER } from '$lib/constants/cookies';
import { addFromNow } from '$lib/helpers/day';
import type { Actions, PageServerLoad } from './$types';

export const load = (({ locals }) => {
  const { user } = locals,
    logs = changeLogs.map(addFromNow);
  return { logs, user };
}) satisfies PageServerLoad;

export const actions = {
  logout: ({ cookies, locals }) => {
    cookies.delete(COOKIE_USER);
    locals.user = undefined;
  }
} satisfies Actions;
