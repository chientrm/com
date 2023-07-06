import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export const fromNow = (
    date: string | number | dayjs.Dayjs | Date | null | undefined
  ) => dayjs(date).fromNow(),
  formatDate = (
    date: string | number | dayjs.Dayjs | Date | null | undefined,
    tz: string,
    template: string
  ) => dayjs(date).tz(tz).format(template),
  addFromNow = <T extends { createdAt: Date }>(entry: T) => ({
    ...entry,
    fromNow: fromNow(entry.createdAt)
  });
