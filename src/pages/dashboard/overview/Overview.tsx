import React, { useMemo, useCallback } from 'react'
import { useOverviewQuery, OverviewRecentItemFragment, TeamStatisticsFragment } from 'generated/graphql'
import { useApolloData } from 'hooks/common'
import { Row, Col, Layout, Card, Table } from '@tencent/tea-component'
import { Localized } from 'i18n'
import dayjs from 'dayjs'
import { NormalFormat } from 'utils/timeFormat'
import styled from '@emotion/styled/macro'
import { RiskPie } from 'components/RiskField'
import { isCommonStatusDisabled, useAllRiskTableColumn } from 'components/AllRiskField'
import { StatusPie, StatusTableColumn } from 'components/StatusField'
import { useTableColumn } from 'pages/template/common'
import { CardDescFooter } from 'components/CardDescFooter'
import { TeamLink, ProjectLink } from 'components/Link'
import { Bar } from 'components/Bar'
import { useConfig } from 'components/Config'

const Gap = styled.div`
  margin-top: 20px;
`

const { Content } = Layout

const useTeamStatistics = (stats: TeamStatisticsFragment[], color: string, getter: (i: TeamStatisticsFragment) => number) => {
  const max = useMemo(() => stats.map(i => getter(i)).reduce((p, count) => p > count ? p : count, 0), [stats, getter])
  const valueRender = useCallback((item: TeamStatisticsFragment) => {
    const value = getter(item)
    return <Bar percent={value / max} color={color}>
      {value}
    </Bar>
  }, [color, max, getter])
  return valueRender
}

const TeamOverview: React.FC<{ team: TeamStatisticsFragment[] }> = ({ team: records }) => {
  type Item = typeof records[0]
  const projectRender = useTeamStatistics(records, '#00c8dc', useCallback(i => i.project, []))
  const riskRender = useTeamStatistics(records, '#ff584c', useCallback(i => i.risk ?? 0, []))
  const { timesLimitEnabled } = useConfig()
  const columns = useTableColumn<Item>([{
    key: 'teamName',
    render({ name: team }) {
      return <TeamLink team={team} />
    }
  }, {
    key: 'projectCount',
    render: projectRender,
  }, {
    key: 'riskCount',
    render: riskRender,
  }, {
    key: 'limitAvaliable',
    render(i) {
      return i.timesLimit?.available
    }
  }])
  if (!timesLimitEnabled) {
    columns.pop()
  }

  return <>
    <Table columns={columns} records={records} />
  </>
}

export const Page: React.FC = () => {
  const allRiskColumn = useAllRiskTableColumn(isCommonStatusDisabled<OverviewRecentItemFragment>())
  const columns = useTableColumn<OverviewRecentItemFragment>(useMemo(() => [{
    key: 'time',
    id: 'timestamp',
    render(item) {
      return dayjs(item.time).format(NormalFormat)
    }
  }, {
    key: 'projectName',
    render(item) {
      return item.team ? <ProjectLink team={item.team.name} project={item.name} /> : item.name
    }
  }, {
    key: 'teamName',
    render(item) {
      return item.team ? <TeamLink team={item.team.name} /> : '--'
    }
  }, {
    ...StatusTableColumn,
    key: 'projectStatus'
  },
  ...allRiskColumn,
  ], [allRiskColumn]))


  return <>
    <Content.Header title={<Localized id='dashboard-overview' />} />
    <Content.Body>
      {useApolloData(useOverviewQuery(), ({ overview }) => {
        const recentEvent = overview.recentEvent || []
        const cols = [
          <Col key='project-overview'>
            <StatusPie
              title={<Localized id='project-overview' />}
              data={overview.status}
            />
          </Col>
        ]
        if (overview.risk.baseline) {
          cols.push(<Col key='risk-overview'>
            <RiskPie
              title={<Localized id='risk-overview' />}
              data={overview.risk.baseline}
            />
          </Col>)
        }
        return <>
          <Card>
            <Card.Body>
              <Row showSplitLine>
                {cols}
              </Row>
            </Card.Body>
          </Card>
          <Gap />
          <Card>
            <Card.Body title={<Localized id='team-overview' />}>
              <TeamOverview team={overview.team ?? []} />
            </Card.Body>
          </Card>
          <Gap />
          <Card>
            <Card.Body title={<Localized id='dashboard-recent-projects' />}>
              <Table columns={columns} records={recentEvent} />
            </Card.Body>
            <CardDescFooter>
              <Localized id='dashboard-recent-projects-top10' />
            </CardDescFooter>
          </Card>
        </>
      })}
    </Content.Body>
  </>
}
