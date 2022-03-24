import React, { useMemo, useState } from 'react'
import { useActionTable, useRefetch } from 'pages/template/table/ActionTable'
import { MgrProjectListItemFragment, useMgrProjectListQuery, useProjectDeletePermanentlyMutation, useProjectRestoreMutation } from 'generated/graphql'
import { Layout, Modal, Form, Input, Select, message } from '@tencent/tea-component'
import { OperationOptionDef, Active, useModalFooter, ModalRender } from 'pages/template/table/Operation'
import { Localized, useGetMessage } from 'i18n'
import { useError } from 'hooks/useError'
import { useInput } from 'hooks/useInput'
import { Link } from 'react-router-dom'
import { formatTime } from 'utils/timeFormat'
import { StatusIcon } from 'components/StatusIcon'
import { omitVariables } from 'utils/omitVariables'
import { Options, useDeletedFilter } from './common'
import { isCommonStatusDisabled, useAllRiskTableColumn } from 'components/AllRiskField'

const { Content } = Layout

export type Item = Pick<MgrProjectListItemFragment, 'id' | 'deleteTime' | 'name'>
export type OOI = OperationOptionDef<Item>

export const useRestoreRender: ModalRender<Item> = ({ item: [item], close }) => {
  const [needRename, setNeedRename] = useState(false)
  const [newName] = useInput('')
  const [err, { checkError, clearError }] = useError()
  const [restore] = useProjectRestoreMutation()
  const getMessage = useGetMessage()
  const refetch = useRefetch()
  const onOk = useMemo(() => checkError(async () => {
    try {
      const r = await restore({
        variables: {
          id: item.id,
          rename: newName.value === '' ? null : newName.value,
        }
      })
      refetch()
      const gotName = r.data?.management.restoreProject?.name
      message.success({
        content: getMessage('management-restore-project-success', { name: gotName ?? item.name })
      })
    } catch (e:any) {
      if (!needRename && e.message === 'error-exists--object') {
        setNeedRename(true)
        clearError()
        return
      } else {
        throw e
      }
    }
    close()
  }), [needRename, refetch, close, restore, item.id, newName.value, clearError, getMessage, item.name, checkError])
  const footer = useModalFooter({
    disabled: needRename && !newName.value,
    onOk,
    close,
  })

  return <>
    <Modal.Body>
      {err}
      {needRename && <>
        <Localized id='management-restore-project-rename-description' vars={{ oldName: item.name }} />
        <Form>
          <Form.Item label={<Localized id='column-projectName' />} required>
            <Input {...newName} />
          </Form.Item>
        </Form>
      </>}
      {!needRename && <Localized id='management-restore-project-description' vars={{ name: item.name }} />}
    </Modal.Body>
    {footer}
  </>
}

export const Restore: OOI = {
  key: 'restore',
  type: 'modal',
  active: [Active.One, ([item]) => !!item.deleteTime],
  caption: () => <Localized id='management-restore-project-caption' />,
  useRender: useRestoreRender,
}

const Delete: OOI = {
  key: 'permanently-delete',
  type: 'modal',
  active: [Active.One],
  caption: ([project]) => <Localized id='management-permanently-delete-project-caption' vars={{ name: project.name }} />,
  useRender({ item: [project], close }) {
    const [err, { checkError }] = useError()
    const refetch = useRefetch()
    const [typed] = useInput('')
    const [del] = useProjectDeletePermanentlyMutation()
    const onOk = useMemo(() => checkError(async () => {
      await del({
        variables: {
          id: project.id
        }
      })
      refetch()
      close()
    }), [refetch, close, del, project.id, checkError])
    const footer = useModalFooter({
      okId: 'dashboard-delete',
      disabled: typed.value !== project.name,
      onOk,
      close
    })

    return <>
      <Modal.Body>
        {err}
        <Form layout='inline-vertical'>
          <Form.Item label={<Localized id='management-permanently-delete-project-description' vars={{ name: project.name }} />}>
            <Input {...typed} />
          </Form.Item>
        </Form>
      </Modal.Body>
      {footer}
    </>
  }
}

export const Page: React.FC = () => {
  const { deleted, ...deletedFilter } = useDeletedFilter()
  const allRiskColumn = useAllRiskTableColumn(isCommonStatusDisabled<MgrProjectListItemFragment>())
  const table = useActionTable(
    omitVariables(useMgrProjectListQuery, {
      delete: deleted
    }),
    ({ management }) => management.project,
    {
      columns: [{
        id: 'projectName',
        key: 'name',
        render({ id, name }) {
          return <Link to={`${id}`}>{name}</Link>
        }
      }, {
        id: 'projectNote',
        key: 'description'
      }, {
        id: 'projectStatus',
        key: 'status',
        render: ({ status }) => <StatusIcon status={status} text />
      }, ...allRiskColumn, {
        key: 'team',
        render: ({ team }) => team ? team.name : '--'
      }, {
        key: 'deleteTime',
        render: (item) => formatTime(item.deleteTime) ?? '--'
      }],
      rightOperation: [Restore, Delete],
      tableLeft() {
        return <Select
          type='simulate'
          appearance='button'
          size='m'
          options={Options.map(i => ({
            value: i,
            text: <Localized id={`enum-project-${i}`} />
          }))}
          boxSizeSync
          {...deletedFilter}
        />
      },
      sortableColumns: ['name', 'deleteTime'],
    })

  return <>
    <Content.Header title={<Localized id='management-project' />} />
    <Content.Body>
      {table}
    </Content.Body>
  </>
}
