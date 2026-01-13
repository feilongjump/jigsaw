import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export const formatDate = (date: string | Date | number, format = 'YYYY-MM-DD HH:mm') => {
  return dayjs(date).format(format);
};

export const fromNow = (date: string | Date | number) => {
  return dayjs(date).fromNow();
};

export default dayjs;
