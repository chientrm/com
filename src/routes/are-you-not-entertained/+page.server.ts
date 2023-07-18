import { adminUsername } from '$lib/constants/string';
import { getTweet } from '$lib/helpers/get_tweet';
import { unique } from '$lib/helpers/unique';
import { validate2 } from '$lib/helpers/validate';
import { redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
  const result = await locals.D1.prepare(
      'select url from Com_Ent where approvedAt is not null order by approvedAt desc'
    ).all<{ url: string }>(),
    urls = (result.results ?? []).map((i) => i.url),
    tweets = await Promise.all(urls.map(getTweet(locals.colorMode))),
    _url = url.searchParams.get('url') ?? '';
  let reviewCount: number | null = null;
  if (locals.user?.username === adminUsername) {
    reviewCount = (
      await locals.D1.prepare(
        'select count(*) as reviewCount from Com_Ent where approvedAt is null'
      ).first<{ reviewCount: number }>()
    ).reviewCount;
  }
  return { tweets, reviewCount, url: _url };
}) satisfies PageServerLoad;

export const actions = {
  submit: async ({ request, locals, platform }) => {
    const { form, message } = await validate2(request, {
      url: string().required()
    });
    if (message) {
      return { message };
    }
    const { url } = form!;
    if (!locals.user) {
      throw redirect(
        303,
        `/auth?redirectTo=/are-you-not-entertained?url=${url}`
      );
    }
    const { username } = locals.user;
    try {
      await locals.D1.prepare(
        'insert into Com_Ent(url, username) values(?1, ?2)'
      )
        .bind(url, username)
        .run();
      await locals.WORKER.fetch('http://whatever.fake/send_email', {
        method: 'POST',
        body: JSON.stringify({
          name: 'entertained',
          addr: 'admin@chientrm.com',
          recipent: 'chientrm@gmail.com',
          subject: `${username} submited a tweet to chientrm.com`,
          data: `${username}'ve just submited a tweet. Url : ${url}\nReview now: https://chientrm.com/are-you-not-entertained/review`
        })
      });
    } catch (e) {
      if (unique(e)) {
        const message = 'Someone already submited this url';
        return { message };
      }
    }
  }
} satisfies Actions;
