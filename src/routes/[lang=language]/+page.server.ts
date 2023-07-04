import type { I18n } from '$lib/helpers/i18n';
import type { PageServerLoad } from './$types';

const i18n: I18n<{ welcome: string }> = {
  en: {
    welcome: 'You may find something useful here'
  },
  vi: {
    welcome: 'Bạn có thể tìm thấy vài thứ hữu ích ở đây'
  }
};

export const load = (async ({ parent }) => {
  const { l, c } = await parent(),
    s = i18n[l];
  return { s, c };
}) satisfies PageServerLoad;
