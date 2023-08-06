import { PUBLIC_HOST } from '$env/static/public';
import { support_email } from '$lib/constants/string';
import { sign } from '$lib/helpers/crypt';
import { sendEmail } from '$lib/helpers/email';
import { validate2 } from '$lib/helpers/validate';
import { string } from 'yup';
import type { Actions } from './$types';

export const actions = {
  default: async ({ request }) => {
    const { form, message } = await validate2(request, {
      email: string().required().email()
    });
    if (message) {
      return { message };
    }
    const { email } = form!,
      jwt = await sign({ email });
    await sendEmail({
      TemplateAlias: 'password-reset',
      To: email,
      TemplateModel: {
        product_name: 'chientrm.com',
        action_url: `${PUBLIC_HOST}/auth/reset-password/${jwt}`,
        support_email
      }
    });
    return { result: `an email is sent to ${email}, please check inbox` };
  }
} satisfies Actions;
