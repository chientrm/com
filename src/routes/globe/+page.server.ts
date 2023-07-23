import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const { radius, groups } = await fetch('/globe/data.json').then((res) =>
    res.json<{ radius: number; groups: Group[] }>()
  );
  return { radius, groups };
}) satisfies PageServerLoad;
