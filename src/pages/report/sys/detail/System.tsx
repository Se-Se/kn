import React from 'react'
import { useApolloData } from 'hooks/common'
import { useProjectSystemKernelQuery, useProjectSystemQuery } from 'generated/graphql'
import { useAnalysisId } from 'pages/report/context'
import { getSysReport, TableTabs, useDetailReportTable } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { Card } from '@tencent/tea-component'
import { Localized } from 'i18n'
import { SearchableKVTable } from 'pages/report/common/render'

const Kernel: React.FC = () => {
  const id = useAnalysisId()

  return (
    <Card>
      <Card.Body>
        {
          useApolloData(useProjectSystemKernelQuery({ variables: { id } }), ({ analysis }) => {
            const system = getSysReport(analysis)?.system
            if (!system) throw new Error('Report is not found')
            return <SearchableKVTable disableTextOverflow records={[{
              key: <Localized id='column-kernel-version' />,
              value: system.kernel.version
            }, {
              key: <Localized id='column-kernel-name' />,
              value: system.kernel.name
            }, {
              key: <Localized id='column-kernel-release' />,
              value: system.kernel.release
            }, {
              key: <Localized id='column-kernel-cmdline' />,
              value: system.kernel.cmdline
            }, {
              key: <Localized id='column-kernel-procVersion' />,
              value: system.kernel.procVersion
            }]} />
          })
        }
      </Card.Body>
    </Card>
  )
}

const BuddyInfo: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectSystemQuery, { id, field: 'buddyInfo' }),
    ({ analysis }) => getSysReport(analysis)?.system.buddyInfo,
    {
      columns: ['node', 'zone', 'freePageBlock']
    }
  )

  return table
}

const Cryptos: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectSystemQuery, { id, field: 'crypto' }),
    ({ analysis }) => getSysReport(analysis)?.system.crypto,
    {
      columns: [
        'driver',
        'module',
        'priority',
        'refCnt',
        'selfTest',
        'internal',
        'type',
      ],
      sortableColumns: ['driver', 'priority']
    }
  )

  return table
}

const Supportedfs: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectSystemQuery, { id, field: 'supportedfs' }),
    ({ analysis }) => getSysReport(analysis)?.system.supportedfs,
    {
      columns: [{
        columnName: 'filesystem',
        key: 'type',
      }, 'dev'],
      sortableColumns: ['type']
    }
  )

  return table
}

export const ProjectSystem: React.FC = () => {
  const tabs = [
    {
      id: 'kernel',
      component: Kernel
    },
    {
      id: 'buddyinfo',
      component: BuddyInfo
    },
    {
      id: 'crypto',
      component: Cryptos
    },
    {
      id: 'supportedfs',
      component: Supportedfs
    },
  ]
  return (
    <TableTabs tabs={tabs} />
  )
}
