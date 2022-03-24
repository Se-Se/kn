import React from 'react'
import { WebviewFileRegionCSRFData, CFGData } from '../types'
import { AddView } from './hoc'
import { JimpleHighlighter } from './JimpleHighlighter'

export interface WebviewFileRegionCSRFViewViewProps {
  data: WebviewFileRegionCSRFData[]
}

export const CFGView = AddView([
  {
    name: 'WebviewFileRegionCSRFData',
    version: '1.0.0'
  }
])(class WebviewFileRegionCSRFViewView extends React.Component<WebviewFileRegionCSRFViewViewProps> {
  private renderCFG(data: CFGData[]) {
    return <table className='cfg-view'>
      <tbody>
        {
          data.map((i, idx) => <tr key={idx}>
            <td><span>{idx + 1}</span></td>
            <td>
              <div><label>漏洞方法 : </label><div><JimpleHighlighter>{i.caller}</JimpleHighlighter></div></div>
              <div><label>漏洞触发点 : </label><JimpleHighlighter>{i.callSite}</JimpleHighlighter></div>
            </td>
          </tr>)
        }
      </tbody>
    </table>
  }
  render() {
    const { data } = this.props
    const hasName = data.filter(i => i.activityName !== '')
    const nonName = data.filter(i => i.activityName === '')
    const nonNameItem = nonName.reduce((prev, i) => {
      return {
        ...prev,
        vul_methods: [...prev.vulMethods, ...i.vulMethods]
      }
    }, {
      activityName: '其他',
      vulMethods: []
    } as WebviewFileRegionCSRFData)
    return [...hasName, nonNameItem].map(({ activityName, vulMethods }, idx) => vulMethods.length > 0 && <div key={idx}>
      <span className='activity-name'>漏洞组件 : {activityName}</span>
      <div className='intent-1'>
        {(this.renderCFG(vulMethods))}
      </div>
    </div>)
  }
})
