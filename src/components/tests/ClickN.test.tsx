import React from 'react'
import { act, wait, render, fireEvent } from 'test-utils'
import { Link } from 'react-router-dom'
import { ClickN } from 'components/ClickN'

describe('ClickN', () => {
  it('should invoke onClick when clicked 5 times in 0.5s', async () => {
    const onClick = jest.fn()
    const Comp: React.FC = () => {
      const cnt = 5
      return <ClickN count={cnt} onClick={onClick} > </ClickN>
    }
    const { container } = render(<Comp />)
    await wait()
    act(() => {
      for (let i = 0; i < 5; i += 1) {
        fireEvent.click(container.querySelector('div')!)
      }
    })
    expect(onClick).toBeCalled()
  })

  it('should not invoke onClick when clicked 5 times out 0.5s', async () => {
    jest.useFakeTimers()
    const onClick = jest.fn()
    const Comp: React.FC = () => {
      const cnt = 5
      return <ClickN count={cnt} onClick={onClick} > </ClickN>
    }
    const { container } = render(<Comp />)
    await wait()
    act(() => {
      for (let i = 0; i < 6; i += 1) {
        fireEvent.click(container.querySelector('div')!)
        jest.advanceTimersByTime(600)
      }
    })
    expect(onClick).not.toBeCalled()
  })

  it('should not invoke onClick when clicked less than 5 times', async () => {
    jest.useFakeTimers()
    const onClick = jest.fn()
    const Comp: React.FC = () => {
      const cnt = 5
      return <ClickN count={cnt} onClick={onClick} > </ClickN>
    }
    const { container } = render(<Comp />)
    await wait()
    act(() => {
      fireEvent.click(container.querySelector('div')!)
      jest.advanceTimersByTime(600)
    })
    expect(onClick).not.toBeCalled()
  })

  it('should not let undefined count break loading', async () => {
    jest.useFakeTimers()
    const onClick = jest.fn()
    const Comp: React.FC = () => {
      return <ClickN onClick={onClick} > </ClickN>
    }
    render(<Comp />)
    await wait()
    expect(onClick).not.toBeCalled()
  })
})
