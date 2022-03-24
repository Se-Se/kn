import React from 'react'
import { act, getRender, fireEvent } from 'test-utils'
import { FoldablePre } from 'components/FoldablePre'

describe('FoldablePre', () => {
  it('should be folded if multiline', async () => {
    const { render } = getRender([])
    const Comp: React.FC = () => {
      return <FoldablePre>{['1234', '5678']}</FoldablePre>
    }
    const { getByText, container } = render(<Comp />)

    expect(container.querySelector('pre')?.textContent).toEqual('1234')
    const unfold = getByText('Unfold')

    act(() => {
      fireEvent.click(unfold)
    })
    expect(container.querySelector('pre')?.textContent).toEqual('1234\n5678')
    getByText('Fold')
  })

  it('should be unfolded if only one line', async () => {
    const { render } = getRender([])
    const Comp: React.FC = () => {
      return <FoldablePre>{['1234']}</FoldablePre>
    }
    const { container } = render(<Comp />)

    expect(container.querySelector('pre')?.textContent).toEqual('1234')
    expect(container.querySelector('button')).toBeFalsy()
  })

  it('should accept pure string', async () => {
    const { render } = getRender([])
    const Comp: React.FC = () => {
      return <FoldablePre>1234</FoldablePre>
    }
    const { container } = render(<Comp />)

    expect(container.querySelector('pre')?.textContent).toEqual('1234')
    expect(container.querySelector('button')).toBeFalsy()
  })

})
