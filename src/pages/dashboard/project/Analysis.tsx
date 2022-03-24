import React, { useCallback } from 'react'
import { Layout, Table, Tabs, TabPanel, Justify, Card, Breadcrumb, Row, Col, Button, Copy } from '@tencent/tea-component'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useAnalysisDetailQuery, AnalysisListItemFragment, useAnalysisCustomizedAuditQuery, useAnalysisStatusSubscription, AnalysisStatus } from 'generated/graphql'
import { Localized, localizedTabs } from 'i18n'
import { Analyze, DeleteBack, ReportPrimary, EditInfo, EditFile, Undo, Stop, ExportIcon, useOperationContext, useTeamId, AnalysisSetting } from './Operation'
import { useRenderOperations } from 'pages/template/table/Operation'
import { useApolloData } from 'hooks/common'
import { ShowError } from 'components/ShowError'
import { ProjectIdProvider } from './Project'
import { useFileList } from './Form'
import { StatusIcon } from 'components/StatusIcon'
import { RiskTableColumn } from 'components/RiskField'
import { formatTime } from 'utils/timeFormat'
import { ProjectLink, ProjectListLink } from 'components/Link'
import { KVTable } from 'components/KVTable'
import { useI18nKVRecords } from 'pages/report/common/render'
import { RefetchProvider, useActionTable } from 'pages/template/table/ActionTable'
import { omitVariables } from 'utils/omitVariables'
import { getAnalysis } from 'pages/report/common'
import { downloadBlob } from 'utils/download'
import { useLog } from 'hooks/useLog'
import { AnalysisCollector } from './collector/AnalysisCollector'
import { useConfig } from 'components/Config'
import { LogViewer } from 'components/LogViewer'
import { renderAnalysisType } from 'pages/template/common'
import { analysisTypeCategory, Category } from 'components/AnalysisTypeItem'

const { Content } = Layout

export const AnalysisUpload: React.FC<{ analysis: AnalysisListItemFragment }> = ({ analysis }) => {
  const ctx = useOperationContext(useTeamId())
  const { form } = useFileList(analysis.analysisType, analysis.file, true)
  const renderOperations = useRenderOperations()
  const ops = renderOperations([EditFile], {
    link: false, selected: [analysis], ctx,
  })

  return <>
    <Table.ActionPanel>
      <Justify
        left={ops}
      />
    </Table.ActionPanel>
    <Card>
      <Card.Body>
        {form}
      </Card.Body>
    </Card>
  </>
}

const AnalysisCustomizedAudit: React.FC<{ analysis: AnalysisListItemFragment }> = ({ analysis }) => {
  const query = omitVariables(useAnalysisCustomizedAuditQuery, { id: analysis.id })
  const table = useActionTable(
    query,
    ({ analysis }) => getAnalysis(analysis)?.customAudit,
    {
      columns: [{
        key: 'ruleName'
      }, {
        key: 'time',
        render: ({ time }) => formatTime(time)
      }],
      leftOperation: [Undo],
      rightOperation: [Undo],
      disableSearch: true,
    }
  )
  return <>
    {table}
  </>
}
export const AnalysisLog: React.FC<{ analysis: AnalysisListItemFragment }> = ({ analysis }) => {
  const [log, completed] = useLog(analysis.logSubID)
  const handleDownload = () => {
    const blob = new Blob([log.join('')])
    downloadBlob(blob, 'log.log')
  }

  const shouldHideLog = [
    AnalysisStatus.Waiting,
  ]
  const disabled = shouldHideLog.includes(analysis.status)

  return <>
    <Card>
      <Card.Body>
        <Table.ActionPanel>
          <Button disabled={disabled} loading={!completed} type='primary' onClick={handleDownload}><Localized id='download' /></Button>
        </Table.ActionPanel>
        <LogViewer log={disabled ? [] : log} />
      </Card.Body>
    </Card>
  </>
}
export const Analysis: React.FC<{ projectId: string, analysis: AnalysisListItemFragment }> = ({ projectId, analysis }) => {
  const ctx = useOperationContext(useTeamId())
  useAnalysisStatusSubscription({
    variables: {
      projectId
    }
  })
  const renderOperations = useRenderOperations()
  const getI18nKVRecords = useI18nKVRecords()
  const ops = renderOperations([ReportPrimary, Analyze, Stop, DeleteBack, AnalysisSetting], {
    link: false, selected: [analysis], ctx
  })
  const rightOps = renderOperations([ExportIcon], {
    link: true, selected: [analysis], ctx
  })
  let { collector: collectorEnabled, plugin: pluginEnabled } = useConfig()
  const isSystem = analysisTypeCategory(analysis.analysisType) === Category.System
  const tabs = [
    'analysisUpload',
    ...(collectorEnabled && isSystem) ? ['analysisCollector'] : [],
    ...(pluginEnabled && isSystem) ? ['analysisCustomizedAudit'] : [],
    'analysisLog',
  ]

  return <>
    <Table.ActionPanel>
      <Justify
        left={ops}
        right={rightOps}
      />
    </Table.ActionPanel>
    <Row>
      <Col>
        <Card>
          <Card.Body
            title={<Localized id='information' />}
            operation={renderOperations([EditInfo], {
              link: true, selected: [analysis], ctx
            })}
          >
            <KVTable records={getI18nKVRecords({
              analysisName: analysis.name,
              analysisNote: analysis.description,
              analysisType: renderAnalysisType(analysis),
            })} />
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card>
          <Card.Body
            title={<Localized id='statistic' />}
            operation={<Copy text={analysis.displayID}><Button type='link'><Localized id='copy-taskid' /></Button></Copy>}
          >
            <KVTable records={getI18nKVRecords({
              status: <StatusIcon status={analysis.status} text />,
              risk: RiskTableColumn.render(analysis),
              time: formatTime(analysis.time),
            })} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col>
        <Tabs
          tabs={localizedTabs(tabs)}
        >
          <TabPanel id='analysisUpload'>
            <AnalysisUpload analysis={analysis} />
          </TabPanel>
          <TabPanel id='analysisCollector'>
            <AnalysisCollector analysis={analysis} />
          </TabPanel>
          <TabPanel id='analysisCustomizedAudit'>
            <AnalysisCustomizedAudit analysis={analysis} />
          </TabPanel>
          <TabPanel id='analysisLog'>
            <AnalysisLog analysis={analysis} />
          </TabPanel>
        </Tabs>
      </Col>
    </Row>
  </>
}

export interface AnalysisMatch {
  team: string
  project: string
  analysis: string
}

export const Page: React.FC = () => {
  const history = useHistory()
  const { params: { team, project, analysis } } = useRouteMatch<AnalysisMatch>()
  const query = useAnalysisDetailQuery({
    variables: {
      team,
      project,
      analysis
    },
    pollInterval: 10 * 1000,
  })

  return <>
    <Content.Header title={<Breadcrumb>
      <Breadcrumb.Item><ProjectListLink team={team}>{<Localized id='dashboard-project' />}</ProjectListLink></Breadcrumb.Item>
      <Breadcrumb.Item><ProjectLink team={team} project={project} /></Breadcrumb.Item>
      <Breadcrumb.Item current>{analysis}</Breadcrumb.Item>
    </Breadcrumb>} showBackButton onBackButtonClick={history.goBack} />
    <Content.Body>
      <ProjectIdProvider>
        <RefetchProvider value={useCallback(async () => { query.refetch() }, [query])}>
          {useApolloData(query, ({ team }) => {
            const projectId = team?.project?.id
            const analysis = team?.project?.analysis
            if (!analysis || !projectId) {
              return <ShowError error={'Analysis not found'} />
            }
            return <Analysis projectId={projectId} analysis={analysis} />
          })}
        </RefetchProvider>
      </ProjectIdProvider>
    </Content.Body>
  </>
}
