import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { Card, Table, Select, Button, ExternalLink } from '@tencent/tea-component'
import { ProjectCard } from 'pages/report/common/component'
import { useApkReportGenericLazyQuery, ApkCheckFragment, CheckRisk } from 'generated/graphql'
import { useRouteMatch, useLocation } from 'react-router-dom'
import { useAnalysisId } from 'pages/report/context'
import { useApolloData } from 'hooks/common'
import { getApkReport } from 'pages/report/common'
import { expandable } from '@tencent/tea-component/lib/table/addons'
import { KVTable } from 'components/KVTable'
import { Markdown } from 'components/Markdown'
import { useInput } from 'hooks/useInput'
import { RiskItem } from 'components/RiskField'
import { useGqlLanguage, Localized } from 'i18n'
import { useTableColumn } from 'pages/template/common'
import { useI18nKVRecords } from 'pages/report/common/render'
import { AnalysisMatch } from 'pages/report/Report'
import { convert, Check } from '../check'
import { ReportView, SingleCheckItem } from '../Risk'


const GoDetail: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return <Button type='link' onClick={onClick}><Localized id='see-detail' /></Button>
}

const CheckView: React.FC<{
  check: Check<unknown>[],
  goDetail: (rule: string) => void
}> = ({ check, goDetail }) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const ruleColumns = useTableColumn<typeof check[0]>(useMemo(() => [{
    key: 'name',
  }, {
    key: 'riskLevel',
    width: 150,
    render({ riskLevel }) {
      return <RiskItem risk={riskLevel} />
    }
  }, {
    key: 'vulnCount',
    width: 100,
    render({ vulInfo }) {
      return vulInfo?.data.length ?? 0
    }
  }, {
    key: 'catalog',
    width: 300,
    render(item) {
      const { extra: { OWASPLink, OWASPRisk } } = item
      return <ExternalLink href={OWASPLink}>{OWASPRisk}</ExternalLink>
    }
  }], []))
  const getRecords = useI18nKVRecords()
  const { state } = useLocation<{ ruleName?: string }>()

  useEffect(() => {
    if (state?.ruleName && check) {
      const r = check.find(i => i.name === state.ruleName)
      if (r) {
        setExpandedKeys([r.name])
      }
    }
  }, [state, check])

  return <>
    <Table
      columns={ruleColumns}
      records={check}
      recordKey={i => i.name}
      addons={[
        expandable({
          expandedKeys,
          onExpandedKeysChange: (keys, { event }) => {
            event.stopPropagation()
            setExpandedKeys(keys)
          },
          render({ name, remediation, description, extra }: typeof check[0]) {
            return <KVTable records={getRecords({
              ruleDescription: <Markdown source={description} />,
              riskContent: <GoDetail onClick={() => {
                goDetail(name)
              }} />,
              riskReason: extra.Reason,
              riskImpact: extra.Impact,
              remediation: <Markdown source={remediation} />
            })} />
          },
          shouldRecordExpandable({ riskLevel }) {
            return ![CheckRisk.Pass, CheckRisk.NotAvailable].includes(riskLevel)
          }
        })
      ]}
    />
  </>
}

const DetailCard: React.FC<{
  check: Check<unknown>[],
  value: string,
  onChange: (v: string) => void
  cardRef?: (instance: HTMLDivElement | null) => void
}> = ({ check, value, onChange, cardRef }) => {
  const hasVulnInfo = useMemo(() => check.filter(i => !!i.vulInfo?.data), [check])
  const options = useMemo(() => hasVulnInfo?.map((i) => ({
    value: i.name,
    text: i.name,
  })), [hasVulnInfo])
  const vulnInfo = hasVulnInfo.find(i => i.name === value)

  return <>
    { (hasVulnInfo?.length ?? 0) > 0 && <ProjectCard ref={cardRef}>
      <Card.Body
        title={<Localized id='project-report-detail' />}
        subtitle={<Select
          type='simulate'
          options={options}
          value={value}
          onChange={onChange}
          appearance='button'
          size='m'
        />}
      >
        <ReportView>
          {vulnInfo && <SingleCheckItem check={vulnInfo} />}
        </ReportView>
      </Card.Body>
    </ProjectCard>}
  </>
}

const Report: React.FC<{ check: ApkCheckFragment }> = ({ check }) => {
  const [rule] = useInput('')
  const card = useRef<HTMLDivElement | null>()
  const checks = useMemo(() => {
    return check.rule ? convert(check.rule) : []
  }, [check.rule])

  return <>
    <ProjectCard>
      <CheckView check={checks} goDetail={useCallback((newRule: string) => {
        rule.onChange(newRule)
        if (card.current) {
          card.current.scrollIntoView()
        }
      }, [rule])} />
    </ProjectCard>
    <DetailCard cardRef={div => card.current = div} check={checks} {...rule} />
  </>
}

export const GenericReport: React.FC = () => {
  const id = useAnalysisId()
  const { params: { page } } = useRouteMatch<AnalysisMatch>()
  const [fetch, result] = useApkReportGenericLazyQuery()
  const { language } = useGqlLanguage()
  useEffect(() => {
    if (page) {
      fetch({
        variables: {
          id,
          classType: page,
          language,
        }
      })
    }
  }, [page, fetch, id, language])

  return <>
    { useApolloData(result, ({ analysis }) => {
      const check = getApkReport(analysis)?.auditReport
      if (!check) {
        throw new Error('impossible')
      }

      return <>
        <Report check={check} />
      </>
    })}
  </>
}
