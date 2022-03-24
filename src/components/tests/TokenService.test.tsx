
import React from 'react'
import { TokenProvider, useToken, setToken, getToken, useSetToken } from 'components/TokenService'
import { render, act } from 'test-utils'

describe('TokenService', () => {
  it('get and set token', () => {
    setToken('test token')
    expect(getToken()).toBe('test token')
    setToken('')
    expect(getToken()).toBe('')
  })

  it('useToken and useSetToken should work', async () => {
    setToken('test token')

    let testSetToken: Function
    const Comp: React.FC = () => {
      const token = useToken()
      testSetToken = useSetToken()
      return <span>{token}</span>
    }
    const { getByText } = render(<TokenProvider>
      <Comp />
    </TokenProvider>)
    getByText('test token')
    expect(getToken()).toBe('test token')

    act(() => {
      testSetToken('test token 2')
    })
    getByText('test token 2')
    expect(getToken()).toBe('test token 2')
  })

  it('dangling useToken should be "" and setToken should be fine', async () => {
    setToken('test token')

    let testSetToken!: Function
    const Comp: React.FC = () => {
      const token = useToken()
      testSetToken = useSetToken()
      return <span data-testid='token'>{token}</span>
    }
    const { getByTestId } = render(<Comp />)
    expect(getByTestId('token')?.textContent).toBe('')
    expect(() => testSetToken('test token 2')).toThrow()
  })
})
