import React, { } from 'react'
import { Layout } from '@tencent/tea-component'
import { useProjectListQuery, useProjectEditMutation, UserPermission, ProjectListItemFragment } from 'generated/graphql'
import { Link } from 'react-router-dom'
import { Localized } from 'i18n'
import { New, Delete, Analyze } from './Operation'
import { useActionTable } from 'pages/template/table/ActionTable'
import { isCommonStatusDisabled, useAllRiskTableColumn } from 'components/AllRiskField'
import { StatusTableColumn } from 'components/StatusField'
import { Header } from '../Header'
import { useTeamId, getTeam } from '../Dashboard'
import { omitVariables } from 'utils/omitVariables'
import { projectLink } from 'components/Link'
import { useHasPermission } from 'components/PermissionGate'
import { useOperationContext } from '../project/Operation'

const { Content } = Layout

export const Page: React.FC = () => {
  const [submitEdit] = useProjectEditMutation()
  const { teamId, teamName } = useTeamId()
  const ctx = useOperationContext(teamId)
  const query = omitVariables(useProjectListQuery, {
    teamId
  })
  const hasPermission = useHasPermission()

  const table = useActionTable(
    query,
    ({ team }) => getTeam(team)?.project,
    {
      columns: [{
        id: 'projectName',
        key: 'name',
        editable: true,
        render({ name }) {
          return <Link data-testid={name} to={projectLink({ team: teamName, project: name })}>{name}</Link>
        }
      }, {
        id: 'projectNote',
        key: 'description',
        editable: true
      }, {
        ...StatusTableColumn,
        id: 'projectStatus'
      },
      ...useAllRiskTableColumn(isCommonStatusDisabled<ProjectListItemFragment>()),
      ],
      leftOperation: [New, Analyze],
      rightOperation: [Analyze, Delete],
      edit: {
        async onEdit(item, field, value) {
          await submitEdit({
            variables: {
              teamId,
              id: item.id,
              [field]: value
            }
          })
        },
        disabled: !hasPermission(UserPermission.TeamProjectWriteable)
      },
      pollInterval: 10 * 1000,
      ctx,
    }
  )

  return <>
    <Header title={<Localized id='dashboard-project' />} />
    <Content.Body>
      {table}
    </Content.Body>
  </>
}
