import React from 'react'
import { AnalysisListItemFragment, useAnalysisCollectorQuery, useCollectorStatusSubscription } from 'generated/graphql'
import { omitVariables } from 'utils/omitVariables'
import { useActionTable } from 'pages/template/table/ActionTable'
import { getAnalysis } from 'pages/report/common'
import { formatTime } from 'utils/timeFormat'
import { Add, AnalysisIdCtx, Delete, Stop, Collect } from './Operation'
import { StatusIcon } from 'components/StatusIcon'
import { useRouteMatch } from 'react-router-dom'
import { CollectorLink } from 'components/Link'
import { AnalysisMatch } from 'pages/report/Report'

export const AnalysisCollector: React.FC<{ analysis: AnalysisListItemFragment }> = ({ analysis }) => {
  useCollectorStatusSubscription({
    variables: {
      analysisID: analysis.id
    }
  })
  const { params } = useRouteMatch<AnalysisMatch>()
  const query = omitVariables(useAnalysisCollectorQuery, { id: analysis.id })
  const table = useActionTable(
    query,
    ({ analysis }) => getAnalysis(analysis)?.collector,
    {
      columns: [{
        key: 'name',
        render: ({ name }) => <CollectorLink {...params} collector={name} />
      }, {
        id: 'collectorNote',
        key: 'description',
      }, {
        key: 'status',
        render: ({ status }) => <StatusIcon status={status} text />
      }, {
        key: 'time',
        render: ({ time }) => formatTime(time),
      }],
      leftOperation: [Add],
      rightOperation: [Collect, Stop, Delete],
      disableSearch: true,
    }
  )
  return <>
    <AnalysisIdCtx.Provider value={analysis.id}>
      {table}
    </AnalysisIdCtx.Provider>
  </>
}
