import React, { useState } from 'react'
import { act, wait, render, fireEvent } from 'test-utils'
import { SearchBox, BigSearchButton } from 'components/SearchBox'
import { useInput } from 'hooks/useInput'

describe('SearchBox', () => {
  it('should render bigger when get focus', async () => {
    const Comp: React.FC = () => {
      return <SearchBox></SearchBox>
    }
    const { container } = render(<Comp />)
    const search = container.querySelector('.size-m')
    expect(search).toBeTruthy()
    act(() => {
      fireEvent.focus(container.querySelector('input')!)
    })
    expect(container.querySelector('.size-l')).toBeTruthy()

    act(() => {
      fireEvent.blur(container.querySelector('input')!)
    })
    expect(container.querySelector('.size-m')).toBeTruthy()
  })

  it('should triggle onSearch when Enter pressed', async () => {
    let onSearch = 0
    const Comp: React.FC = () => {
      return <SearchBox onSearch={() => onSearch += 1} />
    }
    const { container } = render(<Comp />)
    act(() => {
      fireEvent.keyDown(container.querySelector('input')!, { keyCode: 13 })
    })
    expect(onSearch).toBe(1)
  })
})

describe('BigSearchButton', () => {
  it('should triggle onSearch when Enter pressed', async () => {
    let onSearch = 0
    const Comp: React.FC = () => {
      const [input] = useInput('')
      return <BigSearchButton {...input} onSearch={() => onSearch += 1} />
    }
    const { container } = render(<Comp />)
    act(() => {
      fireEvent.keyDown(container.querySelector('input')!, { keyCode: 13 })
      fireEvent.keyDown(container.querySelector('input')!, { keyCode: 14 })
    })
    expect(onSearch).toBe(1)

    act(() => {
      fireEvent.click(container.querySelector('button')!)
    })
    expect(onSearch).toBe(2)
  })
})
