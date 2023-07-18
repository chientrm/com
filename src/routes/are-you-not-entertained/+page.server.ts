import { adminUsername } from '$lib/constants/string';
import { getTweet } from '$lib/helpers/get_tweet';
import { unique } from '$lib/helpers/unique';
import { validate2 } from '$lib/helpers/validate';
import { string } from 'yup';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const result = await locals.D1.prepare(
      'select url from Com_Ent where approvedAt is not null order by approvedAt'
    ).all<{ url: string }>(),
    urls = (result.results ?? []).map((i) => i.url),
    tweets = await Promise.all(urls.map(getTweet(locals.colorMode)));
  let reviewCount: number | null = null;
  if (locals.user?.username === adminUsername) {
    reviewCount = (
      await locals.D1.prepare(
        'select count(*) as reviewCount from Com_Ent where approvedAt is null'
      ).first<{ reviewCount: number }>()
    ).reviewCount;
  }
  return { tweets, reviewCount };
}) satisfies PageServerLoad;

export const actions = {
  submit: async ({ request, locals }) => {
    const { form, message } = await validate2(request, {
      url: string().required()
    });
    if (message) {
      return { message };
    }
    const { url } = form!;
    try {
      await locals.D1.prepare('insert into Com_Ent(url) values(?1)')
        .bind(url)
        .run();
    } catch (e) {
      if (unique(e)) {
        const message = 'Someone already submited this url';
        return { message };
      }
    }
  }
} satisfies Actions;
