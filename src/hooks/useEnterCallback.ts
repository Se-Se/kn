import { useMemo } from 'react'

export const useEnterCallback = (callback: () => void) => {
  return useMemo(() => ({
    onKeyUp(event: React.KeyboardEvent<HTMLInputElement> & React.KeyboardEvent<HTMLTextAreaElement>) {
      // 回车
      if (event.keyCode === 13) {
        event.preventDefault()
        callback()
      }
    }
  }), [callback])
}
