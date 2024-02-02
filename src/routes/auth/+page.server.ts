import { auth } from '$lib/helpers/auth';
import { hashPassword, validatePassword } from '$lib/helpers/password';
import { unique } from '$lib/helpers/unique';
import { validate2 } from '$lib/helpers/validate';
import { fail, redirect } from '@sveltejs/kit';
import { ref, string } from 'yup';

export const actions = {
  login: async ({ request, locals, cookies, url }) => {
    const { form, message: loginMessage } = await validate2(request, {
      username: string()
        .label('Username')
        .matches(
          /^[a-zA-Z0-9\-_]+$/,
          'username can only contain letters, digits, dashes and underscores'
        )
        .required()
        .min(2)
        .max(15),
      password: string().label('Password').required().min(8).max(72)
    });
    if (loginMessage) {
      return { loginMessage };
    }
    const { username, password } = form!,
      dbUser = await locals.D1.prepare(
        'select createdAt, passwordHash from Com_User where username=?1'
      )
        .bind(username)
        .first<{ createdAt: Date; passwordHash: string }>();
    if (!dbUser || !(await validatePassword(password, dbUser.passwordHash))) {
      return { loginMessage: 'invalid username or password' };
    }
    await auth(cookies, { username });
    throw redirect(303, url.searchParams.get('redirectTo')!);
  },
  register: async ({ request, locals, cookies, url }) => {
    const { form, message: registerMessage } = await validate2(request, {
      username: string()
        .label('Username')
        .matches(
          /^[a-zA-Z0-9\-_]+$/,
          'username can only contain letters, digits, dashes and underscores'
        )
        .required()
        .min(2)
        .max(15),
      password: string().label('Password').required().min(8).max(72),
      confirmPassword: string()
        .label('Confirm password')
        .required()
        .oneOf([ref('password')], 'Password mismatch')
    });
    if (registerMessage) {
      return { registerMessage };
    }
    const { username, password } = form!,
      passwordHash = await hashPassword(password);
    try {
      const result = await locals.D1.prepare(
        'insert into Com_User(username, passwordHash) values(?1, ?2) returning createdAt'
      )
        .bind(username, passwordHash)
        .first<{ createdAt: Date }>();
      await auth(cookies, { username });
      throw redirect(303, url.searchParams.get('redirectTo')!);
    } catch (e: any) {
      if (unique(e)) {
        const registerMessage = 'username is already existed';
        return fail(400, { registerMessage });
      }
      throw e;
    }
  }
};
