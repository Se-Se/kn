import React from 'react'
import { waitForElement, fireEvent, getRender, act } from 'test-utils'
import { ViewerDocument } from 'generated/graphql'
import { Page } from './index'
import { setToken, getToken } from 'components/TokenService'
import { sleep } from 'utils/sleep'

// fix NaN warning
jest.mock('popper.js', () => class {
  constructor() {
    return {
      scheduleUpdate: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    }
  }
})

describe('index page', () => {
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

  it('show login when viewer is null', async () => {
    const { render } = getRender([nullViewer])
    const { getByText } = render(<Page />)
    await waitForElement(() =>
      getByText('Log in')
    )
  })

  it('show login when viewer is error', async () => {
    const { render } = getRender([errorViewer])
    const { getByText } = render(<Page />)
    await waitForElement(() =>
      getByText('Log in')
    )
  })

  it('show username when there is a viewer', async () => {
    const { render } = getRender([normalViewer])
    const { getByText } = render(<Page />)
    await waitForElement(() =>
      getByText(username)
    )
  })

  it('should clear token after logout', async () => {
    setToken('asdf')
    const { render } = getRender([normalViewer, nullViewer])
    const { getByText } = render(<Page />)
    fireEvent.mouseOver(await waitForElement(() =>
      getByText(username)
    ))
    await act(async () => {
      fireEvent.click(await waitForElement(() =>
        getByText('Log out')
      ))
      await sleep(10)
    })
    getByText('Log in')
    expect(getToken()).toBe('')
  })
})
