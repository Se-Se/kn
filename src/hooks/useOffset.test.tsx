import React from 'react'
import { render, act } from 'test-utils'
import { useOffset } from './useOffset'

describe('useOffset', () => {
  let input: ReturnType<typeof useOffset>[0], props: ReturnType<typeof useOffset>[1]
  it('works fine', async () => {
    const Comp: React.FC = () => {
      [input, props] = useOffset(20)
      return <></>
    }
    await act(async () => {
      render(<Comp />)
    })
    expect(input).toStrictEqual({
      offset: 0,
      limit: 20,
    })
    expect(props.pageIndex).toBe(1)
    expect(props.pageSize).toBe(20)

    act(() => props.onPagingChange({ pageIndex: 2, pageSize: 30 }))

    expect(input).toStrictEqual({
      offset: 30,
      limit: 30,
    })
    expect(props.pageIndex).toBe(2)
    expect(props.pageSize).toBe(30)
  })
})
