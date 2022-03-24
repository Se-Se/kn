import React, { useMemo } from 'react'
import { Button } from '@tencent/tea-component'
import { useToggle } from 'hooks/common'
import { Localized } from 'i18n'
import { useHighlight } from 'hooks/useHighlight'
import { Highlight } from './Highlight'

type FoldablePreProps = {
  value?: boolean
  onChange?: (v: boolean) => void
  children: string | string[]
  displayLines?: number
}

export const FoldablePre: React.FC<FoldablePreProps> = ({ displayLines = 2, children, value, onChange }) => {
  const [expanded, expand, fold] = useToggle(false, { value, onChange })
  const lines = useMemo(() => {
    if (Array.isArray(children)) {
      return children as string[]
    }
    return children.split('\n')
  }, [children])
  const content = useMemo(() => {
    if (Array.isArray(children)) {
      return children.join('\n')
    }
    return children
  }, [children])
  const display = useMemo(() => {
    return lines.slice(0, displayLines).join('\n')
  }, [lines, displayLines])
  const overflow = useMemo(() => lines.length > displayLines, [displayLines, lines])
  const highlight = useHighlight()

  if (overflow) {
    if (!expanded) {
      return <>
        <pre><Highlight keyword={highlight}>{display}</Highlight></pre><Button type='link' onClick={expand}><Localized id='unfold' /></Button>
      </>
    } else {
      return <>
        <pre><Highlight keyword={highlight}>{content}</Highlight></pre><Button type='link' onClick={fold}><Localized id='fold' /></Button>
      </>
    }
  } else {
    return <pre><Highlight keyword={highlight}>{content}</Highlight></pre>
  }
}
