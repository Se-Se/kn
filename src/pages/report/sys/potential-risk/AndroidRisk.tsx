import React from 'react'
import { useSysReportPotentialRiskQuery } from 'generated/graphql'
import { useDetailReportTable, TableTabs, getSysReport } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { useAnalysisId } from 'pages/report/context'

const SELinux: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useSysReportPotentialRiskQuery, { id, field: 'selinux' }),
    ({ analysis }) => getSysReport(analysis)?.androidRisk.selinux,
    {
      columns: [
        'revise',
        'action',
        'role',
        'context',
        'class',
        'detail',
      ],
    }
  )

  return table
}

export const AndroidRisk: React.FC = () => {
  const tabs = [
    {
      id: 'selinux',
      component: SELinux,
    },
  ]
  return (
    <TableTabs tabs={tabs} />
  )
}
