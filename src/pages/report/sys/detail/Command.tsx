import React from 'react'
import { useProjectCommandQuery } from 'generated/graphql'
import { useDetailReportTable, TableTabs, getSysReport, expandedColumns } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { useAnalysisId } from 'pages/report/context'
import { Button } from '@tencent/tea-component'
import { useDownloadToken } from 'components/Download'
import { useApolloData } from 'hooks/common'

const ExpandedCommand = ({ commandId }: { commandId: string }) => {
  const id = useAnalysisId()
  return useApolloData(useProjectCommandQuery({
    variables: {
      id,
      commandId,
      field: 'command',
      withResult: true,
    },
  }), ({ analysis }) => {
    const cmd = getSysReport(analysis)?.system?.command?.nodes?.[0]
    if (!cmd) return <>Failed to get cmd Result</>
    return expandedColumns<typeof cmd>({
      columns: [
        'command',
        'result',
        'returnStatus',
      ]
    })(cmd)
  })
}

const AllCommands: React.FC = () => {
  const getToken = useDownloadToken()
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectCommandQuery, {
      id,
      field: 'command',
      withResult: false,
    }),
    ({ analysis }) => getSysReport(analysis)?.system?.command,
    {
      columns: [
        'command',
        'returnStatus',
        {
          columnName: 'operation',
          key: 'id',
          render({ id }) {
            return <Button icon='download' onClick={async () => {
              await getToken().then(token => window.open(`/download_report_cmd/${id}?token=${token}`))
            }} />
          },
        },
      ],
      recordKey: r => r.command,
      expanded: {
        render: ({ id }) => <ExpandedCommand commandId={id} />,
        gapCell: 1,
      }
    }
  )

  return table
}

export const ProjectCommands: React.FC = () => {
  const tabs = [
    {
      id: 'command',
      component: AllCommands
    },
  ]
  return (
    <TableTabs tabs={tabs} />
  )
}
