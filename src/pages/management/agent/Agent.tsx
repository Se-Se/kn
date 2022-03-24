import React, { useState, useMemo } from 'react'
import { Layout, Modal, Form, Input, Bubble } from '@tencent/tea-component'
import { Localized, useGetMessage } from 'i18n'
import { useActionTable, useRefetch } from 'pages/template/table/ActionTable'
import { useManagementAgentQuery, AgentFragment, useManagementAgentNewMutation, useManagementAgentDeleteMutation, useManagementAgentEditMutation, AgentStatus } from 'generated/graphql'
import { formatTime } from 'utils/timeFormat'
import { OperationOptionDef, Active, useModalFooter } from 'pages/template/table/Operation'
import { useInput } from 'hooks/useInput'
import { useError } from 'hooks/useError'
import { ClickCopy } from 'components/ClickCopy'
import { Management } from 'icons'

const { Content } = Layout


type OOI = OperationOptionDef<AgentFragment>
const New: OOI = {
  key: 'new',
  primary: true,
  type: 'modal',
  active: Active.Any,
  caption: () => <Localized id='management-new-agent-caption' />,
  useRender({ close }) {
    const [created, setCreated] = useState(false)
    const [err, { checkError }] = useError()
    const [create, { data }] = useManagementAgentNewMutation()
    const refetch = useRefetch()
    const [name] = useInput('')

    const onOk = useMemo(() => checkError(async () => {
      await create({
        variables: {
          input: {
            name: name.value,
          }
        }
      })
      setCreated(true)
      refetch()
    }), [create, refetch, name.value, checkError])

    const footer = useModalFooter({
      okId: 'modal-create',
      onOk,
      close
    })

    return <>
      <Modal.Body>
        {err}
        {!created ?
          <Form>
            <Form.Item label={<Localized id='column-agentName' />}>
              <Input {...name} />
            </Form.Item>
          </Form> :
          <Form>
            <Form.Item label={<Localized id='column-agentId' />}>
              <Input value={data?.management?.createAgent?.displayID} readOnly />
            </Form.Item>
            <ClickCopy
              label={<Localized id='column-token' />}
              value={data?.management.createAgent?.token}
              copiedTip={<Localized id='dashboard-token-copied' />}
            />
          </Form>
        }
      </Modal.Body>
      {!created && footer}
    </>
  }
}

const Delete: OOI = {
  key: 'delete',
  type: 'confirm',
  active: [Active.GtZero, (items) => items.every(i => i.status === AgentStatus.Error)],
  message: <Localized id='management-delete-agent-caption' />,
  description: (item) => <Localized id='management-delete-agent-description' vars={{ item: item.map(i => i.name).join(',') }} />,
  useOnConfirm() {
    const [del] = useManagementAgentDeleteMutation()
    const refetch = useRefetch()
    return [async (item) => {
      await del({
        variables: {
          input: item.map(i => i.id)
        }
      })
      refetch()
    }]
  }
}

const StatusColor: Record<AgentStatus, string> = {
  [AgentStatus.Ready]: '#29cc85',
  [AgentStatus.Busy]: '#ff9c19',
  [AgentStatus.Error]: '#ff584c',
}
const VMiddle = { verticalAlign: 'middle' }
const AgentStatusField: React.FC<{ agent: AgentFragment }> = ({ agent: { status, error } }) => {
  const getMessage = useGetMessage()

  return <>
    <span style={{ color: StatusColor[status], ...VMiddle }}>{getMessage(`enum-status-${status}`)} </span>
    {status === AgentStatus.Error && <Bubble error content={error}>
      <img alt='agent_error' src={Management.AgentError} style={VMiddle} />
    </Bubble>}
  </>
}

export const Page: React.FC = () => {
  const [submitEdit] = useManagementAgentEditMutation()
  const table = useActionTable(
    useManagementAgentQuery,
    ({ management }) => management.agent,
    {
      columns: [{
        id: 'agentId',
        key: 'displayID'
      }, {
        id: 'agentName',
        key: 'name',
        editable: true,
      }, {
        key: 'token'
      }, {
        key: 'status',
        render(agent) {
          return <AgentStatusField agent={agent} />
        }
      }, {
        key: 'time',
        render({ time }) {
          return formatTime(time)
        }
      }, {
        key: 'version',
      }],
      leftOperation: [New, Delete],
      rightOperation: [Delete],
      edit: {
        async onEdit(item, field, value) {
          await submitEdit({
            variables: {
              input: {
                id: item.id,
                [field]: value
              }
            }
          })
        },
      },
      pollInterval: 10 * 1000,
    },
  )

  return <>
    <Content.Header title={<Localized id='management-agent' />} />
    <Content.Body>
      {table}
    </Content.Body>
  </>
}
