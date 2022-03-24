import React, { useCallback, useMemo } from 'react'
import { ProcSecurityFragment } from 'generated/graphql'
import { Folded, Node, Arrow } from './Node'
import { useJump } from '../route'
import { isExperiment } from 'utils/isExperiment'

type ProcessProps = ProcSecurityFragment & Folded

export const Process: React.FC<ProcessProps> = ({
  name,
  pid,
  attackVector,
  security,
  importance,
  connectRelation,
  folded,
  detailPosition,
  baselinePosition,
  score,
}) => {
  const jump = useJump()
  const jumpProcess = useCallback(() => {
    jump(detailPosition!.url, detailPosition!.offset)
  }, [detailPosition, jump])
  const jumpBaseline = useCallback(() => {
    jump(baselinePosition!.url, baselinePosition!.offset)
  }, [baselinePosition, jump])
  const jumpRelation = useCallback(() => {
    jump(connectRelation!.detailPosition!.url, connectRelation!.detailPosition!.offset)
  }, [connectRelation, jump])
  const tail = useMemo(() => {
    if (connectRelation) {
      const pos = connectRelation.detailPosition
      return <Arrow onClick={pos ? jumpRelation : undefined} detail={connectRelation.port}>{connectRelation.type}</Arrow>
    }
  }, [connectRelation, jumpRelation])

  return <Node
    head={name}
    folded={folded}
    tail={tail}
    onClick={detailPosition ? jumpProcess : undefined}
  >
    <Node.Item title='PID'>{pid}</Node.Item>
    <Node.Item title='Attack vector'>{attackVector}</Node.Item>
    <Node.Item title='Process security' onClick={baselinePosition ? jumpBaseline : undefined}>{security?.join('\n')}</Node.Item>
    <Node.Item title='Importance'>{importance}</Node.Item>
    {isExperiment() && <Node.Item title='Score'>{score}</Node.Item>}
  </Node>
}
