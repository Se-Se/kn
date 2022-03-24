import React from 'react'
import { useProjectStorageQuery } from 'generated/graphql'
import { useDetailReportTable, TableTabs, getSysReport } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { useAnalysisId } from 'pages/report/context'

const StorageUsages: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectStorageQuery, { id, field: 'storageUsage' }),
    ({ analysis }) => getSysReport(analysis)?.system.storageUsage,
    {
      columns: ['filesystem', 'total', 'used', 'available', 'usePercent', 'mountOn']
    }
  )

  return table
}

const StoragePartitions: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectStorageQuery, { id, field: 'storagePartition' }),
    ({ analysis }) => getSysReport(analysis)?.system.storagePartition,
    {
      columns: ['name', 'size', 'node']
    }
  )

  return table
}

const StorageMounts: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectStorageQuery, { id, field: 'storageMount' }),
    ({ analysis }) => getSysReport(analysis)?.system.storageMount,
    {
      columns: ['device', 'mountPoint', 'fsType', 'option']
    }
  )

  return table
}

export const ProjectStorage: React.FC = () => {
  const tabs = [
    {
      id: 'storageUsage',
      component: StorageUsages
    },
    {
      id: 'storagePartition',
      component: StoragePartitions
    },
    {
      id: 'storageMount',
      component: StorageMounts
    },
  ]
  return (
    <TableTabs tabs={tabs} />
  )
}
