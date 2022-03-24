// from https://github.com/jaydenseric/apollo-upload-client/issues/88

import { createUploadLink as create } from 'apollo-upload-client'
import { HttpOptions, MutationFunctionOptions } from '@apollo/client'
import { useEffect, useCallback, useState } from 'react'
import { ExecutionResult } from 'graphql'
import { useUpdateToken } from 'components/MotionReport'

const parseHeaders = (rawHeaders: any) => {
  const headers = new Headers()
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  preProcessedHeaders.split(/\r?\n/).forEach((line: any) => {
    const parts = line.split(':')
    const key = parts.shift().trim()
    if (key) {
      const value = parts.join(':').trim()
      headers.append(key, value)
    }
  })
  return headers
}

export const uploadFetch = (url: string, options: any) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = () => {
      const opts: any = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      }
      opts.url =
        'responseURL' in xhr
          ? xhr.responseURL
          : opts.headers.get('X-Request-URL')
      const body = 'response' in xhr ? xhr.response : (xhr as any).responseText
      resolve(new Response(body, opts))
    }
    xhr.onerror = () => {
      reject(new TypeError('Network request failed'))
    }
    xhr.ontimeout = () => {
      reject(new TypeError('Network request failed'))
    }
    xhr.open(options.method, url, true)

    Object.keys(options.headers).forEach(key => {
      xhr.setRequestHeader(key, options.headers[key])
    })

    if (xhr.upload) {
      xhr.upload.onprogress = options.onProgress
    }

    options.onAbortPossible(() => {
      xhr.abort()
    })

    xhr.send(options.body)
  })

const customFetch = (uri: any, options: any) => {
  if (options.useUpload) {
    return uploadFetch(uri, options)
  }
  return fetch(uri, options)
}

export function createUploadLink(linkOptions?: HttpOptions) {
  return create({
    ...linkOptions,
    credentials: 'same-origin',
    fetch: customFetch as any
  })
}

export function useUpload<TData, TVariables>(mutation: (options?: MutationFunctionOptions<TData, TVariables>) => Promise<ExecutionResult<TData>>) {
  const [abort, setAbort] = useState<any>(undefined)
  const [progress, setProgress] = useState<number>(0)
  const updateToken = useUpdateToken()

  const action = useCallback(async (options?: MutationFunctionOptions<TData, TVariables>): Promise<ExecutionResult<TData>> => {
    return await mutation({
      ...options,
      context: {
        fetchOptions: {
          useUpload: true,
          onProgress: (ev: ProgressEvent) => {
            updateToken()
            setProgress(ev.loaded / ev.total);
          },
          onAbortPossible: (abortHandler: any) => {
            setAbort(() => abortHandler)
          }
        }
      }
    })
  }, [mutation, updateToken])
  useEffect(() => {
    return () => {
      abort && abort()
    }
  }, [abort])

  return [action, progress] as const
}
