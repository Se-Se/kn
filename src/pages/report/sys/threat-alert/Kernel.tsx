import React, { useCallback } from 'react'
import { KernelFragment } from 'generated/graphql'
import { Node, Folded } from './Node'
import { useJump } from '../route'

type KernelProps = KernelFragment & Folded

export const Kernel: React.FC<KernelProps> = ({
  version,
  name,
  release,
  folded,
}) => {
  const jump = useJump()
  const jumpKernel = useCallback(() => {
    jump('system/kernel', 0)
  }, [jump])
  return <Node head='Kernel' folded={folded} onClick={jumpKernel}>
    <Node.Item title='Version'>{version}</Node.Item>
    <Node.Item title='Name'>{name}</Node.Item>
    <Node.Item title='Release'>{release}</Node.Item>
  </Node>
}
