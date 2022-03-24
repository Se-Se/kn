import React, { Fragment, useContext } from 'react'
import styled from '@emotion/styled/macro'
import { ProjectCard, Hr } from 'pages/report/common/component'
import { Alert } from './Alert'
import { useThreadAlertQuery } from 'generated/graphql'
import { useOffset } from 'hooks/useOffset'
import { Pagination, Table, Justify, SearchBox } from '@tencent/tea-component'
import { TableWrapper, useSearch, TabContext, TableTabs, getSysReport } from 'pages/report/common'
import { useGetMessage } from 'i18n'
import { useAnalysisId } from 'pages/report/context'
import { useData } from 'pages/template/common'

const CardPadding = styled.div`
  padding: 10px;
`

const TipBox = styled.div`
  text-align: center;
`

const MyPagination = styled(Pagination)`
  margin-top: 10px;
`

export const ThreatAlert: React.FC = () => {
  const id = useAnalysisId()
  const tabContext = useContext(TabContext)
  const [offset, pagination] = useOffset(50)
  const { search, setSearch, clearSearch } = useSearch()
  const { tip, records, totalCount } = useData(
    useThreadAlertQuery({ variables: { id, offset, search } }),
    i => getSysReport(i.analysis)?.threatAlert
  )
  const getMessage = useGetMessage()

  return <>
    <TableWrapper>
      <Table.ActionPanel>
        <Justify right={
          <SearchBox onSearch={setSearch} onClear={clearSearch} placeholder={
            getMessage(`search-tab-placeholder`, {
              tab: tabContext
            })
          } />
        } />
      </Table.ActionPanel>
      <ProjectCard>
        <CardPadding>
          <TipBox>
            {tip}
          </TipBox>
          <>
            {records?.map((i, idx) => <Fragment key={idx}>
              <Alert {...i} />
              <Hr />
            </Fragment>)}
          </>
          <MyPagination {...pagination} recordCount={totalCount} />
        </CardPadding>
      </ProjectCard>
    </TableWrapper>
  </>
}

export const ProjectThreatAlert: React.FC = () => {
  const tabs = [
    {
      id: 'threatAlert',
      component: ThreatAlert
    },
  ]
  return (
    <TableTabs tabs={tabs} />
  )
}
