import React from 'react'
import { Table, TableColumn } from '@tencent/tea-component'

export interface Item {
  key: React.ReactNode
  value: React.ReactNode
}

export interface KVTableProps {
  width?: number
  records: Item[]
  disableTextOverflow?: boolean
  keyRender?: (v: Item) => React.ReactNode
  valueRender?: (v: Item) => React.ReactNode
}

export const KVTable: React.FC<KVTableProps> = ({ width, records, disableTextOverflow, keyRender, valueRender }) => {
  const columns: TableColumn<Item>[] = [{
    key: 'key',
    header: '',
    width: width || 200,
    render: keyRender
  }, {
    key: 'value',
    header: '',
    render: valueRender
  }]
  return <Table verticalTop compact hideHeader columns={columns} records={records} disableTextOverflow={disableTextOverflow} />
}
