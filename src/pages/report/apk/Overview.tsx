import React from 'react'
import { Card, Button, Row, Col, MetricsBoard } from '@tencent/tea-component'
import { Localized, useGqlLanguage } from 'i18n'
import { useHistory } from 'react-router-dom'
import { useReportLink, useAnalysisCtx, useAnalysisId } from '../context'
import { SearchableKVTable, useI18nKVRecords } from 'pages/report/common/render'
import { useApolloData } from 'hooks/common'
import { useApkOverviewQuery } from 'generated/graphql'
import { getApkReport } from 'pages/report/common'
import { useGetRiskMessage, RiskColors } from 'components/RiskField'

export const Overview: React.FC = () => {
  const id = useAnalysisId()
  const reportLink = useReportLink()
  const history = useHistory()
  const getRecords = useI18nKVRecords()
  const { projectName, analysisName } = useAnalysisCtx()
  const lang = useGqlLanguage()
  const getRiskMessage = useGetRiskMessage()

  const info = useApolloData(useApkOverviewQuery({
    variables: {
      id
    }
  }), data => {
    const report = getApkReport(data.analysis)
    if (!report) {
      return <>Failed to get apk report</>
    }
    return <>
      <SearchableKVTable records={getRecords({
        projectName,
        analysisName,
        packageName: report.manifest.packageName,
        version: report.manifest.version,
        md5: report.manifest.md5,
      })} />
    </>
  })
  const statistics = useApolloData(useApkOverviewQuery({
    variables: {
      ...lang,
      id
    }
  }), data => {
    const report = getApkReport(data.analysis)
    if (!report) {
      return <>Failed to get apk report</>
    }
    const { baseline } = report.overview
    return <>
      <Row showSplitLine>
        {baseline?.map(({ risk, count }) => <Col key={risk}>
          <MetricsBoard
            onClick={() => history.push(reportLink({
              page: 'apkRisk',
              tab: risk
            }))}
            title={getRiskMessage(risk)}
            value={<span style={{ color: RiskColors[risk] }}>{count}</span>}
          />
        </Col>
        )}
      </Row>
    </>
  })

  return <>
    <Card>
      <Card.Body
        title={<Localized id='apk-info' />}
        operation={
          <Button type='link' onClick={() => history.push(reportLink({ page: 'signature' }))}><Localized id='apk-detail-report' /></Button>
        }
      >
        {info}
      </Card.Body>
    </Card>
    <Card>
      <Card.Body
        title={<Localized id='apk-statistics' />}
      >
        {statistics}
      </Card.Body>
    </Card>
  </>
}
