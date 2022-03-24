import React, { useCallback, useMemo, useEffect } from 'react'
import { useTeamRoleLazyQuery } from 'generated/graphql'
import { useStatusTip } from 'pages/template/common'
import { Select } from '@tencent/tea-component'

type TeamRoleInputProps = {
  value?: string
  onChange: (value?: string) => void
  disabled?: boolean
  searchable?: boolean
}

export const TeamRoleInput: React.FC<TeamRoleInputProps> = ({ value, onChange, disabled, searchable }) => {
  const [request, result] = useTeamRoleLazyQuery()
  const fetch = useCallback(() => {
    request()
  }, [request])
  const { tip } = useStatusTip(result)

  const records = useMemo(() => result.data?.teamRole ?? [], [result])
  const options = useMemo(() => records.map(({ id, name }) => ({ value: id, text: name })), [records])
  useEffect(()=>{request()}, [request])

  return <>
    <Select
      value={value}
      size='m'
      boxSizeSync
      type='simulate'
      onOpen={fetch}
      onSearch={fetch}
      options={options}
      onChange={onChange}
      tips={tip}
      appearance='button'
      disabled={disabled}
      searchable={searchable}
    />
  </>
}
