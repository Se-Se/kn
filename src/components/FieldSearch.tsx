import { ChangeContext, SearchBox, SearchBoxProps, Select } from '@tencent/tea-component'
import { useInput } from 'hooks/useInput'
import { useGetMessage } from 'i18n'
import { SearchBox as VLSearchBox } from 'components/SearchBox'
import React from 'react'

export type SearchFields = ({ key: string, id: string } | string)[]

export type FieldSearchProps = Omit<SearchBoxProps, 'onSearch'> & {
  searchFields?: SearchFields
  onSearch?: (keyword: [string | undefined, string | undefined], context?: ChangeContext<React.SyntheticEvent<Element, Event>>) => void
}

export const useFieldSearch = ({ searchFields = [], onSearch, ...rest }: FieldSearchProps) => {
  const getMessage = useGetMessage()
  const options = [{
    value: '',
    text: getMessage('column-all-search')
  }, ...searchFields.map((key) => {
    if (typeof key === 'string') {
      return {
        value: key,
        text: getMessage(`column-${key}`)
      }
    } else {
      return {
        value: key.key,
        text: getMessage(`column-${key.id}`)
      }
    }
  })]
  const [searchInput] = useInput('')
  const [searchFieldInput] = useInput<string>('')
  const hasFields = searchFields.length > 0

  return <>
    { hasFields && <Select
      type='simulate'
      size='s'
      options={options}
      appearance='button'
      boxSizeSync
      {...searchFieldInput}
    />}
    { hasFields
      ? <SearchBox
        size='m'
        {...searchInput}
        {...rest}
        onSearch={(v, c) => {
          const field = searchFieldInput.value === '' ? undefined : searchFieldInput.value
          onSearch?.([field, v], c)
        }}
      />
      : <VLSearchBox
        size='m'
        {...searchInput}
        {...rest}
        onSearch={(v, c) => {
          const field = searchFieldInput.value === '' ? undefined : searchFieldInput.value
          onSearch?.([field, v], c)
        }}
      />
    }
  </>
}

export const FieldSearch: React.FC<FieldSearchProps> = (props) => {
  return useFieldSearch(props)
}
