import React, { useMemo } from 'react'
import styled from '@emotion/styled/macro'
import { Clicklike } from './Node'

const Containner = styled.div`
`

const Key = styled.div`
  padding: 5px;
  border: 1px solid rgba(0,0,0,.65);
  background: #f2f2f2;
`
const Value = styled.div`
  padding: 5px;
  border: 1px solid rgba(0,0,0,.65);
  white-space: pre;
`

export type NodeItemProps = {
  title: React.ReactNode
  onClick?: () => void
}

export const NodeItem: React.FC<NodeItemProps> = ({ title, children, onClick }) => {
  const ContainnerClickable = useMemo(() => styled(Containner)`
    ${onClick && Clicklike}
  `, [onClick])
  return <>{children && <ContainnerClickable onClick={onClick}>
    <Key>{title}</Key>
    <Value>{children}</Value>
  </ContainnerClickable>}</>
}
