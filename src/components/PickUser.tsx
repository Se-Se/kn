import React, { useCallback, useMemo, useState } from 'react'
import { usePickUserQuery } from 'generated/graphql'
import { Select } from '@tencent/tea-component'
import { useStatusTip } from 'pages/template/common'

type PickUserProps = {
  value?: string
  onChange: (value?: string) => void
}

export const PickUser: React.FC<PickUserProps> = ({ value, onChange }) => {
  const [search, setSearch] = useState<string | undefined>(undefined)
  const result = usePickUserQuery({
    variables: {
      search
    }
  })

  const fetch = useCallback(() => {
    result.refetch()
  }, [result])
  const { tip } = useStatusTip(result)

  const records = useMemo(() => result.data?.user?.nodes ?? [], [result])
  const options = useMemo(() => records.map(({ id, username }) => ({ value: id, text: username })), [records])

  return <Select
    value={value}
    size='m'
    boxSizeSync
    searchable
    type='simulate'
    onOpen={fetch}
    onSearch={(v) => setSearch(v)}
    options={options}
    onChange={onChange}
    tips={tip}
    appearance='button'
  />
}
