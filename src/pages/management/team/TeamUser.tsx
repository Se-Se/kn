import React, { useMemo } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useError } from 'hooks/useError'
import { getTeam, TeamProvider } from 'pages/dashboard/Dashboard'
import { omitVariables } from 'utils/omitVariables'
import { useTeamUserQuery, useTeamEditUserMutation } from 'generated/graphql'
import { useActionTable } from 'pages/template/table/ActionTable'
import { TeamRoleInput } from 'pages/dashboard/team/TeamRoleInput'
import { Add, Remove } from 'pages/dashboard/team/TeamUser'
import { Localized } from '@fluent/react'
import { Layout, Breadcrumb } from '@tencent/tea-component'
import { ManagementTeamLink } from 'components/Link'
const { Content } = Layout

interface Match {
  teamId: string
}

export const Page: React.FC = () => {
  const history = useHistory()
  const { params: { teamId } } = useRouteMatch<Match>()
  const [err, { checkError }] = useError()
  const query = omitVariables(useTeamUserQuery, {
    teamId
  })
  const result = query()
  const [edit] = useTeamEditUserMutation()
  const submitEdit = useMemo(() => checkError(async (userId: string, roleId?: string) => {
    if (!roleId) {
      return
    }
    await edit({
      variables: {
        teamId,
        input: {
          id: userId,
          teamRole: roleId
        }
      }
    })
  }), [edit, teamId, checkError])

  const table = useActionTable(
    query,
    ({ team }) => getTeam(team)?.manager.user,
    {
      columns: [{
        key: 'username',
      }, {
        key: 'role',
        render: ({ teamRole, id }) => <TeamRoleInput value={teamRole?.id} onChange={v => submitEdit(id, v)} />
      }],
      leftOperation: [Add],
      rightOperation: [{ ...Remove, useActive: undefined }],
    }
  )

  const teamName = getTeam(result.data?.team)?.name ?? ''
  return <>
    <Content.Header title={<Breadcrumb>
      <Breadcrumb.Item><ManagementTeamLink><Localized id='dashboard-team' /></ManagementTeamLink></Breadcrumb.Item>
      <Breadcrumb.Item current>{teamName}</Breadcrumb.Item>
    </Breadcrumb>} showBackButton onBackButtonClick={history.goBack} />
    <Content.Body>
      {err}
      <TeamProvider value={{ teamId, teamName }}>
        {table}
      </TeamProvider>
    </Content.Body>
  </>
}
