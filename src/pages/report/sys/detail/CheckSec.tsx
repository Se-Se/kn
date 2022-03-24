import React from 'react'
import { useProjectCheckSecQuery } from 'generated/graphql'
import { useDetailReportTable, TableTabs, getSysReport } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { useAnalysisId } from 'pages/report/context'
import { useHistory } from 'react-router'
import { Bubble, Icon } from '@tencent/tea-component'
import { FlexDiv } from 'components/FlexDiv'
import { WeakButton } from './component'
import { Localized } from 'i18n'

type State = {
  pid?: number
}

const CheckSec: React.FC = () => {
  const id = useAnalysisId()
  const history = useHistory<State | undefined>()
  const state = history.location.state

  const [table] = useDetailReportTable(
    omitVariables(useProjectCheckSecQuery, { id, pid: state?.pid ?? null }),
    ({ analysis }) => getSysReport(analysis)?.system.checkSec,
    {
      columns: [
        {
          columnName: 'filename',
          key: 'name',
          render: (item) => <Bubble content={item.name} placement='bottom-start'>{item.name}</Bubble>
        },
        'canary',
        'nx',
        'pie',
        'relro',
        'rpath',
        'runpath',
        'symbols',
      ],
      recordKey: r => r.name,
      justifyLeft: state && <WeakButton type="weak" onClick={() => {
        history.push({ ...history.location, state: undefined })
      }}>
        <FlexDiv style={{ "alignItems": "center" }}><Localized id='filter-pid' vars={{ pid: state?.pid ?? -1 }} /><Icon size="s" type="close" /></FlexDiv>
      </WeakButton>
    }
  )

  return table
}

export const ProjectCheckSec: React.FC = () => {
  const tabs = [
    {
      id: 'checksec',
      component: CheckSec
    }
  ]
  return (
    <TableTabs tabs={tabs} />
  )
}
