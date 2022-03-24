import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import copy from 'copy-to-clipboard'
import { Input, Form } from '@tencent/tea-component'

const CopyInput = styled(Input)`
  /* padding: 5px;
  width: 100%; */
  cursor: pointer;
`

type ClickCopyProps = {
  label?: React.ReactNode
  value?: string
  copiedTip?: React.ReactNode
}

export const ClickCopy: React.FC<ClickCopyProps> = ({ label, value, copiedTip }) => {
  const [copied, setCopied] = useState(false)
  const v = value || ''

  return <>
    <Form.Item
      align='middle'
      label={label}
      message={copied && copiedTip}
      status={copied ? 'success' : undefined}
    >
      <CopyInput size='full' readonly onClick={(e: React.MouseEvent<any, MouseEvent>) => {
        e.currentTarget.setSelectionRange(0, v.length)
        copy(v)
        setCopied(true)
      }} value={v} />
    </Form.Item>
  </>
}
