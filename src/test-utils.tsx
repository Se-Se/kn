import React, { useMemo } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { TokenProvider } from 'components/TokenService'
import { Router } from 'react-router-dom'
import { MockedResponse, MockLink } from '@apollo/client/testing'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { createMemoryHistory, History } from 'history'
import { I18nProvider } from 'i18n'

// test suites are expecting Chinese
localStorage.setItem('lang', 'zh-CN')

const ApolloTestProvider: React.FC<{ mocks: MockedResponse[] }> = ({ children, mocks }) => {
  const link = useMemo(() => new MockLink(mocks, true), [mocks])
  const client = useMemo(() => new ApolloClient({
    link,
    cache: new InMemoryCache({ addTypename: true }),
  }), [link])

  return <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
}

const getProviders = (mocks: MockedResponse[], history: History): React.FC =>
  ({ children }) => {
    return (
      <TokenProvider>
        <Router history={history}>
          <ApolloTestProvider mocks={mocks}>
            <I18nProvider>
              {children}
            </I18nProvider>
          </ApolloTestProvider>
        </Router>
      </TokenProvider>
    )
  }

export const getRender = (mocks: MockedResponse[]) => {
  const history = createMemoryHistory()
  const wrapper = getProviders(mocks, history)
  return {
    render: (ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
      render(ui, { wrapper, ...options }),
    history
  }
}

export * from '@testing-library/react'
