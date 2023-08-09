import { adminUsername, support_email } from '$lib/constants/string';
import { unique } from '$lib/helpers/unique';
import { validate2 } from '$lib/helpers/validate';
import { redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
  const _url = url.searchParams.get('url') ?? '';
  let reviewCount: number | null = null;
  if (locals.user?.username === adminUsername) {
    const result = await locals.D1.prepare(
      'select count(*) as reviewCount from Com_Ent where approvedAt is null'
    ).first<{ reviewCount: number }>();
    reviewCount = result!.reviewCount;
  }
  return { reviewCount, url: _url };
}) satisfies PageServerLoad;

export const actions = {
  submit: async ({ request, locals }) => {
    const { form, message } = await validate2(request, {
      url: string().label('Url').required()
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
      locals.WORKER.fetch('http://whatever.fake/send_email', {
        method: 'POST',
        body: JSON.stringify({
          name: 'entertained',
          addr: support_email,
          recipent: 'chientrm@gmail.com',
          subject: `${username} submited a tweet to chientrm.com`,
          data: `${username}'ve just submited a tweet. Url : ${url}\nReview now: https://chientrm.com/are-you-not-entertained/review`
        })
      });
      return { result: 'Submit successfully.' };
    } catch (e) {
      if (unique(e)) {
        const message = 'Someone already submited this url';
        return { message };
      }
    }
  }
} satisfies Actions;
