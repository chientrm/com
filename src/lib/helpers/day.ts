import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export const fromNow = (date: Date) => dayjs(date).fromNow(),
  formatDate = (date: Date, tz: string, template: string) =>
    dayjs(date).tz(tz).format(template);
