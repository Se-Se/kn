import React, { useMemo } from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider, ServerError } from '@apollo/client'
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries'
import { setContext } from '@apollo/client/link/context'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { BrowserRouter, useHistory } from 'react-router-dom'
import { History } from 'history'
import { TokenProvider, useToken } from 'components/TokenService'
import { I18nProvider } from 'i18n'
import { createUploadLink } from 'utils/uploadProgress'
import { HyperLink } from 'utils/hyperLink'
import { GlobalModal } from 'components/Modal'
import { typePolicies } from 'typePolicies'
import { onError } from '@apollo/client/link/error'

const ENDPOINT = '/query'

const sha256 = async (content: string) => {
  const result = new TextEncoder().encode(content)
  let hash: ArrayBuffer
  if (window.crypto.subtle) {
    hash = await window.crypto.subtle.digest('SHA-256', result)
  } else {
    hash = (await import('fast-sha256')).hash(new Uint8Array(result))
  }
  const hashArray = Array.from(new Uint8Array(hash))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function createWsClient(endpoint: string, authorization: string) {
  const WsProtocol = window.location.protocol.replace('http', 'ws')
  const client = new SubscriptionClient(`${WsProtocol}//${window.location.host}${endpoint}`, {
    reconnect: true,
    lazy: true,
    connectionParams: {
      Authorization: authorization
    },
    connectionCallback: function () {
      // TODO: remove this workaround
      // WORKAROUND: prevent infinite reconnection (https://github.com/99designs/gqlgen/issues/745)
      (this as any).wasKeepAliveReceived = true;
    },
  })
  return client
}

function authLink(authorization: string) {
  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: authorization,
      }
    }
  })
}

const ShouldLogout = ['error-token-not-active', 'error-login-restriction', 'error-license-expired']

function getLink(token: string, history: History) {
  const authorization = token ? `Bearer ${token}` : ''
  const ws = createWsClient(ENDPOINT, authorization)
  const http = createUploadLink({
    uri: ({ operationName }) => `${ENDPOINT}?opName=${operationName}`,
    fetchOptions: {
      redirect: 'manual',
    }
  })
  let link = createPersistedQueryLink({ sha256 })
    .concat(authLink(authorization))
    .concat(onError(({ graphQLErrors, networkError }) => {
      const ne = (networkError as ServerError)
      if (ne?.response) {
        if (ne.statusCode === 204) {
          window.location.replace(ne.response.headers.get('location') ?? '/?hsc=204')
          throw new Error('redirected by 204')
        }
      }
      const logoutErr = graphQLErrors?.find(i => ShouldLogout.includes(i.message))?.message
      if (logoutErr&&history.location.pathname.indexOf('login')<0) {
        history.push({
          pathname: '/login',
          search: `?${history.location.pathname}`,
          state: {
            errorMessage: logoutErr,
          },
        })
      }
    }))
    .concat(new HyperLink(ws, http))
  return link
}

const ApolloClientProvider: React.FC = ({ children }) => {
  const token = useToken()
  const history = useHistory()
  const client = useMemo(() => new ApolloClient({
    link: getLink(token, history),
    cache: new InMemoryCache({
      typePolicies
    }),
  }), [token, history])
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export const Providers: React.FC = ({ children }) => (
  <TokenProvider>
    <BrowserRouter>
      <ApolloClientProvider>
        <I18nProvider>
          <GlobalModal>
            {children}
          </GlobalModal>
        </I18nProvider>
      </ApolloClientProvider>
    </BrowserRouter>
  </TokenProvider>
)
