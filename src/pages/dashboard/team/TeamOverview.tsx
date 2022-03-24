import React, { useMemo } from 'react'
import { Header } from '../Header'
import { useTeamId, getTeam } from '../Dashboard'
import { useTeamOverviewQuery, TeamOverviewRecentItemFragment, UserPermission } from 'generated/graphql'
import { useApolloData } from 'hooks/common'
import { Row, Col, Layout, Card, Table, Button, H3, Justify, MetricsBoard } from '@tencent/tea-component'
import { Localized } from 'i18n'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { NormalFormat } from 'utils/timeFormat'
import { isCommonStatusDisabled, useAllRiskTableColumn } from 'components/AllRiskField'
import { GeneralRiskPie } from 'components/RiskField'
import { StatusIcon } from 'components/StatusIcon'
import { StatusPie } from 'components/StatusField'
import { useTableColumn } from 'pages/template/common'
import { CardDescFooter } from 'components/CardDescFooter'
import { ProjectLink } from 'components/Link'
import { RoleGate } from 'components/PermissionGate'
import { generateLink, Pattern } from 'route'
import { useConfig } from 'components/Config'
import { CheckRiskColors, LicenseRiskColors, CVSSRankColor } from 'utils/color'

const TeamPanel: React.FC<{ projectCount: number }> = ({ projectCount }) => {
  return <>
    <H3><Localized id='dashboard-project-count-title' /></H3>
    <MetricsBoard
      title={<></>}
      unit={<Localized id='dashboard-project-count-unit' />}
      value={projectCount}
    />
  </>
}

const { Content } = Layout

export const Page: React.FC = () => {
  const { teamName } = useTeamId()
  const allRiskColumn = useAllRiskTableColumn(isCommonStatusDisabled<TeamOverviewRecentItemFragment>())
  const columns = useTableColumn<TeamOverviewRecentItemFragment>(useMemo(() => [{
    key: 'time',
    id: 'timestamp',
    render(item) {
      return dayjs(item.time).format(NormalFormat)
    }
  }, {
    key: 'name',
    id: 'projectName',
    render({ name }) {
      return <ProjectLink team={teamName} project={name} />
    }
  }, {
    key: 'projectStatus',
    render: (item) => <StatusIcon text status={item.status} />
  },
  ...allRiskColumn,
  ], [teamName, allRiskColumn]))
  const { teamId } = useTeamId()
  const { timesLimitEnabled } = useConfig()
  const colSpanLeft = timesLimitEnabled ? 6 : 0

  return <>
    <Header title={<Localized id='dashboard-team' />} />
    <Content.Body>
      <Justify
        style={{ marginBottom: 20 }}
        left={<>
          <Link to={generateLink(Pattern.ProjectList, { team: teamName })}><Button type='primary'><Localized id='dashboard-manage-project' /></Button></Link>
          <RoleGate perm={[UserPermission.TeamUserReadable]}>
            <Link to={generateLink(Pattern.TeamManagement, { team: teamName })}><Button><Localized id='dashboard-manage-team' /></Button></Link>
            <Link to={generateLink(Pattern.TeamTask, { team: teamName })}><Button><Localized id='dashboard-manage-task' /></Button></Link>
          </RoleGate>
        </>}
      />
      {useApolloData(useTeamOverviewQuery({ variables: { teamId } }), ({ team: teamNode }) => {
        const team = getTeam(teamNode)
        if (!team) {
          throw new Error('not a team')
        }
        const { overview, project, timesLimit } = team
        const recentEvent = overview.recentEvent || []
        const timesCount = <>
          <H3><Localized id='dashboard-team-analysis-count' /></H3>
          <Row>
            <Col>
              <MetricsBoard
                title={<Localized id='dashboard-team-analysis-count-remain' />}
                unit={<Localized id='dashboard-team-analysis-count-unit' />}
                value={timesLimit?.available}
              />
            </Col>
            <Col>
              <MetricsBoard
                title={<Localized id='dashboard-team-analysis-count-used' />}
                unit={<Localized id='dashboard-team-analysis-count-unit' />}
                value={timesLimit?.used}
              />
            </Col>
            <Col>
              <MetricsBoard
                title={<Localized id='dashboard-team-analysis-count-total' />}
                unit={<Localized id='dashboard-team-analysis-count-unit' />}
                value={timesLimit?.total}
              />
            </Col>
          </Row>
        </>
        const statPies = []
        if (overview.risk.baseline) {
          statPies.push(<Col key='baseline'>
            <GeneralRiskPie
              title={<Localized id='project-baseline-statistics' />}
              data={overview.risk.baseline}
              colorMap={CheckRiskColors}
              prefix='enum-risk-'
            />
          </Col>)
        }
        if (overview.risk.license) {
          statPies.push(<Col key='license'>
            <GeneralRiskPie
              title={<Localized id='project-license-statistics' />}
              data={overview.risk.license}
              colorMap={LicenseRiskColors}
              prefix='enum-license-risk-'
            />
          </Col>)
        }
        if (overview.risk.cve) {
          statPies.push(<Col key='cve'>
            <GeneralRiskPie
              title={<Localized id='project-cve-statistics' />}
              data={overview.risk.cve}
              colorMap={CVSSRankColor}
              prefix='enum-cvss-rank-'
            />
          </Col>)
        }
        const pies = <Row showSplitLine>
          <Col span={6}>
            <Row><Col>
              <H3><Localized id='team-project-overview' /></H3>
            </Col></Row>
            <Row><Col>
              <StatusPie
                title={<Localized id='team-overviewe-project-status' />}
                data={overview.status}
              />
            </Col></Row>
          </Col>
          <Col>
            <Row><Col>
              <H3><Localized id='team-risk-overview' /></H3>
            </Col></Row>
            <Row showSplitLine>
              {statPies}
            </Row>
          </Col>
        </Row>
        return <>
          <Card>
            <Card.Body>
              <Row showSplitLine>
                {timesLimitEnabled ? <Col span={colSpanLeft}><TeamPanel projectCount={project?.totalCount ?? 0} /></Col> : <></>}
                <Col span={24 - colSpanLeft}>
                  {timesLimitEnabled ? timesCount : pies}
                </Col>
              </Row>
            </Card.Body>
          </Card>
          {timesLimitEnabled && <Card>
            <Card.Body>
              {pies}
            </Card.Body>
          </Card>}
          <Card>
            <Card.Body title={<Localized id='dashboard-team-recent-project' />}>
              <Table columns={columns} records={recentEvent} />
            </Card.Body>
            <CardDescFooter>
              <Localized id='dashboard-team-recent-project-top10' />
            </CardDescFooter>
          </Card>
        </>
      })}
    </Content.Body>
  </>
}
