import { getTweet } from '$lib/helpers/get_tweet';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ locals, url }) => {
  const approvedAt = url.searchParams.get('approvedAt')!,
    result = await locals.D1.prepare(
      'select url, approvedAt from Com_Ent where approvedAt < ?1 order by approvedAt desc limit 2'
    )
      .bind(approvedAt)
      .all<{ url: string; approvedAt: Date }>(),
    tweets = await Promise.all(
      result.results.map(async ({ url, approvedAt }) => ({
        ...(await getTweet(url)),
        approvedAt
      }))
    );
  return json(tweets);
}) satisfies RequestHandler;
