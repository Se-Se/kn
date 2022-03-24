import { useCallback, useState } from 'react'

export enum CacheKey {
  LinkMarkdown
}

let AnyCache: Record<string, any> = {}

/**
 * Global version useState, state is stored in memory, refresh window will loss all data.
 * @param key global key
 * @param value default value
 */
export const useCache = <T>(key: CacheKey | [CacheKey, string], value: T): [T, (v: T) => void] => {
  const k = Array.isArray(key) ? key.join('.') : key
  const [, setV] = useState(AnyCache[k] ?? value)

  return [
    AnyCache[k] ?? value,
    useCallback((v: T) => {
      AnyCache[k] = v
      setV(v)
    }, [k])
  ]
}
