import { ACCOUNT_ID, API_TOKEN } from '$env/static/private';

export const GET = ({ setHeaders }) => {
  setHeaders({ 'cache-control': 'public,max-age=31536000,immutable' });
  return fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@hf/thebloke/llama-2-13b-chat-awq`,
    {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'System',
            content:
              'You are a funny and viral jokes teller, always tell a new joke.'
          },
          {
            role: 'user',
            content: 'Tell me a joke about websites having no users.'
          }
        ]
      })
    }
  )
    .then((res) => res.body!)
    .then((data) => new Response(data));
};
