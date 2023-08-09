import { changeLogs } from '$lib/constants/changelogs';
import { addFromNow } from '$lib/helpers/day';
import type { PageServerLoad } from './$types';

export const load = (({ locals }) => {
  const { user } = locals,
    logs = changeLogs.map(addFromNow);
  return { logs, user };
}) satisfies PageServerLoad;
