import React, { useMemo } from 'react'
import { useProjectNewMutation, ProjectListItemFragment, useProjectDeleteMutation, useProjectAnalyzeMutation, OverviewDocument } from 'generated/graphql'
import { useInput } from 'hooks/useInput'
import { Form, Input, Modal } from '@tencent/tea-component'
import { Localized } from 'i18n'
import { OperationOptionDef, Active, useModalFooter } from 'pages/template/table/Operation'
import { useRefetch } from 'pages/template/table/ActionTable'
import { useError } from 'hooks/useError'
import { useTeamId } from '../Dashboard'
import { LicenseNotExpired, TeamAvailable, Context, WritePerms } from 'pages/dashboard/projectOperationUtils'

type OOI = OperationOptionDef<ProjectListItemFragment, Context>
const RefetchOpt = {
  refetchQueries: [{ query: OverviewDocument }]
}
export const New: OOI = {
  key: 'new',
  primary: true,
  type: 'modal',
  active: [Active.Any, LicenseNotExpired],
  perms: WritePerms,
  caption: () => <Localized id='dashboard-new-project-caption' />,
  useRender({ close }) {
    const [error, { checkError }] = useError()
    const [name] = useInput('')
    const [description] = useInput('')
    const [create] = useProjectNewMutation(RefetchOpt)
    const { teamId } = useTeamId()

    const refetch = useRefetch()
    const handleOk = useMemo(() => checkError(async () => {
      await create({
        variables: {
          teamId,
          input: {
            name: name.value,
            description: description.value,
          }
        }
      })
      close()
      refetch()
    }), [refetch, close, create, name.value, description.value, checkError, teamId])
    const footer = useModalFooter({
      okId: 'dashboard-create',
      onOk: handleOk,
      disabled: !name.value,
      close
    })

    return <>
      <Modal.Body>
        {error}
        <Form layout='inline-vertical'>
          <Form.Item label={<Localized id='column-projectName' />} required>
            <Input {...name} />
          </Form.Item>
          <Form.Item label={<Localized id='column-projectNote' />}>
            <Input {...description} />
          </Form.Item>
        </Form>
      </Modal.Body>
      {footer}
    </>
  }
}
export const Delete: OOI = {
  key: 'delete',
  type: 'modal',
  active: Active.One,
  perms: WritePerms,
  caption: ([project]) => <Localized id='dashboard-delete-project-caption' vars={{ name: project.name }} />,
  useRender({ item: [project], close }) {
    const [err, { checkError }] = useError()
    const refetch = useRefetch()
    const [typed] = useInput('')
    const [del] = useProjectDeleteMutation(RefetchOpt)
    const { teamId } = useTeamId()

    const onOk = useMemo(() => checkError(async () => {
      await del({
        variables: {
          teamId,
          id: [project.id]
        }
      })
      refetch()
      close()
    }), [refetch, close, del, project.id, checkError, teamId])
    const footer = useModalFooter({
      okId: 'dashboard-delete',
      disabled: typed.value !== project.name,
      onOk,
      close,
    })

    return <>
      <Modal.Body>
        {err}
        <Form layout='inline-vertical'>
          <Form.Item label={<Localized id='dashboard-delete-confirm' vars={{ name: project.name }} />}>
            <Input {...typed} />
          </Form.Item>
        </Form>
      </Modal.Body>
      {footer}
    </>
  }
}

export const Analyze: OOI = {
  key: 'analyze',
  type: 'confirm',
  active: [Active.GtZero, TeamAvailable, LicenseNotExpired],
  perms: WritePerms,
  message: <Localized id='dashboard-analyze-analysis-caption' />,
  description: (items) => <Localized id='dashboard-analyze-analysis-description' vars={{ items: items.map(i => i.name).join(', ') }} />,
  useOnConfirm() {
    const [analyze] = useProjectAnalyzeMutation(RefetchOpt)
    const refetch = useRefetch()
    const { teamId } = useTeamId()

    return [async (item) => {
      await analyze({
        variables: {
          teamId,
          id: item.map(i => i.id)
        }
      })
      refetch()
    }]
  },
  bubble(_, ctx) {
    if (ctx?.teamAvailable === 0) {
      return <Localized id='team-use-up' />
    }
    return
  }
}
