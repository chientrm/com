import { auth } from '$lib/helpers/auth';
import { verify } from '$lib/helpers/verify';
import type { PageServerLoad } from './$types';

interface Payload {
  code: number;
  email: string;
}

export const load = (async ({ params, locals, cookies }) => {
  const { username, createdAt } = locals.user!,
    { jwt } = params,
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
  await locals.D1.prepare(
    'update Com_User set email=?1, emailCode=NULL where username=?2'
  )
    .bind(email, username)
    .run();
  await auth(cookies, { username, createdAt, email });
  return { result: `succesfully changed your email to ${email}` };
}) satisfies PageServerLoad;
