// TODO: move getAst to here
import { getAst, fromAst } from 'components/Contents/utils'
import { MarkdownHeadingNode, MarkdownNode } from 'components/Contents/MarkdownAst'

type RuleItem = {
  title: string
  shortTitle: string
  description: string
  remediation: string
}
type StructedMarkdown = Record<string, RuleItem>

function stripNewline(s: string) {
  while (/^\n/.test(s)) {
    s = s.substr(1)
  }
  while (/\n$/.test(s)) {
    s = s.substr(0, s.length - 1)
  }
  return s
}

export function parseRuleMarkdown(md: string): StructedMarkdown {
  const root = getAst(md).children

  let out: StructedMarkdown = {}
  let cur: RuleItem | undefined = undefined
  const pushCur = () => {
    if (cur) {
      out[cur.title] = cur
    }
  }
  let folded: { title: MarkdownHeadingNode, content: MarkdownNode[] }[] = []
  root.reduceRight((p, i) => {
    if (i.type === 'heading') {
      folded.unshift({
        title: i,
        content: p,
      })
      return []
    } else {
      return [i, ...p]
    }
  }, [] as MarkdownNode[])
  for (let { title: i, content } of folded.filter(i => i.title.children.length > 0)) {
    if (i.depth === 3) {
      pushCur()
      cur = {
        title: '',
        shortTitle: i.children[0].value,
        description: '',
        remediation: '',
      }
    }
    if (i.depth === 4) {
      if (!cur) {
        throw TypeError('Wrong markdown format')
      }
      const title = i.children[0].value
      let c = stripNewline(fromAst(content))
      if (title === 'Title') {
        cur.title = c
      } else if (title === 'Description') {
        cur.description = c
      } else if (title === 'Remediation') {
        cur.remediation = c
      }
    }
  }
  pushCur()

  return out
}
