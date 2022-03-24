import React, { useState, useCallback, useEffect, useMemo, useContext } from 'react'
import { Table, TableColumn, Pagination, Justify, Tabs, TabPanel, TableProps as TablePropsOri, Icon, Tooltip, Card, TagSelect, Form } from '@tencent/tea-component'
import { ErrDescription, Maybe } from 'generated/graphql'
import { Localized } from 'i18n'
import { useOffset } from 'hooks/useOffset'
import { useGetMessage } from 'i18n'
import { useRouteMatch, useHistory, useLocation, Route, Redirect } from 'react-router-dom'
import { withHighlight, withRender, withOverflow, composeRender, withArrayToMultiLine, SearchableKVTable, PreRender, withNumberToString } from './render'
import styled from '@emotion/styled/macro'
import { ExpandableAddonOptions, SortBy, sortable, SortableColumn, filterable } from '@tencent/tea-component/lib/table/addons'
import { useRefCallback } from 'hooks/useRefCallback'
import { useReportLink } from 'pages/report/context'
import { Transform, UseQuery, useData, fieldValueToOption, FieldValues } from 'pages/template/common'
import { AnalysisMatch } from 'pages/report/Report'
import { AllValue, filter2FilterFields, sort2OrderBy } from 'utils/table'
import { FieldSearch, SearchFields } from 'components/FieldSearch'

export const TabContext = React.createContext('')

const { expandable } = Table.addons
export const TableWrapper = styled.div`
  .highlight {
    background: yellow;
  }
`
const PageSizeOptions = [20, 50, 100, 200, 300]

type TableProps<T> = Omit<TablePropsOri<T>, 'columns' | 'records'>

export interface Column<Item> {
  columnName?: string
  key: keyof Item
  render?: (record: Item, rowKey: string, recordIndex: number, column: TableColumn<Item>) => React.ReactNode
  width?: number
  align?: 'left' | 'center' | 'right'
  disableMiddleware?: boolean
}

export function expandedColumns<Item>({
  columns
}: {
  columns: (keyof Item)[]
}) {
  return (record: Item) => <SearchableKVTable
    valueRender={PreRender}
    disableTextOverflow
    records={columns.map(key => ({
      key: <Localized id={`column-${key}`}>{key}</Localized>,
      value: record[key]
    }))}
  />
}

export type JustifyLeftFilterRenderProp = {
  fields: Maybe<FieldValues>
  setFilter: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
}
export interface TableParams<Item> {
  columns: (Column<Item> | (keyof Item))[]
  expanded?: Omit<ExpandableAddonOptions<Item>, 'expandedKeys' | 'onExpandedKeysChange'>
  defaultPageSize?: number
  recordKey?: (record: Item) => string
  hideHeader?: boolean
  justifyLeft?: React.ReactNode
  justifyRight?: React.ReactNode
  rightOps?: React.ReactNode
  sortableColumns?: (string | SortableColumn)[]
  search?: string
  variables?: Record<string, any>
  searchFields?: SearchFields
  topFilter?: keyof Item
  verticalTop?: boolean
  defaultFilterValue?: Record<string, string[]>
  isJump?: boolean
  justifyLeftFilterRender?: (prop: JustifyLeftFilterRenderProp) => React.ReactNode
}
export function useDetailReportTable<
  Item extends object,
  TData,
  >(
    useQuery: UseQuery<TData>,
    transform: Transform<TData, Item>,
    {
      columns: columnsOpt,
      expanded,
      defaultPageSize = 100,
      recordKey,
      hideHeader,
      justifyLeft,
      justifyRight,
      rightOps,
      sortableColumns,
      search: outSearch,
      variables,
      searchFields,
      topFilter,
      verticalTop,
      justifyLeftFilterRender,
      defaultFilterValue,
      isJump = true
    }: TableParams<Item>,
) {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  let tableProps: TableProps<Item> = {
    recordKey,
    hideHeader,
    addons: [],
    verticalTop,
  }
  if (expanded) {
    tableProps.addons!.push(
      expandable({
        expandedKeys,
        onExpandedKeysChange: (keys, { event }) => {
          event.stopPropagation()
          setExpandedKeys(keys)
        },
        ...expanded
      })
    )
  }
  useOnJump((position) => {
    setExpandedKeys([position.toString()])
  })

  const columns = columnWithErrDesc(columnsOpt)
  const [sorts, setSorts] = useState<SortBy[]>([])
  const tabContext = useContext(TabContext)
  const [highlightPos, setHighlightPos] = useState<number | undefined>(undefined)
  const history = useHistory()
  const getMessage = useGetMessage()
  const [offset, pagination, setPageIndex] = useOffset(defaultPageSize)
  const { searchField, search, setFieldSearch, clearSearch } = useSearch()
  const [filter, setFilter] = useState<Record<string, string[]>>(defaultFilterValue ?? {})

  const unionSearch = search ?? outSearch
  const { tip, status, records, totalCount, fieldValues } = useData(useQuery({
    variables: {
      offset,
      search: unionSearch,
      orderBy: sort2OrderBy(sorts),
      filterFields: filter2FilterFields(filter),
      searchField,
      ...variables,
    }
  }), transform)
  const filterables = Object.entries(fieldValues ?? {})
    .filter(([field]) => field !== topFilter)
    .map(([field, values]) => filterable({
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
  const topFilterValues = Object.entries(fieldValues ?? {}).find(([k]) => k === topFilter)?.[1]
  const topFilterView = topFilter === undefined ? undefined : <>
    <Form>
      <Form.Item label={<Localized id={`column-${columns.find(i => i.key === topFilter)?.columnName ?? String(topFilter)}`} />}>
        <TagSelect
          options={topFilterValues?.map(fieldValueToOption) ?? []}
          value={filter[topFilter as string]}
          onChange={(v) => setFilter(old => ({
            ...old,
            [topFilter]: v,
          }))}
        />
      </Form.Item>
    </Form>
  </>
  const c: TableColumn<WithAbsolutePos<Item>>[] = columns.map(i => {
    const width = i.width ?? parseInt(getMessage(`column-length-${i.key}`))
    return {
      ...i,
      key: i.key as string,
      header: <Localized id={`column-${i.columnName ?? String(i.key)}`}><span>{i.key}</span></Localized>,
      width: isNaN(width) ? undefined : width,
      render: i.render ? (
        record: WithAbsolutePos<Item>,
        rowKey: string,
        recordIndex: number,
        column: TableColumn<WithAbsolutePos<Item>>
      ) => i.render!(record, rowKey, recordIndex, column as TableColumn<Item>) : undefined
    }
  })
  const rowClassName = (record: WithAbsolutePos<Item>) => {
    return (highlightPos !== undefined && record._absolutePos === highlightPos) ? 'highlight' : ''
  }

  const readyJump = useScrollIntoView({
    exp: status === 'none' && isJump,
    query: '.highlight'
  })

  useEffect(() => {
    setPageIndex(1)
    if (unionSearch && isJump) {
      history.replace({
        ...history.location,
        search: `highlight=${encodeURIComponent(unionSearch)}`,
      })
    }
  }, [unionSearch, outSearch, setPageIndex, history, isJump])

  useOnJump((position) => {
    if (isJump) {
      setHighlightPos(position)
      setPageIndex(Math.floor(position / defaultPageSize) + 1)
      readyJump()
    }
  })

  const recordsWithPos: WithAbsolutePos<Item>[] = useMemo(() => records.map((i, idx) => ({
    ...i,
    _absolutePos: idx + offset.offset
  })), [records, offset])
  return [<TableWrapper>
    <Table.ActionPanel>
      <Justify left={(justifyLeftFilterRender ? justifyLeftFilterRender({ fields: fieldValues!, setFilter: setFilter }) : null) ?? justifyLeft ?? topFilterView} right={
        <>
          {justifyRight ??
            <FieldSearch
              searchFields={searchFields}
              onSearch={setFieldSearch}
              onClear={clearSearch}
              placeholder={
                searchFields
                  ? getMessage(`search-keyword-placeholder`)
                  : getMessage(`search-tab-placeholder`, {
                    tab: tabContext
                  })
              }
            />
          }
          {rightOps}
        </>
      } />
    </Table.ActionPanel>
    <Card>
      <Table
        {...tableProps}
        columns={c}
        records={recordsWithPos}
        recordKey={r => r._absolutePos.toString()}
        rowClassName={rowClassName}
        topTip={tip}
        addons={[
          ...tableProps.addons ?? [],
          sortable({
            columns: sortableColumns ?? [],
            value: sorts,
            onChange(_, { sort }) {
              setSorts(sort ? [sort] : [])
            },
          }),
          ...filterables,
        ]}
      />
      <Pagination {...pagination} pageSizeOptions={PageSizeOptions} recordCount={totalCount} />
    </Card>
  </TableWrapper>] as const
}

const MarginIcon = styled(Icon)`
  margin-right: 4px;
`
function getErrDescription(i: any): ErrDescription | undefined {
  return Object.keys(i).includes('errDescription') ? i : undefined
}

function columnWithErrDesc<
  Item,
  >(
    columns: (Column<Item> | (keyof Item))[]
  ): Column<Item>[] {
  let cc = columns.map((i): Column<Item> => (typeof i === 'string') ? { key: i } : i as Column<Item>)
  cc = composeRender(cc, withNumberToString, withArrayToMultiLine, withHighlight, withOverflow)
  if (cc.length >= 1) {
    cc[0] = withRender(cc[0], ({ record, next }) => {
      const children = next()
      const err = getErrDescription(record)?.errDescription
      if (err) {
        const text = Object.keys(err).map(k => `${k}: ${err[k]}`).join('\n')
        return <>
          <MarginIcon type='error' tooltip={<Tooltip>{text}</Tooltip>} />
          {children}
        </>
      }
      return children
    })
  }
  return cc
}

export function useOnJump(onJump: (position: number) => void) {
  const { state } = useLocation<State | undefined>()
  const jump = useRefCallback(onJump)
  useEffect(() => {
    if (state && state.action === 'jump') {
      const { position } = state
      if (position === undefined) {
        return
      }
      jump(position)
    }
  }, [state, jump])
}
export function useScrollIntoView({ exp, query }: { exp: boolean, query: string }) {
  const [nextJump, setNextJump] = useState(false)
  useEffect(() => {
    if (nextJump && exp) {
      window.setTimeout(() => {
        const el = document.querySelector(query) as HTMLElement
        if (!el) {
          return
        }
        el.scrollIntoView({
          block: 'center'
        })
        setNextJump(false)
      }, 0)
    }
  }, [nextJump, exp, query])

  return useCallback(() => setNextJump(true), [])
}
export function useSearch() {
  const history = useHistory()
  const [search, setSearch] = useState<string | undefined>(undefined)
  const [searchField, setSearchField] = useState<string | undefined>(undefined)
  const clearSearch = useCallback(() => {
    setSearch(undefined)
    history.replace({
      ...history.location,
      search: ``
    })
  }, [history])

  return {
    searchField,
    search,
    setSearch,
    setFieldSearch: useCallback(([field, search]: [string | undefined, string | undefined]) => {
      setSearchField(field)
      setSearch(search)
    }, []),
    clearSearch,
  }
}

export interface State {
  action: 'jump'
  position?: number
}

type WithAbsolutePos<T> = T & {
  _absolutePos: number
}

interface TabDesc {
  id: string
  component: React.FC<{}>
}

export const TableTabs: React.FC<{ tabs: TabDesc[] }> = ({ tabs }) => {
  const reportLink = useReportLink()
  const { params: { page, tab }, path, url } = useRouteMatch<AnalysisMatch>()
  const history = useHistory()
  const state = history.location.state
  const tabsElement = tabs.map(({ id, component: Component }) => <TabPanel id={id} key={id}>
    <Route path={`${path}/${id}`}>
      <Component />
    </Route>
  </TabPanel>)
  return <>
    {!tab && <Redirect to={reportLink({ page, tab: tabs[0].id })} />}
    <InnerTabs tabs={tabs} url={url} state={state}>{tabsElement}</InnerTabs>
  </>
}

const InnerTabs: React.FC<{ tabs: TabDesc[], url: string, state?: unknown }> = ({ tabs, children, state }) => {
  const getMessage = useGetMessage()
  const history = useHistory()
  const { params: { tab, page } } = useRouteMatch<AnalysisMatch>()
  const reportLink = useReportLink()

  const activeId = tab || tabs[0].id
  const activeTabName = getMessage(`tabs-${activeId}`, {}, activeId)
  const tabsDesc = useMemo(() => tabs.map(({ id }) => ({
    id,
    label: <Localized id={`tabs-${id}`}><span>tabs-{id}</span></Localized>
  })), [tabs])
  return <TabContext.Provider value={activeTabName}>
    <Tabs
      ceiling
      activeId={activeId}
      tabs={tabsDesc}
      onActive={({ id }) => history.push(reportLink({ page, tab: id }), state)}
    >
      {children}
    </Tabs>
  </TabContext.Provider>
}

export function getProject<T>(d: T): T extends { __typename?: 'Project' } ? T : undefined {
  // @ts-ignore
  return d?.__typename === 'Project' ? d : undefined
}

export function getAnalysis<T>(d: T): T extends { __typename?: 'Analysis' } ? T : undefined {
  // @ts-ignore
  return d?.__typename === 'Analysis' ? d : undefined
}

export function getSysReport<T>(d: T): T extends {
  __typename?: 'Analysis'
  report: infer U
} ? U extends {
  __typename?: 'SysReport'
} ? U : undefined : undefined {
  // @ts-ignore
  if (d?.__typename !== 'Analysis' || d?.report?.__typename !== 'SysReport') return
  // @ts-ignore
  return d.report
}

export function getApkReport<T>(d: T): T extends {
  __typename?: 'Analysis'
  report: infer U
} ? U extends {
  __typename?: 'ApkReport'
} ? U : undefined : undefined {
  // @ts-ignore
  if (d?.__typename !== 'Analysis' || d?.report?.__typename !== 'ApkReport') return
  // @ts-ignore
  return d.report
}
