import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export const fromNow = (
  date: string | number | dayjs.Dayjs | Date | null | undefined
) => dayjs(date).fromNow();

export const addFromNow = <T extends { createdAt: string }>(entry: T) => ({
  ...entry,
  fromNow: fromNow(entry.createdAt)
});
