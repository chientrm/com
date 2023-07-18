import { adminUsername } from '$lib/constants/string';
import { getTweet } from '$lib/helpers/tweet';
import { unique } from '$lib/helpers/unique';
import { validate2 } from '$lib/helpers/validate';
import { string } from 'yup';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ parent, locals }) => {
  const { colorMode: _colorMode } = await parent(),
    colorMode = _colorMode === 'white' ? 'white' : 'dark',
    result = await locals.D1.prepare(
      'select url from Com_Ent where approvedAt is not null order by approvedAt'
    ).all<{ url: string }>(),
    urls = (result.results ?? []).map((i) => i.url),
    tweets = await Promise.all(urls.map(getTweet)),
    isAdmin = locals.user?.username === adminUsername;
  return { colorMode, tweets, isAdmin };
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
