import React, { useState } from 'react'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-toml'
import 'prismjs/themes/prism.css'
import styled from '@emotion/styled/macro'
import { useToggle } from 'hooks/common'

const Box = styled.div`
  height: 600px;
  overflow: auto;
  border: 1px solid #ddd;
  transition: .2s ease-in-out;
  &[data-focus=true] {
    border: 1px solid #006eff;
  }
`

const BorderEditor = styled(Editor)`
  width: 100%;
  & textarea {
    outline: 0;
  }
`

type TomlEditorProps = {
  className?: string
  value: string
  onChange?: (v: string) => void
  readOnly?: boolean
}

export const TomlEditor: React.FC<TomlEditorProps> = ({ className, value, onChange, readOnly }) => {
  const [style] = useState<React.CSSProperties>({
    verticalAlign: 'middle',
    fontFamily: '"Fira code", "Fira Mono", monospace',
    fontSize: 12,
    border: 'none',
    minHeight: '100px',
  })
  const [focus, setFocus, resetFocus] = useToggle(false)

  return <Box data-focus={focus} className={className}>
    <BorderEditor
      readOnly={readOnly}
      value={value}
      onValueChange={onChange || (() => void 0)}
      highlight={code => highlight(code, languages.toml, 'toml')}
      padding='10px'
      style={style}
      onFocus={setFocus}
      onBlur={resetFocus}
    />
  </Box>
}
