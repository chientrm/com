import { verify } from '$lib/helpers/crypt';
import { hashPassword } from '$lib/helpers/password';
import { validate2 } from '$lib/helpers/validate';
import { redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions } from './$types';

export const actions = {
  default: async ({ params, request, locals }) => {
    const { jwt } = params,
      { email } = await verify<{ email: string }>(jwt),
      { form, message } = await validate2(request, {
        password: string().required().min(8).max(72)
      });
    if (message) {
      return { message };
    }
    const { password } = form!,
      passwordHash = await hashPassword(password);
    await locals.D1.prepare(
      'update Com_User set passwordHash=?1 where email=?2'
    )
      .bind(passwordHash, email)
      .run();
    throw redirect(303, '/reset-password/success');
  }
} satisfies Actions;
