import React, { useState } from 'react'
import { LoadPage } from 'components/LoadPage'
import { render, act, wait } from 'test-utils'

describe('LoadPage', () => {
  it('should load async import', async () => {
    const Comp: React.FC = () => {
      return <LoadPage page={import('./SamplePage')} />
    }
    const { getByText, getByTestId } = render(<Comp />)

    getByTestId('show-loading')
    await wait()
    getByText('Sample Page')
  })

  it('should show error message when rejected', async () => {
    const Comp: React.FC = () => {
      return <LoadPage page={Promise.reject('sample error')} />
    }
    const { getByTestId } = render(<Comp />)
    await wait()
    expect(getByTestId('show-error').textContent).toBe('sample error')
  })

  it('should not throw warning when unmount to early', async () => {
    {
      const Comp: React.FC = () => {
        return <LoadPage page={import('./SamplePage')} />
      }
      const { unmount } = render(<Comp />)
      unmount()
    }
    {
      const Comp: React.FC = () => {
        return <LoadPage page={Promise.reject('sample error')} />
      }
      const { unmount } = render(<Comp />)
      unmount()
    }
  })

  it('should load new page after page changed', async () => {
    let page
    let setPage: Function
    const Comp: React.FC = () => {
      [page, setPage] = useState<Promise<{ Page: React.FC }>>(Promise.resolve({ Page: () => <span>Sample 1</span> }))
      return <LoadPage page={page} />
    }
    const { getByText } = render(<Comp />)
    await wait()
    getByText('Sample 1')

    await act(async () => {
      setPage!(import('./SamplePage'))
      await wait()
    })
    getByText('Sample Page')
  })
})
