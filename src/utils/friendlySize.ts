const Step = 1024
const Units = ['B', 'KB', 'MB', 'GB', 'TB']

export function friendlySize(size: number | string): [string, string] {
  let s = typeof size === 'string' ? parseInt(size) : size
  for (const unit of Units.slice(0, -1)) {
    if (s < Step) {
      return [s.toFixed(2), unit]
    }
    s /= 1024
  }
  return [s.toFixed(2), Units[Units.length - 1]]
}

export function friendlySizeStr(size: number | string) {
  return friendlySize(size).join('')
}
