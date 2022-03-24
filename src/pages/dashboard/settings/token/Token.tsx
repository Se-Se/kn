import React, { useMemo, useState } from 'react'
import { useActionTable, useRefetch } from 'pages/template/table/ActionTable'
import { useTokenListQuery, TokenItemFragment, useTokenNewMutation, useViewerQuery, useTokenDeleteMutation, useTokenEditMutation } from 'generated/graphql'
import { Layout, Modal, Form, Input } from '@tencent/tea-component'
import dayjs from 'dayjs'
import { NormalFormat } from 'utils/timeFormat'
import { OperationOptionDef, Active, useModalFooter } from 'pages/template/table/Operation'
import { Localized } from 'i18n'
import { useInput } from 'hooks/useInput'
import { useError } from 'hooks/useError'
import { ClickCopy } from 'components/ClickCopy'

const { Content } = Layout

type OOI = OperationOptionDef<TokenItemFragment>
const New: OOI = {
  key: 'new',
  primary: true,
  type: 'modal',
  active: Active.Any,
  caption: () => <Localized id='dashboard-add-token-caption' />,
  useRender({ close }) {
    const [created, setCreated] = useState(false)
    const { data: viewerData } = useViewerQuery()
    const [err, { checkError }] = useError()
    const [create, { data }] = useTokenNewMutation()
    const refetch = useRefetch()
    const [description] = useInput('')

    const onOk = useMemo(() => checkError(async () => {
      await create({
        variables: {
          input: {
            description: description.value,
          }
        }
      })
      setCreated(true)
      refetch()
    }), [create, refetch, description.value, checkError])

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
            <Form.Item label={<Localized id='username' />}>
              <Input value={viewerData?.viewer?.username} readOnly />
            </Form.Item>
            <Form.Item label={<Localized id='column-tokenNote' />}>
              <Input {...description} />
            </Form.Item>
          </Form> :
          <Form>
            <ClickCopy
              label={<Localized id='column-token' />}
              value={data?.token.createToken?.token}
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
  active: Active.GtZero,
  message: <Localized id='dashboard-delete-token-caption' />,
  description: (item) => <Localized id='dashboard-delete-token-description' vars={{ item: item.map(i => i.token).join(',') }} />,
  useOnConfirm() {
    const [del] = useTokenDeleteMutation()
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

export const Page: React.FC = () => {
  const [submitEdit] = useTokenEditMutation()
  const table = useActionTable(
    useTokenListQuery,
    ({ token }) => token,
    {
      columns: [{
        key: 'token'
      }, {
        key: 'createTime',
        render(item) {
          return dayjs(item.createTime).format(NormalFormat)
        }
      }, {
        id: 'tokenNote',
        key: 'description',
        editable: true,
      }],
      leftOperation: [New, Delete],
      rightOperation: [Delete],
      disableSearch: true,
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
      }
    })

  return <>
    <Content.Header title={<Localized id='dashboard-token' />} />
    <Content.Body>
      {table}
    </Content.Body>
  </>
}
