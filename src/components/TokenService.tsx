import React, { createContext, useState, useContext, useMemo, useEffect } from 'react'

interface TokenCtx {
  token: string
  setToken: (t: string) => void
}
const defaultCtx: TokenCtx = {
  token: '',
  setToken: () => { throw new Error('Please use TokenProvider to setToken') }
}
const TokenContext = createContext(defaultCtx)

export const setToken = (token: string) => window.localStorage.setItem('sysauditor-token', token)
export const getToken = () => window.localStorage.getItem('sysauditor-token') || ''

export const TokenProvider: React.FC = ({ children }) => {
  const [token, setTokenState] = useState(getToken())
  useEffect(() => {
    const listener = () => {
      const token = getToken()
      if (token) {
        setTokenState(token)
      }
    }
    window.addEventListener('storage', listener)
    return () => window.removeEventListener('storage', listener)
  }, [])
  const value = useMemo(() => ({
    token,
    setToken: (v: string) => {
      setTokenState(v)
      setToken(v)
    },
  }), [token])

  return <TokenContext.Provider value={value}>
    {children}
  </TokenContext.Provider>
}

export const useToken = () => {
  const { token } = useContext(TokenContext)
  return token
}

export const useSetToken = () => {
  const { setToken } = useContext(TokenContext)
  return setToken
}
