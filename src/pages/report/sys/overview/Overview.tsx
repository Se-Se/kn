import React from 'react'
import { Card, Row, Col, MetricsBoard, Button, Justify } from '@tencent/tea-component'
import { useAnalysisId, useAnalysisCtx, useReportLink } from '../../context'
import { useApolloData } from 'hooks/common'
import { useReportOverviewQuery, CheckRisk, CvssRank, LicenseRisk, SysReportAnalysisFragment, AnalysisType } from 'generated/graphql'
import { getSysReport } from 'pages/report/common'
import { SearchableKVTable, useI18nKVRecords } from 'pages/report/common/render'
import { Localized, useGetMessage } from 'i18n'
import { useHistory } from 'react-router-dom'
import { useGetRiskMessage, RiskColors, RiskOrder, ShowRisk } from 'components/RiskField'
import { useBaselineLink, useCustomLink, useCveLink, useLicenseLink } from '../statistics/Statistics'
import { Dashboard } from 'components/Dashboard'
import { ExportIconActive } from 'pages/dashboard/project/Operation'
import { useRenderOperations } from 'pages/template/table/Operation'
import styled from '@emotion/styled/macro'
import { CVSSRankColor, LicenseRiskColors } from 'utils/color'
import { Annotation, BasicPie } from '@tencent/tea-chart'
import { useReportVariable } from 'components/Config'
import { Category, analysisTypeCategory } from 'components/AnalysisTypeItem'

const Gap = styled.div`
  height: 20px;
`

type OverviewProps = {
  analysis: SysReportAnalysisFragment,
}

const mayUndefined = <T extends any>(t: T): T | undefined => t

export const Overview: React.FC<OverviewProps> = ({ analysis }) => {
  const id = useAnalysisId()
  const { projectName, analysisName } = useAnalysisCtx()
  const reportLink = useReportLink()
  const history = useHistory()
  const getRecords = useI18nKVRecords()
  const getRiskMessage = useGetRiskMessage()
  const baselineLink = useBaselineLink()
  const cveLink = useCveLink()
  const licenseLink = useLicenseLink()
  const customLink = useCustomLink()
  const getMessage = useGetMessage()
  const renderOperations = useRenderOperations()
  const rightOps = renderOperations([ExportIconActive], {
    link: true, selected: [{ id } as any]
  })
  const isRtos = analysis.analysisType === AnalysisType.ArtifactRtos
  const isSystem = analysisTypeCategory(analysis.analysisType) === Category.System
  return useApolloData(useReportOverviewQuery({
    variables: {
      id,
      ...useReportVariable(),
    }
  }), data => {
    const report = getSysReport(data.analysis)
    if (!report) {
      return <>analysis assert error</>
    }
    const kernel = mayUndefined(report.system?.kernel)
    const { baseline, cve, license, custom, baselineSecureScore } = report.overview
    const cols = []

    if (baseline && isSystem && !isRtos) {
      const topRisk = RiskOrder.find(i => baseline.find(j => i === j.risk && j.count > 0)) ?? CheckRisk.Pass
      cols.push(
        <Col key='baseline' span={12}>
          <Card>
            <Card.Body
              title={<Localized id='project-baseline-statistics' />}
              operation={
                <Button type='link' onClick={() => history.push(reportLink({ page: 'baseline' }))}><Localized id='view-all' /></Button>
              }
            >
              <Row showSplitLine>
                <Col span={10}>
                  <Dashboard
                    color={RiskColors[topRisk]}
                    title={<Localized id={`enum-score-level-${topRisk}`} />}
                    value={baselineSecureScore!}
                  >{baselineSecureScore}</Dashboard>
                </Col>
                <Col>
                  <Row style={{ padding: '18px 0' }} showSplitLine>
                    {
                      baseline.filter(i => RiskOrder.includes(i.risk as ShowRisk))
                        .map(({ risk, count }) => <Col key={risk}>
                          <MetricsBoard
                            onClick={() => history.push(baselineLink(risk))}
                            title={getRiskMessage(risk)}
                            value={<span style={{ color: RiskColors[risk] }}>{count}</span>}
                          />
                        </Col>)
                    }
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      )
    }
    if (cve) {
      cols.push(
        <Col key='cve' span={12}>
          <Card>
            <Card.Body
              title={<Localized id='project-cve-statistics' />}
              operation={
                <Button type='link' onClick={() => history.push(reportLink({ page: 'cvesec' }))}><Localized id='see-detail' /></Button>
              }
            >
              <PieBoard items={cve.filter(i => [CvssRank.Critical, CvssRank.High, CvssRank.Medium, CvssRank.Low].includes(i.risk))
                .map(({ risk, count }) => ({
                  onClick: () => history.push(cveLink(), { cvssRank: risk }),
                  text: getMessage(`enum-cvss-rank-${risk}`),
                  color: CVSSRankColor[risk]!,
                  count,
                }))} />
            </Card.Body>
          </Card>
        </Col>
      )
    }
    if (license && !isSystem) {
      cols.push(
        <Col key='license' span={12}>
          <Card>
            <Card.Body
              title={<Localized id='project-license-statistics' />}
              operation={
                <Button type='link' onClick={() => history.push(reportLink({ page: 'license' }))}><Localized id='see-detail' /></Button>
              }
            >
              <PieBoard items={license.filter(i => [LicenseRisk.High, LicenseRisk.Middle, LicenseRisk.Low].includes(i.risk))
                .map(({ risk, count }) => ({
                  onClick: () => history.push(licenseLink(), { risk }),
                  text: getMessage(`enum-license-risk-${risk}`),
                  color: LicenseRiskColors[risk]!,
                  count,
                }))} />
            </Card.Body>
          </Card>
        </Col>
      )
    }
    if (custom) {
      cols.push(
        <Col key='custom' span={12}>
          <Card>
            <Card.Body
              title={<Localized id='project-custom-statistics' />}
              operation={
                <Button type='link' onClick={() => history.push(reportLink({ page: 'customized' }))}><Localized id='view-all' /></Button>
              }
            >
              <PieBoard items={custom.filter(i => [CheckRisk.High, CheckRisk.Medium, CheckRisk.Warning, CheckRisk.Pass].includes(i.risk))
                .map(({ risk, count }) => ({
                  onClick: () => history.push(customLink(risk)),
                  text: getRiskMessage(risk),
                  color: RiskColors[risk],
                  count,
                }))} />
            </Card.Body>
          </Card>
        </Col>
      )
    }
    const kernelMap = kernel && !isRtos ? {
      kernalVersion: kernel.version,
      kernalName: kernel.name,
      kernelRelease: kernel.release
    } : {}
    return <>
      <Justify style={{ marginBottom: 20 }} right={rightOps} />
      <Card>
        <Card.Body
          title={<Localized id='project-system-info' />}
          operation={
            <Button type='link' onClick={() => history.push(reportLink({ page: 'system' }))}><Localized id='project-title-detail' /></Button>
          }
        >
          <SearchableKVTable records={getRecords({
            projectName,
            analysisName,
            ...kernelMap
          })} />
        </Card.Body>
      </Card>
      <Gap />

      <Row>
        {cols}
      </Row>
    </>
  })
}

const PieBoard: React.FC<{
  items: {
    count: number
    color: string
    text: string
    onClick?: () => void
  }[]
}> = ({ items }) => {
  const counts = items.reduce((p, i) => p + i.count, 0)
  return <Row showSplitLine>
    <Col span={6}>
      <BasicPie
        height={120}
        position='count'
        circle
        dataSource={items as any[]}
        color={{
          key: 'text',
          colors: (i) => {
            return items.find(({ text }) => text === i)?.color ?? '#fff'
          },
        }}
        legend={false}
      >
        <Annotation>
          <Annotation.Label
            content={counts}
            position={['50%', '50%']}
            offsetY={10}
            textStyle='font-size:20px;'
          />
        </Annotation>
      </BasicPie>
    </Col>
    <Col>
      <Row style={{ padding: '18px 0' }} showSplitLine>
        {
          items.map(({ text, count, onClick, color }) => <Col key={text}>
            <MetricsBoard
              title={text}
              value={<span style={{ color }}>{count}</span>}
              onClick={onClick}
            />
          </Col>)
        }
      </Row>
    </Col>
  </Row>
}
