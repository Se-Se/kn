import React, { useState, useEffect } from 'react'
import { useStatusDiskQuery, useStatusPostgresQuery, useManagementLimitQuery, useTeamListQuery } from 'generated/graphql'
import { Layout, Card, Row, Col, MetricsBoard } from '@tencent/tea-component'
import { Localized, useGetMessage } from 'i18n'
import { useApolloData } from 'hooks/common'
import { BasicPie, BasicLine, TooltipOptions, StackBar } from '@tencent/tea-chart'
import { Loading } from 'components/Loading'
import { friendlySize, friendlySizeStr } from 'utils/friendlySize'
import dayjs from 'dayjs'
import styled from '@emotion/styled/macro'
import { useConfig } from 'components/Config'

const { Content } = Layout

const Gap = styled.div`
  margin-top: 20px;
`
const Container = styled.div`
  height: 500px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
`

const PollInterval = 1 * 1000
const SizePollInterval = 5 * 1000
const LimitPollInterval = 5 * 1000
const TimeFormat = 'HH:mm:ss'
const MemoryCount = 60
const SizeMetricsBoard: React.FC<{ titleId: string, size: number | string }> = ({ titleId, size }) => {
  const [value, unit] = friendlySize(size)
  const getMessage = useGetMessage()

  return <MetricsBoard
    title={getMessage(titleId)}
    value={value}
    unit={unit}
  />
}
const LimitMetricsBoard: React.FC<{ titleId: string, limit: number }> = ({ titleId, limit }) => {
  const getMessage = useGetMessage()

  return <MetricsBoard
    title={getMessage(titleId)}
    value={limit}
    unit={getMessage('column-limit-times')}
  />
}
const Context = {
  forceWs: true
}

const SizeTooltip: TooltipOptions = {
  formatter: (meta) => meta.map(i => ({
    ...i,
    valueText: friendlySizeStr(i.value)
  }))
}
const StatusDisk: React.FC = () => {
  const getMessage = useGetMessage()
  return <Card.Body title={<Localized id='status-disk' />}>
    {useApolloData(useStatusDiskQuery({
      pollInterval: SizePollInterval,
      context: Context
    }), ({ management: { systemStatus: { disk } } }) => {
      return <>
        <Row showSplitLine>
          <Col>
            <SizeMetricsBoard
              titleId='column-total-disk-space'
              size={disk.totalSpace}
            />
          </Col>
          <Col>
            <SizeMetricsBoard
              titleId='column-free'
              size={disk.freeSpace}
            />
          </Col>
          <Col>
            <SizeMetricsBoard
              titleId='column-occupied'
              size={disk.occupiedSpace}
            />
          </Col>
        </Row>
        <BasicPie
          height={411}
          dataSource={[{
            type: getMessage('column-free'),
            value: parseInt(disk.freeSpace)
          }, {
            type: getMessage('column-occupied'),
            value: parseInt(disk.occupiedSpace)
          }]}
          position='value'
          color='type'
          tooltip={SizeTooltip}
        />
      </>
    })}
  </Card.Body>
}

const StatusLimit: React.FC = () => {
  return <Card.Body title={<Localized id='status-limit' />}>
    {useApolloData(useManagementLimitQuery({
      pollInterval: LimitPollInterval,
      context: Context
    }), ({ management: { timesLimit } }) => {
      return <Container>
        <LimitMetricsBoard
          titleId='column-available-limit'
          limit={timesLimit?.available ?? 0}
        />
        <LimitMetricsBoard
          titleId='column-used-limit'
          limit={timesLimit?.used ?? 0}
        />
        <LimitMetricsBoard
          titleId='column-total-limit'
          limit={timesLimit?.total ?? 0}
        />
      </Container>
    })}
  </Card.Body>
}

const TeamLimits: React.FC = () => {
  const getMessage = useGetMessage()
  return <Card.Body title={<Localized id='status-team-limits' />}>
    {useApolloData(useTeamListQuery({
      pollInterval: LimitPollInterval,
      context: Context
    }), ({ management: { team } }) => {
      const records = team?.nodes?.flatMap((team) => [
        { name: team.name, value: team.timesLimit?.available || 0, type: getMessage('column-available-limit') },
        { name: team.name, value: team.timesLimit?.used || 0, type: getMessage('column-used-limit') },
      ])
      return records && records.length ? <StackBar
        dataSource={records}
        position='name*value'
        color='type'
        stackLabels={false}
        height={500}
        percent={false}
      /> : <Loading />
    })}
  </Card.Body>
}

interface Item {
  time: string | null
  type: string | null
  value: number | null
}
const prepareList = (count: number, types: string[]) => {
  let out: Item[] = []
  let time = dayjs()

  for (let i = 0; i < count; i++) {
    time = time.subtract(PollInterval, 'millisecond')
    let group: Item[] = []
    for (const type of types) {
      group.push({
        time: time.format(TimeFormat),
        type,
        value: null
      })
    }
    out.unshift(...group)
  }

  return out
}
const StatusPostgres: React.FC = () => {
  const [list, setList] = useState<Item[]>(prepareList(MemoryCount, ['Active', 'Idle', 'Total']))
  const result = useStatusPostgresQuery({
    skip: true,
    context: Context
  })
  const refetch = result.refetch

  useEffect(() => {
    const fetchMore = async () => {
      const { data: { management: { systemStatus: { postgres: pg } } } } = await refetch()
      const time = dayjs().format(TimeFormat)
      setList(l => [...l, {
        time,
        type: 'Active',
        value: pg.activeSessionCount,
      }, {
        time,
        type: 'Idle',
        value: pg.idleSessionCount,
      }, {
        time,
        type: 'Total',
        value: pg.totalSessionCount,
      }].slice(-MemoryCount * 3))
    }
    fetchMore()
    const id = setInterval(fetchMore, PollInterval)
    return () => clearInterval(id)
  }, [refetch])

  return <Card.Body title={<Localized id='status-postgresql' />}>
    {list.length > 0 ? <>
      <BasicLine
        height={500}
        // @ts-ignore
        dataSource={list}
        color='type'
        position='time*value'
        scale={{
          time: {
            type: 'time',
            timeParseFormat: TimeFormat
          }
        }}
      />
    </> : <Loading />}
  </Card.Body>
}

export const Page: React.FC = () => {
  const { timesLimitEnabled } = useConfig()
  return <>
    <Content.Header title={<Localized id='management-status' />} />
    <Content.Body>
      <Row>
        <Col span={12}>
          <Card>
            <StatusDisk />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <StatusPostgres />
          </Card>
        </Col>
      </Row>
      {timesLimitEnabled && <>
        <Gap />
        <Card>
          <Row showSplitLine>
            <Col span={6}>
              <StatusLimit />
            </Col>
            <Col span={18}>
              <TeamLimits />
            </Col>
          </Row>
        </Card>
      </>}
    </Content.Body>
  </>
}
