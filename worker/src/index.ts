import { zValidator } from '@hono/zod-validator';
import { EmailMessage } from 'cloudflare:email';
import { Hono } from 'hono';
import { createMimeMessage } from 'mimetext';
import { z } from 'zod';

const app = new Hono<{ Bindings: { SEB: SendEmail } }>();

app.get('/', (c) => c.text('Hello Hono!'));
app.post(
  '/send_email',
  zValidator(
    'json',
    z.object({
      name: z.string(),
      addr: z.string(),
      recipent: z.string(),
      subject: z.string(),
      data: z.string()
    })
  ),
  async (c) => {
    const { name, addr, recipent, subject, data } = c.req.valid('json'),
      msg = createMimeMessage();
    const contentType = 'text/plain';
    msg.setSender({ name, addr });
    msg.setRecipient(recipent);
    msg.setSubject(subject);
    msg.addMessage({ contentType, data });
    const message = new EmailMessage(addr, recipent, msg.asRaw());
    await c.env.SEB.send(message);
    return c.text('');
  }
);

export default app;
