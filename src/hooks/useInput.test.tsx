import React from 'react'
import { useInput } from './useInput'
import { render, act } from 'test-utils'

describe('useInput', () => {
  let value: any
  it('works fine', async () => {
    const Comp: React.FC = () => {
      [value] = useInput('')
      return <>{value.value}</>
    }
    render(<Comp />)
    expect(value.value).toBe('')
    act(() => {
      value.onChange('asdf')
    })
    expect(value.value).toBe('asdf')
  })
})
