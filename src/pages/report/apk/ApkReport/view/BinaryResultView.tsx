import React from 'react'
import { BinaryResultData } from '../types'
import { AddView } from './hoc'
import { KVTable } from 'components/KVTable'

interface BinaryResultViewProps {
  data: BinaryResultData[]
}

AddView({
  name: 'BinaryResultData',
  version: '1.0.0'
})(
  class BinaryResultView extends React.Component<BinaryResultViewProps> {
    private renderBinary({ noASLR, noCanary }: BinaryResultData, idx: number) {
      return <div className='intent-1' key={idx}>
        {noASLR.length > 0 && <>
          <h3>地址空间随机化保护未开启</h3>
          <div className='intent-1'>
            <KVTable records={noASLR.map((name, id) => ({ key: id + 1, value: <code>{name}</code> }))} />
          </div>
        </>}
        {noCanary.length > 0 && <>
          <h3>栈保护缺失</h3>
          <div className='intent-1'>
            <KVTable records={noCanary.map((name, id) => ({ key: id + 1, value: <code>{name}</code> }))} />
          </div>
        </>}
      </div>
    }
    render() {
      const { data } = this.props
      return data.map((i, idx) => this.renderBinary(i, idx))
    }
  }
)
