import { auth } from '$lib/helpers/auth';
import { hashPassword, validatePassword } from '$lib/helpers/password';
import { unique } from '$lib/helpers/unique';
import { validate2 } from '$lib/helpers/validate';
import { Users } from '$lib/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
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
    const { username, password } = form!;
    const user = await locals.db.query.Users.findFirst({
      columns: { passwordHash: true },
      where: eq(Users.username, username)
    });
    if (!user || !(await validatePassword(password, user.passwordHash))) {
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
      await locals.db.insert(Users).values({ username, passwordHash });
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
