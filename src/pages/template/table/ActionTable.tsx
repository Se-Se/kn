import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import { useGetMessage } from 'i18n'
import { useInput } from 'hooks/useInput'
import { useOffset } from 'hooks/useOffset'
import { TableColumn, Table, Justify, Pagination, Text, TableAddon, Card } from '@tencent/tea-component'
import { Editable } from 'components/Editable'
import { filterable, selectable, sortable, SortableColumn, SortBy } from '@tencent/tea-component/lib/table/addons'
import { PaginationBox } from 'components/PaginationBox'
import { UseQuery, Transform, useData, fieldValueToOption } from '../common'
import styled from '@emotion/styled/macro'
import { OperationOptionDef, useRenderOperations } from './Operation'
import { useErrorToDescription } from 'hooks/useErrorToDescription'
import { useModalError } from 'components/Modal'
import { FieldSearch } from 'components/FieldSearch'
import { AllValue, filter2FilterFields, sort2OrderBy } from 'utils/table'
import { useSearch } from 'pages/report/common'

const RefetchCtx = React.createContext<() => Promise<void>>(async () => void 0)
export const RefetchProvider = RefetchCtx.Provider
export const useRefetch = () => useContext(RefetchCtx)

const TableWrapper = styled.div`
  table {
    tr {
      .edit-btn {
        display: none;
      }
      &:hover {
        .edit-btn {
          display: inline-block;
        }
      }
    }
  }
`

export interface ActionTableColumn<Item> {
  id?: string
  key: string
  editable?: boolean
  width?: number
  hidden?: boolean,
  render?: (item: Item) => React.ReactNode
}

interface ActionTableOptions<Item, Ctx = undefined> {
  columns: ActionTableColumn<Item>[]
  edit?: {
    onEdit: (item: Item, fieldKey: string, value: string) => Promise<void>
    disabled?: boolean
  }
  leftOperation?: OperationOptionDef<Item, Ctx>[]
  rightOperation?: OperationOptionDef<Item, Ctx>[]
  tableLeft?: (render: () => React.ReactNode) => React.ReactNode
  disableSelect?: boolean
  // hide select when leftOperation filter by active is empty
  disableAutoHideSelect?: boolean
  disableSearch?: boolean
  disableCard?: boolean
  pollInterval?: number
  sortableColumns?: (string | SortableColumn)[]
  additionalFilter?: Record<string, string[]>
  ctx?: Ctx
}

/**
 * Item 必须拥有id字段并且为string
 *
 * @param query
 * @param transform
 * @param options
 */
export function useActionTable<Item, TData, Ctx>(
  query: UseQuery<TData>,
  transform: Transform<TData, Item>,
  options: ActionTableOptions<Item, Ctx>
) {
  const {
    edit,
    leftOperation,
    rightOperation,
    disableSelect,
    disableAutoHideSelect,
    disableSearch,
    disableCard,
    pollInterval,
    sortableColumns,
    tableLeft = (r: () => React.ReactNode) => r(),
    additionalFilter,
    ctx = undefined,
  } = options
  const modalError = useModalError()
  const renderOperations = useRenderOperations()
  const getErrorDescription = useErrorToDescription()
  const [saving, setSaving] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const getMessage = useGetMessage()
  const { searchField, search, setFieldSearch, clearSearch } = useSearch()
  const [searchInput] = useInput('')
  const [offset, pagination, setPageIndex] = useOffset(50)
  const [sorts, setSorts] = useState<SortBy[]>([])
  const [filter, setFilter] = useState<Record<string, string[]>>({})

  useEffect(() => {
    setPageIndex(1)
  }, [search, setPageIndex])

  const result = query({
    variables: {
      offset,
      search,
      orderBy: sort2OrderBy(sorts),
      filterFields: filter2FilterFields({
        ...filter,
        ...additionalFilter,
      }),
      searchField,
    },
    pollInterval,
  })
  const { tip, records, totalCount, fieldValues } = useData(result, transform)
  const selected = useMemo(() => records.filter(i => selectedKeys.includes((i as any).id)), [selectedKeys, records])
  const wrapEdit = useCallback(async (p: Promise<void>) => {
    try {
      setSaving(true)
      await p
    } catch (e:any) {
      modalError(getErrorDescription(e))
    } finally {
      setSaving(false)
    }
  }, [getErrorDescription, modalError])
  const addons: TableAddon[] = []
  if (!disableSelect && !disableAutoHideSelect && ((leftOperation?.length ?? 0) > 0)) {
    addons.push(
      selectable({
        value: selectedKeys,
        onChange: (keys) => {
          setSelectedKeys(keys)
        },
        rowSelect: true,
      })
    )
  }
  if (sortableColumns) {
    addons.push(
      sortable({
        columns: sortableColumns ?? [],
        value: sorts,
        onChange(_, { sort }) {
          setSorts(sort ? [sort] : [])
        },
      }),
    )
  }
  const filterables = Object.entries(fieldValues ?? {}).map(([field, values]) => filterable({
    type: 'multiple',
    column: field,
    options: values.map(fieldValueToOption),
    all: { value: AllValue, text: 'All' },
    searchable: true,
    value: filter[field],
    onChange: (v) => setFilter(old => ({
      ...old,
      [field]: v,
    }))
  }))
  addons.push(...filterables)

  const columns: TableColumn<Item>[] = useMemo(() => [...options.columns
    .filter(i => !i.hidden)
    .map(i => ({
      key: i.key.toString(),
      header: getMessage(`column-${i.id ?? i.key}`),
      width: i.width,
      render: (item: Item) => {
        const text = (item as any)[i.key]
        const children = i.render ? i.render(item) : <Text title={text} overflow>{text}</Text>
        if (i.editable && edit && !edit.disabled) {
          return <Editable
            value={text}
            loading={saving}
            onSave={value => wrapEdit(edit.onEdit(item, i.key.toString(), value))}
          >
            {children}
          </Editable>
        }
        return children
      }
    })), ...(rightOperation && rightOperation.length > 0 ? [{
      key: '_operation',
      header: getMessage(`column-operation`),
      render: (item: Item) => renderOperations(rightOperation, {
        link: true,
        selected: [item],
        ctx,
      })
    }] : [])], [options.columns, getMessage, edit, saving, renderOperations, rightOperation, wrapEdit, ctx])
  const table = <>
    <TableWrapper>
      <Table
        records={records}
        columns={columns}
        addons={addons}
        recordKey={item => (item as any).id}
        topTip={tip}
      />
    </TableWrapper>
    <PaginationBox>
      <Pagination {...pagination} recordCount={totalCount} />
    </PaginationBox>
  </>

  return <RefetchProvider value={useCallback(async () => {
    setSelectedKeys([])
    await result.refetch()
  }, [result])}>
    <Table.ActionPanel>
      <Justify
        left={tableLeft(() => leftOperation && renderOperations(leftOperation, {
          link: false,
          selected,
          ctx,
        }))}
        right={disableSearch || <FieldSearch
          {...searchInput}
          onSearch={setFieldSearch}
          onClear={clearSearch}
        />}
      />
    </Table.ActionPanel>
    {disableCard ? table :
      <Card>
        {table}
      </Card>}
  </RefetchProvider>
}
