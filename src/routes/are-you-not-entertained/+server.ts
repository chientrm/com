import { getTweet } from '$lib/helpers/get_tweet';
import { Ents } from '$lib/schema';
import { json } from '@sveltejs/kit';
import { desc, lt } from 'drizzle-orm';

export const GET = async ({ locals, url }) => {
  const approvedAt = url.searchParams.get('approvedAt')!;
  const tweets = await locals.db.query.Ents.findMany({
    columns: { url: true, approvedAt: true },
    where: lt(Ents.approvedAt, approvedAt),
    orderBy: [desc(Ents.approvedAt)],
    limit: 2
  }).then((ents) =>
    Promise.all(
      ents.map(async ({ url, approvedAt }) => ({
        ...(await getTweet(url)),
        approvedAt
      }))
    )
  );
  return json(tweets);
};
