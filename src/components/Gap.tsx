import styled from '@emotion/styled/macro'

export const Gap = styled.div<{ h?: number, w?: number }>`
  width: ${p => p.w ?? 0}px;
  height: ${p => p.h ?? 0}px;
  flex: none;
`
