import { adminUsername } from '$lib/constants/string';
import { getTweet } from '$lib/helpers/get_tweet';
import { validate } from '$lib/helpers/validate';
import { redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  if (locals.user?.username !== adminUsername) {
    throw redirect(302, '/');
  }
  const result = await locals.D1.prepare(
      'select url from Com_Ent where approvedAt is null order by createdAt desc'
    ).all<{ url: string }>(),
    urls = (result.results ?? []).map((i) => i.url),
    tweets = await Promise.all(urls.map(getTweet(locals.colorMode)));
  return { tweets };
}) satisfies PageServerLoad;

export const actions = {
  approve: async ({ request, locals }) => {
    if (locals.user?.username !== adminUsername) {
      throw redirect(302, '/');
    }
    const { url } = await validate(request, { url: string().required() });
    await locals.D1.prepare(
      'update Com_Ent set approvedAt = CURRENT_TIMESTAMP where url = ?1 and approvedAt is null'
    )
      .bind(url)
      .run();
  }
} satisfies Actions;
