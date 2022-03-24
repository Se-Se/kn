
export interface Position {
  start: { offset: number }
  end: { offset: number }
}
export interface NodeBase {
  position: Position
}
export interface MarkdownHeadingNode extends NodeBase {
  type: 'heading'
  depth: number
  children: MarkdownTextNode[]
}
export interface MarkdownTextNode extends NodeBase {
  type: 'text'
  value: string
}
export interface MarkdownRootNode extends NodeBase {
  type: 'root'
  children: MarkdownNode[]
}
export type MarkdownNode = MarkdownHeadingNode | MarkdownTextNode
