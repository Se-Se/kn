import React from 'react'
import { ContentsItem } from './Contents'
import { Anchor } from './Anchor'
import markdownParse from 'remark-parse'
import markdownStringify from 'remark-stringify'
import unified from 'unified'
import { MarkdownNode, MarkdownRootNode, MarkdownHeadingNode } from './MarkdownAst'

export const uniqueId = (s: string) => {
  return s.replace(/ /g, '_').replace(/\./g, '_').replace(/\//g, '_')
}

export const getAst = (md: string) => {
  const parser = unified().use(markdownParse)
  return parser.parse(md) as any as MarkdownRootNode
}
export const fromAst = (nodes: MarkdownNode[]) => {
  const parser:any = unified().use(markdownStringify)
  return parser.stringify({
    type: 'root',
    children: nodes,
  }) as any
}
type ContentsItemWithLevel = ContentsItem & { level: number }
export const getContents = (md: string, limit = 2): ContentsItem[] => {
  const parser = unified().use(markdownParse) as any
  var rawAst = parser.parse(md).children as MarkdownNode[]

  const out: ContentsItemWithLevel[] = rawAst
    .filter(i => i.type === 'heading' && i.children.length > 0)
    .map(_i => {
      const i = _i as MarkdownHeadingNode
      const title = i.children[0].value
      return {
        title,
        id: uniqueId(title),
        level: i.depth
      }
    })

  return makeTree(out, limit)
}
export const makeTree = (list: ContentsItemWithLevel[], limit = 2): ContentsItem[] => {
  let out: ContentsItemWithLevel[] = [...list]
  let toRemove: typeof out = []
  let parent: typeof out = []
  const lastLevel = () => {
    const r = parent[parent.length - 1]
    if (r) {
      return r.level
    } else {
      return -1
    }
  }

  for (let i of out) {
    while (i.level <= lastLevel()) {
      parent.pop()
    }
    if (parent.length > 0) {
      const last = parent[parent.length - 1]
      if (i.level > last.level) {
        if (parent.length < limit) {
          last.children = [...last.children || [], i]
        }
        toRemove.push(i)
      }
    }
    parent.push(i)
  }

  for (const i of toRemove) {
    out.splice(out.indexOf(i), 1)
  }

  return out
}
const walker = (child: React.ReactChild, cb: (child: React.ReactChild) => boolean | void) => {
  if (typeof child === 'string' || typeof child === 'number') {
    if (cb(child)) return
  } else if (Array.isArray(child)) {
    child.forEach((i) => walker(i, cb))
  } else {
    if (cb(child)) return
    if (child.props && child.props.children) {
      if (Array.isArray(child.props.children)) {
        child.props.children.forEach((i: any) => walker(i, cb))
      } else {
        walker(child.props.children, cb)
      }
    }
  }
}
export const Heading: React.FC<{ level: number, children: React.ReactChild }> = ({ level, children }) => {
  let title = ''

  walker(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      title += child.toString()
    }
  })
  return <>
    <Anchor id={uniqueId(title)} />
    {React.createElement(`h${level}`, null, children)}
  </>
}
