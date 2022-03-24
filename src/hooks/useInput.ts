import { useState, useCallback, useMemo } from 'react'

export const useInput = <T>(defaultValue: T) => {
  const [value, setValue] = useState(defaultValue)
  const onChange = useCallback((v: T) => {
    setValue(v)
  }, [])
  return [useMemo(() => ({
    value,
    onChange,
  }), [value, onChange]), setValue] as const
}
