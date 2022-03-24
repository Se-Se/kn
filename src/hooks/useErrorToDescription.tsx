import React, { Fragment, useCallback } from 'react'
import { Localized } from 'i18n'
import { isApolloError } from '@apollo/client'

export type ErrorType = Error | string | undefined
export function useErrorToDescription(): (error: ErrorType) => React.ReactNode {
  return useCallback((error: ErrorType) => {
    let description: React.ReactNode = ''
    if (typeof error === 'undefined') {
      return <></>
    } else if (typeof error === 'string') {
      description = <Localized id={error} />
    } else if (isApolloError(error)) {
      if (error.graphQLErrors.length > 0) {
        description = error.graphQLErrors.map(e => {
          if (e.extensions?.type === 'Code') {
            return <Localized id={e.message} vars={e.extensions.params} />
          }
          if (e.extensions?.type === 'Raw') {
            return e.message
          }
          // internal error
          return <Localized id='error-internal' />
        }).map((i, id) => <Fragment key={id}>{i}</Fragment>)
      } else if (error.networkError) {
        description = <Localized id='error-networkError' />
      }
    } else {
      console.warn('unknown error', error)
      description = <Localized id='error-unknown' />
    }
    return description
  }, [])
}
