import { useSetToken } from 'components/TokenService'
import { useUpdateTokenMutation } from 'generated/graphql'
import React, { useEffect, useMemo } from 'react'

export const useUpdateToken = () => {
  const setToken = useSetToken()
  const [update] = useUpdateTokenMutation()
  const updateToken = useMemo(() => {
    let hot = false
    return () => {
      if (!hot) {
        // ignore error
        update().catch((e) => {
          if (e.message === 'error-token-not-active') {
            setToken('')
          }
        })
        hot = true
        setTimeout(() => hot = false, 10 * 1000)
      }
    }
  }, [update, setToken])
  return updateToken
}

export const MotionReport: React.FC = () => {
  const updateToken = useUpdateToken()
  useEffect(() => {
    document.addEventListener('mousemove', updateToken)
    document.addEventListener('keypress', updateToken)
    return () => {
      document.removeEventListener('mousemove', updateToken)
      document.removeEventListener('keypress', updateToken)
    }
  }, [updateToken])
  return <></>
}
