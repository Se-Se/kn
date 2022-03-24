import React, { useMemo } from 'react'
import { useApkReportBaselineQuery, CheckRisk } from 'generated/graphql'
import { useDetailReportTable, getApkReport } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { useAnalysisId, useReportLink } from 'pages/report/context'
import { Link, useRouteMatch, Redirect, useHistory } from 'react-router-dom'
import { useGqlLanguage, useGetMessage, Localized } from 'i18n'
import { Checkbox, Text, Form } from '@tencent/tea-component'
import { AllRiskOrder, RiskItem } from 'components/RiskField'
import { AnalysisMatch } from 'pages/report/Report'

export const useBaselineLink = () => {
  const reportLink = useReportLink()
  return (risk: CheckRisk) => reportLink({
    page: 'baseline',
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
  return [<>
    { !tab && <Redirect to={reportLink({ page, tab: defAll.join(',') })} />}
    <Form>
      <Form.Item label={<Text reset><Localized id='column-riskLevel' /></Text>}>
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

const RuleGen = () => {
  const AuditTable: React.FC = () => {
    const lang = useGqlLanguage()
    const reportLink = useReportLink()
    const id = useAnalysisId()
    const [segment, selected] = useSegmentMultiple()
    const [table] = useDetailReportTable(
      omitVariables(useApkReportBaselineQuery, {
        id,
        risk: selected,
        ...lang,
      }),
      ({ analysis }) => getApkReport(analysis)?.audit,
      {
        columns: [
          {
            key: 'ruleName',
            render({ ruleName, classKey, riskLevel }) {
              const link = ![CheckRisk.Pass, CheckRisk.NotAvailable].includes(riskLevel)
              return (link && classKey) ? <Link to={{
                pathname: reportLink({
                  page: classKey
                }),
                state: {
                  ruleName
                }
              }}>{ruleName}</Link> : ruleName
            }
          },
          {
            key: 'riskLevel',
            render({ riskLevel }) {
              return <RiskItem risk={riskLevel} />
            }
          },
          {
            columnName: 'vulnCount',
            key: 'riskContent',
            render({ riskContent }) {
              try {
                return JSON.parse(JSON.parse(riskContent).Json).length
              } catch (e) {
                return 0
              }
            }
          },
          'catalog',
        ],
        justifyLeft: segment,
        justifyRight: <></>,
      }
    )

    return table
  }
  return AuditTable
}

export const BaselineAudits: React.FC = () => {
  const AuditTable = useMemo(() => RuleGen(), [])
  return <AuditTable />
}
