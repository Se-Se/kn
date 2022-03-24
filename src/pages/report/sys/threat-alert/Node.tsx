import React, { useMemo } from 'react'
import styled from '@emotion/styled/macro'
import { css } from '@emotion/core'
import { withStatic } from 'utils/withStatic'
import { NodeItem } from './NodeItem'

const NodeHeight = 60
const MaxNodeLength = 300
const ArrowLength = 150

export const Clicklike = css`
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`
const HideText = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const Upper = styled.span`
  display: flex;
  align-items: center;
  width: fit-content;
  height: ${NodeHeight}px;
`

export const NodeBox = styled.span`
  box-sizing: border-box;
  display: inline-block;
  border: 1px solid #888;
  border-radius: 5px;
  padding: 10px;
  max-width: ${MaxNodeLength}px;
  font-size: 14px;

  ${HideText}
`

const ArrowBox = styled.span`
  display: inline-flex;
  flex-direction: column;
  width: ${ArrowLength}px;
  justify-content: center;
`
const ArrowTitle = styled.span`
  padding: 0 10px;
  font-size: 12px;
  text-align: center;
  height: 18px;

  ${HideText}
`
const ArrowDetail = styled.span`
  padding: 0 10px;
  font-size: 10px;
  text-align: center;
  height: 18px;

  ${HideText}
`

const NodeContainner = styled.span`
`

const Expanded = styled.div`
  margin-top: 8px;
  margin-right: 35px;
`

type NodeProps = {
  folded: boolean
  head: React.ReactNode
  tail?: React.ReactNode
  onClick?: () => void
}

export type Folded = {
  folded: boolean
}

export const Arrow: React.FC<{ detail?: React.ReactNode, onClick?: () => void }> = ({ onClick, children, detail }) => {
  const ArrowBoxClickable = useMemo(() => styled(ArrowBox)`
    ${onClick && Clicklike}
  `, [onClick])
  return <ArrowBoxClickable onClick={onClick}>
    <ArrowTitle title={String(children)}>
      {children}
    </ArrowTitle>
    <svg version="1.1" width={`${ArrowLength}px`} height="20px" viewBox={`0 5 ${ArrowLength} 20`} xmlns="http://www.w3.org/2000/svg">
      <path d={`M 0 15 L ${ArrowLength - 10} 15`} strokeWidth="5" stroke="#797979" fill="none" />
      <g transform={`matrix(1 0 0 1 ${ArrowLength - 102} 13 )`}>
        <path d={"M 90 13.5  L 102 2  L 90 -9.5  L 90 13.5 Z"} fillRule="nonzero" fill="#797979" stroke="none" />
      </g>
    </svg>
    <ArrowDetail title={String(detail)}>{detail}</ArrowDetail>
  </ArrowBoxClickable>
}

const NodeDef: React.FC<NodeProps> = ({ head, folded, tail, children, onClick }) => {
  const NodeBoxClickable = useMemo(() => styled(NodeBox)`
    ${onClick && Clicklike}
  `, [onClick])
  return <NodeContainner>
    <Upper>
      <NodeBoxClickable onClick={onClick}>
        {head}
      </NodeBoxClickable>
      {tail}
    </Upper>
    {!folded && <Expanded>{children}</Expanded>}
  </NodeContainner>
}

export const Node = withStatic(NodeDef, {
  Item: NodeItem
})
