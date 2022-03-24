import React from 'react'
import { ConstantKeyData } from '../types'
import { AddView } from './hoc'
import { JimpleHighlighter } from './JimpleHighlighter'

export interface ConstantKeyViewProps {
  data: ConstantKeyData[]
}

AddView([
  {
    name: 'ConstantKeyData',
    version: '1.0.0'
  }
])(class ConstantKeyView extends React.Component<ConstantKeyViewProps> {
  render() {
    const { data } = this.props
    return <table className='cfg-view constant-key'>
      <tbody>
        {data.map((i, idx) => <tr key={idx}>
          <td><span>{idx + 1}</span></td>
          <td>
            <div><label>漏洞方法 : </label><div><JimpleHighlighter>{i.caller}</JimpleHighlighter></div></div>
            <div><label>漏洞触发点 : </label><JimpleHighlighter>{i.callSite}</JimpleHighlighter></div>
            <div><label>硬编码密钥 : </label><div className='code-div'><code>{i.hardcode}</code></div></div>
          </td>
        </tr>)}
      </tbody>
    </table>
  }
})
