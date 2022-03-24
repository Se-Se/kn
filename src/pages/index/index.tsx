import React, { useState, useMemo } from 'react'
import { NavMenu, Layout, Text, Modal, Form, Input, RadioGroup, Radio } from '@tencent/tea-component'
import { useViewerQuery, UserPermission, useFeatureConfigQuery, AnalysisType, useCreateAnalysisFastMutation, useViewerTeamRoleQuery } from 'generated/graphql'
import { useApolloData, createValueContext, useValueContext, usePortal } from 'hooks/common'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { Localized, I18nItem } from 'i18n'
import { ClickN } from 'components/ClickN'
import { useSwitchExperiment } from 'utils/isExperiment'
import styled from '@emotion/styled/macro'
import { RoleGate, LoginGate, Perms } from 'components/PermissionGate'
import { useOperation } from './Operation'
import { ConfigProvider, ReportConfigProvider } from 'components/Config'
import { useModalFooter } from 'pages/template/table/Operation'
import { useRefetch } from 'pages/template/table/ActionTable'
import { useError } from 'hooks/useError'
import { useInput } from 'hooks/useInput'
import { PickProject } from 'components/PickProject'
import { PickTeam, TeamValue } from 'components/PickTeam'
import { generateLink, Pattern } from 'route'
import { useTeamId } from 'pages/dashboard/Dashboard'
// import { ExpireContext } from 'pages/index/Patent'
import { AnalysisTypeItem } from 'components/AnalysisTypeItem'
import logoImage from '../../image/logo.png'

const { Header } = Layout
// const ExperimentBanner = styled.div`
//   font-style: italic;
//   font-size: 200px;
//   font-weight: 900;
// `
// const Banner = styled.div`
//   font-style: italic;
//   font-size: 20px;
//   font-weight: 900;
// `
const PageLayout = styled(Layout)`
  .tea-nav {
    overflow: hidden;
  }
`

// const NavButton = styled(Button)`
//   color: #BBB !important;
//   padding: 0 15px;
//   :focus {
//     color: #BBB;
//     transition: none;
//     background-color: transparent;
//   }
//   :hover, :active {
//     color: #3d91ff;
//     transition: none;
//     background-color: transparent;
//   }
//   i {
//     vertical-align: -3px;
//   }
// `

const LoginItem: React.FC<{ overlay: React.ReactElement }> = ({ overlay }) => {
  const renderViewer = (username: string) => {
    return <NavMenu.Item
      type='dropdown'
      overlay={overlay}
    >{username}</NavMenu.Item>
  }
  const renderLogin = () => {
    return <>
      <NavMenu.Item><Link to='/login'><Localized id='login' /></Link></NavMenu.Item>
    </>
  }
  return useApolloData(useViewerQuery(), data => {
    if (data.viewer) {
      return renderViewer(data.viewer.username)
    } else {
      return renderLogin()
    }
  }, () => {
    return renderLogin()
  })
}

const RightPortal = createValueContext<React.ReactNode>(undefined)
const LeftPortal = createValueContext<React.ReactNode>(undefined)

export const IndexLeft: React.FC = (p) => usePortal(LeftPortal, p)
export const IndexRight: React.FC = (p) => usePortal(RightPortal, p)

export const NavItem: React.FC<{
  id: string
  perm?: Perms
}> = ({ id, perm }) => {
  const { pathname } = useLocation()
  const to = `/${id}/`

  return <RoleGate key={id} perm={perm}>
    <NavMenu.Item selected={pathname.startsWith(to)}>
      <Link to={to}><Localized id={`nav-${id}`} /></Link>
    </NavMenu.Item>
  </RoleGate>
}

const DefaultLeft = <>
  <LoginGate>
    {/* <NavItem id='dashboard' /> */}
    {/* <NavItem id='complianceTesting' /> */}
    {/* <NavItem id='complianceTesting/studio' /> */}
    {/* <NavMenu.Item>
      <Link to={'/complianceTesting/studio/'}><Localized id={'nav-studio'} /></Link>
    </NavMenu.Item> */}
    {/* <NavItem id='management' perm={UserPermission.ManagementReadable} /> */}
  </LoginGate>
</>

const useFastAnalysisModal = () => {
  const [visible, setVisible] = useState(false)
  const close = () => setVisible(false)
  const refetch = useRefetch()
  return {
    setVisible,
    modal: <Modal visible={visible} onClose={() => setVisible(false)} caption={<Localized id='quick-analysis' />}>
      <FastAnalysisDialog close={close} refetch={refetch} />
    </Modal>
  }
}

const FastAnalysisDialog: React.FC<{ close: () => void, refetch: () => void }> = ({ close, refetch }) => {
  const [form, params] = useFastAnalysisForm()
  const [error, { checkError }] = useError()
  const history = useHistory()

  const [newAnalysis] = useCreateAnalysisFastMutation()
  const onOk = useMemo(() => checkError(async () => {
    await newAnalysis({
      variables: {
        teamId: params.teamId ?? '',
        input: {
          name: params.analysisName,
          projectID: params.newProject ? null : params.existProject,
          description: params.analysisNote,
          createProject: params.newProject ? {
            name: params.projectName,
            description: params.projectNote
          } : null,
          analysisType: params.analysisType!,
        }
      }
    })
    refetch()
    close()
    history.push(generateLink(Pattern.Analysis, {
      team: params.teamName ?? '',
      project: params.projectName,
      analysis: params.analysisName
    }))
  }), [refetch, close, params, checkError, history, newAnalysis])
  const disabled: boolean = params.teamId === '' ||
    params.analysisName === '' ||
    (params.newProject ? params.projectName === '' : params.existProject === '') ||
    (params.projectName !== '' && !params.analysisType)

  const footer = useModalFooter({
    onOk,
    close,
    disabled
  })

  return <>
    <Modal.Body>
      {error}
      {form}
    </Modal.Body>
    {footer}
  </>
}

const Gap = styled.div`
  margin-top: 15px;
`

const FormContainer = styled.div`
  min-height: 300px;
`

const useFastAnalysisForm = () => {
  const [teamVal] = useInput<TeamValue>(useTeamId())
  const result = useViewerTeamRoleQuery({
    variables: {
      teamId: teamVal.value.teamId
    },
    skip: teamVal.value.teamId === ''
  })

  const [newProject] = useInput('new')
  const [projectName] = useInput('')
  const [projectNote] = useInput('')
  const [existProject] = useInput('')
  const [analysisName] = useInput('')
  const [analysisNote] = useInput('')
  const [analysisType] = useInput<AnalysisType | undefined>(undefined)

  const downForm = <>
    <Form><Form.Title><Localized id='column-project' /></Form.Title></Form>
    <RadioGroup {...newProject} layout='inline'>
      <Radio name='new'><Localized id='column-newProject' /></Radio>
      <Radio name='exist'><Localized id='column-existProject' /></Radio>
    </RadioGroup>
    <Gap />
    <Form>
      {newProject.value === 'new' && <>
        <Form.Item label={<Localized id='column-projectName' />} required>
          <Input {...projectName} />
        </Form.Item>
        <Form.Item label={<Localized id='column-projectNote' />}>
          <Input {...projectNote} />
        </Form.Item>
      </>}
      {newProject.value === 'exist' && <><Form.Item label={<Localized id='column-exist-project-name' />} required>
        <PickProject {...existProject} teamId={teamVal.value?.teamId ?? ''} onProjectName={projectName.onChange} />
      </Form.Item></>}
      <Form.Title><Localized id='column-analysis' /></Form.Title>
      <Form.Item label={<Localized id='column-analysisName' />} required>
        <Input {...analysisName} />
      </Form.Item>
      <Form.Item label={<Localized id='column-analysisNote' />} >
        <Input {...analysisNote} />
      </Form.Item>
      <AnalysisTypeItem {...analysisType} />
    </Form>
  </>

  const afterSelectTeam = useApolloData(result, (data) => {
    const curPerm = [...data?.viewer?.teamRole?.permissions ?? []]
    const hasPermission = curPerm.some(p => p === UserPermission.TeamProjectWriteable)
    const chooseTeam = teamVal.value.teamId !== ''
    if (chooseTeam && !hasPermission) {
      return <><Gap /><Text theme='danger' reset><Localized id='error-no-team-permission' /></Text></>
    }
    if (hasPermission) {
      return downForm
    }
    return <></>
  })
  const wrapper = result.loading ? <FormContainer>{afterSelectTeam}</FormContainer> : afterSelectTeam

  return [<><Form>
    <Form.Title><Localized id='column-team' /></Form.Title>
    <Form.Item label={<Localized id='choose-team' />} required>
      <PickTeam {...teamVal} />
    </Form.Item>
  </Form>
    {!teamVal && <><Gap /><Text theme='danger' reset><Localized id='error-noTeam' /></Text></>}
    {wrapper}
  </>, {
    teamId: teamVal.value?.teamId,
    teamName: teamVal.value?.teamName,
    newProject: newProject.value === 'new',
    projectName: projectName.value,
    projectNote: projectNote.value,
    existProject: existProject.value,
    analysisName: analysisName.value,
    analysisNote: analysisNote.value,
    analysisType: analysisType.value
  }] as const
}

export const Page: React.FC = ({ children }) => {
  const switchExperiment = useSwitchExperiment()
  const [leftProvider, left] = useValueContext<React.ReactNode>(undefined)
  const [rightProvider, right] = useValueContext<React.ReactNode>(undefined)
  const { overlay, modal } = useOperation()
  const { data: configData } = useFeatureConfigQuery()
  const { modal: analysisModal } = useFastAnalysisModal()
  // const isLicenseExpired = useContext(ExpireContext)
  // const isDisabled = isLicenseExpired

  return <>
    <ReportConfigProvider value={configData?.reportFeature}>
      <ConfigProvider value={configData?.feature}>
        <PageLayout>
          <Header>
            <NavMenu
              style={{background:'#242424'}}
              left={
                <>
                  <NavMenu.Item>
                    <ClickN count={5} onClick={switchExperiment}>
                      <Link to='/'>
                        {/* {isExperiment() ? <ExperimentBanner><Localized id='banner-title' /></ExperimentBanner> : <Banner><Localized id='banner-title' /></Banner>} */}
                        {/* {<Icon type="viewgrid" />} */}
                        <img alt="" style={{marginTop:20,height:35}} src={logoImage}></img>
                      </Link>
                    </ClickN>
                  </NavMenu.Item>
                  {left || DefaultLeft}
                </>
              }
              right={
                <>
                  {right}
                  <LoginGate>
                    {/* <NavMenu.Item>
                      <NavButton type='text' onClick={(() => setVisible(true))} disabled={isDisabled}><Icon type='plus' /><Localized id='quick-analysis' /></NavButton>
                    </NavMenu.Item> */}
                    {/* <NavMenu.Item>
                      <Link to='/documentation/'><Localized id='documentation' /></Link>
                    </NavMenu.Item> */}
                  </LoginGate>
                  <I18nItem />
                  <LoginItem overlay={overlay} />
                </>
              }
            />
            {analysisModal}
            {modal}
          </Header>
          <LeftPortal.Provider value={leftProvider}>
            <RightPortal.Provider value={rightProvider}>
              {children}
            </RightPortal.Provider>
          </LeftPortal.Provider>
        </PageLayout>
      </ConfigProvider>
    </ReportConfigProvider>
  </>
}
