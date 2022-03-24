import React from 'react'
import { Switch, Redirect, Route, generatePath, useLocation } from 'react-router-dom'
import { RoutePage } from 'components/LoadPage'
import { useViewerQuery } from 'generated/graphql'
import { useApolloData } from 'hooks/common'

export enum Pattern {
  Report = '/report/:team/:project/:analysis/report/:page?/:tab?',

  Team = '/dashboard/team/:team?/',
  ProjectList = '/dashboard/project/:team?/',
  TeamManagement = '/dashboard/team/:team/management',
  TeamTask = '/dashboard/team/:team/task',
  Project = '/dashboard/project/:team?/:project/',
  Analysis = '/dashboard/project/:team?/:project/:analysis/',
  Collector = '/dashboard/project/:team?/:project/:analysis/:collector/',
  DashboardOverview = '/dashboard/overview/',

  ManagementTeam = '/management/team',
  ManagementTeamUser = '/management/team/:teamId',
  Documentation = '/documentation/:path*',
  Entry = '/entry',
  ComplianceTesting = '/lingshu/complianceTesting',
  ComplianceTestingOverview = '/lingshu/complianceTesting/overview',
  ComplianceTestingProject = '/lingshu/complianceTesting/project',
  ComplianceTestingProjectDetail = '/lingshu/complianceTesting/project/detail/:projectId?',
  ComplianceTestingToolDetail = '/lingshu/complianceTesting/project/tool/detail/:projectId?/:toolId?',
  ComplianceTestingCaseDetail = '/lingshu/complianceTesting/project/case/detail/:projectId?/:caseId?',
  ComplianceTestingCaseWorkFlow = '/lingshu/complianceTesting/project/case/workFlow/:projectId?/:caseId?',
  ComplianceTestingCaseTaskFlow = '/lingshu/complianceTestingCenter/studio/taskFlow/:projectId?/:caseId?/:lawCatalogueId?',
  ComplianceTestingConfigLaw = '/lingshu/complianceTesting/config/law',
  ComplianceTestingConfigCarModule = '/lingshu/complianceTesting/config/carModule',
  ComplianceTestingStudio='/lingshu/complianceTesting/studio',
  ComplianceTestingProjectOverView='/lingshu/complianceTestingCenter/projectOverView/:projectId?',
  ComplianceTestingCarModel='/lingshu/complianceTesting/carModel/Manage',
  ComplianceTestingCarModelDetail='/lingshu/complianceTesting/carModel/detail',
  ComplianceTestingLawManage='/lingshu/complianceTesting/law',
  ComplianceTestingSuiteManage='/lingshu/complianceTesting/suite/',
  ComplianceTestingCaseManage='/lingshu/complianceTesting/case/',
  ComplianceTestingUserManage='/lingshu/complianceTesting/user/',
  ComplianceTestingTeamManage='/lingshu/complianceTesting/team/',
  // ComplianceTestingDashBoard='/complianceTesting/dashboard/',
  ComplianceTestingCase='/complianceTesting/case/caseDetail/:caseId?',

  //

  Root='/lingshu/',

  DashBoard='/lingshu/dashboard/',
  ComplianceTestingCenter='/lingshu/complianceTestingCenter/',
  CaseManage='/lingshu/caseManage/case/',
  CaseDetail='/lingshu/caseManage/case/caseDetail/:caseId?',
  ProjectReport='/lingshu/complianceTestingCenter/ProjectReport/:caseId?/:projectId?',
  SuitManage='/lingshu/caseManage/suite/',
  ComplianceTestingLawDetail='/lingshu/caseManage/suite/lawdetail/:suiteId?',
  ComplianceTestingSuiteDetail='/lingshu/caseManage/suite/suiteDetail/:suiteId/',

  SoftWareManage='/lingshu/assetsManage/softwareManage',
  SoftWareDetail='/lingshu/assetsManage/softwareManage/softwareDetail/:softwarweId',
  ThirdPartDetail='/lingshu/assetsManage/softwareManage/thirdPartsDetail/:thirdPartDetailId',
  FirmDetail='/lingshu/assetsManage/softwareManage/firmDetail/:firmId?',
  EncryptionkeyDetail='/lingshu/assetsManage/softwareManage/encryptionkeyDetail/:encryptionKeyId?',
  CertificateDetail='/lingshu/assetsManage/softwareManage/certificateDetail/:certificateId?',
  AppServer='/lingshu/assetsManage/softwareManage/appserverDetail/:appserverId?',
  LogsFile = '/lingshu/assetsManage/softwareManage/logsFileDetail/:logsFileId?',
  configDetail = '/lingshu/assetsManage/softwareManage/configDetail/:configId?',
  HardWareManage='/lingshu/assetsManage/hardwareManage',
  HardWareDetail='/lingshu/assetsManage/hardwareManage/hardwareDetail/:hardwareId?',
  CarModelManage='/lingshu/assetsManage/carModelManage',
  CarDisplay='/lingshu/assetsManage/carDisplay',
  ComponentManage='/lingshu/assetsManage/componentManage',
  ComponentECUDetail='/lingshu/assetsManage/componentManage/ECUDetail/:componentId',
  ComponentCloudDetail='/lingshu/assetsManage/componentManage/cloudDetail/:componentId',
  ComponentMobleDetail='/lingshu/assetsManage/componentManage/mobleDetail/:componentId',
  SystemManage='/lingshu/assetsManage/systemManage',
  SystemDetail='/lingshu/assetsManage/systemManage/systemDetail/:systemId?',
  AppDetail='/lingshu/assetsManage/systemManage/appDetail/:systemId?',
  ApiDetail='/lingshu/assetsManage/systemManage/apiDetail/:systemId?',

  BugManage='/lingshu/assetsManage/bugManage',
  UserManage='/lingshu/userManage'

}
export type ParamType = {
  [Pattern.Report]: {
    team: string
    project: string
    analysis: string
    page?: string
    tab?: string
  }
  [Pattern.Team]: {
    team: string
  }
  [Pattern.ProjectList]: {
    team: string
  }
  [Pattern.Project]: {
    team?: string
    project?: string
  }
  [Pattern.Analysis]: {
    team: string
    project: string
    analysis: string
  }
  [Pattern.Collector]: {
    team: string
    project: string
    analysis: string
    collector: string
  }
  [Pattern.TeamManagement]: {
    team: string
  }
  [Pattern.TeamTask]: {
    team: string
  }
  [Pattern.ManagementTeam]: {}
  [Pattern.ManagementTeamUser]: {
    teamId: string
  }
  [Pattern.Documentation]: {
    path: string
  }
  [Pattern.Entry]: {
    path: string
  }
  [Pattern.ComplianceTesting]: {
    path: string
  }
  [Pattern.ComplianceTestingProject]: {
    path: string
  }
  [Pattern.ComplianceTestingProjectDetail]: {
    projectId: string
  }
  [Pattern.ComplianceTestingConfigLaw]: {
    path: string
  }
  [Pattern.ComplianceTestingConfigCarModule]: {
    path: string
  }
  [Pattern.ComplianceTestingToolDetail]:{
    toolId: string
    projectId: string
  }
  [Pattern.ComplianceTestingCaseDetail]:{
    caseId:string
    projectId: string
  }
  [Pattern.ComplianceTestingCaseWorkFlow]:{
    caseId:string
    projectId: string
  }
  [Pattern.ComplianceTestingStudio]:{}
  [Pattern.ComplianceTestingProjectOverView]:{
    projectId: string
  }
  [Pattern.ComplianceTestingCaseTaskFlow]:{
    caseId:string
    projectId: string
  }
  [Pattern.ComplianceTestingCarModel]:{
    path:string
  }
  [Pattern.ComplianceTestingCarModelDetail]:{
    path:string
  }
  [Pattern.ComplianceTestingLawManage]:{
    path:string
  }
  [Pattern.ComplianceTestingLawDetail]:{
    suiteId:string
  }
  [Pattern.ComplianceTestingSuiteManage]:{
    path:string
  }
  [Pattern.ComplianceTestingSuiteDetail]:{
    suiteId:string
  }
  [Pattern.ComplianceTestingUserManage]:{
    suiteId:string
  }
  [Pattern.ComplianceTestingTeamManage]:{
    suiteId:string
  }
  [Pattern.DashBoard]:{
    suiteId:string
  }
  [Pattern.ComplianceTestingCase]:{
    caseId:string
  }
  [Pattern.CaseDetail]:{
    caseId:string
  }
  [Pattern.ProjectReport]:{
    caseId:string
    projectId: string
  }
}
export function generateLink<T extends keyof ParamType>(pattern: T, params?: ParamType[T], suffixSlash: boolean = true) {
  try {
    // @ts-ignore
    const r = generatePath(pattern, params)
    return r.endsWith('/') ? r : `${r}/`
  } catch (e) {
    console.error(e)
    return '/'
  }
}

const RequireLogin: React.FC = ({ children }) => {
  const location = useLocation()
  const redir = <Redirect to={{
    pathname: '/login',
    search: `?${location.pathname}`,
  }} />
  return useApolloData(useViewerQuery(), (data) => {
    return data.viewer ? <>{children}</> : redir
  }, e => redir)
}

export const Routes: React.FC = () => {
  return (
    <Switch>
      <RoutePage path='/' page={import('pages/index/')}>
        <Switch>
          <RoutePage exact path='/' page={import('pages/deliverManage/Layout')}>
            <Redirect to='/lingshu/dashboard/' />
          </RoutePage>
          <RoutePage exact path={Pattern.Entry} page={import('pages/entry/entry')}/>
          <RoutePage path={Pattern.Root} page={import('pages/deliverManage/Layout')}>
            {/* <Route exact path={Pattern.DashBoard}><Redirect to={Pattern.DashBoard} /></Route> */}
            <Switch>
            <RoutePage exact path={Pattern.ComplianceTestingOverview} page={import('pages/complianceTesting/overView/Overview')} />
              <RoutePage exact path={Pattern.ComplianceTestingProject} page={import('pages/complianceTesting/project/Project')} />
              <RoutePage exact path={Pattern.ComplianceTestingProjectDetail} page={import('pages/complianceTesting/project/ProjectDetail')} />
              <RoutePage exact path={Pattern.ComplianceTestingToolDetail} page={import('pages/complianceTesting/project/ToolDetail')} />
              <RoutePage exact path={Pattern.ComplianceTestingCaseDetail} page={import('pages/complianceTesting/project/CaseDetail')} />
              <RoutePage exact path={Pattern.ComplianceTestingConfigLaw} page={import('pages/complianceTesting/config/law')} />
              <RoutePage exact path={Pattern.ComplianceTestingConfigCarModule} page={import('pages/complianceTesting/config/carModule')} />
              <RoutePage exact path={Pattern.ComplianceTestingCaseWorkFlow} page={import('pages/complianceTesting/case/workFlow')} />
              <RoutePage exact path={Pattern.ComplianceTestingCaseTaskFlow} page={import('pages/complianceTesting/case/taskFlow_td')} />
              {/* <RoutePage exact path={Pattern.ComplianceTestingStudio} page={import('pages/complianceTesting/studio/studio')} /> */}
              <RoutePage exact path={Pattern.ComplianceTestingProjectOverView} page={import('pages/complianceTesting/project/projectOverveiew_td')} />
              <RoutePage exact path={Pattern.ComplianceTestingCarModel} page={import('pages/complianceTesting/carModel/carModelManage')} />
              <RoutePage exact path={Pattern.ComplianceTestingLawManage} page={import('pages/complianceTesting/LawManage/lawManage')} />
              <RoutePage exact path={Pattern.ComplianceTestingLawDetail} page={import('pages/complianceTesting/LawManage/lawDetailList')} />
              <RoutePage exact path={Pattern.ComplianceTestingSuiteManage} page={import('pages/complianceTesting/suite/suiteManage')} />
              <RoutePage exact path={Pattern.ComplianceTestingCaseManage} page={import('pages/complianceTesting/suite/caseManage')} />
              <RoutePage exact path={Pattern.ComplianceTestingSuiteDetail} page={import('pages/complianceTesting/suite/caseList')} />
              <RoutePage exact path={Pattern.ComplianceTestingUserManage} page={import('pages/management/user')} />
              <RoutePage exact path={Pattern.ComplianceTestingTeamManage} page={import('pages/management/team')} />
              <RoutePage exact path={Pattern.ComplianceTestingCase} page={import('pages/complianceTesting/suite/caseDetail')} />

              <RoutePage exact path={Pattern.DashBoard} page={import('pages/complianceTesting/dashboard/dashboard')}/>
              <RoutePage exact path={Pattern.ComplianceTestingCenter} page={import('pages/complianceTesting/studio/studio')} />
              <RoutePage exact path={Pattern.CaseManage} page={import('pages/complianceTesting/suite/caseManage')} />
              <RoutePage exact path={Pattern.CaseDetail} page={import('pages/complianceTesting/suite/caseDetail')} />
              <RoutePage exact path={Pattern.ProjectReport} page={import('pages/complianceTesting/project/projectReport')} />
              <RoutePage exact path={Pattern.SuitManage} page={import('pages/complianceTesting/suite/suiteManage')} />
              {/* <RoutePage exact path={Pattern.CarModelManage} page={import('pages/complianceTesting/carModel/carModelManage')} /> */}

              <RoutePage exact path={Pattern.SoftWareManage} page={import('pages/deliverManage/assetManage/softwareManage')} />
              <RoutePage exact path={Pattern.SoftWareDetail} page={import('pages/deliverManage/assetManage/softwareManage/softDetail')} />
              <RoutePage exact path={Pattern.ThirdPartDetail} page={import('pages/deliverManage/assetManage/softwareManage/components/thirdParts/thirdPartsDetail')} />
              <RoutePage exact path={Pattern.FirmDetail} page={import('pages/deliverManage/assetManage/softwareManage/components/firmware/firmDetail')} />
              <RoutePage exact path={Pattern.EncryptionkeyDetail} page={import('pages/deliverManage/assetManage/softwareManage/components/encryptionkey/encryptionkeyDetail')} />
              <RoutePage exact path={Pattern.CertificateDetail} page={import('pages/deliverManage/assetManage/softwareManage/components/certificate/certificateDetail')} />
              <RoutePage exact path={Pattern.AppServer} page={import('pages/deliverManage/assetManage/softwareManage/components/appServer/appServerDetail')} />
              <RoutePage exact path={Pattern.LogsFile} page={import('pages/deliverManage/assetManage/softwareManage/components/logfiles/logsFileDetail')} />
              <RoutePage exact path={Pattern.configDetail} page={import('pages/deliverManage/assetManage/softwareManage/components/configuration/configurationDetail')} />
              
              <RoutePage exact path={Pattern.HardWareManage} page={import('pages/deliverManage/assetManage/hardwareManage')} />
              <RoutePage exact path={Pattern.HardWareDetail} page={import('pages/deliverManage/assetManage/hardwareManage/hardwareDetail')} />

              <RoutePage exact path={Pattern.CarDisplay} page={import('pages/deliverManage/assetManage/carDisplay')} />
              <RoutePage exact path={Pattern.ComponentManage} page={import('pages/deliverManage/assetManage/componentsManage')} />
              <RoutePage exact path={Pattern.ComponentECUDetail} page={import('pages/deliverManage/assetManage/componentsManage/ECUDetail')} />
              <RoutePage exact path={Pattern.ComponentCloudDetail} page={import('pages/deliverManage/assetManage/componentsManage/cloudDetail')} />
              <RoutePage exact path={Pattern.ComponentMobleDetail} page={import('pages/deliverManage/assetManage/componentsManage/mobleDetail')} />
              
              <RoutePage exact path={Pattern.SystemManage} page={import('pages/deliverManage/assetManage/systemManage')} />
              <RoutePage exact path={Pattern.SystemDetail} page={import('pages/deliverManage/assetManage/systemManage/system/systemDetail')} />
              <RoutePage exact path={Pattern.AppDetail} page={import('pages/deliverManage/assetManage/systemManage/appTab/appDetail')} />
              <RoutePage exact path={Pattern.ApiDetail} page={import('pages/deliverManage/assetManage/systemManage/apiTab/apiDetail')} />
              <RoutePage exact path={Pattern.CarModelManage} page={import('pages/deliverManage/assetManage/carModalManage')} />

              <RoutePage exact path={Pattern.BugManage} page={import('pages/deliverManage/assetManage/bugManage')} />
              <RoutePage exact path={Pattern.UserManage} page={import('pages/management/user')} />

            </Switch>
          </RoutePage>
          <RoutePage path='/documentation/:path*' page={import('pages/documentation/')} />
          <RoutePage path='/management/' page={import('pages/management')}>
            <Switch>
              <Route exact path='/management/'><Redirect to='/management/status/' /></Route>
              <RoutePage exact path='/management/status' page={import('pages/management/status')} />
              <RoutePage exact path='/management/user' page={import('pages/management/user')} />
              <RoutePage exact path={Pattern.ManagementTeam} page={import('pages/management/team')} />
              <RoutePage exact path={Pattern.ManagementTeamUser} page={import('pages/management/team/TeamUser')} />
              <RoutePage exact path='/management/project' page={import('pages/management/project')} />
              <RoutePage exact path='/management/project/:projectId' page={import('pages/management/project/Analysis')} />
              <RoutePage exact path='/management/log' page={import('pages/management/log/Log')} />
              <RoutePage exact path='/management/license' page={import('pages/management/license')} />
              <RoutePage exact path='/management/agent' page={import('pages/management/agent')} />
              <RoutePage exact path='/management/task' page={import('pages/management/task')} />
              <RoutePage exact path='/management/settings/system' page={import('pages/management/settings/system')} />
              <RoutePage exact path='/management/settings/sso' page={import('pages/management/settings/sso')} />
            </Switch>
          </RoutePage>
          <RoutePage exact path='/login' page={import('pages/login/Login')} />
          {process.env.NODE_ENV === 'development' && <RoutePage exact path='/test' page={import('pages/test')} />}
        </Switch>
      </RoutePage>
    </Switch>
  )
}
