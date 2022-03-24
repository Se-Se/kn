import React from 'react'
import { getRender, act } from 'test-utils'
import { ViewerDocument } from 'generated/graphql'
import { Page } from './home'
import { sleep } from 'utils/sleep'

describe('home page', () => {
  const id = 'idid'
  const username = 'asdfasdf'
  const nickname = 'nicknick'
  const normalViewer = {
    request: {
      query: ViewerDocument,
    },
    result: {
      data: {
        __typename: 'Query',
        viewer: {
          __typename: 'User',
          id,
          username,
          nickname
        }
      },
    },
  }
  const nullViewer = {
    request: {
      query: ViewerDocument,
    },
    result: {
      data: {
        __typename: 'Query',
        viewer: null
      },
    },
  }
  const errorViewer = {
    request: {
      query: ViewerDocument,
    },
    error: new Error('viewer error')
  }

  it('render not login', async () => {
    const { render, history } = getRender([nullViewer])
    await act(async () => {
      render(<Page />)
      await sleep(10)
    })
    expect(history.location.pathname).toBe('/login')
  })

  it('render login', async () => {
    const { render, history } = getRender([normalViewer])
    await act(async () => {
      render(<Page />)
      await sleep(10)
    })
    expect(history.location.pathname).toBe('/')
  })

  it('render when error', async () => {
    const { render, history } = getRender([errorViewer])
    await act(async () => {
      render(<Page />)
      await sleep(10)
    })
    expect(history.location.pathname).toBe('/login')
  })
})
