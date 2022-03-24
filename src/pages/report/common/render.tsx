import { TableColumn, Text } from '@tencent/tea-component'
import { Column } from '.'
import React, { useState, useCallback } from 'react'
import { Highlight } from 'components/Highlight'
import * as KVTable from 'components/KVTable'
import { useGetMessage } from 'i18n'
import { useHighlight } from 'hooks/useHighlight'

const HighlightByQueryString: React.FC = ({ children }) => {
  const highlight = useHighlight()
  return <Highlight keyword={highlight}>{children}</Highlight>
}

export interface ChainRenderParams<T> {
  record: T
  rowKey: string
  recordIndex: number
  column: TableColumn<T>
  next: () => React.ReactNode
}
export interface ChainRender<T> {
  (params: ChainRenderParams<T>): React.ReactNode
}
function DefaultRender<T>({ record, column }: ChainRenderParams<T>): React.ReactNode {
  return (record as any)[column.key]
}
export function withRender<T>(column: Column<T>, render: ChainRender<T>) {
  const oldRender = column.render
  const rootRender: ChainRender<T> = oldRender ?
    (({ record, rowKey, recordIndex, column }) => oldRender(
      record,
      rowKey,
      recordIndex,
      column,
    )) : DefaultRender

  return {
    ...column,
    render: (record: T, rowKey: string, recordIndex: number, column: TableColumn<T>): React.ReactNode => {
      const params = {
        record,
        rowKey,
        recordIndex,
        column,
        next: () => void 0
      }
      return render({
        ...params,
        next: () => rootRender(params)
      })
    }
  }
}

export function withHighlight<T>(column: Column<T>) {
  return withRender(column, ({ next }) => {
    return <HighlightByQueryString>{next()}</HighlightByQueryString>
  })
}

const OverflowText: React.FC = ({ children }) => {
  const [title, setTitle] = useState('')
  const handleRef = useCallback((i: HTMLSpanElement | null) => setTitle(i?.textContent || ''), [])
  return <Text
    ref={handleRef}
    overflow={true}
    title={title}
  >
    {children}
  </Text>
}

export function withOverflow<T>(column: Column<T>) {
  return withRender(column, ({ next }) => {
    return <OverflowText>
      {next()}
    </OverflowText>
  })
}

export function withArrayToMultiLine<T>(column: Column<T>) {
  return withRender(column, ({ next }) => {
    let value = next()
    if (Array.isArray(value)) {
      value = value.join('\n')
    }
    return value
  })
}

export function withNumberToString<T>(column: Column<T>) {
  return withRender(column, ({ next }) => {
    let value = next()
    if (typeof value === 'number') {
      return value.toString()
    }
    return value
  })
}

export function composeRender<T>(column: Column<T>[], ...params: ((column: Column<T>) => Column<T>)[]) {
  let out = column
  for (const p of params) {
    out = out.map(i => i.disableMiddleware ? i : p(i))
  }
  return out
}

export const PreRender = ({ value }: KVTable.Item) => <pre>{value}</pre>

export const SearchableKVTable: React.FC<
  KVTable.KVTableProps
> = ({ children, valueRender, ...props }) => {
  return <KVTable.KVTable {...props} valueRender={valueRender}>{children}</KVTable.KVTable>
}

export const useI18nKVRecords = () => {
  const getMessage = useGetMessage()
  return useCallback((data: Record<string, React.ReactNode>) => Object.entries(data)
    .map(
      ([k, v]) => ({
        key: getMessage(`column-${k}`, undefined, k),
        value: v
      })
    ),
    [getMessage]
  )
}

export const keyPrefix = <T extends any>(prefix: string, obj: Record<string, T>): Record<string, T> => {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [prefix + k, v] as const))
}
