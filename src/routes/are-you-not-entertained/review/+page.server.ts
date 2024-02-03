import { adminUsername } from '$lib/constants/string';
import { getTweet2 } from '$lib/helpers/get_tweet';
import { validate } from '$lib/helpers/validate';
import { Ents } from '$lib/schema';
import { error } from '@sveltejs/kit';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { string } from 'yup';

export const load = async ({ locals }) => {
  const tweets = await locals.db.query.Ents.findMany({
    columns: { url: true },
    where: isNull(Ents.approvedAt),
    orderBy: [desc(Ents.createdAt)]
  }).then((ents) => Promise.all(ents.map(getTweet2)));
  return { tweets };
};

export const actions = {
  approve: async ({ request, locals }) => {
    if (locals.user.username !== adminUsername) {
      error(401);
    }
    const { url } = await validate(request, { url: string().required() });
    await locals.db
      .update(Ents)
      .set({ approvedAt: sql`CURRENT_TIMESTAMP` })
      .where(and(eq(Ents.url, url), isNull(Ents.approvedAt)));
  }
};
