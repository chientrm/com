import { PUBLIC_HOST } from '$env/static/public';
import { support_email } from '$lib/constants/string';
import { sendEmail } from '$lib/helpers/email';
import { sign } from '$lib/helpers/sign';
import { validate2 } from '$lib/helpers/validate';
import { string } from 'yup';
import type { Actions } from './$types';

export const actions = {
  default: async ({ request, locals }) => {
    const { username } = locals.user!,
      { form, message } = await validate2(request, {
        email: string().label('Email').required().email()
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
      action_url = `${PUBLIC_HOST}/auth/confirm-email/${jwt}`;
    await sendEmail({
      To: email,
      TemplateAlias: 'confirm',
      TemplateModel: {
        username,
        product_name: 'chientrm.com',
        support_email,
        action_url
      }
    });
    return { result: 'Please check your inbox for confirmation email' };
  }
} satisfies Actions;
