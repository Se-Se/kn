import React from 'react'
import { useSysReportPotentialRiskQuery, ProcRiskLevel } from 'generated/graphql'
import { useDetailReportTable, TableTabs, getSysReport } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { useAnalysisId, useReportLink } from 'pages/report/context'
import { ExternalLink } from '@tencent/tea-component'
import { useHistory } from 'react-router-dom'
import styled from '@emotion/styled'
import { ProcRiskColors } from 'utils/color'
import { Localized } from 'i18n'

const Li = styled.li`
  height: 20px;
  line-height: 20px;
`

const Round = styled.i`
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 8px;
  vertical-align: middle;
  margin-right: 4px;

  ${Object.keys(ProcRiskColors).map(risk => `&[data-risk="${risk}"] { background: ${ProcRiskColors[risk as ProcRiskLevel]}; }`)}
`

const ProcessSecurity: React.FC = () => {
  const id = useAnalysisId()
  const reportLink = useReportLink()
  const history = useHistory()
  const [table] = useDetailReportTable(
    omitVariables(useSysReportPotentialRiskQuery, { id, field: 'procSec' }),
    ({ analysis }) => getSysReport(analysis)?.procRisk.procSec,
    {
      columns: [
        'pid',
        'processName',
        'cmd',
        'root',
        {
          columnName: "checkSec",
          key: "checkSec",
          render({ checkSec, pid }) {
            return <ExternalLink weak onClick={() => {
              history.push(reportLink({ page: 'checksec', tab: 'checksec' }), { pid })
            }}>{checkSec}</ExternalLink>
          }
        },
        {
          columnName: "cveSec",
          key: "cveSec",
          render({ cveSec, pid }) {
            return <ExternalLink weak onClick={() => {
              history.push(reportLink({ page: 'cvesec', tab: 'third-party' }), { pid })
            }}>{cveSec}</ExternalLink>
          }
        },
        'effectiveUID',
        {
          columnName: 'riskLevel',
          key: "risk",
          render({ risk }) {
            return <ul>
              <Li>
                <Round data-risk={risk}></Round><Localized id={`enum-proc-risk-${risk}`} />
              </Li>
            </ul>
          }
        },
      ],
      sortableColumns: ['processName', 'pid', 'risk', 'cveSec'],
      recordKey: r => String(r.pid),
    }
  )

  return table
}

const ExposedService: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useSysReportPotentialRiskQuery, { id, field: 'exposedService' }),
    ({ analysis }) => getSysReport(analysis)?.procRisk.exposedService,
    {
      columns: [
        'pid',
        'processName',
        'localAddress',
        'localPort',
        'remoteAddress',
        'remotePort',
        'type',
        'effectiveUID',
      ],
      sortableColumns: ['processName', 'pid'],
      recordKey: r => String(r.pid),
    }
  )

  return table
}

export const ProcessRisk: React.FC = () => {
  const tabs = [
    {
      id: 'process-security',
      component: ProcessSecurity
    },
    {
      id: 'exposed-service',
      component: ExposedService
    },
  ]
  return (
    <TableTabs tabs={tabs} />
  )
}
