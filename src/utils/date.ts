import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export function formatDate(date: string | Date | number, format = 'YYYY-MM-DD HH:mm') {
  return dayjs(date).format(format)
}

export function fromNow(date: string | Date | number) {
  return dayjs(date).fromNow()
}

export default dayjs
