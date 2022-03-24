import React from 'react'
import { Link } from 'react-router-dom'
import { generateLink, Pattern, ParamType } from 'route'

export const teamLink = (params: ParamType[Pattern.Team]) => generateLink(Pattern.Team, params)
export const reportLink = (params: ParamType[Pattern.Report]) => generateLink(Pattern.Report, params)
export const projectLink = (params: ParamType[Pattern.Project]) => generateLink(Pattern.Project, params)
export const projectListLink = (params: ParamType[Pattern.ProjectList]) => generateLink(Pattern.ProjectList, params)
export const analysisLink = (params: ParamType[Pattern.Analysis]) => generateLink(Pattern.Analysis, params)
export const collectorLink = (params: ParamType[Pattern.Collector]) => generateLink(Pattern.Collector, params)
export const managementTeamLink = (params: ParamType[Pattern.ManagementTeam]) => generateLink(Pattern.ManagementTeam, params)
export const managementTeamUserLink = (params: ParamType[Pattern.ManagementTeamUser]) => generateLink(Pattern.ManagementTeamUser, params)

export const TeamLink: React.FC<ParamType[Pattern.Team]> = ({ children, team }) => {
  return <Link to={{
    pathname: teamLink({ team }),
    state: {
      team
    }
  }}>{children ?? team}</Link>
}

export const ReportLink: React.FC<ParamType[Pattern.Report]> = ({ children, ...rest }) => {
  const url = reportLink(rest)
  return <Link target='_blank' to={url}>{children ?? rest.analysis}</Link>
}

export const ProjectLink: React.FC<ParamType[Pattern.Project]> = ({ children, ...rest }) => {
  const url = projectLink(rest)
  return <Link to={url}>{children ?? rest.project}</Link>
}

export const ProjectListLink: React.FC<ParamType[Pattern.ProjectList]> = ({ children, ...rest }) => {
  const url = projectListLink(rest)
  return <Link to={url}>{children ?? rest.team}</Link>
}

export const AnalysisLink: React.FC<ParamType[Pattern.Analysis]> = ({ children, ...rest }) => {
  return <Link to={analysisLink(rest)}>{children ?? rest.analysis}</Link>
}

export const CollectorLink: React.FC<ParamType[Pattern.Collector]> = ({ children, ...rest }) => {
  return <Link to={collectorLink(rest)}>{children ?? rest.collector}</Link>
}

export const ManagementTeamLink: React.FC<ParamType[Pattern.ManagementTeam]> = ({ children, ...rest }) => {
  return <Link to={managementTeamLink(rest)}>{children}</Link>
}

export const ManagementTeamUserLink: React.FC<ParamType[Pattern.ManagementTeamUser]> = ({ children, ...rest }) => {
  return <Link to={managementTeamUserLink(rest)}>{children}</Link>
}
