import React, { useEffect, useCallback, useState, useMemo, useContext } from 'react'
import { QueryResult, OperationVariables, LazyQueryResult } from '@apollo/client'
import { Loading } from 'components/Loading'
import { ShowError } from 'components/ShowError'
import { Button } from '@tencent/tea-component'

// eslint-disable-next-line
export const useMount = (f: () => void) => useEffect(() => { f() }, [])

export const useApolloData = <TData = any, TVariables = OperationVariables>(
  res: QueryResult<TData, TVariables> | LazyQueryResult<TData, TVariables>,
  render: (data: TData) => React.ReactElement,
  renderError?: (error: any) => React.ReactElement
): React.ReactElement => {
  const { data, error, loading, refetch, called } = res
  const onClick = useCallback(() => refetch?.(), [refetch])
  if (!called) {
    return React.createElement(React.Fragment)
  }
  if (loading) {
    return React.createElement(Loading)
  }
  if (error) {
    if (renderError) {
      return renderError(error)
    } else {
      return React.createElement(
        ShowError,
        {
          error
        },
        React.createElement(Button, { onClick }, 'Refetch')
      )
    }
  }
  return render(data!)
}

export type Controlled<T> = {
  value?: T
  onChange?: (v: T) => void
}

export const useToggle = (defaultValue: boolean, controlled?: Controlled<boolean>) => {
  let [value, setValue]: [boolean, (v: boolean) => void] = useState(defaultValue)
  if (controlled?.value !== undefined) {
    value = controlled.value
  }
  if (controlled?.onChange !== undefined) {
    setValue = controlled.onChange
  }
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])
  return [value, setTrue, setFalse] as const
}

export const useSwitch = (defaultValue: boolean) => {
  const [value, setValue] = useState(defaultValue)
  const switchValue = useCallback(() => setValue(v => !v), [])
  return [value, switchValue] as const
}

export const createValueContext = <T>(defaultValue: T) => {
  return React.createContext<{
    value: T,
    setValue: React.Dispatch<React.SetStateAction<T>>
  }>({
    value: defaultValue,
    setValue: () => { throw new Error('not in context') }
  })
}

export const useValueContext = <T>(defaultValue: T) => {
  const [value, setValue] = useState<T>(defaultValue)
  const providerValue = useMemo(() => ({
    value,
    setValue,
  }), [value])
  return [providerValue, value, setValue] as const
}

export const usePortal: (context: React.Context<{
  value: React.ReactNode;
  setValue: (v: React.ReactNode) => void;
}>, props: { children?: React.ReactNode }) => null = (context, { children }) => {
  const { setValue } = useContext(context)

  useEffect(() => {
    setValue(children)
    return () => setValue(undefined)
  }, [children, setValue])

  return null
}

export const useExpanded = <T>() => {
  const [expanded, setExpanded] = useState<T[]>([])
  const toggleExpand = useCallback((key: T) => {
    setExpanded(e => {
      if (e.includes(key)) {
        return [...e.filter(i => i !== key)]
      } else {
        return [...e, key]
      }
    })
  }, [])
  return { expanded, toggleExpand }
}
