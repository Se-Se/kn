import { useEffect, useState, useCallback } from 'react'
import { useDownloadTokenQuery } from 'generated/graphql'
import { useError } from 'hooks/useError'

/** Token 过期前 RefetchBefore 秒重新获取 Token */
const RefetchBefore = 10
/** Token 有效时间, 单位秒 */
const TokenTTL = 60

type TokenCache = { start: number, token: Promise<string> }
let GlobalTokenCache: TokenCache | undefined = undefined
const now = () => Math.floor(Date.now() / 1000)
export const useDownloadToken = () => {
  const { refetch } = useDownloadTokenQuery({
    fetchPolicy: 'network-only',
    skip: true,
  })
  return useCallback(async () => {
    const time = now()
    if (!GlobalTokenCache || (GlobalTokenCache.start + TokenTTL - RefetchBefore < time)) {
      GlobalTokenCache = {
        start: time,
        token: (async () => {
          const { data: { downloadToken } } = await refetch()
          return downloadToken
        })()
      }
    }
    return GlobalTokenCache.token
  }, [refetch])
}

export const useLazyFetchDownload = (url: string) => {
  const [error, { setError }] = useError()
  const getToken = useDownloadToken()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState('')
  const request = useCallback(() => {
    (async () => {
      try {
        setLoading(true)
        const token = await getToken()
        const res = await fetch(`${url}?token=${token}`)
        const result = await res.text()
        setData(result)
      } catch (e) {
        setError(e as any)
      } finally {
        setLoading(false)
      }
    })()
  }, [getToken, setError, url])

  return [request, {
    data,
    error,
    loading,
  }] as const
}

export const useFetchDownload = (url: string) => {
  const [onMount, data] = useLazyFetchDownload(url)

  useEffect(onMount, [url, onMount])

  return data
}
