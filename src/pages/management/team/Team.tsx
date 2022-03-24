import React, { useState, useMemo } from 'react'
import { useActionTable, useRefetch } from 'pages/template/table/ActionTable'
import { TeamListItemFragment, useTeamNewMutation, useTeamDeleteMutation, useTeamListQuery, useTeamEditMutation, useManagementLimitQuery } from 'generated/graphql'
import { Layout, Modal, Form, Input, InputNumber, Text } from '@tencent/tea-component'
import dayjs from 'dayjs'
import { NormalFormat } from 'utils/timeFormat'
import { OperationOptionDef, Active, useModalFooter } from 'pages/template/table/Operation'
import { Localized } from 'i18n'
import { useInput } from 'hooks/useInput'
import { useError } from 'hooks/useError'
import { ManagementTeamUserLink, managementTeamUserLink } from 'components/Link'
import { useConfig } from 'components/Config'
import { useApolloData } from 'hooks/common'
import { useHistory } from 'react-router-dom'

const { Content } = Layout

function useNewTeamForm(item?: TeamListItemFragment) {
  const { timesLimitEnabled } = useConfig()
  const [error] = useState('')
  const [name] = useInput(item ? item.name : '')
  const [limit] = useInput(0)
  const result = useManagementLimitQuery({
    fetchPolicy: 'network-only'
  })
  const input = useMemo(() => {
    if (name.value === '' || (timesLimitEnabled && limit.value < 0)) {
      return undefined
    }
    return {
      timesLimit: timesLimitEnabled ? limit.value : undefined,
      name: name.value,
    }
  }, [name.value, limit.value, timesLimitEnabled])

  return {
    form: useApolloData(result, (data) => <Form>
      <Form.Item label='Team Name' required>
        <Input {...name} />
      </Form.Item>
      {
        timesLimitEnabled && <>
          <Form.Item label='Team Limit' required>
            <InputNumber hideButton={true} size='l' {...limit} />
          </Form.Item>
          <Form.Item>
            <Text theme='weak' reset><Localized id='management-add-team-analysis' vars={{ item: data.management.timesLimit?.unallocated ?? 0 }} /></Text>
          </Form.Item>
        </>
      }
    </Form>),
    input,
    error,
    disabled: (
      !input ||
      !input.name
    )
  } as const
}

function useEditTeamForm(item?: TeamListItemFragment) {
  const { timesLimitEnabled } = useConfig()
  const [error] = useState('')
  const [name] = useInput(item ? item.name : '')
  const [limit] = useInput(item?.timesLimit ? item.timesLimit.total : 0)
  const result = useManagementLimitQuery({
    fetchPolicy: 'network-only'
  })
  const input = useMemo(() => {
    if (name.value === '' || (timesLimitEnabled && limit.value < 0)) {
      return undefined
    }
    return {
      timesLimit: timesLimitEnabled ? limit.value : undefined,
      name: name.value,
    }
  }, [name.value, limit.value, timesLimitEnabled])

  return {
    form: useApolloData(result, (data) => {
      const used = item?.timesLimit?.used ?? 0
      const total = item?.timesLimit?.total ?? 0
      const rest = data.management.timesLimit?.unallocated ? total + data.management.timesLimit.unallocated : total
      return <Form>
        <Form.Item label='Team Name' required>
          <Input {...name} />
        </Form.Item>
        {
          timesLimitEnabled && <>
            <Form.Item label='Team Used Limit'>
              <InputNumber hideButton={true} size='l' value={used} disabled />
            </Form.Item>
            <Form.Item label='Team Limit' required>
              <InputNumber hideButton={true} size='l' {...limit} />
            </Form.Item>
            <Form.Item>
              <Text theme='weak' reset><Localized id='management-edit-team-analysis' vars={{ item: rest }} /></Text>
            </Form.Item>
          </>
        }
      </Form>
    }),
    input,
    error,
    disabled: (
      !input ||
      !input.name
    )
  }
}

type OOI = OperationOptionDef<TeamListItemFragment>
const New: OOI = {
  key: 'new',
  primary: true,
  type: 'modal',
  active: Active.Any,
  caption: () => <Localized id='management-add-team-caption' />,
  useRender({ close }) {
    const [err, { setError, checkError }] = useError()
    const [create] = useTeamNewMutation()
    const history = useHistory()
    const refetch = useRefetch()
    const { form, input, error, disabled } = useNewTeamForm()

    const onOk = useMemo(() => checkError(async () => {
      if (error) {
        setError(error)
        return
      }
      if (!input) {
        return
      }
      const { data } = await create({
        variables: input
      })
      close()
      await refetch()
      const link = managementTeamUserLink({ teamId: data?.management.createTeam?.id || '' })
      history.push(link)
    }), [create, refetch, close, error, input, setError, checkError, history])

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
  active: [Active.One],
  caption: () => <Localized id='management-edit-team-caption' />,
  useRender({ item: [team], close }) {
    const [err, { setError, checkError }] = useError()
    const [create] = useTeamEditMutation()
    const refetch = useRefetch()
    const { form, input, error, disabled } = useEditTeamForm(team)

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
          input: {
            id: team.id,
            ...input
          }
        }
      })
      close()
      refetch()
    }), [create, refetch, close, error, input, setError, checkError, team.id])

    const footer = useModalFooter({
      okId: 'modal-ok',
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
const Delete: OOI = {
  key: 'delete',
  type: 'modal',
  active: [Active.One],
  caption: ([team]) => <Localized id='management-delete-team-caption' vars={{ name: team.name }} />,
  useRender({ item: [team], close }) {
    const [err, { checkError }] = useError()
    const refetch = useRefetch()
    const [typed] = useInput('')
    const [del] = useTeamDeleteMutation()
    const onOk = useMemo(() => checkError(async () => {
      await del({
        variables: {
          ids: [team.id]
        }
      })
      refetch()
      close()
    }), [refetch, close, del, team.id, checkError])
    const footer = useModalFooter({
      okId: 'dashboard-delete',
      disabled: typed.value !== team.name,
      onOk,
      close
    })

    return <>
      <Modal.Body>
        {err}
        <Form layout='inline-vertical'>
          <Form.Item label={<Localized id='management-delete-team-description' vars={{ name: team.name }} />}>
            <Input {...typed} />
          </Form.Item>
        </Form>
      </Modal.Body>
      {footer}
    </>
  }
}

export const Page: React.FC = () => {
  const [submitEdit] = useTeamEditMutation()
  const { timesLimitEnabled } = useConfig()
  const table = useActionTable(
    useTeamListQuery,
    ({ management }) => management.team,
    {
      columns: [{
        id: 'team-name',
        key: 'name',
        editable: true,
        render(item) {
          return <ManagementTeamUserLink teamId={item.id}>{item.name}</ManagementTeamUserLink>
        }
      }, {
        key: 'available-analysis',
        hidden: !timesLimitEnabled,
        render: (item) => item.timesLimit?.available ?? ''
      }, {
        key: 'used-analysis',
        hidden: !timesLimitEnabled,
        render: (item) => item.timesLimit?.used ?? ''
      }, {
        key: 'total-analysis',
        hidden: !timesLimitEnabled,
        render: (item) => item.timesLimit?.total ?? ''
      }, {
        key: 'createTime',
        render(item) {
          return dayjs(item.createTime).format(NormalFormat)
        }
      }],
      leftOperation: [New],
      rightOperation: [Edit, Delete],
      disableSelect: true,
      edit: {
        async onEdit(item, field, value) {
          await submitEdit({
            variables: {
              input: {
                id: item.id,
                [field]: value,
              }
            }
          })
        },
      },
      sortableColumns: ['name', 'createTime'],
    }
  )

  return <>
    <Content.Header title={<Localized id='management-team' />} />
    <Content.Body>
      {table}
    </Content.Body>
  </>
}
