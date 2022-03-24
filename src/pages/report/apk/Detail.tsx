import React from 'react'
import { Card } from '@tencent/tea-component'
import { Localized } from 'i18n'
import { useAnalysisId } from 'pages/report/context'
import { SearchableKVTable, useI18nKVRecords } from 'pages/report/common/render'
import { useApolloData } from 'hooks/common'
import { useApkDetailQuery, useApkDetailPermissionQuery } from 'generated/graphql'
import { getApkReport, TableTabs, useDetailReportTable } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'

export const Signature: React.FC = () => {
  const id = useAnalysisId()
  const getRecords = useI18nKVRecords()

  return useApolloData(useApkDetailQuery({
    variables: {
      id,
    }
  }), data => {
    const report = getApkReport(data.analysis)
    if (!report) {
      return <>Failed to get apk report</>
    }
    const { from, to, oid, subject, version, algorithm } = report.signature
    return <>
      <Card>
        <Card.Body
          title={<Localized id='apk-signature' />}
        >
          <SearchableKVTable records={getRecords({
            from,
            to,
            oid,
            subject,
            version,
            algorithm,
          })} />
        </Card.Body>
      </Card>
    </>
  })
}

export const Components: React.FC = () => {
  const id = useAnalysisId()

  return useApolloData(useApkDetailQuery({
    variables: {
      id,
    }
  }), data => {
    const report = getApkReport(data.analysis)
    if (!report) {
      return <>Failed to get apk report</>
    }
    const { activities, services, receivers, providers } = report.components
    return <>
      <Card>
        <Card.Body
          title={<Localized id='apk-activity' />}
        >
          {activities && <SearchableKVTable records={activities.map((i, idx) => ({
            key: idx + 1,
            value: i,
          }))} />}
        </Card.Body>
      </Card>
      <Card>
        <Card.Body
          title={<Localized id='apk-service' />}
        >
          {services && <SearchableKVTable records={services.map((i, idx) => ({
            key: idx + 1,
            value: i,
          }))} />}
        </Card.Body>
      </Card>
      <Card>
        <Card.Body
          title={<Localized id='apk-receiver' />}
        >
          {receivers && <SearchableKVTable records={receivers.map((i, idx) => ({
            key: idx + 1,
            value: i,
          }))} />}
        </Card.Body>
      </Card>
      <Card>
        <Card.Body
          title={<Localized id='apk-provider' />}
        >
          {providers && <SearchableKVTable records={providers.map((i, idx) => ({
            key: idx + 1,
            value: i,
          }))} />}
        </Card.Body>
      </Card>
    </>
  })
}

export const Permission: React.FC = () => {
  const id = useAnalysisId()

  const [table] = useDetailReportTable(
    omitVariables(useApkDetailPermissionQuery, { id }),
    ({ analysis }) => getApkReport(analysis)?.permission,
    {
      columns: [
        'name',
      ],
      recordKey: r => r.name,
    }
  )
  return table
}
export const Detail: React.FC = () => {
  const tabs = [
    {
      id: 'signature',
      component: Signature
    },
    {
      id: 'components',
      component: Components
    },
    {
      id: 'permission',
      component: Permission
    }
  ]
  return (
    <TableTabs tabs={tabs} />
  )
}
