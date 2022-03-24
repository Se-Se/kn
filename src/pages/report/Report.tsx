import React from 'react'
import { useApolloData } from 'hooks/common'
import { useReportQuery, CheckItemFragment } from 'generated/graphql'
import { useRouteMatch } from 'react-router-dom'
import { useGqlLanguage, Localized } from 'i18n'
import { ShowError } from 'components/ShowError'
import { SysReport } from './sys/Report'
import { ApkReport } from './apk/Report'
import { LinkItem } from 'components/LinkItem'
import { AnalysisCtxProvider, useReportLink } from './context'
import { ReportDrawer } from 'components/Drawer'

export type TypedAudits = Record<'baseline' | 'customized', CheckItemFragment[] | null>

export interface AnalysisMatch {
  team: string
  project: string
  analysis: string
  page?: string
  tab?: string
}
export const DetailMenu: React.FC<{
  id: string,
  title?: string
  titleId?: string
  icon?: string
}> = ({ id, title, titleId, icon }) => {
  const reportLink = useReportLink()

  return <LinkItem
    title={
      title ?? <Localized id={titleId || `detail-title-${id}`}>{id}</Localized>
    }
    to={reportLink({ page: id })}
    icon={icon}
  />
}

export interface AnalysisMatch {
  team: string
  project: string
  analysis: string
  page?: string
  tab?: string
}

export const Page: React.FC = () => {
  const { params: {
    team: teamName,
    project: projectName,
    analysis: analysisName,
  } } = useRouteMatch<AnalysisMatch>()
  const { language } = useGqlLanguage()
  return useApolloData(useReportQuery({
    variables: {
      teamName,
      projectName,
      analysisName,
      language,
    }
  }), data => {
    const analysis = data.team?.project?.analysis
    return data.team?.project?.analysis && analysis ?
      <AnalysisCtxProvider value={{
        teamId: data.team.id,
        projectId: data.team.project.id,
        analysisId: analysis.id,
        teamName,
        projectName,
        analysisName,
        // TODO remove any
        reportId: (analysis.report as any).id,
      }}>
        <ReportDrawer>
          {analysis.report.__typename === 'SysReport' && <SysReport analysis={analysis} />}
          {analysis.report.__typename === 'ApkReport' && <ApkReport analysis={analysis} />}
        </ReportDrawer>
      </AnalysisCtxProvider> : <ShowError error='error-404' />
  })
}
