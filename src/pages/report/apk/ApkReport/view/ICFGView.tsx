import React, { Fragment } from 'react'
import { ICFGData, ICFGPathData } from '../types'
import { AddView, ViewProps } from './hoc'
import { JimpleHighlighter } from './JimpleHighlighter'
import { joinArray } from 'utils/joinArray'

export interface ICFGViewProps extends ViewProps {
  data: ICFGData[]
}

interface PathItem {
  type: string
  content: React.ReactNode
}

AddView({
  name: 'CommonIcfgResultData',
  version: '1.0.0'
})(class ICFGView extends React.Component<ICFGViewProps> {
  private renderPath3(path: ICFGPathData) {
    const [first, ...rest] = path
    let curLocation = first.location
    let items: PathItem[] = []
    const last = rest.pop()

    items.push({ type: 'empty', content: <code></code> })
    items.push({ type: 'first', content: <code className='first'>攻击入口 -&gt;</code> })
    for (let i of rest) {
      let line = ''
      if (curLocation !== i.location) {
        items.push({ type: 'empty', content: <code></code> })
      }
      curLocation = i.location
      items.push({ type: 'path', content: <code>{line}{i.to}{'<-'}{i.from}</code> })
    }
    if (last && curLocation !== last.location) {
      items.push({ type: 'empty', content: <code></code> })
    }
    items.push({ type: 'last', content: <code className='last'>触发位置 -&gt;</code> })

    const elems = joinArray(items.map(i => <span className={i.type}>{i.content}</span>), '\n').map((i, idx) => <Fragment key={idx}>{i}</Fragment>)

    return <div className='path-view'>
      <div className='path'>
        <pre>{elems}</pre>
      </div>
      <div className='code'><div>{this.renderPath(path)}</div></div>
    </div>
  }
  private renderPath(path: ICFGPathData) {
    const [first] = path
    const ret = path.reduce((prev, i) => {
      if (prev.location === i.location) {
        return {
          ...i,
          code: [...prev.code, `    ${i.stmt}`]
        }
      } else {
        return {
          ...i,
          code: [...prev.code, `${i.location}\n    ${i.stmt}`]
        }
      }
    }, {
      location: '',
      stmt: first.stmt,
      code: [] as string[]
    })
    const value = ret.code.join('\n')
    return <JimpleHighlighter>{value}</JimpleHighlighter>
  }

  render() {
    const { data } = this.props
    return <table className='icfg-view'>
      <tbody>
        {data.map((i, idx) => <tr key={idx}>
          <td><span>{idx + 1}</span></td>
          <td>
            <div><label>漏洞组件 : </label><code>{i.component}</code></div>
            <div><label>攻击面入口 : </label><JimpleHighlighter>{i.source}</JimpleHighlighter></div>
            <div><label>漏洞触发点 : </label><JimpleHighlighter>{i.sink}</JimpleHighlighter></div>
            <div><label>漏洞触发路径 : </label>{this.renderPath3(i.path)}</div>
          </td>
        </tr>)}
      </tbody>
    </table>
  }
})
