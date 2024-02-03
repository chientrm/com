import { unique } from '$lib/helpers/unique';
import { validate2 } from '$lib/helpers/validate';
import { Ents } from '$lib/schema';
import { redirect } from '@sveltejs/kit';
import { isNull, sql } from 'drizzle-orm';
import { string } from 'yup';

export const load = async ({ locals, url }) => {
  const _url = url.searchParams.get('url') ?? '';
  let reviewCount: number | null = null;
  const result = await locals.db
    .select({ count: sql<string>`count(*)` })
    .from(Ents)
    .where(isNull(Ents.approvedAt));
  reviewCount = parseInt(result[0].count);
  return {
    reviewCount,
    url: _url,
    title: 'submit tweet',
    description: 'submit your favorite tweet here to share with other.'
  };
};

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
      await locals.db.insert(Ents).values({ url, username });
      return { result: 'Submit successfully.' };
    } catch (e) {
      if (unique(e)) {
        const message = 'Someone already submited this url';
        return { message };
      }
    }
  }
};
