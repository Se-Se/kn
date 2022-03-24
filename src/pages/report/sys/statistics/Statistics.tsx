import React, { useMemo, useState } from 'react'
import { useSysReportBaselineQuery, CheckRisk, AuditType, CheckRiskStatistics, Maybe, useReportOverviewQuery, Wp29 } from 'generated/graphql'
import { useDetailReportTable, getSysReport } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { CustomizedPrefix } from '../Report'
import { Link, useRouteMatch, Redirect, useHistory } from 'react-router-dom'
import { useGqlLanguage, useGetMessage, Localized } from 'i18n'
import { Checkbox, Text, Form, Card, Col, MetricsBoard, Row, Button, Tag, Modal } from '@tencent/tea-component'
import { AllRiskOrder, RiskItem, useGetRiskMessage, RiskColors } from 'components/RiskField'
import { AnalysisMatch } from 'pages/report/Report'
import { useApolloData } from 'hooks/common'
import { useAnalysisId, useReportLink } from 'pages/report/context'
import { useReportVariable } from 'components/Config'

export const useBaselineLink = () => {
  const reportLink = useReportLink()
  return (risk: CheckRisk) => reportLink({
    page: 'baseline',
    tab: risk
  })
}

export const useCveLink = () => {
  const reportLink = useReportLink()
  return () => reportLink({
    page: 'cvesec',
    tab: 'third-party'
  })
}

export const useLicenseLink = () => {
  const reportLink = useReportLink()
  return () => reportLink({
    page: 'license',
  })
}

export const useCustomLink = () => {
  const reportLink = useReportLink()
  return (risk: CheckRisk) => reportLink({
    page: 'customized',
    tab: risk
  })
}
const useSegmentMultiple = () => {
  const history = useHistory()
  const reportLink = useReportLink()
  const { params: { page, tab } } = useRouteMatch<AnalysisMatch>()
  const getMessage = useGetMessage()
  const options = useMemo(() => AllRiskOrder.map(i => ({
    text: getMessage(`enum-risk-${i}`),
    value: i,
  })), [getMessage])
  const defAll = options.map(i => i.value)
  const selected = (tab?.split(',') as CheckRisk[]) ?? defAll
  const selectAll = selected.length === options.length
  const [lastSelected, setLastSelected] = useState<CheckRisk[]>([])

  return [<>
    { !tab && <Redirect to={reportLink({ page, tab: defAll.join(',') })} />}
    <Form>
      <Form.Item label={<Text reset><Localized id='column-riskLevel' /></Text>}>
        <Checkbox
          value={selectAll}
          indeterminate={selected.length > 0 && !selectAll}
          onChange={v => {
            if (!selectAll) {
              setLastSelected(selected)
              history.replace(reportLink({ page, tab: defAll.join(',') }))
            } else if (lastSelected.length > 0) {
              setLastSelected([])
              history.replace(reportLink({ page, tab: lastSelected.join(',') }))
            }
          }}
        >{<Localized id='all-risk' />}</Checkbox>
        <Checkbox.Group value={selected} onChange={v => {
          if (v.length > 0) {
            history.replace(reportLink({ page, tab: v.join(',') }))
          }
        }}>
          {options.map(({ value, text }) => <Checkbox key={value} name={value}>{text}</Checkbox>)}
        </Checkbox.Group>
      </Form.Item>
    </Form>
  </>, selected] as const
}



const WP29Rule: React.FC<{ item: Wp29 }> = ({ item }) => {
  return <>
    <Form layout='vertical'>
      <Form.Item>
        <Tag theme='primary'>{item.rule}</Tag>
      </Form.Item>
      <Form.Item label={<Text theme='label'><Localized id='column-wp29-class' /></Text>}>
        <Text reset>{item.class}</Text>
      </Form.Item>
      <Form.Item label={<Text theme='label'><Localized id='column-wp29-detail' /></Text>}>
        <Text reset>{item.detail}</Text>
      </Form.Item>
      <Form.Item label={<Text theme='label'><Localized id='column-wp29-example' /></Text>}>
        <textarea readOnly cols={70} rows={3} value={item.example} />
      </Form.Item>
    </Form>
  </>
}

const RuleGen = (auditType: AuditType) => {
  const AuditTable: React.FC = () => {
    const lang = useGqlLanguage()
    const [item, setItem] = useState<Wp29 | undefined>(undefined)
    const reportLink = useReportLink()
    const id = useAnalysisId()
    const [segment, selected] = useSegmentMultiple()
    const query = omitVariables(useSysReportBaselineQuery, {
      id,
      risk: selected,
      auditType,
      ...lang,
    })
    const getRiskMessage = useGetRiskMessage()
    const result = useReportOverviewQuery({
      variables: {
        id,
        ...useReportVariable(),
      }
    })
    const [table] = useDetailReportTable(
      query,
      ({ analysis }) => getSysReport(analysis)?.audit,
      {
        columns: [
          {
            key: 'ruleName',
            width: 350,
            render({ ruleName, classKey, riskLevel }) {
              const link = ![CheckRisk.Pass, CheckRisk.NotAvailable].includes(riskLevel)
              return (link && classKey) ? <Link to={{
                pathname: reportLink({
                  page: auditType === AuditType.Custom ? (CustomizedPrefix + classKey) : classKey
                }),
                state: {
                  ruleName
                }
              }}>{ruleName}</Link> : ruleName
            }
          },
          {
            key: 'wp29',
            render({ wp29 }) {
              return <>{wp29?.map((wp29) =>
                <Button type='link' onClick={() => setItem(wp29)}><Tag theme='primary'>{wp29.rule}</Tag></Button>
              )}</>
            }
          },
          {
            key: 'riskLevel',
            width: 200,
            render({ riskLevel }) {
              return <RiskItem risk={riskLevel} />
            }
          },
          {
            key: 'class',
            width: 200,
          },
          {
            key: 'catalog',
            width: 200
          }
        ],
        justifyLeft: segment,
        justifyRight: <></>,
      }
    )

    return <>
      <Modal caption={<Localized id='wp29' />} visible={!!item} onClose={() => setItem(undefined)}>
        <Modal.Body>
          {item && <WP29Rule item={item} />}
        </Modal.Body>
      </Modal>
      {useApolloData(result, (data) => {
        const report = getSysReport(data.analysis)
        let stat: Maybe<Pick<CheckRiskStatistics, 'risk' | 'count'>[]> | undefined
        if (auditType === AuditType.Baseline) {
          stat = report?.overview.baseline
        } else {
          stat = report?.overview.custom
        }
        return <Card style={{ marginBottom: 10 }}>
          <Card.Body>
            <Row showSplitLine>
              {stat?.map(({ risk, count }) => <Col key={risk}>
                <MetricsBoard
                  title={getRiskMessage(risk)}
                  value={<span style={{ color: RiskColors[risk] }}>{count}</span>}
                />
              </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      })}
      {table}
    </>
  }
  return AuditTable
}

export const BaselineAudits: React.FC = () => {
  const AuditTable = useMemo(() => RuleGen(AuditType.Baseline), [])
  return <AuditTable />
}

export const CustomizedAudits: React.FC = () => {
  const AuditTable = useMemo(() => RuleGen(AuditType.Custom), [])
  return <AuditTable />
}
