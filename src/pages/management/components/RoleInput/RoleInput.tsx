import React, { useCallback, useMemo, useEffect } from 'react'
import { Select } from '@tencent/tea-component'
import { useRoleLazyQuery } from 'generated/graphql'
import { useStatusTip } from 'pages/template/common'

type RoleInputProps = {
  value?: string
  onChange: (value?: string) => void
}

export const RoleInput: React.FC<RoleInputProps> = ({ value, onChange }) => {
  const [request, result] = useRoleLazyQuery()
  const fetch = useCallback(() => {
    request()
  }, [request])
  const { tip } = useStatusTip(result)

  const records = useMemo(() => result.data?.userRole ?? [], [result])
  const options = useMemo(() => records.map(({ id, name }) => ({ value: id, text: name })), [records])
  useEffect(()=>{request()}, [request])

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
