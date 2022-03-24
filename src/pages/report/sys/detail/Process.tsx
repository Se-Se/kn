import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Process, useProjectProcessBriefQuery, useProjectProcessQuery } from 'generated/graphql'
import { useDetailReportTable, TableTabs, getSysReport, useSearch, State, useScrollIntoView } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { useAnalysisId } from 'pages/report/context'
import { FoldablePre } from 'components/FoldablePre'
import { SearchableKVTable, useI18nKVRecords } from 'pages/report/common/render'
import { useInput } from 'hooks/useInput'
import { Localized, useGetMessage } from 'i18n'
import { useFieldSearch } from 'components/FieldSearch'
import { Button, Card, H5, Form, Justify, Segment, Table, Text } from '@tencent/tea-component'
import styled from '@emotion/styled'
import { useDrawer } from 'components/Drawer'
import { useApolloData } from 'hooks/common'
import { Gap } from 'components/Gap'
import { FlexDiv } from 'components/FlexDiv'
import { useLocation } from 'react-router-dom'
type CommonComponents = { switcher: React.ReactNode, searcher: React.ReactNode, search?: string, searchField?: string }

type Node = {
  cmd: string[]
  cwd: string
  id: string
  name: string
  pid: number
  ppid: number
  expand: boolean
  children: Set<number>
  indent: number
  _absolutePos?: number
}

const { autotip } = Table.addons;

export const TableWrapper = styled.div`
  .highlight {
    background: yellow;
  }
`

// Key 为 Pid
type NodeMap = Map<number, Node>

const GreyFontDiv = styled.div`
  color: #888888;
  display: inline;
`

const HoverA = styled.a`
  color: inherit;
  &:hover * {
    color: #006EFF;
  }
  &:hover {
    color: #006EFF;
  }
`

const nodesMapper = (nodes: (Pick<Process, 'pid' | 'cmd' | 'id' | 'cwd' | 'name'> & { status: { ppid: number } })[]) => {
  const nodeMap: NodeMap = new Map()
  for (let node of nodes) {
    const nNode: Node = {
      ...node,
      indent: 0,
      expand: true,
      children: new Set(),
      ppid: node.status.ppid,
    }
    nodeMap.set(node.pid, nNode)
  }
  return nodeMap
}

const buildTree = (nodeMap: NodeMap, searchPid: number) => {
  // 保证每个Root下的节点pid不重复(出现重复则把pid设置成1), 否则不动
  const checkNode = (leaf: Node) => {
    let visited: Set<number> = new Set()
    let cur: Node | undefined = leaf
    while (cur) {
      if (visited.has(cur.pid)) {
        console.warn(`Detected circular references pid: ${cur.pid} ppid: ${cur.ppid}. Set ppid to 1`)
        cur.ppid = 1
        break
      }

      cur = nodeMap.get(cur.ppid)
    }
  }
  for (const node of nodeMap.values()) {
    checkNode(node)
  }

  const indentHelper = (nodePid: number, baseIndent: number = 0) => {
    const node = nodeMap.get(nodePid)
    if (!node) {
      return
    }
    node.indent = baseIndent
    for (let childPid of node.children) {
      indentHelper(childPid, baseIndent + 1)
    }
  }
  const roots: number[] = []
  for (let [pid, node] of nodeMap) {
    if (!nodeMap.has(node.ppid)) {
      roots.push(pid)
    } else {
      let parentNode = nodeMap.get(node.ppid)
      parentNode?.children.add(pid)
    }
    expandParents(searchPid, nodeMap)
  }
  for (let childPid of roots) {
    indentHelper(childPid)
  }
  return roots
}

const flatNodePid = (nodePid: number, nodeMap: NodeMap) => {
  let out: number[] = []
  const node = nodeMap.get(nodePid)
  if (!node) {
    return []
  }
  if (!node.expand) {
    return [node.pid]
  }
  out.push(nodePid)
  for (let childPid of node.children) {
    out = [...out, ...flatNodePid(childPid, nodeMap)]
  }
  return out
}

const expandParents = (pid: number, nodeMap: NodeMap) => {
  const node = nodeMap.get(pid)
  if (node) {
    node.expand = true
    expandParents(node.ppid, nodeMap)
  }
}

const flatNodes = (nodePids: number[], nodeMap: NodeMap) => {
  let flattenNodes: Node[] = []
  let i = 0
  for (const [key, value] of nodeMap.entries()) {
    nodeMap.set(key, {
      ...value,
      _absolutePos: i++
    })
  }
  for (const nodePid of nodePids) {
    for (const subPid of flatNodePid(nodePid, nodeMap)) {
      const node = nodeMap.get(subPid)
      if (node) {
        flattenNodes = [...flattenNodes, node]
      }
    }
  }
  return flattenNodes
}

const NormalProcess: React.FC<CommonComponents> = ({ switcher, searcher, search, searchField }) => {
  const id = useAnalysisId()
  const getI18nKVRecords = useI18nKVRecords()
  const [table] = useDetailReportTable(
    omitVariables(useProjectProcessQuery, { id, search, searchField }),
    ({ analysis }) => getSysReport(analysis)?.system.process,
    {
      columns: [{
        columnName: 'processName',
        key: 'name',
      }, {
        key: 'pid',
        render({ pid }) {
          return pid.toString()
        },
      }, 'cmd', 'cwd', 'loginUID', 'rootDir'],
      expanded: {
        render(record) {
          let recordMapFirstPart = {
            'status-name': record.status.name,
            uid: record.uid,
            gid: record.gid,
            'status-seccomp': record.status.seccomp,
          }
          let recordMapApkPart: { APK?: string } = {}
          if (record.apk)
            recordMapApkPart['APK'] = record.apk
          let recordMapLastPart = {
            memmap: <FoldablePre>{record.memmap}</FoldablePre>,
            sharelibs: <FoldablePre>{record.sharelibs?.map(i => i.name) || ''}</FoldablePre>,
            inodes: <FoldablePre>{record.inodes?.map(String) || ''}</FoldablePre>,
            fileHandles: <FoldablePre>{record.fileHandles || ''}</FoldablePre>,
          }
          return <SearchableKVTable records={getI18nKVRecords({ ...recordMapFirstPart, ...recordMapApkPart, ...recordMapLastPart })} />
        },
        gapCell: 1,
      },
      search,
      defaultPageSize: 20,
      searchFields: ['name', 'pid'],
      sortableColumns: ['name', 'pid'],
      justifyLeft: switcher,
      justifyRight: searcher,
      isJump: false
    },
  )
  return table
}

const ProcessDetail: React.FC<{ id: string, pid: string }> = ({ id, pid }) => {
  return useApolloData(useProjectProcessQuery({
    variables: {
      id,
      pid,
    },
  }), (data) => {
    const p = getSysReport(data.analysis)?.system?.process?.nodes?.[0]
    if (!p) {
      console.error('no license', data)
      return <>No license</>
    }
    type Keys = keyof typeof p
    const basicMap: Record<string, Keys> = {
      processName: 'name',
      pid: 'pid',
      cmd: 'cmd',
      cwd: 'cwd',
      loginUID: 'loginUID',
      rootDir: 'rootDir',
    }
    const detailMap: Record<string, React.ReactNode> = {
      'status-name': <Text reset>{p.status.name}</Text>,
      uid: <Text reset>{p.uid}</Text>,
      gid: <Text reset>{p.gid}</Text>,
      'status-seccomp': <Text reset>{p.status.seccomp}</Text>,
      memmap: <FoldablePre>{p.memmap}</FoldablePre>,
      sharelibs: <FoldablePre>{p.sharelibs?.map(i => i.name) || ''}</FoldablePre>,
      inodes: <FoldablePre>{p.inodes?.map(String) || ''}</FoldablePre>,
      fileHandles: <FoldablePre>{p.fileHandles || ''}</FoldablePre>,
    }
    return <>
      <H5><Localized id='process-basic-title' /></H5>
      <Gap h={20} />
      <Form layout='fixed' readonly>
        {Object.entries(basicMap).map(([id, key]) => {
          return <Form.Item
            key={key}
            label={<Text theme='label'><Localized id={`column-${id}`} /></Text>}
          >
            <Text reset>{p[key]}</Text>
          </Form.Item>
        })}
      </Form>
      <Gap h={20} />
      <H5><Localized id='process-detail-title' /></H5>
      <Gap h={20} />
      <Form layout='fixed' readonly>
        {Object.entries(detailMap).map(([key, value]) => {
          return <Form.Item
            key={key}
            label={<Text theme='label'><Localized id={`column-${key}`} /></Text>}
          >
            <Text reset>{value}</Text>
          </Form.Item>
        })}
      </Form>
    </>
  })
}

const FoldItem: React.FC<{ onFold: () => void, node: Node, id: string }> = ({ onFold, node, id }) => {
  const showDrawer = useDrawer()
  const getMessage = useGetMessage()
  const expandButton = <Button icon={node.expand ? 'minus' : 'plus'} onClick={onFold} />
  return <FlexDiv style={{ marginLeft: node.indent * 20, alignItems: 'center' }}>
    {node.children.size ? expandButton : <div style={{ width: 25 }}></div>}
    <HoverA onClick={() => {
      showDrawer({
        title: getMessage('process-info'),
        body: <ProcessDetail id={id} pid={node.id} />
      })
    }}>
      {node.name}<GreyFontDiv style={{ marginLeft: 10 }}>({node.pid})</GreyFontDiv>
    </HoverA>
  </FlexDiv>
}

const TreeProcess: React.FC<CommonComponents> = ({ switcher, searcher, search, searchField }) => {
  const id = useAnalysisId()
  const { state } = useLocation<State | undefined>()
  const position = state?.position ?? undefined
  const [highlightPos, setHighlightPos] = useState<number | undefined>(position)
  const { data, loading } = useProjectProcessBriefQuery({
    variables: {
      id,
      searchField,
    }
  })
  const readyJump = useScrollIntoView({ exp: !loading && (!!search || !!position), query: '.highlight' })

  const [flattenNodes, setFlattenNodes] = useState<Node[]>([])

  const process = getSysReport(data?.analysis)?.system.process

  const [nodeMap, rootNodePids, flatted] = useMemo(() => {
    const nodeMap = nodesMapper(process?.nodes ?? [])
    const rootNodePids = buildTree(nodeMap, parseInt(search ?? ''))
    const flatted = flatNodes(rootNodePids, nodeMap)
    return [nodeMap, rootNodePids, flatted]
  }, [process?.nodes, search])

  useLayoutEffect(() => {
    setFlattenNodes(flatted)
  }, [flatted])

  useEffect(() => {
    if (search) {
      setHighlightPos(flattenNodes.find(i => i.pid.toString() === search)?._absolutePos)
    }
  }, [search, flattenNodes])

  useEffect(() => { readyJump() }, [search, position, readyJump])

  const rowClassName = (record: Node) => {
    return (highlightPos !== undefined && highlightPos === record._absolutePos) ? 'highlight' : ''
  }

  return <>
    <Table.ActionPanel>
      <Justify left={switcher} right={searcher} />
    </Table.ActionPanel>
    <Card>
      <TableWrapper>
        <Table
          rowClassName={rowClassName}
          records={flattenNodes}
          columns={[
            {
              key: 'pidName',
              width: 600,
              header: <Localized id='column-pidName' />,
              render: (node) => {
                const onFold = () => {
                  node.expand = !node.expand
                  setFlattenNodes(flatNodes(rootNodePids, nodeMap))
                }
                return <FoldItem onFold={onFold} node={node} id={id} />
              }
            },
            {
              key: 'cmd',
              header: 'CMD'
            },
            {
              key: 'cwd',
              header: 'cwd'
            },
          ]}
          addons={[autotip({ isLoading: loading })]}
        />
      </TableWrapper>
    </Card>
  </>
}

const SearchFields = [
  {
    id: 'processName',
    key: 'name',
  },
  {
    id: 'pid',
    key: 'pid',
  },
  {
    id: 'cmd',
    key: 'cmd',
  },
  {
    id: 'cwd',
    key: 'cwd',
  }
]

const Switcher: React.FC = () => {
  const [view] = useInput<'tree' | 'list'>('tree')

  const getMessage = useGetMessage()
  const { search, searchField, setFieldSearch, clearSearch } = useSearch()
  const searcher = useFieldSearch({
    searchFields: view.value === 'list' ? SearchFields : [],
    onSearch: v => {
      setFieldSearch(v)
    },
    onClear: clearSearch,
    placeholder: view.value === 'list' ? getMessage(`search-keyword-placeholder`) : getMessage(`search-pid-placeholder`),
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
  return view.value === 'tree' ? <TreeProcess {...commonComponents} /> : <NormalProcess {...commonComponents} />
}

export const ProjectProcess: React.FC = () => {
  const tabs = [
    {
      id: 'process',
      component: Switcher
    },
  ]
  return (
    <TableTabs tabs={tabs} />
  )
}
