import styled from '@emotion/styled/macro'
import React from 'react'
import { Layout } from '@tencent/tea-component'
import { CheckItemFragment, SysReportAnalysisFragment } from 'generated/graphql'
import { useRouteMatch, Redirect, useLocation } from 'react-router-dom'
import { Localized } from 'i18n'
import { useProjectDetailRoute } from './route'
import { LeftMenu } from './LeftMenu'
import { getSysReport, State } from 'pages/report/common'
import { AnalysisMatch } from '../Report'
import { useReportLink } from '../context'

export type TypedAudits = Record<'baseline' | 'customized', CheckItemFragment[] | null>

const { Sider, Content, Body } = Layout

// The height of Sider in Body is fixed in tea. Here is the workaround
const FixedBody = styled(Body)`
  .tea-menu__submenu .tea-menu__list .tea-menu__item {
    height: initial !important;
  }
`

const DefaultId = 'overview'
export const CustomizedPrefix = 'Customized '

export const SysReport: React.FC<{ analysis: SysReportAnalysisFragment }> = ({ analysis }) => {
  const audits: TypedAudits = {
    baseline: getSysReport(analysis)?.baselineAudit!,
    customized: getSysReport(analysis)?.customizedAudit!.map(i => ({
      ...i,
      key: CustomizedPrefix + i.key,
    }))!,
  }
  const reportLink = useReportLink()
  const analysisType = analysis.analysisType
  const projectDetailRoute = useProjectDetailRoute(analysisType, audits)
  const { params: { page } } = useRouteMatch<AnalysisMatch>()
  const RouteList = projectDetailRoute.filter(i => i[1]).map(i => i[1]!.children).flat()
  const curListItem = RouteList.find(i => i.id === page)
  const defCategory = projectDetailRoute.find(([key]) => key === DefaultId)![1]
  const { state } = useLocation<State | undefined>()
  return <>
    <FixedBody>
      <Sider>
        <LeftMenu analysisType={analysisType} defaultId={DefaultId} audits={audits} />
      </Sider>
      <Content>
        {!page && defCategory && <Redirect to={reportLink({ page: DefaultId, tab: defCategory.children[0].id })} />}
        {curListItem ? <>
          <Content.Header
            title={<Localized id={curListItem.title ?? `detail-title-${curListItem.id}`} />}
          />
          <Content.Body>
            <curListItem.component
              key={`${curListItem.id}-${state?.action}-${state?.position}`}
              analysis={analysis}
            />
          </Content.Body>
        </> : undefined
        }
      </Content>
    </FixedBody>
  </>
}
