import React from 'react'
import styled from '@emotion/styled/macro'
import { css } from '@emotion/core'
import { Loading } from './Loading'
const ReactMarkdownOri = React.lazy(() => import('react-markdown'))
const ReactMarkdownWithHtml = React.lazy(() => import('react-markdown/with-html'))
const SyntaxHighlighter = React.lazy(() => import('react-syntax-highlighter'))

const Style = css`
  /* font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji; */
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-all;
  word-break: break-all;

  &>:first-of-type {
    margin-top: 0!important
  }

  &>:last-child {
      margin-bottom: 0!important
  }
  hr {
    height: .25em;
    padding: 0;
    margin: 24px 0;
    background-color: #e1e4e8;
    border: 0
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25
  }

  h1 {
    font-size: 2em
  }

  h1,h2 {
    padding-bottom: .3em;
    border-bottom: 1px solid #eaecef
  }

  h2 {
    font-size: 1.5em
  }

  h3 {
    font-size: 1.25em
  }

  h4 {
    font-size: 1em
  }

  h5 {
    font-size: .875em
  }

  h6 {
    font-size: .85em;
    color: #6a737d
  }

  ol,ul {
    padding-left: 2em
  }

  ol.no-list,ul.no-list {
    padding: 0;
    list-style-type: none
  }

  ol ol,ol ul,ul ol,ul ul {
    margin-top: 0;
    margin-bottom: 0
  }

  li {
    word-wrap: break-all
  }

  li>p {
    margin-top: 16px
  }

  li+li {
    margin-top: .25em
  }

  img, pre {
    max-width: 100%;
  }
  p {
    margin-top: 0;
    margin-bottom: 16px;
  }
  ul {
    list-style-type: disc;
    margin-top: 0;
    margin-bottom: 16px;
  }
  ol {
    list-style-type: decimal;
    margin-top: 0;
    margin-bottom: 16px;
  }
  table {
    th , td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
  }
`

export const ReactMarkdown = styled(ReactMarkdownOri)`${Style}`
export const ReactMarkdownHtml = styled(ReactMarkdownWithHtml)`${Style}`

export interface CodeBlockProps {
  value: string
  language?: string
}
export const CodeBlock: React.FC<CodeBlockProps> = ({ value, language }) => {
  return <React.Suspense fallback={<Loading />}>
    <SyntaxHighlighter language={language}>
      {value}
    </SyntaxHighlighter>
  </React.Suspense>
}

export interface MarkdownProps {
  source: string
  limitHeight?: number
}
export const Markdown: React.FC<MarkdownProps> = ({ source, limitHeight }) => {
  return <React.Suspense fallback={<Loading />}>
    <ReactMarkdown
      source={source}
      renderers={{
        code: CodeBlock
      }}
      className='markdown'
    />
  </React.Suspense>
}
