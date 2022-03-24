import React, { useState, useCallback } from 'react'
import { SearchBox as TeaSearchBox, SearchBoxProps, InputAdornment, Button, Input } from '@tencent/tea-component'
import { useEnterCallback } from 'hooks/useEnterCallback'
type SearchBoxSize = 'full' | 'l' | 'm' | 's'

export const SearchBox: React.FC<SearchBoxProps> = ({ children, ...props }) => {
  const [size, setSize] = useState<SearchBoxSize>('m')
  const onFocus = useCallback(() => setSize('l'), [])
  const onBlur = useCallback(() => setSize('m'), [])
  return <TeaSearchBox {...props} onFocus={onFocus} onBlur={onBlur} size={size}>{children}</TeaSearchBox>
}

type BigSearchButtonProps = {
  placeholder?: string
  value: string
  onChange: (v: string) => void
  onSearch: (s: string) => void
}
export const BigSearchButton: React.FC<BigSearchButtonProps> = ({ placeholder, value, onChange, onSearch, children }) => {
  const handleClick = useCallback(() => onSearch(value), [value, onSearch])
  const enter = useEnterCallback(() => onSearch(value))
  return <InputAdornment className='group' after={<Button type='primary' onClick={handleClick}>{children}</Button>}>
    <Input size='full' placeholder={placeholder} value={value} onChange={onChange} {...enter}></Input>
  </InputAdornment>
}
