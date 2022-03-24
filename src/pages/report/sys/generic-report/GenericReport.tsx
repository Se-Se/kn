import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { Card, Table, Select, Button, TableColumn, Text, Badge } from '@tencent/tea-component'
import { ProjectCard, FileRef, ProcessRef } from 'pages/report/common/component'
import { CheckFragment, CheckRuleFragment, AuditType, CheckRisk, useSysReportRuleDetailQuery, useSysReportGenericQuery, ColumnAppend } from 'generated/graphql'
import { useRouteMatch, useLocation } from 'react-router-dom'
import { CustomizedPrefix } from '../Report'
import { useApolloData } from 'hooks/common'
import { getSysReport } from 'pages/report/common'
import { expandable, pageable } from '@tencent/tea-component/lib/table/addons'
import { KVTable } from 'components/KVTable'
import { Loading } from 'components/Loading'
import { Markdown } from 'components/Markdown'
import { useInput } from 'hooks/useInput'
import { RiskItem } from 'components/RiskField'
import { useGqlLanguage, Localized } from 'i18n'
import { useTableColumn } from 'pages/template/common'
import { useI18nKVRecords } from 'pages/report/common/render'
import { AnalysisMatch } from 'pages/report/Report'
import { useOffset } from 'hooks/useOffset'
import styled from '@emotion/styled/macro'
import { useModal } from 'components/Modal'
import { useAnalysisId } from 'pages/report/context'

const FlexDiv = styled.div`
  display: flex;
`
const DetailDiv = styled.div`
  overflow: auto;
`

const InlineBlock = styled.div`
  display: inline-block;
  min-width: 0;
`

type TC = TableColumn<Record<string, any>>
const DetailView: React.FC<{ ruleId: string }> = ({ ruleId }) => {
  const { showModal } = useModal()
  const Attr: Record<string, ((tc: TC) => TC) | undefined> = {
    unfold(tc) {
      return {
        ...tc,
        render(record, _, __, { key }) {
          const content = record[key]
          return <FlexDiv>
            <Text overflow>{content}</Text>
            <Button type='link' onClick={() => showModal({
              caption: <>{key}</>,
              body: <DetailDiv>
                <pre>
                  {content}
                </pre>
              </DetailDiv>
            })}><Localized id='view' /></Button>
          </FlexDiv>
        }
      }
    },
    fileref(tc) {
      return {
        ...tc,
        render(record, _, __, { key }) {
          const path = record[key]
          return <FileRef path={path} />
        }
      }
    },
    pidref(tc) {
      return {
        ...tc,
        render(record, _, __, { key }) {
          const pid = record[key]
          return <ProcessRef pid={pid} />
        }
      }
    }
  }

  const TypeToLocalized: Record<string, React.ReactElement> = {
    'binary': <Localized id='file-category-binary' />
  }

  const AppendAttr: Record<string, ((tc: TC, append: {
    __typename?: "ColumnAppend" | undefined;
  } & Pick<ColumnAppend, "key" | "type">) => TC) | undefined> = {
    tag(tc, append) {
      return {
        ...tc,
        render(record, rowKey, recordIndex, column, columnIndex) {
          const ref = tc.render?.(record, rowKey, recordIndex, column, columnIndex)
          const recordContent = record[append.key]
          return <FlexDiv>
            <InlineBlock>{ref}</InlineBlock>
            {recordContent && <Badge style={{ marginLeft: '.5em', flex: 'none' }}>{TypeToLocalized[recordContent]}</Badge>}
          </FlexDiv>
        }
      } as TC
    }
  }

  const id = useAnalysisId()
  const [offset, offsetProps] = useOffset(50)
  const result = useSysReportRuleDetailQuery({
    variables: {
      id,
      ruleId,
      offset,
    }
  })
  return useApolloData(result, ({ analysis }) => {
    const detail = getSysReport(analysis)?.ruleByID?.detail
    if (!detail) {
      return <>No detail</>
    }
    const columns = detail.column.map(i => {
      let column: TC = {
        key: i.key,
        header: i.title,
      }
      const types = i.type?.split(',') ?? []
      for (const type of types) {
        column = Attr[type]?.(column) ?? column
      }
      const appends = i.append ?? []
      for (const append of appends) {
        column = AppendAttr[append.type]?.(column, append) ?? column
      }

      return column
    })

    return <>
      <Table
        columns={columns}
        records={detail.nodes ?? []}
        addons={[
          pageable({
            ...offsetProps,
            recordCount: detail.totalCount,
          })
        ]}
      />
    </>
  })
}

const GoDetail: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return <Button type='link' onClick={onClick}><Localized id='see-detail' /></Button>
}

const CheckView: React.FC<{ check: CheckFragment, goDetail: (rule: string) => void }> = ({ check, goDetail }) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const ruleColumns = useTableColumn<CheckRuleFragment>(useMemo(() => [{
    key: 'ruleName',
    width: 300,
  }, {
    key: 'riskLevel',
    width: 150,
    render({ riskLevel }) {
      return <RiskItem risk={riskLevel} />
    }
  }, {
    key: 'catalog',
    width: 100,
  }], []))
  const getRecords = useI18nKVRecords()
  const { state } = useLocation<{ ruleName?: string }>()
  const rules = check.rule

  useEffect(() => {
    if (state?.ruleName && rules) {
      const r = rules.find(i => i.ruleName === state.ruleName)
      if (r) {
        setExpandedKeys([r.ruleName])
      }
    }
  }, [state, rules])

  return <>
    { (check.rule) ? <>
      <Table
        columns={ruleColumns}
        records={check.rule}
        recordKey={i => i.ruleName}
        addons={[
          expandable({
            expandedKeys,
            onExpandedKeysChange: (keys, { event }) => {
              event.stopPropagation()
              setExpandedKeys(keys)
            },
            render({ ruleName, riskContent, riskReason, remediation, detail, description }: CheckRuleFragment) {
              return <KVTable records={getRecords({
                ruleDescription: <Markdown source={description} />,
                riskContent: riskContent === '' && detail ? <GoDetail onClick={() => {
                  goDetail(ruleName)
                }} /> : riskContent,
                riskReason,
                remediation: <Markdown source={remediation} />
              })} />
            },
            shouldRecordExpandable({ riskLevel }) {
              return ![CheckRisk.Pass, CheckRisk.NotAvailable].includes(riskLevel)
            }
          })
        ]}
      />
    </> : <Loading />}
  </>
}

const DetailCard: React.FC<{
  check: CheckFragment,
  value: string,
  onChange: (v: string) => void
  cardRef?: (instance: HTMLDivElement | null) => void
}> = ({ check, value, onChange, cardRef }) => {
  const hasDetail = useMemo(() => check.rule?.filter(i => !!i.detail), [check])
  const options = useMemo(() => hasDetail?.map((i) => ({
    value: i.ruleName,
    text: i.ruleName,
  })), [hasDetail])
  const detailRule = hasDetail && hasDetail.find(i => i.ruleName === value)

  return <>
    { (hasDetail?.length ?? 0) > 0 && <ProjectCard ref={cardRef}>
      <Card.Body
        title={<Localized id='project-report-detail' />}
        subtitle={<Select
          type='simulate'
          options={options}
          value={value}
          onChange={onChange}
        />}
      >
        {detailRule && <DetailView key={value} ruleId={detailRule.id} />}
      </Card.Body>
    </ProjectCard>}
  </>
}

const Report: React.FC<{ check: CheckFragment }> = ({ check }) => {
  const [rule] = useInput('')
  const card = useRef<HTMLDivElement | null>()

  return <>
    <ProjectCard>
      <CheckView check={check} goDetail={useCallback((newRule: string) => {
        rule.onChange(newRule)
        if (card.current) {
          card.current.scrollIntoView()
        }
      }, [rule])} />
    </ProjectCard>
    <DetailCard cardRef={div => card.current = div} check={check} {...rule} />
  </>
}

const Page: React.FC<{ page: string, auditType: AuditType }> = ({ page, auditType }) => {
  const id = useAnalysisId()
  const { language } = useGqlLanguage()
  const result = useSysReportGenericQuery({
    variables: {
      id,
      classType: page,
      language,
      auditType,
    }
  })

  return <>
    { useApolloData(result, ({ analysis }) => {
      const check = getSysReport(analysis)?.auditReport
      if (!check) {
        throw new Error('impossible')
      }
      return <>
        <Report check={check} />
      </>
    })}
  </>
}

export const GenericReport: React.FC = () => {
  const { params: { page } } = useRouteMatch<AnalysisMatch>()

  return <>
    { page ? <Page page={page} auditType={AuditType.Baseline} /> : <Loading />}
  </>
}

export const CustomGenericReport: React.FC = () => {
  const { params } = useRouteMatch<AnalysisMatch>()
  const page = params.page?.startsWith(CustomizedPrefix) ? params.page.substr(CustomizedPrefix.length) : params.page

  return <>
    { page ? <Page page={page} auditType={AuditType.Custom} /> : <Loading />}
  </>
}
