import React, { useState } from 'react'
import { sortable, SortBy } from '@tencent/tea-component/lib/table/addons'
import { CveFragment, CveStatus, CvssRank, useProjectKernelCveSecQuery, useProjectLibCveSecQuery } from 'generated/graphql'
import { Localized, useGetMessage } from 'i18n'
import { Button, Bubble, Icon, Table, TableColumn, Text } from '@tencent/tea-component'
import { useDrawer } from 'components/Drawer'
import { assertNever } from 'utils/assertNever'
import { CvssRiskItem, } from 'components/RiskField'
import { CveDetail } from './CVEDetail'
import { useApolloData } from 'hooks/common'
import { getSysReport } from 'pages/report/common'
import { useAnalysisId } from 'pages/report/context'


type FieldValues = Record<string, string[]>
const CountWidth = 120

const CVSSRankOrder = [CvssRank.Critical, CvssRank.High, CvssRank.Medium, CvssRank.Low]
const CVEStatusOrder = [CveStatus.Confirmed, CveStatus.HighlyRelated, CveStatus.Fixed, '']

export const LibCveTable: React.FC<{ component: string, version: string, filterFields: FieldValues }> = ({
  component,
  version,
  filterFields,
}) => {
  const id = useAnalysisId()
  const result = useProjectLibCveSecQuery({
    variables: {
      id,
      component,
      version,
      withCVE: true,
      filterFields
    },
  })
  return useApolloData(result, ({ analysis }) => {
    const cve = getSysReport(analysis)?.system?.libCveSec?.nodes?.[0]?.cve
    if (!cve) {
      return <>No cve</>
    }
    return <CveTable component={component} cve={cve} />

  })
}

export const KernelCveTable: React.FC<{ path: string, component: string, version: string, filterFields: FieldValues }> = ({
  path,
  filterFields,
  component,
}) => {
  const id = useAnalysisId()
  const result = useProjectKernelCveSecQuery({
    variables: {
      id,
      path,
      withCVE: true,
      filterFields
    },
  })
  return useApolloData(result, ({ analysis }) => {
    const cve = getSysReport(analysis)?.system?.kernelCveSec?.nodes?.[0]?.cve
    if (!cve) {
      return <>No cve</>
    }
    return <CveTable component={component} cve={cve} />

  })
}


const CVETableButton: React.FC<{ cve: CveFragment, component: string }> = ({ children, cve, component }) => {
  const showDrawer = useDrawer()
  return <ul><Button
    type='link'
    onClick={() => showDrawer(({ close }) => ({
      title: cve.name,
      body: <CveDetail close={close} cve={cve} libname={component} />,
    }))}
  >{children}</Button></ul>
}

const CveTable: React.FC<{ component: string, cve: CveFragment[] }> = ({ component, cve }) => {
  const getMessage = useGetMessage()
  const getHeaderKey = (i: string) => {
    return {
      header: getMessage('column-cve-' + i),
      key: i,
    }
  }

  const statusHeader = <>
    <Localized id='column-cve-status' />
    <Bubble
      arrowPointAtCenter
      placement="top"
      style={{ maxWidth: 360 }}
      content={
        <>
          <div style={{ whiteSpace: 'nowrap' }}>
            <Text style={{ marginRight: 10 }}><Localized id='cvedetail-status-comfirmed' /></Text>
            <Localized id='cvedetail-status-comfirmed-desc' />
          </div>
          <div style={{ whiteSpace: 'nowrap' }}>
            <Text style={{ marginRight: 10 }}><Localized id='cvedetail-status-highlyrelated' /></Text>
            <Localized id='cvedetail-status-highlyrelated-desc' />
          </div>
          <div style={{ whiteSpace: 'nowrap' }}>
            <Text style={{ marginRight: 10 }}><Localized id='cvedetail-status-fixed' /></Text>
            <Localized id='cvedetail-status-fixed-desc' />
          </div>
        </>
      }
    ><Icon type="info" /></Bubble>
  </>


  const getCntRender = function (field: keyof CveFragment) {
    return (record: CveFragment) => {
      if (record[field]) {
        return <CVETableButton cve={record} component={component}><Localized id='cvedetail-basic-had' /></CVETableButton>
      } else {
        return <></>
      }
    }
  }
  const statusRender = ({ status }: CveFragment) => {
    switch (status) {
      case CveStatus.Confirmed:
        return <Text theme='danger'><Localized id='cvedetail-status-comfirmed' /></Text>
      case CveStatus.Fixed:
        return <Text theme='success'><Localized id='cvedetail-status-fixed' /></Text>
      case CveStatus.HighlyRelated:
        return <Text theme='warning'><Localized id='cvedetail-status-highlyrelated' /></Text>
      case CveStatus.LikelyRelated:
        return <Text theme='text'><Localized id='cvedetail-status-likelyrelated' /></Text>
      case CveStatus.None:
        return <></>
      default:
        assertNever(status)
    }
  }

  // TODO Need some improve
  const columns: TableColumn<CveFragment>[] = [{
    ...getHeaderKey('name'),
    width: CountWidth + 50,
    render(record) {
      return <CVETableButton cve={record} component={component}>{record.name}</CVETableButton>
    }
  }, {
    ...getHeaderKey('cvssRank'),
    width: CountWidth,
    render({ cvssRank }) {
      return <CvssRiskItem cvssRank={cvssRank}>{cvssRank}</CvssRiskItem>
    }
  }, {
    ...getHeaderKey('cvss'),
    width: CountWidth,
    render({ cvss }) {
      return cvss.toPrecision(2)
    }
  }, {
    header: statusHeader,
    key: 'status',
    width: CountWidth,
    render: statusRender,
  }, {
    ...getHeaderKey('poc'),
    width: CountWidth,
    render: getCntRender('poc')
  }, {
    ...getHeaderKey('patch'),
    width: CountWidth,
    render: getCntRender('patch')
  }, {
    ...getHeaderKey('exp'),
    width: CountWidth,
    render: getCntRender('exp')
  }]

  const [sorts, setSorts] = useState<SortBy[]>([])
  const lengthSorter = (k: keyof Pick<CveFragment, 'poc' | 'exp' | 'patch'>) => {
    return (cvea: CveFragment, cveb: CveFragment) => {
      let d = (cvea[k]?.length || 0) - (cveb[k]?.length || 0)
      return d
    }
  }

  return <>
    <Table
      columns={columns}
      records={[...cve].sort(sortable.comparer(sorts))}
      addons={[
        sortable({
          columns: ['name', 'cvss', {
            key: 'cvssRank',
            prefer: 'asc',
            sorter: ({ cvssRank: a }: CveFragment, { cvssRank: b }: CveFragment) => {
              let d = CVSSRankOrder.indexOf(b) - CVSSRankOrder.indexOf(a)
              if (d) {
                return d
              }
              return b.localeCompare(a)
            },
          }, {
              key: 'status',
              prefer: 'desc',
              sorter: ({ status: a }: CveFragment, { status: b }: CveFragment) => {
                let d = CVEStatusOrder.indexOf(b) - CVEStatusOrder.indexOf(a)
                if (d) {
                  return d
                }
                return b.localeCompare(a)
              },
            }, {
              key: 'poc',
              prefer: 'asc',
              sorter: lengthSorter('poc'),
            },
            {
              key: 'patch',
              prefer: 'asc',
              sorter: lengthSorter('patch'),
            },
            {
              key: 'exp',
              prefer: 'asc',
              sorter: lengthSorter('exp'),
            }],
          value: sorts,
          onChange(_, { sort }) {
            setSorts(sort ? [sort] : [])
          },
        })
      ]}
    />
  </>
}
