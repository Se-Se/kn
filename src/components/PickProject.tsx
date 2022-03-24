import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { usePickProjectQuery } from 'generated/graphql'
import { Select } from '@tencent/tea-component'
import { useStatusTip } from 'pages/template/common'
import { getTeam } from 'pages/dashboard/Dashboard'

type PickProjectProps = {
  teamId: string
  value: string
  onChange: (value: string) => void
  onProjectName?: (value: string) => void
}

export const PickProject: React.FC<PickProjectProps> = ({ teamId, value, onChange, onProjectName: setProject }) => {
  const [search, setSearch] = useState<string | undefined>(undefined)
  const result = usePickProjectQuery({
    variables: {
      teamId,
      search
    }
  })

  const fetch = useCallback(() => {
    result.refetch()
  }, [result])
  const { tip } = useStatusTip(result)

  const records = useMemo(() => getTeam(result.data?.team)?.project?.nodes ?? [], [result])
  const options: { value: string, text: string }[] = useMemo(() => records.map(({ id, name }) => ({ value: id, text: name })), [records])
  const map: Record<string, string> = useMemo(() => options.reduce((obj, item) => ({ ...obj, [item['value']]: item['text'] }), {}), [options])
  useEffect(() => {
    if (setProject) {
      setProject(map[value])
    }
  }, [map, value, setProject])

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
