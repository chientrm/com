import { POSTMARK_SERVER_TOKEN } from '$env/static/private';

const host = 'https://api.postmarkapp.com';
export const sendEmail = ({
  TemplateAlias,
  To,
  TemplateModel
}: {
  TemplateAlias: string;
  To: string;
  TemplateModel: Record<string, string | number>;
}) =>
  fetch(`${host}/email/withTemplate`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-Postmark-Server-Token': POSTMARK_SERVER_TOKEN
    },
    body: JSON.stringify({
      From: 'admin@chientrm.com',
      To,
      TemplateAlias,
      TemplateModel
    })
  });
