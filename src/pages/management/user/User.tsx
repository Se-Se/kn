import React, { useState, useMemo, useEffect } from 'react'
import { useActionTable, useRefetch } from 'pages/template/table/ActionTable'
import { useUserListQuery, UserListItemFragment, useUserNewMutation, useUserDeleteMutation, useUserEditMutation } from 'generated/graphql'
import { Layout, Modal, Form, Input, Bubble, List } from '@tencent/tea-component'
import dayjs from 'dayjs'
import { NormalFormat } from 'utils/timeFormat'
import { OperationOptionDef, Active, useModalFooter, UseActive } from 'pages/template/table/Operation'
import { Localized } from 'i18n'
import { useInput } from 'hooks/useInput'
import { useError } from 'hooks/useError'
import { RoleInput } from '../components/RoleInput'

const { Content } = Layout

function useUserForm(item?: UserListItemFragment) {
  const [error, setError] = useState('')
  const [username] = useInput(item ? item.username : '')
  const [roleId] = useInput<string | undefined>(item?.userRole.id)
  const [password] = useInput('')
  const [passwordRepeat] = useInput('')
  const edit = !!item
  const input = useMemo(() => {
    if (roleId.value === undefined) {
      return undefined
    }
    return {
      username: username.value,
      role: roleId.value,
      password: password.value,
    }
  }, [username.value, roleId.value, password.value])
  useEffect(() => {
    if (!item && password.value === '') {
      setError('error-password-empty')
    } else if (password.value !== passwordRepeat.value) {
      setError('error-password-not-match')
    } else {
      setError('')
    }
  }, [password.value, passwordRepeat.value, item])

  return {
    form: <Form>
      <Form.Item label={<Localized id='column-username' />} required>
        <Input {...username} disabled={edit} />
      </Form.Item>
      <Form.Item label={<Localized id='column-role' />} required>
        <RoleInput {...roleId} />
      </Form.Item>
      <Form.Item label={<Localized id='column-password' />} required={!edit}>
        <Bubble
          trigger='focus'
          content={<List type='bullet'><Localized id='password-rule' /></List>}
          placement='right'
        >
          <Input type='password' {...password} />
        </Bubble>
      </Form.Item>
      <Form.Item label={<Localized id='column-password-repeat' />} required={!edit}>
        <Input type='password' {...passwordRepeat} />
      </Form.Item>
    </Form>,
    input,
    error,
    disabled: (
      !input ||
      ![input.username, input.role].every(Boolean) ||
      (!edit && ![password.value, passwordRepeat.value].every(Boolean))
    )
  } as const
}

type OOI = OperationOptionDef<UserListItemFragment>
const New: OOI = {
  key: 'new',
  primary: true,
  type: 'modal',
  active: Active.Any,
  caption: () => <Localized id='management-add-user-caption' />,
  useRender({ close }) {
    const [err, { setError, checkError }] = useError()
    const [create] = useUserNewMutation()
    const refetch = useRefetch()
    const { form, input, error, disabled } = useUserForm()

    const onOk = useMemo(() => checkError(async () => {
      if (error) {
        setError(error)
        return
      }
      if (!input) {
        return
      }
      await create({
        variables: {
          user: {
            ...input,
          }
        }
      })
      close()
      refetch()
    }), [create, refetch, close, error, input, setError, checkError])

    const footer = useModalFooter({
      okId: 'modal-create',
      disabled,
      onOk,
      close
    })

    return <>
      <Modal.Body>
        {err}
        {form}
      </Modal.Body>
      {footer}
    </>
  }
}
const Edit: OOI = {
  key: 'edit',
  type: 'modal',
  active: Active.One,
  useActive() {
    const viewer = UseActive.useViewer()
    return [(item) => item[0]?.id !== viewer?.id]
  },
  caption: () => <Localized id='management-edit-user-caption' />,
  useRender({ item: [item], close }) {
    const [err, { setError, checkError }] = useError()
    const [submit] = useUserEditMutation()
    const { form, input, error, disabled } = useUserForm(item)

    const onOk = useMemo(() => checkError(async () => {
      if (error) {
        setError(error)
        return
      }
      if (!input) {
        return
      }
      await submit({
        variables: {
          user: {
            id: item.id,
            ...input,
            password: input.password === '' ? undefined : input.password
          }
        }
      })
      close()
    }), [submit, close, error, input, item, setError, checkError])
    const footer = useModalFooter({
      okId: 'modal-submit',
      disabled,
      onOk,
      close,
    })

    return <>
      <Modal.Body>
        {err}
        {form}
      </Modal.Body>
      {footer}
    </>
  }
}

const Delete: OOI = {
  key: 'delete',
  type: 'confirm',
  active: Active.GtZero,
  useActive() {
    const viewer = UseActive.useViewer()
    return [(item) => item[0]?.id !== viewer?.id]
  },
  message: <Localized id='management-delete-user-caption' />,
  description: (item) => <Localized id='management-delete-user-description' vars={{ items: item.map(i => i.username).join(', ') }} />,
  useOnConfirm() {
    const [del] = useUserDeleteMutation()
    const refetch = useRefetch()
    return [async (item) => {
      await del({
        variables: {
          users: item.map(i => i.id)
        }
      })
      refetch()
    }]
  }
}

export const Page: React.FC = () => {
  const table = useActionTable(
    useUserListQuery,
    ({ management }) => management.user,
    {
      columns: [{
        key: 'username'
      }, {
        id: 'role',
        key: 'userRole',
        render(item) {
          return item.userRole.name
        }
      }, {
        key: 'lastLoginTime',
        render(item) {
          return dayjs(item.lastLoginTime).format(NormalFormat)
        }
      }],
      leftOperation: [New, Delete],
      rightOperation: [Delete, Edit],
      sortableColumns: ['username', 'lastLoginTime'],
    })

  return <>
    <Content.Header title={<Localized id='management-user' />} />
    <Content.Body full>
      {table}
    </Content.Body>
  </>
}
