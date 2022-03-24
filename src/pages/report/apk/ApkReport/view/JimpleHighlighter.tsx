import React, { CSSProperties } from 'react'
import jimple from './jimple'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/light'
import defaultStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/default-style'
SyntaxHighlighter.registerLanguage('jimple', jimple)

const customStyle: CSSProperties = {
  padding: '1em 0.5em'
}

export const JimpleHighlighter: React.StatelessComponent<{ children: string }> = ({ children }) => {
  if (!children) {
    return <>undefined</>
  }
  return <SyntaxHighlighter
    language='jimple'
    style={defaultStyle}
    customStyle={customStyle}
  >{children}</SyntaxHighlighter>
}
