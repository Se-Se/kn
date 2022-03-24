import React from 'react'
import styled from '@emotion/styled/macro'
import { Highlight } from './Highlight'

const Pre = styled.pre`
  overflow: auto;
`

type CodeProps = {
  className?: string
  code: React.ReactNode
  highlight?: string
}

export const Code: React.FC<CodeProps> = ({ code, className, highlight }) => {
  return <Pre className={className}><code><Highlight keyword={highlight}>{code}</Highlight></code></Pre>
}
