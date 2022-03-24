import React from 'react'
import { AddView } from './hoc'
import { Markdown } from 'components/Markdown'

export interface CustomNormalViewProps {
  data: { custom_data: string }[]
}

interface CustomNormalViewState {
}

AddView({
  name: 'CustomNormalData',
  version: '1.0.0'
})(class CustomNormalView extends React.Component<CustomNormalViewProps, CustomNormalViewState> {
  render() {
    const { data } = this.props
    return <div className='custom-nomral-view'>
      {data.map((i, idx) => <div key={idx}>
        <Markdown source={i.custom_data}></Markdown>
      </div>)}
    </div>
  }
})
