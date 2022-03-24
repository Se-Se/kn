import React from 'react'
import styled from '@emotion/styled/macro'

const Box = styled.div`
  width: 100%;
  & span {
    padding-left: 5px;
  }
`
const Inner = styled.div`
  display: inline-block;
  background: red;
  color: transparent;
`

export const Bar: React.FC<{ percent: number, color: string }> = ({ children, color, percent }) => {
  const p = Math.floor(percent * 100)
  return <Box>
    <Inner style={{
      width: `${p * 0.9}%`,
      background: color,
    }}>{children}</Inner>
    <span>{children}</span>
  </Box>
}
