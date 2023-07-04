import { COOKIE_USER } from '$lib/constants/cookies';
import { sign } from '$lib/helpers/crypt';
import { hashPassword, validatePassword } from '$lib/helpers/password';
import { validate } from '$lib/helpers/validate';
import { fail, redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions, PageServerLoad } from './$types';

export const load = (({ locals }) => {
  if (locals.user) {
    throw redirect(303, '/');
  }
}) satisfies PageServerLoad;

export const actions = {
  login: async ({ request, locals, cookies }) => {
    try {
      const { username, password } = await validate(request, {
          username: string()
            .matches(
              /^[a-zA-Z0-9\-_]+$/,
              'Usernames can only contain letters, digits, dashes and underscores'
            )
            .label('Username')
            .required()
            .min(2)
            .max(15),
          password: string().label('Password').required().min(8).max(72)
        }),
        dbUser = await locals.D1.prepare(
          'select createdAt, passwordHash from Com_User where username=?1'
        )
          .bind(username)
          .first<{ createdAt: Date; passwordHash: string }>();
      if (!dbUser || !(await validatePassword(password, dbUser.passwordHash))) {
        throw new Error('Invalid user or password');
      }
      const { createdAt } = dbUser,
        jwt = await sign<App.User>({ username, createdAt });
      cookies.set(COOKIE_USER, jwt);
    } catch (e: any) {
      const loginMessage = e.message;
      return fail(400, { loginMessage });
    }
    throw redirect(303, '/');
  },
  register: async ({ request, locals, cookies }) => {
    try {
      const { username, password } = await validate(request, {
          username: string()
            .matches(
              /^[a-zA-Z0-9\-_]+$/,
              'Usernames can only contain letters, digits, dashes and underscores'
            )
            .label('Username')
            .required()
            .min(2)
            .max(15),
          password: string().label('Password').required().min(8).max(72)
        }),
        passwordHash = await hashPassword(password),
        { createdAt } = await locals.D1.prepare(
          'insert into Com_User(username, passwordHash) values(?1, ?2) returning createdAt'
        )
          .bind(username, passwordHash)
          .first<{ createdAt: Date }>(),
        jwt = await sign<App.User>({ username, createdAt });
      cookies.set(COOKIE_USER, jwt);
    } catch (e: any) {
      let registerMessage = e.message;
      if (
        e instanceof Error &&
        (e.message.includes('UNIQUE constraint failed') ||
          // @ts-ignore
          e.cause?.message.includes('UNIQUE constraint failed'))
      ) {
        registerMessage = 'Email is already existed!';
      }
      return fail(400, { registerMessage });
    }
    throw redirect(303, '/');
  }
} satisfies Actions;
