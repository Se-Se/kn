import React, { useMemo, useEffect, useCallback } from 'react'
import { useManagementTeamSelectListQuery, useTeamSelectListQuery } from 'generated/graphql'
import { Select } from '@tencent/tea-component'
import { useData } from 'pages/template/common'
import { useLocation } from 'react-router-dom'

type PickTeamProps = {
  value: TeamValue | undefined
  onChange: (value: TeamValue) => void
  disabled?: boolean
}

export interface TeamValue {
  teamId: string
  teamName: string
}

const LastTeamId = 'c-last-teamid'
export const PickTeam: React.FC<PickTeamProps> = ({ value, onChange, disabled }) => {
  const { state } = useLocation<{ team?: string }>()
  const result = useTeamSelectListQuery()
  const { records, tip } = useData(result, ({ team }) => team)
  const options = useMemo(() => records.map(i => ({
    value: i.id,
    text: i.name,
  })), [records])
  useEffect(() => {
    if (state && state.team) {
      const t = records.find(i => i.name === state.team)
      if (t) {
        onChange({
          teamId: t.id,
          teamName: t.name
        })
      }
    }
  }, [state, records, onChange])
  useEffect(() => {
    if (value === undefined && records.length > 0) {
      const lastId = window.localStorage.getItem(LastTeamId)
      if (records.some(i => i.id === lastId)) {
        const t = records.find(i => i.id === lastId)!
        onChange({
          teamId: t.id,
          teamName: t.name
        })
      } else {
        onChange({
          teamId: records[0].id,
          teamName: records[0].name
        })
      }
    }
  }, [value, records, onChange])
  useEffect(() => {
    if (value !== undefined) {
      window.localStorage.setItem(LastTeamId, value.teamId)
    }
  }, [value])
  const onTeamChange = useCallback((id: string) => {
    const t = records.find(i => i.id === id)!
    onChange({
      teamId: t.id,
      teamName: t.name
    })
  }, [onChange, records])


  return <Select
    boxSizeSync
    size='m'
    type='simulate'
    appearance='button'
    autoClearSearchValue={false}
    options={options || []}
    bottomTips={tip}
    value={value?.teamId ?? undefined}
    onChange={onTeamChange}
    disabled={disabled}
  />
}


type SelectTeamProps = {
  value: string | undefined
  onChange: (value: string | undefined) => void
  disabled?: boolean
  searchable?: boolean
}

export const ManagementSelectTeam: React.FC<SelectTeamProps> = ({ value, onChange, disabled, searchable }) => {
  const result = useManagementTeamSelectListQuery({
    variables: {
      offset: {
        offset: 0,
        limit: -1,
      }
    }
  })
  const { records, tip } = useData(result, ({ management }) => management.team)
  const options = useMemo(() => records.map(i => ({
    value: i.id,
    text: i.name,
  })), [records])

  return <Select
    boxSizeSync
    size='m'
    type='simulate'
    appearance='button'
    autoClearSearchValue={false}
    options={options || []}
    bottomTips={tip}
    value={value}
    onChange={onChange}
    disabled={disabled}
    searchable={searchable}
  />
}
