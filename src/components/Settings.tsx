import { useGetMessage } from "i18n"
import React, { useCallback, useMemo, useState } from "react"
import { Prompt } from 'react-router-dom'
import deepEqual from 'deep-equal'

export const SettingPrompt: React.FC<{ when: boolean }> = ({ when }) => {
  const getMessage = useGetMessage()

  return <Prompt when={when} message={getMessage('management-settings-before-leave')} />
}

type Options<
  T extends Record<string, any>,
  I extends Record<keyof T, any>,
  > = {
    toInput?: (v: T) => I,
  }
type InputType<T> = T extends Options<any, infer I> ? I : never

export const useFormData = <
  T extends Record<string, any>,
  O extends Options<T, any>,
  >(oldValue: T, options?: O) => {
  const [value, setValue] = useState(oldValue)
  const changed = !deepEqual(oldValue, value)
  const toInput = options?.toInput
  const input = useMemo(() => {
    if (toInput) {
      return toInput(value) as InputType<O>
    } else {
      return value as InputType<O>
    }
  }, [toInput, value])
  const bind = useCallback(<K extends keyof T>(key: K) => {
    return (v: T[K]) => {
      setValue(oldValue => ({
        ...oldValue,
        [key]: v
      }))
    }
  }, [])

  return {
    changed,
    value,
    bind,
    setValue,
    input,
  } as const
}
