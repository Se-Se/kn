import React, { useMemo, useState } from 'react'
import { Layout, Modal, Form, Input, Select, message } from '@tencent/tea-component'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { omitVariables } from 'utils/omitVariables'
import { useMgrAnalysisListQuery, MgrAnalysisListItemFragment, useAnalysisRestoreMutation, useAnalysisDeletePermanentlyMutation } from 'generated/graphql'
import { useActionTable, useRefetch } from 'pages/template/table/ActionTable'
import { StatusIcon } from 'components/StatusIcon'
import { formatTime } from 'utils/timeFormat'
import { OperationOptionDef, Active, useModalFooter } from 'pages/template/table/Operation'
import { Localized, useGetMessage } from 'i18n'
import { useError } from 'hooks/useError'
import { useInput } from 'hooks/useInput'
import { getProject } from 'pages/report/common'
import { renderAnalysisType } from 'pages/template/common'
import { Options, useDeletedFilter } from './common'
// import { AnalysisLink } from 'components/Link'
import { allFilled } from 'utils/allFilled'
import { useRestoreRender as useProjectRestoreRender } from './Project'
import { isAnalysisStatusDisabled, useAllRiskTableColumn } from 'components/AllRiskField'
const { Content } = Layout

export type OOI = OperationOptionDef<MgrAnalysisListItemFragment>
const Restore: OOI = {
  key: 'restore',
  type: 'modal',
  active: [Active.One, ([item]) => !!item.deleteTime],
  caption: () => <Localized id='management-restore-analysis-caption' />,
  useRender({ item: [item], close }) {
    const [renderProjectRestore, setRenderProjectRestore] = useState(false)
    const isProjectDeleted = item.project?.deleteTime !== null
    const [needRename, setNeedRename] = useState(false)
    const [newName] = useInput('')
    const [err, { checkError, clearError }] = useError()
    const [restore] = useAnalysisRestoreMutation()
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
        const gotName = r.data?.management.restoreAnalysis?.name
        message.success({
          content: getMessage('management-restore-analysis-success', { name: gotName ?? item.name })
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

    const projectRestore = useProjectRestoreRender({ item: [item.project!], close })
    const pdFooter = useModalFooter({
      okId: 'management-restore-project-caption',
      async onOk() {
        setRenderProjectRestore(true)
      },
      close,
    })

    if (renderProjectRestore) {
      return projectRestore
    } else if (isProjectDeleted) {
      return <>
        <Modal.Body>
          <Localized id='management-restore-analysis-project' vars={{
            project: item.project?.name ?? '',
            analysis: item.name
          }} />
        </Modal.Body>
        {pdFooter}
      </>
    } else {
      return <>
        <Modal.Body>
          {err}
          {needRename && <>
            <Localized id='management-restore-analysis-rename-description' vars={{ oldName: item.name }} />
            <Form>
              <Form.Item label={<Localized id='column-analysisName' />} required>
                <Input {...newName} />
              </Form.Item>
            </Form>
          </>}
          {!needRename && <Localized id='management-restore-analysis-description' vars={{ name: item.name }} />}
        </Modal.Body>
        {footer}
      </>
    }
  }
}
const Delete: OOI = {
  key: 'permanently-delete',
  type: 'modal',
  active: [Active.One],
  caption: ([analysis]) => <Localized id='management-permanently-delete-analysis-caption' vars={{ name: analysis.name }} />,
  useRender({ item: [analysis], close }) {
    const [err, { checkError }] = useError()
    const refetch = useRefetch()
    const [typed] = useInput('')
    const [del] = useAnalysisDeletePermanentlyMutation()
    const onOk = useMemo(() => checkError(async () => {
      await del({
        variables: {
          id: analysis.id
        }
      })
      refetch()
      close()
    }), [refetch, close, del, analysis.id, checkError])
    const footer = useModalFooter({
      okId: 'dashboard-delete',
      disabled: typed.value !== analysis.name,
      onOk,
      close
    })

    return <>
      <Modal.Body>
        {err}
        <Form layout='inline-vertical'>
          <Form.Item label={<Localized id='management-permanently-delete-analysis-description' vars={{ name: analysis.name }} />}>
            <Input {...typed} />
          </Form.Item>
        </Form>
      </Modal.Body>
      {footer}
    </>
  }
}

const Analysis: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { deleted, ...deletedFilter } = useDeletedFilter()
  const query = omitVariables(useMgrAnalysisListQuery, {
    projectId,
    delete: deleted,
  })
  const history = useHistory()
  const { data } = query()
  const allRiskColumn = useAllRiskTableColumn(isAnalysisStatusDisabled<MgrAnalysisListItemFragment>())
  const table = useActionTable(query, ({ management }) => management?.analysis, {
    columns: [
      {
        id: 'analysisName',
        key: 'name',
        render(analysis) {
          if (!analysis) {
            return '--'
          }
          const p = {
            team: analysis.project?.team?.name,
            project: analysis.project?.name,
            analysis: analysis.name,
          }
          const { displayID, name, deleteTime } = analysis
          if (!allFilled(p) || deleteTime) {
            return `${name} #${displayID}`
          }
          // return <><AnalysisLink {...p}>{name}</AnalysisLink></>
        }
      }, {
        id: 'analysisNote',
        key: 'description',
        editable: true,
      }, {
        id: 'analysisType',
        key: 'systemType',
        render: renderAnalysisType,
      }, {
        key: 'status',
        render: (item) => <StatusIcon text status={item.status} />
      },
      ...allRiskColumn,
      {
        key: 'time',
        render(item) {
          return formatTime(item.time)
        }
      }, {
        key: 'deleteTime',
        render(item) {
          return formatTime(item.deleteTime) ?? '--'
        }
      }
    ],
    rightOperation: [Restore, Delete],
    tableLeft() {
      return <Select
        type='simulate'
        appearance='button'
        size='m'
        options={Options.map(i => ({
          value: i,
          text: <Localized id={`enum-analysis-${i}`} />
        }))}
        boxSizeSync
        {...deletedFilter}
      />
    },
    sortableColumns: ['name', 'time', 'deleteTime'],
  })
  const project = data?.project;

  return <>
    <Content.Header title={(getProject(project)?.name) || projectId} showBackButton onBackButtonClick={history.goBack} />
    <Content.Body>
      {table}
    </Content.Body>
  </>
}

interface ProjectMatch {
  team: string
  projectId: string
}

export const Page: React.FC = () => {
  const { params: { projectId } } = useRouteMatch<ProjectMatch>()

  return <>
    <Analysis projectId={projectId} />
  </>
}
