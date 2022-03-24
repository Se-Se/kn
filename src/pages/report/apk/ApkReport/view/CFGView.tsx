import React from 'react'
import { CFGData } from '../types'
import { AddView } from './hoc'
import { JimpleHighlighter } from './JimpleHighlighter'

export interface CFGViewProps {
  data: CFGData[]
}

interface CFGViewState {
}

AddView([
  {
    name: 'CommonCfgResultData',
    version: '1.0.0'
  }, {
    name: 'OpenSocketData',
    version: '1.0.0'
  }
])(class CFGView extends React.Component<CFGViewProps, CFGViewState> {
  render() {
    const { data } = this.props
    return <table className='cfg-view'>
      <tbody>
        {data.map((i, idx) => <tr key={idx}>
          <td><span>{idx + 1}</span></td>
          <td>
            <div><label>漏洞方法 : </label><div><JimpleHighlighter>{i.caller}</JimpleHighlighter></div></div>
            <div><label>漏洞触发点 : </label><JimpleHighlighter>{i.callSite}</JimpleHighlighter></div>
          </td>
        </tr>)}
      </tbody>
    </table>
  }
})
