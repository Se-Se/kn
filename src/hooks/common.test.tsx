import React from 'react'
import { useMount, useApolloData, useToggle } from './common'
import { useViewerQuery, ViewerDocument } from 'generated/graphql'
import { MockedProvider } from '@apollo/client/testing'
import { render, wait, fireEvent, act } from 'test-utils'

describe('useMount', () => {
  it('run once after mount', async () => {
    let count = 0
    const Comp: React.FC = () => {
      useMount(() => count += 1)
      return <div id='count'>{count}</div>
    }
    render(<Comp />)
    await wait()
    expect(count).toBe(1)
  })

  it('support async function', async () => {
    let count = 0
    const Comp: React.FC = () => {
      useMount(async () => count += 1)
      return <div id='count'>{count}</div>
    }
    render(<Comp />)
    await wait()
    expect(count).toBe(1)
  })

})

describe('useApolloData', () => {
  const normalData = {
    request: {
      query: ViewerDocument,
    },
    result: {
      data: {
        __typename: 'Query',
        viewer: {
          __typename: 'User',
          id: 'id',
          username: 'username',
          nickname: 'nickname'
        }
      },
    },
  }
  const normalJSON = `{"id":"id","username":"username","nickname":"nickname","__typename":"User"}`
  const errorData = {
    request: {
      query: ViewerDocument,
    },
    error: new Error('Error'),
  }
  it('render data', async () => {
    const mocks = [normalData]
    const Comp: React.FC = () => useApolloData(useViewerQuery(), data => <span>{JSON.stringify(data.viewer)}</span>)
    const { getByText } = render(<MockedProvider mocks={mocks}>
      <Comp />
    </MockedProvider>)
    await wait()
    getByText(normalJSON)
  })

  it('show error when query error', async () => {
    const mocks = [errorData]
    const Comp: React.FC = () => useApolloData(useViewerQuery(), data => <span>{JSON.stringify(data.viewer)}</span>)
    const { getByTestId } = render(<MockedProvider mocks={mocks}>
      <Comp />
    </MockedProvider>)
    await wait()
    expect(getByTestId('show-error')).toBeTruthy()
  })

  it('show custom error when query error', async () => {
    const mocks = [errorData]
    const Comp: React.FC = () => useApolloData(useViewerQuery(), data => <span>data: {JSON.stringify(data.viewer)}</span>, e => <span>custom err</span>)
    const { getByText } = render(<MockedProvider mocks={mocks}>
      <Comp />
    </MockedProvider>)
    await wait()
    getByText('custom err')
  })

  it('refetch should get normal data', async () => {
    const mocks = [errorData, normalData]
    const Comp: React.FC = () => useApolloData(useViewerQuery(), data => <span>{JSON.stringify(data.viewer)}</span>)
    const { getByText } = render(<MockedProvider mocks={mocks}>
      <Comp />
    </MockedProvider>)
    await wait()
    expect(getByText('Refetch')).toBeTruthy()
    await fireEvent.click(getByText('Refetch'))
    await wait()
    getByText(normalJSON)
  })
})

describe('useToggle', () => {
  it('works', () => {
    let turnOn: () => void
    let turnOff: () => void
    const Comp: React.FC = () => {
      let v: boolean
      [v, turnOn, turnOff] = useToggle(false)
      return <span>{v.toString()}</span>
    }
    const { getByText } = render(<Comp />)
    getByText('false')
    act(turnOn!)
    getByText('true')
    act(turnOff!)
    getByText('false')
  })
})
