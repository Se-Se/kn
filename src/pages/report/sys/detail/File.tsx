import React, { useEffect, useCallback, useState } from 'react'
import { useProjectFileQuery, File, useProjectFileTreeQuery, useProjectFileContentQuery } from 'generated/graphql'
import { useDetailReportTable, TableTabs, getSysReport, expandedColumns, useSearch, useOnJump } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { AnalysisCtxProvider, useAnalysisCtx, useAnalysisId } from 'pages/report/context'
import { Button, Segment, Justify, Table, Card, LoadingTip, Bubble, Text } from '@tencent/tea-component'
import { useDownloadToken } from 'components/Download'
import { useInput } from 'hooks/useInput'
import { useGetMessage, Localized } from 'i18n'
import { indentable } from '@tencent/tea-component/lib/table/addons'
import { useModal } from 'components/Modal'
import { useApolloData } from 'hooks/common'
import { KVTable } from 'components/KVTable'
import { useI18nKVRecords } from 'pages/report/common/render'
import { useFieldSearch } from 'components/FieldSearch'
import { FileRef } from 'pages/report/common/component'
import styled from '@emotion/styled/macro'
import { BubbleStyle } from 'utils/style'

const LinkRefWrapper = styled.span`
  display: inline-block;
  span {
    color: #006eff;
  }
`

type FileTreeItemProps = {
  id: string
  fileId: string
  disabled?: boolean
}

const DownloadButton: React.FC<FileTreeItemProps> = ({ fileId, disabled }) => {
  const getToken = useDownloadToken()

  return <Button disabled={disabled} icon='download' onClick={async () => {
    const token = await getToken()
    window.open(`/download_report_file/${fileId}?token=${token}`)
  }} />
}

const getDetailContent = (analysis: Pick<File, "type" | "contentType" | "linkFile" | "content" | "name">) => {
  let content: React.ReactNode = analysis.content
  if (analysis.type === 'TypeLink' && analysis.linkFile) {
    content = <LinkFileContent filename={analysis.name} linkFile={analysis.linkFile} />
  }
  if (analysis.contentType === 'RawData') {
    content = <div><Localized id='file-category-binary'></Localized></div>
  }
  return content
}

const LoadingDetail: React.FC<FileTreeItemProps> = ({ id, fileId }) => {
  const getI18nKVRecords = useI18nKVRecords()
  return useApolloData(useProjectFileContentQuery({
    variables: {
      id,
      fileId,
    }
  }), (data) => {
    const f = getSysReport(data.analysis)?.system.file?.nodes?.[0]
    if (!f) {
      console.error('no file', data)
      return <>No file</>
    }
    const fileContent = getDetailContent(f)
    let contentNode: React.ReactNode = fileContent
    if (typeof (contentNode) === "string") {
      contentNode = <textarea readOnly cols={80} rows={30} value={f.content} />
    }
    const kvRecords: {
      filename: string,
      arch?: string,
      type: string,
      permission: string,
      ownerUser: string,
      ownerGroup: string,
      size: number,
      date: string,
      contentType: string,
      linkCount: number,
      content: React.ReactNode,
    } = {
      filename: f.name,
      arch: "",
      type: f.type,
      permission: f.perm,
      ownerUser: f.ownerUser,
      ownerGroup: f.ownerGroup,
      size: f.size,
      date: f.date,
      contentType: f.contentType,
      linkCount: f.linkCount,
      content: contentNode,
    }
    if (f.arch) {
      kvRecords["arch"] = f.arch
    } else {
      delete kvRecords["arch"]
    }
    return <KVTable records={getI18nKVRecords(kvRecords)} />
  })
}

const DetailButton: React.FC<FileTreeItemProps> = ({ id, fileId, disabled }) => {
  const { showModal } = useModal()
  const analysis = useAnalysisCtx()
  return <Button disabled={disabled} icon='info' onClick={() => {
    showModal({
      caption: <Localized id='detail-info' />,
      body: <AnalysisCtxProvider value={analysis} ><LoadingDetail id={id} fileId={fileId} /></AnalysisCtxProvider>,
      size: 'xl',
    })
  }} />
}

type CommonComponents = { switcher: React.ReactNode, searcher: React.ReactNode, search?: string, searchField?: string }
type Node = {
  name: string
  path: string
  type: string
  perm: string
  id: string
  folded: boolean
  isDir: boolean
  loading: boolean
  totalCount?: number
  children?: Node[]
  indent: number
  disableOperation: boolean
}

const mapNodes = (f: Pick<File, 'name' | 'type' | 'perm' | 'id' | 'type' | 'virtual'>): Node => {
  const names = f.name.split('/')
  return {
    id: f.id,
    name: names[names.length - 1],
    type: f.type,
    perm: f.perm,
    path: f.name,
    folded: true,
    loading: false,
    isDir: f.type === 'TypeDir',
    indent: names.length - 2,
    disableOperation: f.virtual,
  }
}

const LinkFileContent: React.FC<{ filename: string, linkFile: string }> = ({ filename, linkFile }) => {
  const { closeModal } = useModal()
  return <>
    <Localized id='project-report-linkfile' vars={{ item: filename }} />
    <LinkRefWrapper>
      <FileRef path={linkFile} hideIcon={true} onClick={closeModal} />
    </LinkRefWrapper>
  </>
}

const flatNode = (nodes: Node[]): Node[] => {
  let out: Node[] = []
  for (let n of nodes) {
    out.push(n)
    if (!n.folded && n.children) {
      out.push(...flatNode(n.children))
    }
  }
  return out
}

const findNode = (nodes: Node[], path: string): Node | undefined => {
  for (let n of nodes) {
    if (n.path === path) {
      return n
    }
    const r = n.children && findNode(n.children, path)
    if (r) {
      return r
    }
  }
  return undefined
}

const TreeFile: React.FC<CommonComponents> = ({ switcher, searcher }) => {
  const [loading, setLoading] = useState(false)
  const id = useAnalysisId()
  const { refetch: fetch } = useProjectFileTreeQuery({ skip: true })
  const fetchPath = useCallback(async (path: string) => {
    const res = await fetch({
      id,
      path,
      offset: {
        offset: 0,
        limit: 10000,
      }
    })
    return getSysReport(res.data.analysis)?.system.file
  }, [id, fetch])
  const [nodes, setNodes] = useState<Node[]>([])

  useEffect(() => {
    (async () => {
      setLoading(true)
      const res = await fetchPath('')
      setLoading(false)
      setNodes(res?.nodes?.map(mapNodes) ?? [])
    })()
  }, [fetchPath])

  const openFolder = async (path: string) => {
    const node = findNode(nodes, path)
    if (!node) {
      console.error('openFolder error: path not found', path)
      return
    }
    try {
      node.folded = false
      node.loading = true
      setNodes(n => [...n])
      if (!node.children) {
        const res = await fetchPath(path)
        const r = res?.nodes?.map(mapNodes)
        node.children = r
        setNodes(n => [...n])
      }
    } finally {
      node.loading = false
      setNodes(n => [...n])
    }
  }

  const closeFolder = async (path: string) => {
    const node = findNode(nodes, path)
    if (!node) {
      console.error('closeFolder error: path not found', path)
      return
    }
    node.folded = true
    setNodes(n => [...n])
  }

  return <>
    <Table.ActionPanel>
      <Justify left={switcher} right={searcher} />
    </Table.ActionPanel>
    <Card>
      <Table
        records={flatNode(nodes)}
        columns={[{
          key: 'path',
          header: <Localized id='column-filename' />,
          render({ path, name, isDir, loading, folded, indent }) {
            const folder = (folded ? <Button icon='folderclose' onClick={() => openFolder(path)} /> : <Button icon='folderopen' onClick={() => closeFolder(path)} />)
            const icon = isDir ? folder : <Button icon='daily' />
            return <div style={{ marginLeft: indent * 20 }}>
              {loading ? <Button icon='loading' disabled /> : icon}
              {name}
            </div>
          }
        }, {
          key: 'type',
          header: <Localized id='column-type' />,
          width: 200,
        }, {
          key: 'perm',
          header: <Localized id='column-perm' />,
          width: 200,
        }, {
          key: 'operation',
          header: <Localized id='column-operation' />,
          width: 200,
          render({ id: fileId, disableOperation: disabled }) {
            const props = {
              id,
              fileId,
              disabled,
            }
            return <Bubble content={disabled && <Localized id='file-not-collected' />}>
              <DownloadButton {...props} />
              <DetailButton {...props} />
            </Bubble>
          }
        }]}
        addons={[
          indentable({
            indent: 20,
            targetColumnKey: 'path',
          })
        ]}
        topTip={loading && <LoadingTip />}
      />
    </Card>
  </>
}

const ExpandedFile: React.FC<{ fileId: string }> = ({ fileId }) => {
  const id = useAnalysisId()
  return useApolloData(useProjectFileContentQuery({
    variables: {
      id,
      fileId,
    }
  }), ({ analysis }) => {
    const file = getSysReport(analysis)?.system?.file?.nodes?.[0]
    if (!file) return <>Failed to get file content</>
    const fileRecord = {
      filename: file.name,
      ...file,
      content: getDetailContent(file),
    }
    let recordColumns: (keyof typeof fileRecord)[] = ['filename',
      'contentType',
      'content',
      'aclEnabled',
      'linkCount',
      'nodes']
    if (file.arch) {
      recordColumns.splice(1, 1, 'arch')
    }
    return expandedColumns<typeof fileRecord>({
      columns: recordColumns
    })(fileRecord)
  })
}

const NormalFile: React.FC<CommonComponents> = ({ switcher, searcher, search, searchField }) => {
  const id = useAnalysisId()
  const [table] = useDetailReportTable(
    omitVariables(useProjectFileQuery, { id }),
    ({ analysis }) => getSysReport(analysis)?.system?.file,
    {
      columns: [
        {
          columnName: 'filename',
          key: 'name',
          width: 300,
          render(node) {
            return <>
              <BubbleStyle content={<Text style={{ whiteSpace: 'nowrap' }}>{node.name}</Text>}>
                {node.name}
              </BubbleStyle>
            </>
          }
        },
        'type',
        'perm',
        'ownerUser',
        'ownerGroup',
        'size',
        'date',
        {
          key: 'operation',
          render({ id: fileId }) {
            return <DownloadButton id={id} fileId={fileId} />
          }
        }
      ],
      recordKey: r => r.id,
      expanded: {
        render: ({ id }) => <ExpandedFile fileId={id} />,
        gapCell: 1,
      },
      justifyLeft: switcher,
      justifyRight: searcher,
      search,
      variables: {
        searchField
      },
      sortableColumns: ['size'],
    }
  )

  return table
}

const SearchFields = [
  {
    id: 'filename',
    key: 'name',
  },
  {
    id: 'filecontent',
    key: 'content',
  },
  'perm',
]

const Swithcer: React.FC = () => {
  const [view] = useInput<'tree' | 'list'>('tree')
  useOnJump(() => view.onChange('list'))
  const { search, searchField, setFieldSearch, clearSearch } = useSearch()

  const getMessage = useGetMessage()
  const searcher = useFieldSearch({
    searchFields: SearchFields,
    onSearch: v => {
      view.onChange('list')
      setFieldSearch(v)
    },
    onClear: clearSearch,
    placeholder: getMessage(`search-keyword-placeholder`),
  })
  const switcher = <>
    <Segment options={[{
      value: 'tree',
      text: <Localized id='tree-view' />
    }, {
      value: 'list',
      text: <Localized id='list-view' />
    }]} {...view} />
  </>
  const commonComponents = {
    switcher,
    searcher,
    search,
    searchField,
  }
  return view.value === 'tree' ? <TreeFile {...commonComponents} /> : <NormalFile {...commonComponents} />
}

export const ProjectFiles: React.FC = () => {
  const tabs = [
    {
      id: 'allfile',
      component: Swithcer
    },
  ]
  return (
    <TableTabs tabs={tabs} />
  )
}
