import { COOKIE_LANG } from '$lib/constants/cookies';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (({ platform, cookies }) => {
  const cookieLang = cookies.get(COOKIE_LANG);
  const countryLang = platform?.cf?.country === 'VN' ? 'vi' : 'en';
  const lang = cookieLang ?? countryLang;
  throw redirect(302, `${lang}/`);
}) satisfies RequestHandler;
