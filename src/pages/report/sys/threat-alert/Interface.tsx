import React, { useCallback } from 'react'
import { InterfaceSecurityFragment } from 'generated/graphql'
import { Node, Folded, Arrow } from './Node'
import { useJump } from '../route'

type InterfaceProps = InterfaceSecurityFragment & Folded

export const Interface: React.FC<InterfaceProps> = ({
  name,
  ip,
  port,
  inode,
  folded
}) => {
  const jump = useJump()
  const jumpInterface = useCallback(() => {
    jump('network/interface')
  }, [jump])
  return <Node head={name} folded={folded} tail={<Arrow>socket</Arrow>} onClick={jumpInterface}>
    <Node.Item title='IP'>{ip}</Node.Item>
    <Node.Item title='Port'>{port}</Node.Item>
    <Node.Item title='Inode'>{inode}</Node.Item>
  </Node>
}
