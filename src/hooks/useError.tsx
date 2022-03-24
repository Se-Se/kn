import React, { useState, useCallback } from 'react'
import { ShowError } from 'components/ShowError'
import { ErrorType } from './useErrorToDescription'

export const useError = (err?: ErrorType) => {
  const [error, setError] = useState<ErrorType>(err)
  const clearError = useCallback(() => setError(undefined), [])
  const checkError = useCallback(<T extends (...args: any[]) => Promise<void>>(callback: T): T => {
    return (async (...args: any[]) => {
      try {
        await callback(...args)
      } catch (e) {
        setError(e as any)
      }
    }) as any
  }, [])
  return [error && <ShowError error={error}></ShowError>, { setError, clearError, checkError }] as const
}
