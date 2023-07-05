import { COOKIE_USER } from '$lib/constants/cookies';
import { sign } from '$lib/helpers/crypt';
import { hashPassword, validatePassword } from '$lib/helpers/password';
import { validate2 } from '$lib/helpers/validate';
import { fail, redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions } from './$types';

export const actions = {
  login: async ({ request, locals, cookies, url }) => {
    const { form, message: loginMessage } = await validate2(request, {
      username: string()
        .matches(
          /^[a-zA-Z0-9\-_]+$/,
          'username can only contain letters, digits, dashes and underscores'
        )
        .required()
        .min(2)
        .max(15),
      password: string().required().min(8).max(72)
    });
    if (loginMessage) {
      return fail(400, { loginMessage });
    }
    const { username, password } = form!,
      dbUser = await locals.D1.prepare(
        'select createdAt, passwordHash from Com_User where username=?1'
      )
        .bind(username)
        .first<{ createdAt: Date; passwordHash: string }>();
    if (!dbUser || !(await validatePassword(password, dbUser.passwordHash))) {
      return fail(400, { loginMessage: 'invalid username or password' });
    }
    const { createdAt } = dbUser,
      jwt = await sign<App.User>({ username, createdAt });
    cookies.set(COOKIE_USER, jwt);
    throw redirect(303, url.searchParams.get('redirectTo')!);
  },
  register: async ({ request, locals, cookies, url }) => {
    const { form, message: registerMessage } = await validate2(request, {
      username: string()
        .matches(
          /^[a-zA-Z0-9\-_]+$/,
          'username can only contain letters, digits, dashes and underscores'
        )
        .required()
        .min(2)
        .max(15),
      password: string().required().min(8).max(72)
    });
    if (registerMessage) {
      console.log('gg');
      return fail(400, { registerMessage });
    }
    const { username, password } = form!,
      passwordHash = await hashPassword(password);
    try {
      const { createdAt } = await locals.D1.prepare(
          'insert into Com_User(username, passwordHash) values(?1, ?2) returning createdAt'
        )
          .bind(username, passwordHash)
          .first<{ createdAt: Date }>(),
        jwt = await sign<App.User>({ username, createdAt });
      cookies.set(COOKIE_USER, jwt);
    } catch (e: any) {
      if (
        e instanceof Error &&
        (e.message.includes('UNIQUE constraint failed') ||
          // @ts-ignore
          e.cause?.message.includes('UNIQUE constraint failed'))
      ) {
        const registerMessage = 'username is already existed';
        return fail(400, { registerMessage });
      }
      throw e;
    }
    throw redirect(303, url.searchParams.get('redirectTo')!);
  }
} satisfies Actions;
