import React, { useCallback, useState } from 'react'
import { Icon, Input } from '@tencent/tea-component'
import styled from '@emotion/styled/macro'
import { useToggle } from 'hooks/common'
import { useEnterCallback } from 'hooks/useEnterCallback'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
const Children = styled.span`
  overflow: hidden;
  flex: 1 1 0;
`
const IconBtn = styled(Icon)`
  flex: none;
  cursor: pointer;
`

type EditableProps = {
  value: string
  onSave: (value: string) => void
  loading?: boolean
}

export const Editable: React.FC<EditableProps> = ({ value, children, onSave, loading }) => {
  const [newValue, setNewValue] = useState('')
  const [editing, setEditing, resetEditing] = useToggle(false)
  const onClick = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setNewValue(value)
    setEditing()
    e.stopPropagation()
  }, [setEditing, value])
  const handleSave = useCallback(() => {
    if (value !== newValue) {
      onSave(newValue)
    }
    resetEditing()
  }, [resetEditing, value, newValue, onSave])
  const enter = useEnterCallback(handleSave)

  return <Wrapper>
    {editing ?
      <Input defaultValue={value} onChange={setNewValue} onBlur={handleSave} autoFocus {...enter} /> :
      <>
        <Children>{children}</Children>
        {loading ?
          <Icon className='edit-btn' type='loading' /> :
          <IconBtn className='edit-btn' type='pencil' onClick={onClick} />
        }
      </>
    }
  </Wrapper>
}
