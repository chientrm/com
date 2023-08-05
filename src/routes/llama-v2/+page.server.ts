import { validate2 } from '$lib/helpers/validate';
import { redirect } from '@sveltejs/kit';
import { string } from 'yup';
import type { Actions, PageServerLoad } from './$types';
import { llmav27b } from '$lib/helpers/banana';

export const load = (({ url }) => {
  const prompt = url.searchParams.get('prompt') ?? '';
  return { prompt };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, locals }) => {
    const { form, message } = await validate2(request, {
      prompt: string().required().max(5000)
    });
    if (message) {
      return { message };
    }
    const { prompt } = form!;
    if (!locals.user) {
      throw redirect(303, `/auth?redirectTo=/llama-v2?prompt=${prompt}`);
    }
    const { username } = locals.user!,
      result = await locals.D1.prepare(
        'select beamUsed, beamQuota from Com_User where username=?1'
      )
        .bind(username)
        .first<{ beamUsed: number; beamQuota: number }>(),
      { beamUsed, beamQuota } = result!;
    if (beamUsed >= beamQuota) {
      return { message: 'out of quota. ask chientrm for some' };
    }
    await locals.D1.prepare(
      'update Com_User set beamUsed = beamUsed + 1 where username=?1'
    )
      .bind(username)
      .run();
    const { json } = await llmav27b.call('/', { prompt, max_new_tokens: 500 });
    const answer = (json.outputs as string)
      .replace(`<s> ${prompt}`, '')
      .replace('</s>', '')
      .split('\n')
      .filter((s) => s);
    return { answer };
  }
} satisfies Actions;
