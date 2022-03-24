import React, { useCallback, useMemo, useEffect } from 'react'
import { Select } from '@tencent/tea-component'
import { useTeamLazyQuery } from 'generated/graphql'
import { useData } from 'pages/template/common'

type TeamInputProps = {
  value?: string
  onChange: (value?: string) => void
}

export const TeamInput: React.FC<TeamInputProps> = ({ value, onChange }) => {
  const [request, result] = useTeamLazyQuery()
  const fetch = useCallback((inputValue = '') => {
    request({
      variables: {
        search: inputValue
      }
    })
  }, [request])
  const { records, tip } = useData(result, i => i.management.team)
  const options = useMemo(() => records.map(({ id, name }) => ({ value: id, text: name })), [records])
  useEffect(()=>{request()}, [])

  return <>
    <Select
      value={value}
      size='m'
      boxSizeSync
      searchable
      type='simulate'
      onOpen={fetch}
      onSearch={fetch}
      options={options}
      onChange={onChange}
      tips={tip}
      appearance='button'
    />
  </>
}
