import React from 'react'
import { useProjectNetworkQuery } from 'generated/graphql'
import { useDetailReportTable, TableTabs, getSysReport } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { useAnalysisId } from 'pages/report/context'
import { FoldablePre } from 'components/FoldablePre'
import { useExpanded } from 'hooks/common'

const Interfaces: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectNetworkQuery, { id, field: 'interface' }),
    ({ analysis }) => getSysReport(analysis)?.system.network?.interface,
    {
      columns: [{
        columnName: 'interfaceName',
        key: 'name'
      }, 'ipv4Address', 'ipv6Address', 'phyAddress'],
      sortableColumns: ['name'],
    }
  )

  return table
}

const Hosts: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectNetworkQuery, { id, field: 'hosts' }),
    ({ analysis }) => getSysReport(analysis)?.system.hosts,
    {
      columns: ['address', 'hostname'],
      sortableColumns: ['hostname'],
    }
  )

  return table
}

const Routings: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectNetworkQuery, { id, field: 'routing' }),
    ({ analysis }) => getSysReport(analysis)?.system.network?.routing,
    {
      columns: ['table', 'destination', 'mask', 'gateway', 'interfaceName'],
      sortableColumns: ['interfaceName']
    }
  )

  return table
}

const UnixSockets: React.FC = () => {
  const { expanded, toggleExpand } = useExpanded()
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectNetworkQuery, { id, field: 'unixSocket' }),
    ({ analysis }) => getSysReport(analysis)?.system.network?.unixSocket,
    {
      columns: ['path', 'inode', {
        key: 'processName',
        render({ processName }, rowKey) {
          const exp = expanded.includes(rowKey)
          return <FoldablePre displayLines={3} value={exp} onChange={() => toggleExpand(rowKey)}>
            {processName ?? []}
          </FoldablePre>
        }
      }, {
          key: 'pid',
          render({ pid }, rowKey) {
            const exp = expanded.includes(rowKey)
            return <FoldablePre displayLines={3} value={exp} onChange={() => toggleExpand(rowKey)}>
              {pid?.map(String) ?? []}
            </FoldablePre>
          }
        }],
      sortableColumns: ['path'],
    }
  )

  return table
}

const ListeningSockets: React.FC = () => {
  const { expanded, toggleExpand } = useExpanded()
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectNetworkQuery, { id, field: 'listeningSocket' }),
    ({ analysis }) => getSysReport(analysis)?.system.network?.listeningSocket,
    {
      columns: ['localAddress', 'localPort', 'inode', {
        key: 'processName',
        render({ processName }, rowKey) {
          const exp = expanded.includes(rowKey)
          return <FoldablePre displayLines={3} value={exp} onChange={() => toggleExpand(rowKey)}>
            {processName ?? []}
          </FoldablePre>
        }
      }, {
          key: 'pid',
          render({ pid }, rowKey) {
            const exp = expanded.includes(rowKey)
            return <FoldablePre displayLines={3} value={exp} onChange={() => toggleExpand(rowKey)}>
              {pid?.map(String) ?? []}
            </FoldablePre>
          }
        }, 'type']
    }
  )

  return table
}

const ConnectingSockets: React.FC = () => {
  const { expanded, toggleExpand } = useExpanded()
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectNetworkQuery, { id, field: 'connectingSocket' }),
    ({ analysis }) => getSysReport(analysis)?.system.network?.connectingSocket,
    {
      columns: ['localAddress', 'localPort', 'remoteAddress', 'remotePort', 'inode', {
        key: 'processName',
        render({ processName }, rowKey) {
          const exp = expanded.includes(rowKey)
          return <FoldablePre displayLines={3} value={exp} onChange={() => toggleExpand(rowKey)}>
            {processName ?? []}
          </FoldablePre>
        }
      }, {
          key: 'pid',
          render({ pid }, rowKey) {
            const exp = expanded.includes(rowKey)
            return <FoldablePre displayLines={3} value={exp} onChange={() => toggleExpand(rowKey)}>
              {pid?.map(String) ?? []}
            </FoldablePre>
          }
        }, 'type']
    }
  )

  return table
}

export const ProjectNetwork: React.FC = () => {
  const tabs = [
    {
      id: 'interface',
      component: Interfaces
    },
    {
      id: 'routing',
      component: Routings
    },
    {
      id: 'hosts',
      component: Hosts
    },
    {
      id: 'unixSocket',
      component: UnixSockets
    },
    {
      id: 'listeningSocket',
      component: ListeningSockets
    },
    {
      id: 'connectingSocket',
      component: ConnectingSockets
    },
  ]
  return (
    <TableTabs tabs={tabs} />
  )
}
