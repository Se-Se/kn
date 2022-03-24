import React, { useMemo } from 'react'
import { OffsetConnectionInput, AnalysisType, Maybe, OrderByInput, Scalars } from 'generated/graphql'
import { QueryHookOptions, QueryResult, LazyQueryResult } from '@apollo/client'
import { useErrorToDescription } from 'hooks/useErrorToDescription'
import { StatusTip, TableColumn } from '@tencent/tea-component'
import { useTranslation } from '@tencent/tea-component/lib/i18n'
import { useGetMessage, Localized } from 'i18n'
import { analysisTypeCategory } from 'components/AnalysisTypeItem'

export type FieldValue = { value: string, count?: number }
export type FieldValues = Record<string, { value: string, count?: number }[]>
export const formatFieldValues = (i: FieldValue) => {
  const avoidEmpty = (s: string) => !s ? '　' : s
  if (i.count === undefined) {
    return `${avoidEmpty(i.value)}`
  } else {
    return `${avoidEmpty(i.value)} (${i.count})`
  }
}
export const fieldValueToOption = (i: FieldValue): { value: string, text: string } => {
  return {
    value: i.value,
    text: formatFieldValues(i),
  }
}

export interface Variables {
  offset?: Maybe<OffsetConnectionInput>
  search?: Maybe<string>
  orderBy?: Maybe<OrderByInput>
  filterFields?: Maybe<Scalars['Map']>
  searchField?: Maybe<string>
}

export interface UseQuery<TData> {
  (options?: QueryHookOptions<TData, Variables>): QueryResult<TData, Variables>
}

export interface Nodes<Item> {
  nodes?: Maybe<Item[]>
  totalCount: number
  fieldValues?: Maybe<Record<string, string[]>>
  fieldValuesWithCount?: Maybe<Record<string, { value: string, count: number }[]>>
}

export interface Transform<TData, Item> {
  (data: TData): Maybe<Nodes<Item>> | undefined | false
}
export type Status = 'empty' | 'loading' | 'error' | 'found' | 'none'

export function useStatusTip<TData, TVariables extends Variables>(
  { error, loading, called }: QueryResult<TData, TVariables> | LazyQueryResult<TData, TVariables>
) {
  let status: Status
  if (!called) {
    status = 'none'
  } else if (loading) {
    status = 'loading'
  } else if (error) {
    status = 'error'
  } else {
    status = 'none'
  }
  const t = useTranslation()
  const getErrorDescription = useErrorToDescription()
  const errDesc = error && getErrorDescription(error)

  return {
    tip: status !== 'none' && (
      <StatusTip
        status={status}
        errorText={<>{t.loadErrorText}: {errDesc}</>}
      />
    ),
    status
  }
}

export function useData<TData, Item, TVariables extends Variables>
  (
    result: QueryResult<TData, TVariables> | LazyQueryResult<TData, TVariables>,
    transform: Transform<TData, Item>
  ): {
    status: Status,
    records: Item[],
    totalCount: number,
    error: React.ReactNode,
    tip: React.ReactNode,
    fieldValues?: Maybe<FieldValues>,
  } {
  const { error } = result
  const { status, ...rest } = toData(result, transform)
  const getErrorDescription = useErrorToDescription()
  const errDesc = error && getErrorDescription(error)
  const t = useTranslation()

  return {
    ...rest,
    error: errDesc,
    tip: status !== 'none' && (
      <StatusTip
        status={status}
        errorText={<>{t.loadErrorText}: {errDesc}</>}
      />
    ),
    status
  } as const
}

function toData<TData, Item, TVariables extends Variables>
  (
    result: QueryResult<TData, TVariables> | LazyQueryResult<TData, TVariables>,
    transform: Transform<TData, Item>
  ): {
    status: Status
    records: Item[]
    totalCount: number
    fieldValues?: Maybe<FieldValues>
  } {
  const { error, loading, data, variables, called } = result
  if (!called) {
    return {
      status: 'none',
      records: [],
      totalCount: 0,
    }
  }
  if (loading) {
    return {
      status: 'loading',
      records: [],
      totalCount: 0,
    }
  }
  if (error) {
    return {
      status: 'error',
      records: [],
      totalCount: 0,
    }
  }
  if (!data) {
    throw new TypeError(`Data shouldn't be null or undefined`)
  }
  const item = transform(data!) || undefined
  const fieldValues: FieldValues = {
    ...(item?.fieldValuesWithCount ?? {}),
    ...(item?.fieldValues
      ? Object.fromEntries(Object.entries(item.fieldValues).map(([k, v]) =>
        [k, v.map(i => ({
          value: i,
        }))])) as FieldValues
      : undefined) ?? {}
  }
  if (!item || !item?.totalCount || !item.nodes) {
    return {
      status: 'empty',
      records: [],
      totalCount: 0,
      fieldValues,
    }
  }
  if (variables?.search) {
    return {
      status: 'found',
      records: item.nodes,
      totalCount: item.totalCount,
      fieldValues,
    }
  }
  return {
    status: 'none',
    records: item.nodes,
    totalCount: item.totalCount,
    fieldValues,
  }
}

/**
 * 根据key自动填充空header为i18n翻译
 */
export function useTableColumn<T>(columns: (Omit<TableColumn<T>, 'header'> & { id?: string })[]) {
  const getMessage = useGetMessage()
  return useMemo<TableColumn<T>[]>(() => {
    return columns.map(i => {
      const ret: TableColumn<T> = {
        header: undefined,
        ...i,
      }
      if (!ret.header) {
        ret.header = getMessage(`column-${i.id ?? ret.key}`)
      }
      return ret
    })
  }, [getMessage, columns])
}

export const renderAnalysisType = ({ analysisType }: { analysisType: AnalysisType }) => {
  const category = analysisTypeCategory(analysisType)
  return <>{category} / <Localized id={`enum-${category}Type-${analysisType}`} /></>
}
