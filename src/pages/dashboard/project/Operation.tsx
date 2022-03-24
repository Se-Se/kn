import React, { useCallback, useContext, useMemo } from 'react'
import { Modal, Progress } from '@tencent/tea-component'
import { useAnalysisNewMutation, AnalysisListItemFragment, useAnalysisEditMutation, useAnalysisDeleteMutation, useAnalysisAnalyzeMutation, CustomizedAuditFragment, useAnalysisCustomizedAuditUndoMutation, useAnalysisEditFileMutation, useAnalysisStopMutation, AnalysisStatus, useTeamLimitQuery, useUpdateAnalysisSettingMutation } from 'generated/graphql'
import { Localized } from 'i18n'
import { useUpload } from 'utils/uploadProgress'
import { OperationOptionDef, Active, useModalFooter } from 'pages/template/table/Operation'
import { useRefetch } from 'pages/template/table/ActionTable'
import { useError } from 'hooks/useError'
import { reportLink, projectLink, analysisLink } from 'components/Link'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { ProjectMatch } from './Project'
import { useAnalysisForm, useFileList } from './Form'
import { ExportUseRender } from 'components/ReportExportDialog'
import { sleep } from 'utils/sleep'
import { getTeam } from '../Dashboard'
import { useAnalysisSettingForm } from './Settings'
import { ExpireContext } from 'pages/index/Patent'
import { Context, WritePerms, LicenseNotExpired, TeamAvailable, AnalysisStatusPending, AnalysisStatusSuccess } from 'pages/dashboard/projectOperationUtils'

export const IdCtx = React.createContext<{ teamId: string, projectId: string }>({ teamId: '', projectId: '' })
export const IdProvider = IdCtx.Provider
export const useIdProject = () => useContext(IdCtx)
export const useTeamId = () => useContext(IdCtx).teamId

const FileListSize = 'l'
export type OOI = OperationOptionDef<AnalysisListItemFragment, Context>

export const New: OOI = {
  key: 'new',
  primary: true,
  type: 'modal',
  active: [Active.Any, LicenseNotExpired],
  perms: WritePerms,
  caption: () => <Localized id='dashboard-new-analysis-caption' />,
  useRender({ close }) {
    const { params: { project: projectName, team: teamName } } = useRouteMatch<ProjectMatch>()
    const [error, { checkError }] = useError()
    const { projectId: projectID, teamId } = useContext(IdCtx)
    const [form, params, disabled] = useAnalysisForm()
    const refetch = useRefetch()
    const [create, { loading }] = useAnalysisNewMutation()
    const history = useHistory()
    const [createUpload, progress] = useUpload(create)
    const onOk = useMemo(() => checkError(async () => {
      await createUpload({
        variables: {
          teamId,
          input: {
            projectID,
            ...params,
          }
        }
      })
      let link = analysisLink({ team: teamName, project: projectName, analysis: params.name ?? "" })
      await refetch()
      history.push(link)
      close()
    }), [refetch, close, createUpload, history, params, projectName, teamName, projectID, checkError, teamId])
    const footer = useModalFooter({
      okId: 'dashboard-create',
      disabled,
      onOk,
      close,
    })

    return <>
      <Modal.Body>
        {error}
        {loading && <Progress percent={progress * 100} text={percent => `${percent.toFixed(1)} %`} />}
        {form}
      </Modal.Body>
      {footer}
    </>
  }
}

export const EditInfo: OOI = {
  key: 'edit',
  type: 'modal',
  size: FileListSize,
  active: Active.One,
  perms: WritePerms,
  caption: () => <Localized id='dashboard-edit-analysis-caption' />,
  useRender({ item: [analysis], close }) {
    const { params: { project: projectName, team: teamName } } = useRouteMatch<ProjectMatch>()
    const [error, { checkError }] = useError()
    const [form, { name, description }, disabled] = useAnalysisForm(analysis)
    const [submit, { loading: submiting }] = useAnalysisEditMutation()
    const [submitUpload, progress] = useUpload(submit)
    const { teamId } = useContext(IdCtx)
    const history = useHistory()

    const onOk = checkError(useCallback(async () => {
      await submitUpload({
        variables: {
          teamId,
          input: {
            id: analysis.id,
            name,
            description,
          }
        }
      })
      let link = analysisLink({ team: teamName, project: projectName, analysis: name ?? '' })
      history.push(link)
      close()
    }, [close, submitUpload, name, description, analysis.id, teamId, history, teamName, projectName]))
    const footer = useModalFooter({
      okId: 'dashboard-submit',
      onOk,
      close,
      disabled
    })

    return <>
      <Modal.Body>
        {error}
        {submiting && <Progress percent={progress * 100} text={percent => `${percent.toFixed(1)} %`} />}
        {form}
      </Modal.Body>
      {footer}
    </>
  }
}

export const EditFile: OOI = {
  key: 'edit',
  type: 'modal',
  size: FileListSize,
  active: [Active.One, ([i]) => !AnalysisStatusPending(i)],
  perms: WritePerms,
  primary: true,
  caption: () => <Localized id='dashboard-edit-analysis-caption' />,
  useRender({ item: [analysis], close }) {
    const [error, { checkError }] = useError()
    const { form, input: file, disabled } = useFileList(analysis.analysisType, analysis.file)
    const [submit, { loading: submiting }] = useAnalysisEditFileMutation()
    const [submitUpload, progress] = useUpload(submit)
    const { teamId } = useContext(IdCtx)

    const onOk = checkError(useCallback(async () => {
      await submitUpload({
        variables: {
          teamId,
          input: {
            analysisID: analysis.id,
            file,
          }
        }
      })
      close()
    }, [close, submitUpload, file, analysis.id, teamId]))
    const footer = useModalFooter({
      okId: 'dashboard-submit',
      disabled,
      onOk,
      close,
    })

    return <>
      <Modal.Body>
        {error}
        {submiting && <Progress percent={progress * 100} text={percent => `${percent.toFixed(1)} %`} />}
        {form}
      </Modal.Body>
      {footer}
    </>
  }
}

export const Delete: OOI = {
  key: 'delete',
  type: 'confirm',
  active: Active.GtZero,
  perms: WritePerms,
  message: <Localized id='dashboard-delete-analysis-caption' />,
  description: (item) => <Localized id='dashboard-delete-analysis-description' vars={{ items: item.map(i => i.name).join(', ') }} />,
  useOnConfirm() {
    const [remove] = useAnalysisDeleteMutation()
    const refetch = useRefetch()
    const { teamId } = useContext(IdCtx)

    return [async (item) => {
      await remove({
        variables: {
          teamId,
          id: item.map(i => i.id)
        }
      })
      refetch()
    }]
  }
}
export const DeleteBack: OOI = {
  key: 'delete',
  type: 'confirm',
  active: [Active.One, ([i]) => !AnalysisStatusPending(i)],
  perms: WritePerms,
  message: <Localized id='dashboard-delete-analysis-caption' />,
  description: (item) => <Localized id='dashboard-delete-analysis-description' vars={{ items: item.map(i => i.name).join(', ') }} />,
  useOnConfirm() {
    const { params } = useRouteMatch<ProjectMatch>()
    const [remove] = useAnalysisDeleteMutation()
    const refetch = useRefetch()
    const history = useHistory()
    const { teamId } = useContext(IdCtx)

    return [async (item) => {
      await remove({
        variables: {
          teamId,
          id: item.map(i => i.id)
        }
      })
      refetch()
      history.push(projectLink(params))
    }]
  }
}

export const AnalysisSetting: OOI = {
  key: 'analysis-setting',
  type: 'modal',
  active: [Active.One, ([i]) => !AnalysisStatusPending(i)],
  perms: WritePerms,
  caption: () => <Localized id='dashboard-analysis-settings-caption' />,
  size: 'xl',
  useRender({ item: [analysis], close }) {
    const [update] = useUpdateAnalysisSettingMutation()
    const { form, changed, value } = useAnalysisSettingForm(analysis.setting)
    const [error, { checkError }] = useError()
    const { teamId } = useContext(IdCtx)
    const refetch = useRefetch()
    const onOk = useMemo(() => checkError(async () => {
      await update({
        variables: {
          teamId,
          input: {
            id: analysis.id,
            ...value,
          }
        }
      })
      refetch()
      close()
    }), [analysis.id, checkError, teamId, update, value, refetch, close])
    const footer = useModalFooter({
      okId: 'dashboard-save',
      disabled: !changed,
      onOk,
      close,
    })

    return <>
      <Modal.Body>
        {error}
        {form}
      </Modal.Body>
      {footer}
    </>
  },
}

export const Analyze: OOI = {
  key: 'analyze',
  type: 'confirm',
  active: [Active.GtZero, (i) => i.some(i => !AnalysisStatusPending(i)), TeamAvailable, LicenseNotExpired],
  perms: WritePerms,
  message: <Localized id='dashboard-analyze-analysis-caption' />,
  description: (item) => <Localized id='dashboard-analyze-analysis-description' vars={{ items: item.map(i => i.name).join(', ') }} />,
  useOnConfirm() {
    const [analyze] = useAnalysisAnalyzeMutation()
    const refetch = useRefetch()
    const { teamId } = useContext(IdCtx)

    return [async (item) => {
      await analyze({
        variables: {
          teamId,
          id: item.filter(i => i.status !== AnalysisStatus.Analyzing).map(i => i.id)
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

export const Stop: OOI = {
  key: 'stop',
  type: 'confirm',
  active: [Active.One, ([i]) => AnalysisStatusPending(i)],
  perms: WritePerms,
  message: <Localized id='dashboard-stop-analysis-caption' />,
  description: (item) => <Localized id='dashboard-stop-analysis-description' vars={{ items: item.map(i => i.name).join(', ') }} />,
  useOnConfirm() {
    const [analyze] = useAnalysisStopMutation()
    const refetch = useRefetch()
    const { teamId } = useContext(IdCtx)

    return [async ([item]) => {
      await analyze({
        variables: {
          teamId,
          id: item.id
        }
      })
      // backend need more than one second to update status.
      await sleep(2000)
      refetch()
    }]
  }
}

export const Report: OOI = {
  key: 'report',
  type: 'link',
  active: [Active.One, AnalysisStatusSuccess],
  useLink([{ name }]) {
    const { params: { project, team } } = useRouteMatch<ProjectMatch>()
    return {
      url: reportLink({
        team,
        project,
        analysis: name,
      }),
      target: '_blank'
    }
  }
}

export const Export: OOI = {
  key: 'export',
  type: 'modal',
  caption: () => <Localized id='dashboard-export-caption' />,
  active: [
    Active.One,
    AnalysisStatusSuccess,
  ],
  useRender: ExportUseRender,
}

export const ExportIconActive: OOI = {
  ...Export,
  active: [Active.One],
  key: 'export-icon',
}

export const ExportIcon: OOI = {
  ...Export,
  key: 'export-icon',
}

export const ReportPrimary: OOI = {
  key: 'report-primary',
  type: 'link',
  primary: true,
  active: [Active.One, AnalysisStatusSuccess],
  useLink([{ name }]) {
    const { params: { project, team } } = useRouteMatch<ProjectMatch>()
    return {
      url: reportLink({
        team,
        project,
        analysis: name,
      }),
      target: '_blank'
    }
  }
}

export const Undo: OperationOptionDef<CustomizedAuditFragment> = {
  key: 'undo',
  type: 'confirm',
  active: Active.GtZero,
  primary: true,
  perms: WritePerms,
  message: <Localized id='dashboard-undo-customized-audit-message' />,
  description: (item) => <Localized id='dashboard-undo-customized-audit-description' vars={{ items: item.map(i => i.ruleName).join(', ') }} />,
  useOnConfirm() {
    const [remove] = useAnalysisCustomizedAuditUndoMutation()
    const refetch = useRefetch()
    const { teamId } = useContext(IdCtx)

    return [async (item) => {
      await remove({
        variables: {
          teamId,
          id: item.map(i => i.id)
        }
      })
      refetch()
    }]
  }
}

export const useOperationContext = (teamId: string): Context => {
  const { data: teamLimitData } = useTeamLimitQuery({ variables: { teamId } })
  const teamAvailable = getTeam(teamLimitData?.team)?.timesLimit?.available ?? 1000
  const isLicenseExpired = useContext(ExpireContext)
  return {
    teamAvailable,
    isLicenseExpired
  }
}
