import React, { useMemo } from 'react'
import { Header } from '../Header'
import { Layout, Modal, Form } from '@tencent/tea-component'
import { useTeamId, getTeam } from '../Dashboard'
import { useActionTable, useRefetch } from 'pages/template/table/ActionTable'
import { useTeamUserQuery, TeamUserItemFragment, useTeamEditUserMutation, useTeamRemoveUserMutation, useTeamAddUserMutation, TeamSelectListDocument } from 'generated/graphql'
import { omitVariables } from 'utils/omitVariables'
import { TeamRoleInput } from './TeamRoleInput'
import { OperationOptionDef, useModalFooter, Active, UseActive } from 'pages/template/table/Operation'
import { Localized } from 'i18n'
import { useInput } from 'hooks/useInput'
import { PickUser } from 'components/PickUser'
import { useError } from 'hooks/useError'
import { useHistory } from 'react-router-dom'

const { Content } = Layout

type OOI = OperationOptionDef<TeamUserItemFragment>
export const Add: OOI = {
  key: 'add',
  type: 'modal',
  active: Active.Any,
  primary: true,
  caption: () => <Localized id='dashboard-add-user-caption' />,
  useRender({ close }) {
    const [error, { checkError }] = useError()
    const [roleId] = useInput<string | undefined>(undefined)
    const [userId] = useInput<string | undefined>(undefined)
    const [add] = useTeamAddUserMutation({
      refetchQueries: [{ query: TeamSelectListDocument }]
    })
    const { teamId } = useTeamId()
    const refetch = useRefetch()

    const footer = useModalFooter({
      okId: 'modal-add',
      onOk: checkError(async () => {
        await add({
          variables: {
            teamId,
            input: {
              id: userId.value!,
              teamRole: roleId.value!
            }
          }
        })
        close()
        refetch()
      }),
      disabled: roleId.value === undefined || userId.value === undefined,
      close
    })

    return <>
      <Modal.Body>
        {error}
        <Form>
          <Form.Item label='User' align='middle'>
            <PickUser {...userId} />
          </Form.Item>
          <Form.Item label='Team Role' align='middle'>
            <TeamRoleInput {...roleId} />
          </Form.Item>
        </Form>
      </Modal.Body>
      {footer}
    </>
  }
}

export const Remove: OOI = {
  key: 'remove',
  type: 'confirm',
  active: Active.GtZero,
  useActive: () => {
    const viewer = UseActive.useViewer()
    return [(item) => item[0]?.id !== viewer?.id]
  },
  message: <Localized id='dashboard-remove-user-caption' />,
  description: (item) => <Localized id='dashboard-remove-user-description' vars={{ items: item.map(i => i.username).join(', ') }} />,
  useOnConfirm() {
    const { teamId } = useTeamId()
    const [del] = useTeamRemoveUserMutation({
      refetchQueries: [{ query: TeamSelectListDocument }]
    })
    const refetch = useRefetch()

    return [async (item) => {
      await del({
        variables: {
          teamId,
          id: item.map(i => i.id)
        }
      })
      refetch()
    }]
  }
}

export const Page: React.FC = () => {
  const history = useHistory()
  const [err, { checkError }] = useError()
  const { teamId } = useTeamId()
  const query = omitVariables(useTeamUserQuery, {
    teamId
  })
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
      rightOperation: [Remove],
    }
  )

  return <>
    <Header title={<Localized id='dashboard-team' />} showBackButton onBackButtonClick={history.goBack} />
    <Content.Body>
      {err}
      {table}
    </Content.Body>
  </>
}
