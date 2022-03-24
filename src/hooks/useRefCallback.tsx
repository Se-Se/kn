import { useCallback, useRef } from 'react'

export function useRefCallback<T extends (...args: any[]) => any>(callback: T): T {
  const cb = useRef<T>(callback)
  cb.current = callback
  // @ts-ignore
  return useCallback<T>((...args) => cb.current(...args), [cb])
}
