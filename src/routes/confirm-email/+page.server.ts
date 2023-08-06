import { auth } from '$lib/helpers/auth';
import { verify } from '$lib/helpers/crypt';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface Payload {
  code: number;
  email: string;
}

export const load = (async ({ url, locals, cookies }) => {
  const { username, createdAt } = locals.user!,
    jwt = url.searchParams.get('jwt')!,
    { code, email } = await verify<Payload>(jwt),
    result = await locals.D1.prepare(
      'select emailCode from Com_User where username=?1'
    )
      .bind(username)
      .first<{ emailCode: number }>(),
    { emailCode } = result!;
  if (code != emailCode) {
    return { email, error: 'invalid verification' };
  }
  await locals.D1.prepare('update Com_User set email=?1 where username=?2')
    .bind(email, username)
    .run();
  await auth(cookies, { username, createdAt, email });
  throw redirect(303, '/');
}) satisfies PageServerLoad;
