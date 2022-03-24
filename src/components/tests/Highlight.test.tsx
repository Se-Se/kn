import React from 'react'
import { wait, render } from 'test-utils'
import { Highlight } from 'components/Highlight'
import { matchers } from 'jest-emotion'

expect.extend(matchers)

describe('Highlight', () => {
  it('keyword less than 1000 should be yellow', async () => {
    const Comp: React.FC = () => {
      const keyword = 'test'
      const children = 'testtyugiynasjkbnkasjll'
      return <Highlight keyword={keyword}>{children}</Highlight>
    }
    const { getByText } = render(<Comp />)
    await wait()
    expect(getByText('test')).toHaveStyleRule('background', 'yellow')
  })

  it('keyword only be yellow 1000 times', async () => {
    const Comp: React.FC = () => {
      const keyword = 'a'
      const children = 'a'.repeat(1052)
      return <Highlight keyword={keyword}>{children}</Highlight>
    }
    const { getAllByText } = render(<Comp />)
    expect(getAllByText('a').length).toEqual(1000)
  })

  it('should not be highlight when no keyword', async () => {
    const Comp: React.FC = () => {
      const children = 'aaaa'
      return <Highlight>{children}</Highlight>
    }
    const { getByText } = render(<Comp />)
    expect(getByText('aaaa')).not.toHaveStyleRule('background', 'yellow')
  })
})
