import type { I18n } from '$lib/helpers/i18n';
import type { PageServerLoad } from './$types';

const i18n: I18n<{ welcome: string }> = {
  US: {
    welcome: 'You may find something useful here'
  },
  VN: {
    welcome: 'Bạn có thể tìm thấy vài thứ hữu ích ở đây'
  }
};

export const load = (({ locals }) => {
  const strings = i18n[locals.country];
  return { strings };
}) satisfies PageServerLoad;
