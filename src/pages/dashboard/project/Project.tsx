import React, { useMemo } from 'react'
import { Layout, Card, Breadcrumb, Segment } from '@tencent/tea-component'
import { useAnalysisListQuery, useAnalysisStatusSubscription, useAnalysisEditMutation, useProjectIdQuery, useProjectChartQuery, CheckRisk, AnalysisStatus, UserPermission, AnalysisListItemFragment } from 'generated/graphql'
import { useRouteMatch, useHistory } from 'react-router-dom'
import dayjs from 'dayjs'
import { New, Delete, Analyze, IdProvider, Report, Stop, Export, useOperationContext, useTeamId } from './Operation'
import { NormalFormat, formatTime } from 'utils/timeFormat'
import { useActionTable } from 'pages/template/table/ActionTable'
import { omitVariables } from 'utils/omitVariables'
import { useApolloData } from 'hooks/common'
import { StatusIcon } from 'components/StatusIcon'
import { getProject } from 'pages/report/common'
import { StackBar } from '@tencent/tea-chart'
import { ShowError } from 'components/ShowError'
import styled from '@emotion/styled/macro'
import { AnalysisLink, ProjectListLink } from 'components/Link'
import { Localized, localizedOptions } from 'i18n'
import { renderAnalysisType } from 'pages/template/common'
import { useHasPermission } from 'components/PermissionGate'
import { useInput } from 'hooks/useInput'
import { AllRisk, AllRiskColor, AllRisks, getAllRiskShowOrder, isAnalysisStatusDisabled, useAllRiskTableColumn, useGetAllRiskMessage } from 'components/AllRiskField'
import { Values } from 'utils/values'
import { useReportConfig } from 'components/Config'

const Gap = styled.div`
  margin-top: 20px;
`

const { Content } = Layout
const AllDuration = ['7d', '14d', '30d', '90d', 'all'] as const

const DurationValueMap: Record<Values<typeof AllDuration>, number | undefined> = {
  '7d': 7,
  '14d': 14,
  '30d': 30,
  '90d': 90,
  'all': undefined,
}

export interface ProjectMatch {
  team: string
  project: string
}

const ProjectPage: React.FC<{ teamId: string, projectId: string }> = ({ teamId, projectId }) => {
  const { params: { project: projectName, team: teamName } } = useRouteMatch<ProjectMatch>()
  useAnalysisStatusSubscription({
    variables: {
      projectId
    }
  })
  const ctx = useOperationContext(useTeamId())
  const [submitEdit] = useAnalysisEditMutation()
  const query = omitVariables(useAnalysisListQuery, {
    projectId
  })
  const hasPermission = useHasPermission()
  const getRiskMessage = useGetAllRiskMessage()
  const allRiskColumn = useAllRiskTableColumn(isAnalysisStatusDisabled<AnalysisListItemFragment>())
  const reportConfig = useReportConfig()
  const allRisk = useMemo(() => {
    let out: AllRisk[] = []
    if (reportConfig.baseline) {
      out.push('baseline')
    }
    if (reportConfig.license) {
      out.push('license')
    }
    if (reportConfig.cveKernel || reportConfig.cveSec) {
      out.push('cve')
    }
    return out
  }, [reportConfig])

  const table = useActionTable(query, ({ project }) => getProject(project)?.analysis, {
    columns: [
      {
        id: 'analysisName',
        key: 'name',
        editable: true,
        render({ name }) {
          return <AnalysisLink team={teamName} project={projectName} analysis={name} />
        }
      }, {
        id: 'analysisNote',
        key: 'description',
        editable: true,
      }, {
        id: 'analysisType',
        key: 'systemType',
        width: 150,
        render: renderAnalysisType,
      }, {
        id: 'analysisStatus',
        key: 'status',
        render: (item) => <StatusIcon text status={item.status} />
      },
      ...allRiskColumn,
      {
        key: 'time',
        render(item) {
          return dayjs(item.time).format(NormalFormat)
        }
      }
    ],
    leftOperation: [New, Analyze, Stop, Delete],
    rightOperation: [Report, Export],
    edit: {
      async onEdit(item, field, value) {
        await submitEdit({
          variables: {
            teamId,
            input: {
              id: item.id,
              [field]: value
            }
          }
        })
      },
      disabled: !hasPermission(UserPermission.TeamProjectWriteable)
    },
    pollInterval: 10 * 1000,
    sortableColumns: ['name', 'time'],
    ctx,
  })

  const [duration] = useInput<Values<typeof AllDuration>>('7d')
  const [riskTypeInput] = useInput<Values<typeof AllRisks>>(allRisk[0])
  const riskType = riskTypeInput.value
  const recentDays = DurationValueMap[duration.value]
  const result = useProjectChartQuery({
    variables: {
      projectId,
      recentDays,
    }
  })
  const chart = useApolloData(result, ({ project }) => {
    if (allRisk.length === 0) {
      return <ShowError />
    }
    const chart = getProject(project)?.chart?.nodes
    if (!chart) {
      return <ShowError />
    }
    const data: { name: string, time: string, risk: string, value: number | null }[] = []
    const order = getAllRiskShowOrder(riskType)
    for (const c of chart) {
      for (const r of order) {
        // TODO-space
        // const risk = c.risk.find(i => i.risk === r)
        const risks = (c.risk[riskType] ?? []) as { risk: string, count: number }[]
        const risk = risks.find(i => i.risk === r.risk)
        data.push({
          name: c.name,
          risk: r.risk,
          time: c.time,
          value: c.status === AnalysisStatus.Success ? (risk?.count ?? null) : null,
        })
      }
    }

    return <>
      <StackBar
        height={300}
        dataSource={data}
        percent={false}
        stackLabels={true}
        position='name*value'
        tooltip={{
          formatter(values) {
            return values.map(i => ({
              ...i,
              label: getRiskMessage(riskType, i.label as CheckRisk),
              title: `${i.title} ${formatTime(i.row!.time as string)}`
            }))
          }
        }}
        color={{
          key: 'risk',
          colors: (key) => AllRiskColor[riskType][key as CheckRisk]
        }}
        legend={{
          formatter: (key) => getRiskMessage(riskType, key as CheckRisk)
        }}
      />
    </>
  })
  return <>
    {allRisk.length > 0 &&
      <>
        <Card>
          <Card.Body title={<>
            <Localized id='risk-statistics' />
            <div style={{ display: 'inline-block', width: 10 }} />
            <Segment
              options={localizedOptions('column-statistic-', allRisk)}
              {...riskTypeInput}
            />
          </>} operation={<Segment
            options={localizedOptions('duration-', AllDuration)}
            {...duration}
          />}>
            {chart}
          </Card.Body>
        </Card>
        <Gap />
      </>
    }
    {table}
  </>
}

export const useIdProvider = (render: (p: { teamId: string, projectId: string }) => React.ReactNode) => {
  const { params: { project: projectName, team: teamName } } = useRouteMatch<ProjectMatch>()
  const idResult = useProjectIdQuery({
    variables: {
      teamName,
      projectName
    }
  })

  return useApolloData(idResult, ({ team }) => {
    return team?.project?.id ? <IdProvider value={{
      projectId: team.project.id,
      teamId: team.id
    }}>
      {render({ teamId: team.id, projectId: team.project.id })}
    </IdProvider> : <ShowError />
  })
}
export const ProjectIdProvider: React.FC = ({ children }) => {
  return useIdProvider(() => children)
}

export const Page: React.FC = () => {
  const history = useHistory()
  const { params: { team, project } } = useRouteMatch<ProjectMatch>()

  return <>
    <Content.Header title={<Breadcrumb>
      <Breadcrumb.Item><ProjectListLink team={team}>{<Localized id='dashboard-project' />}</ProjectListLink></Breadcrumb.Item>
      <Breadcrumb.Item>{project}</Breadcrumb.Item>
    </Breadcrumb>} showBackButton onBackButtonClick={history.goBack} />
    <Content.Body>
      {useIdProvider(({ teamId, projectId }) => <ProjectPage teamId={teamId} projectId={projectId} />)}
    </Content.Body>
  </>
}
