import React from 'react'
import { useError } from './useError'
import { getRender, wait, act } from 'test-utils'

describe('useError', () => {
  let error: ReturnType<typeof useError>[0], setError: Function, clearError: Function
  it('show nothing by default', async () => {
    const { render } = getRender([])
    const Comp: React.FC = () => {
      [error, { setError, clearError }] = useError()
      return <>{error}</>
    }
    render(<Comp />)
    await wait()
    expect(error).toBe(undefined)
  })

  it('show error by setError', async () => {
    const { render } = getRender([])
    const Comp: React.FC = () => {
      [error, { setError, clearError }] = useError()
      return <>{error}</>
    }
    const { getByTestId } = render(<Comp />)
    await act(async () => {
      setError(new Error('hello world'))
    })
    expect(getByTestId('show-error')?.textContent).toBe('Unknown Error')
  })


  it('show nothing by clearError', async () => {
    const { render } = getRender([])
    const Comp: React.FC = () => {
      [error, { setError, clearError }] = useError()
      return <>{error}</>
    }
    const { queryByTestId } = render(<Comp />)
    await act(async () => {
      setError(new Error('hello world'))
    })
    expect(queryByTestId('show-error')?.textContent).toBe('Unknown Error')

    await act(async () => {
      clearError()
    })

    expect(queryByTestId('show-error')?.textContent).toBeFalsy()
  })
})
