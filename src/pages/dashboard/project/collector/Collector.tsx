import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { AnalysisMatch } from 'pages/report/Report'
import { useCollectorDetailQuery, CollectorItemFragment, useCollectorStatusSubscription } from 'generated/graphql'
import { Breadcrumb, Layout, Table, Justify, Row, Col, Card, Button, Tabs, TabPanel } from '@tencent/tea-component'
import { ProjectListLink, ProjectLink, AnalysisLink } from 'components/Link'
import { Localized } from '@fluent/react'
import { ProjectIdProvider } from '../Project'
import { useApolloData } from 'hooks/common'
import { ShowError } from 'components/ShowError'
import { useRenderOperations } from 'pages/template/table/Operation'
import { KVTable } from 'components/KVTable'
import { StatusIcon } from 'components/StatusIcon'
import { formatTime } from 'utils/timeFormat'
import { useI18nKVRecords } from 'pages/report/common/render'
import { Collect, Stop, Edit, DeleteBack } from './Operation'
import { localizedTabs } from 'i18n'
import { useLog } from 'hooks/useLog'
import { downloadBlob } from 'utils/download'
import { TomlEditor } from 'components/TomlEditor'
import { LogViewer } from 'components/LogViewer'

interface CollectorMatch extends AnalysisMatch {
  collector: string
}

const { Content } = Layout

export const CollectorConfig: React.FC<{ collector: CollectorItemFragment }> = ({ collector }) => {
  const renderOperations = useRenderOperations()
  return <>
    <Card>
      <Card.Body>
        <Table.ActionPanel>
          {renderOperations([Edit], {
            link: false, selected: [collector]
          })}
        </Table.ActionPanel>
        <TomlEditor readOnly value={collector.config} />
      </Card.Body>
    </Card>
  </>
}

export const CollectorLog: React.FC<{ collector: CollectorItemFragment }> = ({ collector }) => {
  const [log, completed] = useLog(collector.logSubID)
  const handleDownload = () => {
    const blob = new Blob([log.join('')])
    downloadBlob(blob, 'log.log')
  }

  return <>
    <Card>
      <Card.Body>
        <Table.ActionPanel>
          <Button loading={!completed} type='primary' onClick={handleDownload}><Localized id='download' /></Button>
        </Table.ActionPanel>
        <LogViewer log={log} />
      </Card.Body>
    </Card>
  </>
}

const Collector: React.FC<{ analysisId: string, collector: CollectorItemFragment }> = ({ analysisId, collector }) => {
  useCollectorStatusSubscription({
    variables: {
      analysisID: analysisId
    }
  })
  const renderOperations = useRenderOperations()
  const getI18nKVRecords = useI18nKVRecords()
  const ops = renderOperations([Collect, Stop, DeleteBack], {
    link: false, selected: [collector]
  })

  return <>
    <Table.ActionPanel>
      <Justify
        left={ops}
      />
    </Table.ActionPanel>
    <Row>
      <Col>
        <Card>
          <Card.Body
            title={<Localized id='information' />}
            operation={renderOperations([Edit], {
              link: true, selected: [collector]
            })}
          >
            <KVTable records={getI18nKVRecords({
              collectorName: collector.name,
              collectorNote: collector.description,
            })} />
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card>
          <Card.Body
            title={<Localized id='status' />}
          >
            <KVTable records={getI18nKVRecords({
              status: <StatusIcon status={collector.status} text />,
              time: formatTime(collector.time),
            })} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col>
        <Tabs
          tabs={localizedTabs([
            'config',
            'log',
          ])}
        >
          <TabPanel id='config'>
            <CollectorConfig collector={collector} />
          </TabPanel>
          <TabPanel id='log'>
            <CollectorLog collector={collector} />
          </TabPanel>
        </Tabs>
      </Col>
    </Row>
  </>
}

export const Page: React.FC = () => {
  const history = useHistory()
  const { params } = useRouteMatch<CollectorMatch>()
  const { team, project, analysis, collector } = params
  const query = useCollectorDetailQuery({
    variables: {
      team,
      project,
      analysis,
      collector,
    }
  })

  return <>
    <Content.Header title={<Breadcrumb>
      <Breadcrumb.Item><ProjectListLink {...params}>{<Localized id='dashboard-project' />}</ProjectListLink></Breadcrumb.Item>
      <Breadcrumb.Item><ProjectLink {...params} /></Breadcrumb.Item>
      <Breadcrumb.Item><AnalysisLink {...params} /></Breadcrumb.Item>
      <Breadcrumb.Item current>{collector}</Breadcrumb.Item>
    </Breadcrumb>} showBackButton onBackButtonClick={history.goBack} />
    <Content.Body>
      <ProjectIdProvider>
        {useApolloData(query, ({ team }) => {
          const aid = team?.project?.analysis?.id
          const c = team?.project?.analysis?.collector
          if (!c || !aid) {
            return <ShowError error={'Analysis not found'} />
          }
          return <Collector analysisId={aid} collector={c} />
        })}
      </ProjectIdProvider>
    </Content.Body>
  </>
}
