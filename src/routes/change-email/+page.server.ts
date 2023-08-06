import { dev } from '$app/environment';
import { sign } from '$lib/helpers/crypt';
import { sendEmail } from '$lib/helpers/email';
import { validate2 } from '$lib/helpers/validate';
import { string } from 'yup';
import type { Actions } from './$types';

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
    await sendEmail({
      To: 'admin@chientrm.com',
      TemplateAlias: 'confirm',
      TemplateModel: {
        username,
        product_name: 'chientrm.com',
        support_email: 'admin@chientrm.com',
        action_url
      }
    });
    return { result: 'please check your inbox for confirmation email' };
  }
} satisfies Actions;
