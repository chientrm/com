import { validate2 } from '$lib/helpers/validate';
import { string } from 'yup';
import type { Actions, PageServerLoad } from './$types';
import { sign, verify } from '$lib/helpers/crypt';
import { ServerClient, TemplatedMessage } from 'postmark';
import { dev } from '$app/environment';

const client = new ServerClient('72cf24a7-2fff-44ef-9160-516f78ac1020');

export const actions = {
  default: async ({ request, locals }) => {
    const { username } = locals.user!,
      { form, message } = await validate2(request, {
        email: string().required().email()
      });
    if (message) {
      return { message };
    }
    const { email } = form!,
      code = Math.floor(Math.random() * 1e7);
    await locals.D1.prepare('update Com_User set emailCode=?1')
      .bind(code)
      .run();
    const jwt = await sign({
        email,
        code
      }),
      host = dev ? 'http://localhost:5173' : 'https://chientrm.com',
      action_url = `${host}/confirm-email?jwt=${jwt}`;
    await client.sendEmailWithTemplate(
      new TemplatedMessage(
        'admin@chientrm.com',
        'confirm',
        {
          username,
          product_name: 'chientrm.com',
          support_email: 'admin@chientrm.com',
          action_url
        },
        email
      )
    );
    return { result: 'please check your inbox for confirmation email' };
  }
} satisfies Actions;
