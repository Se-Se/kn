import React, { useState } from 'react'
import { CheckRisk, useSensitiveInfoQuery, SensitiveType, SensitiveIpFragment, SensitiveDomainFragment, SensitiveDomainDetail, SensitiveFile, SensitiveContentFragment } from 'generated/graphql'
import { useDetailReportTable, getSysReport } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { useAnalysisId, useReportLink } from 'pages/report/context'
import Maybe from 'graphql/tsutils/Maybe'
import { Button, Form, List, Modal, SelectMultiple, Table, TagSelect, Text } from '@tencent/tea-component'
import { Localized, useGetMessage } from 'i18n'
import { FileRef } from 'pages/report/common/component'
import styled from '@emotion/styled'
import { useApolloData } from 'hooks/common'
import { Tag } from 'components/Tag'
import { BinaryBadge } from 'components/BinaryBadge'
import { FlexDiv } from 'components/FlexDiv'
import { LineFoldable } from 'components/FoldableLine'

const ListBox = styled.div`
  border: 1px solid #ddd;
  width: 480px;
  max-height: 300px;
  overflow: auto;
  font-size: 12px;
  li {
    padding: 6px;
  }
`
export const useBaselineLink = () => {
  const reportLink = useReportLink()
  return (risk: CheckRisk) => reportLink({
    page: 'baseline',
    tab: risk
  })
}

export const useCustomLink = () => {
  const reportLink = useReportLink()
  return (risk: CheckRisk) => reportLink({
    page: 'customized',
    tab: risk
  })
}

type AssertNodes<T extends Maybe<{ nodes?: Maybe<any[]> }>, I> = T extends null | undefined ? T : Omit<T, 'nodes'> & { nodes: Maybe<I[]> }

const IPFileList: React.FC<{ item: SensitiveIpFragment }> = ({ item: { ip, type } }) => {
  const id = useAnalysisId()
  const result = useSensitiveInfoQuery({
    variables: {
      id,
      ip,
      type: SensitiveType.Ip,
      withDetail: true,
    },
  })
  const fileList = useApolloData(result, ({ analysis }) => {
    const node = getSysReport(analysis)?.sensitiveInfo?.nodes?.[0]
    if (node?.__typename !== 'SensitiveIP' || !node.files) return <>Failed to get file</>
    return <>
      <FileList fileList={node.files} />
    </>
  })

  return <KeyValueForm
    data={{
      ip: <Text reset>{ip}</Text>,
      type: <Text reset>{type}</Text>,
      filename: fileList,
    }}
  />
}

const AuditTableIP: React.FC = () => {
  const [item, setItem] = useState<SensitiveIpFragment | undefined>(undefined)
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useSensitiveInfoQuery, {
      id,
      type: SensitiveType.Ip,
    }),
    ({ analysis }) => {
      const si = getSysReport(analysis)?.sensitiveInfo
      return si as AssertNodes<typeof si, SensitiveIpFragment>
    },
    {
      columns: [
        'ip',
        'type',
        {
          key: 'count',
          columnName: 'expose-count',
        },
        {
          key: 'files',
          columnName: 'expose-path',
          render(item) {
            return <Button type='link' onClick={() => setItem(item)}><Localized id='filelist' /></Button>
          }
        },
      ],
      sortableColumns: ['ip', 'count'],
    }
  )

  return <>
    <Modal caption={<Localized id='filelist' />} visible={!!item} onClose={() => setItem(undefined)}>
      <Modal.Body>
        {item && <IPFileList item={item} />}
      </Modal.Body>
    </Modal>
    {table}
  </>
}

type DomainDetail = Pick<SensitiveDomainDetail, "content" | "files">

const FileList: React.FC<{ fileList: SensitiveFile[] }> = ({ fileList }) => {
  return <ListBox style={{ width: 600 }}>
    <List split='divide'>
      {fileList.map(f => <List.Item key={f.name}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <FileRef style={{ width: 0, flex: 'auto' }} path={f.name} showBubble />
          {f.type && <Tag style={{ marginLeft: 5 }}><Localized id={`tag-${f.type}`} /></Tag>}
        </div>
      </List.Item>)}
    </List>
  </ListBox>
}

const KeyValueForm: React.FC<{ data: Record<string, React.ReactNode> }> = ({ data }) => {
  return <>
    <Form layout='vertical'>
      {Object.entries(data).map(([k, v]) =>
        <Form.Item
          key={k}
          label={<Localized id={`column-${k}`} />}
        >
          {v}
        </Form.Item >
      )}
    </Form>
  </>
}

const ExpandedDetail: React.FC<{
  domain: string,
  contentColumnName: string,
  type: SensitiveType,
  filterFields?: Record<string, string[]>,
}> = ({ domain, contentColumnName, type, filterFields }) => {
  const [item, setItem] = useState<DomainDetail | undefined>(undefined)
  const id = useAnalysisId()
  const result = useSensitiveInfoQuery({
    variables: {
      id,
      type,
      domain,
      withDetail: true,
      filterFields,
    },
  })

  return useApolloData(result, ({ analysis }) => {
    const node = getSysReport(analysis)?.sensitiveInfo?.nodes?.[0]
    if (node?.__typename !== 'SensitiveDomain' || !node.detail) return <>Failed to get detail</>
    return <>
      <Modal caption={<Localized id='filelist' />} visible={!!item} onClose={() => setItem(undefined)} size={650}>
        <Modal.Body>
          {item && <KeyValueForm
            data={{
              domain: <Text reset>{node.domain}</Text>,
              [contentColumnName]: <Text reset>{item.content}</Text>,
              filename: <FileList fileList={item.files} />,
            }}
          />}
        </Modal.Body>
      </Modal>
      <Table
        columns={[{
          key: 'content',
          header: <Localized id={contentColumnName} />,
        }, {
          key: 'count',
          header: <Localized id='column-expose-count' />,
          width: 200,
          render(item) {
            return item.files.length
          }
        }, {
          key: 'file',
          header: <Localized id='column-expose-path' />,
          width: 200,
          render(item) {
            return <Button type='link' onClick={() => setItem(item)}><Localized id='filelist' /></Button>
          }
        }]}
        records={node.detail}
      />
    </>
  })
}

const AuditTableEmail: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useSensitiveInfoQuery, {
      id,
      type: SensitiveType.Email,
    }),
    ({ analysis }) => {
      const si = getSysReport(analysis)?.sensitiveInfo
      return si as AssertNodes<typeof si, SensitiveDomainFragment>
    },
    {
      columns: [
        {
          key: 'domain',
        },
        {
          key: 'count',
          columnName: 'emailCount',
        },
      ],
      topFilter: 'domain',
      expanded: {
        render: ({ domain }) => <ExpandedDetail
          contentColumnName='email'
          type={SensitiveType.Email}
          domain={domain}
        />,
        gapCell: 1,
      },
      recordKey: i => i.domain,
      sortableColumns: ['domain', 'count'],
    },
  )

  return table
}

const AuditTableUri: React.FC = () => {
  const id = useAnalysisId()
  const [filter, setFilter] = useState<Record<string, string[]>>({})
  const getMessage = useGetMessage()
  const [table] = useDetailReportTable(
    omitVariables(useSensitiveInfoQuery, {
      id,
      filterFields: filter,
      type: SensitiveType.Uri,
    }),
    ({ analysis }) => {
      const si = getSysReport(analysis)?.sensitiveInfo
      return si as AssertNodes<typeof si, SensitiveDomainFragment>
    },
    {
      columns: [
        {
          key: 'domain',
        },
        {
          key: 'count',
          columnName: 'uriCount'
        },
      ],
      topFilter: 'domain',
      expanded: {
        render: ({ domain }) => <ExpandedDetail
          key={domain}
          contentColumnName='uri'
          type={SensitiveType.Uri}
          domain={domain}
          filterFields={filter}
        />,
        gapCell: 1,
      },
      recordKey: i => i.domain,
      sortableColumns: ['domain', 'count'],
      justifyLeftFilterRender: (prop) => {
        return <>
          <Form layout="inline">
            <Form.Item align='middle' label={<Localized id={`column-domain`} />}>
              <TagSelect
                style={{ minWidth: "280px" }}
                options={prop?.fields?.domain?.map(i => ({
                  text: `${i.value}(${i.count})`,
                  value: i.value
                }))}
                value={filter['domain']}
                onChange={(v) => setFilter(old => ({
                  ...old,
                  domain: v,
                }))}
              />
            </Form.Item>
            <Form.Item align='middle' label={<Localized id={`column-scheme`} />}>
              <SelectMultiple
                searchPlaceholder={getMessage('search-scheme-placeholder')}
                clearable={true}
                style={{ minWidth: "183px" }}
                staging={false}
                appearance="button"
                searchable
                filter={(inputValue, selectOption) => {
                  return selectOption.text?.toString().indexOf(inputValue) !== -1
                }}
                options={prop?.fields?.scheme?.map(i => ({
                  text: i.value,
                  value: i.value
                })) || []}
                onChange={(value) => setFilter(old => ({
                  ...old,
                  scheme: value,
                }))}
                allOption={{
                  value: "all",
                  text: <Localized id="select-all-scheme" />,
                }}
              />
            </Form.Item>
          </Form>
        </>
      }
    }
  )

  return table
}



const AuditTableUriPassword: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useSensitiveInfoQuery, {
      id,
      type: SensitiveType.UriPassword,
    }),
    ({ analysis }) => {
      const si = getSysReport(analysis)?.sensitiveInfo
      return si as AssertNodes<typeof si, SensitiveContentFragment>
    },
    {
      columns: [
        {
          key: 'file',
          columnName: 'expose-path',
          render(record) {
            const sensitiveFile = record.file
            return (
              <FlexDiv>
                <FileRef path={record.file.name} />
                {sensitiveFile.type === 'binary' && <BinaryBadge />}
              </FlexDiv>
            )
          }
        },
        {
          key: 'content',
          columnName: 'uri-password',
          render(record) {
            return (
              <div>
                {record.content.map((eachContent, i) => <div key={i}>{eachContent}</div>)}
              </div>
            )
          }
        },
      ],
      recordKey: i => i.file.name,
      sortableColumns: ['file'],
      verticalTop: true,
    },
  )
  return table
}

const AuditTablePriKey: React.FC = () => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useSensitiveInfoQuery, {
      id,
      type: SensitiveType.PrivateKey,
    }),
    ({ analysis }) => {
      const si = getSysReport(analysis)?.sensitiveInfo
      return si as AssertNodes<typeof si, SensitiveContentFragment>
    },
    {
      columns: [
        {
          key: 'file',
          columnName: 'expose-path',
          render(record) {
            const sensitivePriv = record.file
            return (
              <FlexDiv>
                <FileRef path={record.file.name} />
                {sensitivePriv.type === 'binary' && <BinaryBadge />}
              </FlexDiv>
            )
          }
        },
        {
          key: 'content',
          columnName: 'column-sensitive-priv',
          render(record) {
            return (
              <LineFoldable>
                {record.content}
              </LineFoldable>
            )
          },
          disableMiddleware: true,
        },
      ],
      recordKey: i => i.file.name,
      sortableColumns: ['file'],
      verticalTop: true,
    },
  )
  return table
}

export const SensitiveUrl: React.FC = () => {
  return <AuditTableUri />
}

export const SensitiveIP: React.FC = () => {
  return <AuditTableIP />
}

export const SensitiveEmail: React.FC = () => {
  return <AuditTableEmail />
}

export const SensitiveUriPassword: React.FC = () => {
  return <AuditTableUriPassword />
}

export const SensitivePrivKey: React.FC = () => {
  return <AuditTablePriKey />
}
