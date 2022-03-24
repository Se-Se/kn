import React from 'react'
import { AddView } from './hoc'
import { JimpleHighlighter } from './JimpleHighlighter'

interface IgnoreCertificateErrorViewProps {
  data: {
    vul_method: string
  }[]
}

AddView({
  name: 'IgnoreCertificateErrorData',
  version: '1.0.0'
})(class IgnoreCertificateErrorView extends React.Component<IgnoreCertificateErrorViewProps> {
  render() {
    const { data } = this.props
    return <div>
      <div className='intent-1'>
        <table className='table-list'>
          <tbody>
            {data.map(({ vul_method }, id) => <tr key={id}>
              <td>{id + 1}</td>
              <td>
                <div>
                  <label>漏洞位置 : </label>
                  <JimpleHighlighter>{vul_method}</JimpleHighlighter>
                </div>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  }
})
