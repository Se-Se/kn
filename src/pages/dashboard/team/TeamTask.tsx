import React from 'react'
import { Header } from '../Header'
import { Layout } from '@tencent/tea-component'
import { useTeamId, getTeam } from '../Dashboard'
import { useActionTable } from 'pages/template/table/ActionTable'
import { useTeamTaskQuery } from 'generated/graphql'
import { omitVariables } from 'utils/omitVariables'
import { Localized } from 'i18n'
import { useHistory } from 'react-router-dom'
import { allFilled } from 'utils/allFilled'
import { AnalysisLink } from 'components/Link'
import { ProjectLink } from 'components/Link'
import { StatusIcon } from 'components/StatusIcon'
import { formatTime } from 'utils/timeFormat'

const { Content } = Layout

export const Page: React.FC = () => {
  const history = useHistory()
  const { teamId } = useTeamId()
  const query = omitVariables(useTeamTaskQuery, {
    teamId
  })

  const table = useActionTable(
    query,
    ({ team }) => getTeam(team)?.manager.task,
    {
      columns: [{
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
          const {deleteTime} = analysis
          const projectName = analysis.project?.name
          if (!allFilled(p) || deleteTime) {
            return `${projectName}`
          }
          return <><ProjectLink {...p}>{projectName}</ProjectLink></>
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
          return <><AnalysisLink {...p}>{name}</AnalysisLink></>
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
        id: 'executeUser',
        key: 'userName',
      }],
      sortableColumns: ['analysis', 'time']
    }
  )

  return <>
    <Header title={<Localized id='dashboard-team' />} showBackButton onBackButtonClick={history.goBack} />
    <Content.Body>
      {table}
    </Content.Body>
  </>
}
