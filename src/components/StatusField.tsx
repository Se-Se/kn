import React, { useMemo } from 'react'
import { CommonStatus, CommonStatusStatistics } from 'generated/graphql'
import styled from '@emotion/styled/macro'
import { StatusIcon, useGetStatusMessage } from './StatusIcon'
import { TitledPie } from 'components/TitledPie'

export const StatusColors: Record<CommonStatus, string> = {
  [CommonStatus.Completed]: '#29cc85',
  [CommonStatus.InProgress]: '#1fc0cc',
  [CommonStatus.Ready]: '#006eff',
}

const ItemBox = styled.span`
  display: inline-block;
  width: 45px;
  line-height: 16px;
`

const ItemIcon = styled(StatusIcon)`
  margin-right: 5px;
`
const ItemCount = styled.span`
  margin-right: 5px;
  vertical-align: middle;
`

const StatusOrder: CommonStatus[] = [CommonStatus.Ready, CommonStatus.InProgress, CommonStatus.Completed]

const Item: React.FC<{ status: CommonStatus, count: number }> = ({ status, count }) => {
  return <ItemBox>
    <ItemIcon status={status} />
    <ItemCount>{count}</ItemCount>
  </ItemBox>
}

type StatusFieldProps = {
  status: CommonStatusStatistics[]
}

export const StatusField: React.FC<StatusFieldProps> = ({ status }) => {
  const dict = useMemo(() => {
    return Object.fromEntries(status.map(i => [i.status, i])) as Record<CommonStatus, CommonStatusStatistics | undefined>
  }, [status])

  return <>
    { StatusOrder.map(i => [i, dict[i]] as const).map(([i, s]) => <Item key={i} status={i} count={s?.count ?? 0} />)}
  </>
}
export const StatusTableColumn = {
  key: 'status',
  width: 200,
  render: ({ status }: { status: CommonStatus }) => <StatusIcon status={status} text />
}

export const StatusPie: React.FC<{
  title: React.ReactNode
  data: CommonStatusStatistics[]
}> = ({ title, data }) => {
  const getStatusMessage = useGetStatusMessage()
  return <TitledPie
    title={title}
    circle
    height={250}
    dataSource={data}
    position='count'
    color={{
      key: 'status',
      colors: (i) => {
        return StatusColors[i as CommonStatus]
      },
    }}
    legend={{
      formatter: (i) => {
        return getStatusMessage(i as CommonStatus)
      }
    }}
  />
}
