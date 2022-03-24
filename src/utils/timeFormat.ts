import dayjs from 'dayjs'

export const NormalFormat = 'YYYY-MM-DD HH:mm'
export const formatTime = (time?: string | null) => {
  if (time) {
    return dayjs(time).format(NormalFormat)
  }
  return time
}
