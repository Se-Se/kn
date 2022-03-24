import React, { useCallback } from 'react'
import { Layout, Card, Modal, Form, Input, Button, Bubble, List } from '@tencent/tea-component'
import { Localized } from 'i18n'
import { KVTable } from 'components/KVTable'
import { useI18nKVRecords } from 'pages/report/common/render'
import { useViewerQuery, useProfileTeamListQuery } from 'generated/graphql'
import { useApolloData } from 'hooks/common'
import { useActionTable } from 'pages/template/table/ActionTable'
import { useToggle } from 'hooks/common'
import { useInput } from 'hooks/useInput'
import { useModalFooter } from 'pages/template/table/Operation'
import { useEditPasswordMutation } from 'generated/graphql'
import { useError } from 'hooks/useError'
import { TeamLink } from 'components/Link'
const { Content } = Layout

const useEditPassword = () => {
  const [error, { checkError, clearError }] = useError()
  const [visible, setVisible, resetVisible] = useToggle(false)
  const [cur, setCur] = useInput('')
  const [newPwd, setPwd] = useInput('')
  const [repeatPwd, setRepeatPwd] = useInput('')
  const [edit] = useEditPasswordMutation()
  const close = useCallback(() => {
    setCur('')
    setPwd('')
    setRepeatPwd('')
    clearError()
    resetVisible()
  }, [clearError, setCur, setPwd, setRepeatPwd, resetVisible])

  const footer = useModalFooter({
    okId: 'modal-submit',
    onOk: checkError(async () => {
      await edit({
        variables: {
          cur: cur.value,
          newPwd: newPwd.value,
        }
      })
      close()
    }),
    close,
    disabled: !cur.value || !newPwd.value || newPwd.value !== repeatPwd.value
  })

  return [
    <Button type='link' onClick={setVisible}><Localized id='column-editPassword' /></Button>,
    <Modal visible={visible} onClose={close} caption={<Localized id='edit-password' />}>
      <Modal.Body>
        {error}
        <Form>
          <Form.Item label={<Localized id='column-currentPassword' />} required>
            <Input {...cur} type='password' />
          </Form.Item>
          <Form.Item label={<Localized id='column-newPassword' />} required>
            <Bubble
              trigger='focus'
              content={<List type='bullet'><Localized id='password-rule' /></List>}
              placement='right'
            >
              <Input {...newPwd} type='password' />
            </Bubble>
          </Form.Item>
          <Form.Item label={<Localized id='column-repeatPassword' />} required>
            <Input {...repeatPwd} type='password' />
          </Form.Item>
        </Form>
      </Modal.Body>
      {footer}
    </Modal>,
  ]
}


const ProfileInfo: React.FC = () => {
  const result = useViewerQuery()
  const getI18nKVRecords = useI18nKVRecords()
  const [editPassword, editPasswordModal] = useEditPassword()

  return <>
    { editPasswordModal}
    { useApolloData(result, ({ viewer }) => {
      return <KVTable records={getI18nKVRecords({
        username: viewer?.username,
        role: viewer?.userRole.name,
        editPassword,
      })} />
    })}
  </>
}

const TeamMembership: React.FC = () => {
  const table = useActionTable(
    useProfileTeamListQuery,
    ({ team }) => team,
    {
      columns: [{
        id: 'team-name',
        key: 'name',
        render({ name }) {
          return <TeamLink team={name} />
        }
      }, {
        key: 'viewerRole',
        render({ viewerRole }) {
          return viewerRole?.name
        }
      }],
      disableSearch: true,
      disableCard: true,
    },
  )

  return <>
    { table}
  </>
}

export const Page: React.FC = () => {
  return <>
    <Content.Header title={<Localized id='dashboard-profile' />} />
    <Content.Body>
      <Card>
        <Card.Body title={<Localized id='dashboard-profile-information' />}>
          <ProfileInfo />
        </Card.Body>
      </Card>
      <Card>
        <Card.Body title={<Localized id='dashboard-team-membership' />}>
          <TeamMembership />
        </Card.Body>
      </Card>
    </Content.Body>
  </>
}
