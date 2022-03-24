import React from 'react'
import { Layout } from '@tencent/tea-component'
import { Localized } from 'i18n'
import { useActionTable } from 'pages/template/table/ActionTable'
import { useManagementTaskQuery } from 'generated/graphql'
import { formatTime } from 'utils/timeFormat'
import { StatusIcon } from 'components/StatusIcon'
import { Link } from 'react-router-dom'
// import { AnalysisLink } from 'components/Link'
// import { ProjectLink } from 'components/Link'
import { allFilled } from 'utils/allFilled'

const { Content } = Layout

export const Page: React.FC = () => {
  const table = useActionTable(
    useManagementTaskQuery,
    ({ management }) => management.task,
    {
      columns: [{
        id: 'taskId',
        key: 'id',
        render({ displayID }) {
          return displayID
        }
      }, {
        id: 'projectName',
        key: 'projectName',
        render({ analysis }) {
          if (!analysis?.project) {
            return '--'
          }
          const p = {
            team: analysis.project?.team?.name,
            project: analysis.project?.name,
            analysis: analysis.name,
          }
          const { deleteTime } = analysis
          const projectName = analysis.project?.name
          if (!allFilled(p) || deleteTime) {
            return `${projectName}`
          }
          // return <><ProjectLink {...p}>{projectName}</ProjectLink></>
        }
      },{
        id: 'analysisName',
        key: 'analysis',
        render({ analysis }) {
          if (!analysis) {
            return '--'
          }
          const p = {
            team: analysis.project?.team?.name,
            project: analysis.project?.name,
            analysis: analysis.name,
          }
          const { name, deleteTime } = analysis
          if (!allFilled(p) || deleteTime) {
            return `${name}`
          }
          // return <><AnalysisLink {...p}>{name}</AnalysisLink></>
        }
      }, {
        key: 'status',
        render({ status }) {
          return <StatusIcon status={status} text />
        }
      }, {
        key: 'time',
        render({ time }) {
          return formatTime(time)
        }
      }, {
        key: 'command',
        render({ command }) {
          return command
        }
      }, {
        id: 'agentName',
        key: 'agent',
        render({ agent }) {
          return agent ? <Link to='/management/agent/'>{agent.name}</Link> : '--'
        }
      }, {
        id: 'executeUser',
        key: 'userName',
      }, {
        id: 'team',
        key: 'teamName'
      }],
      pollInterval: 10 * 1000,
      sortableColumns: ['id', 'analysis'],
    },
  )

  return <>
    <Content.Header title={<Localized id='management-task' />} />
    <Content.Body>
      {table}
    </Content.Body>
  </>
}
