import { Threads } from '$lib/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals, params }) => {
  const { username } = params;
  const result = await locals.db.query.Users.findFirst({
    columns: { createdAt: true },
    where: eq(Threads.username, username)
  });
  const { createdAt } = result!;
  return { username, createdAt, title: username, description: createdAt };
};
