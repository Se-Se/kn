import React from 'react'
import { useProjectUserQuery } from 'generated/graphql'
import { TableTabs, getSysReport, useDetailReportTable } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { useAnalysisId } from 'pages/report/context'

const UserList: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectUserQuery, { id, field: 'user' }),
    ({ analysis }) => getSysReport(analysis)?.system.user,
    {
      columns: ['userName', 'uid', 'gid', 'passwordHash', 'shell'],
      sortableColumns: ['userName', 'uid', 'gid', 'shell'],
    }
  )

  return table
}

const GroupList: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectUserQuery, { id, field: 'group' }),
    ({ analysis }) => getSysReport(analysis)?.system.group,
    {
      columns: ['groupName', 'gid', 'groupPassword', 'userList'],
      sortableColumns: ['groupName', 'gid'],
    }
  )

  return table
}

export const ProjectUser: React.FC = () => {
  const tabs = [
    {
      id: 'userlist',
      component: UserList
    },
    {
      id: 'grouplist',
      component: GroupList
    },
  ]
  return (
    <TableTabs tabs={tabs} />
  )
}
