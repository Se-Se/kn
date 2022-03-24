import React from 'react'
import { useProjectPeripheralQuery } from 'generated/graphql'
import { useDetailReportTable, TableTabs, getSysReport } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { useAnalysisId } from 'pages/report/context'

const USB: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectPeripheralQuery, { id, field: 'usb' }),
    ({ analysis }) => getSysReport(analysis)?.system?.usb,
    {
      columns: [
        'busID',
        'deviceID',
        'idProduct',
        'idVendor',
        'description',
      ],
    }
  )

  return table
}

export const ProjectPeripheral: React.FC = () => {
  const tabs = [
    {
      id: 'usb',
      component: USB
    },
  ]
  return (
    <TableTabs tabs={tabs} />
  )
}
