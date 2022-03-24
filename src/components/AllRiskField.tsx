import React, { useCallback, useMemo } from 'react'
import { ReactComponent as BaselineSvgIcon } from 'icons/Risk/baseline.svg'
import { ReactComponent as LicenseSvgIcon } from 'icons/Risk/license.svg'
import { ReactComponent as CveSvgIcon } from 'icons/Risk/cve.svg'
import styled from '@emotion/styled/macro'
import { useReportVariable } from './Config'
import { AllRiskStatisticsFragment, AnalysisStatus, CheckRisk, CommonStatus, CvssRank, LicenseRisk } from 'generated/graphql'
import { ReactComponent as HighRisk } from 'icons/Risk/high.svg'
import { ReactComponent as MediumRisk } from 'icons/Risk/medium.svg'
import { ReactComponent as WarningRisk } from 'icons/Risk/warning.svg'
import { ReactComponent as PassRisk } from 'icons/Risk/pass.svg'
import { Bubble } from '@tencent/tea-component'
import { Localized, useGetMessage } from 'i18n'
import { Values } from 'utils/values'
import { CheckRiskColors, CVSSRankColor, LicenseRiskColors } from 'utils/color'

export const AllRisks = ['baseline', 'license', 'cve'] as const
export type AllRisk = Values<typeof AllRisks>

interface RiskTypeMap {
  baseline: CheckRisk
  license: LicenseRisk
  cve: CvssRank
}

enum RiskLevel {
  High,
  Medium,
  Low,
}

// return [[high level], [middle level]]
const getAllRiskLevelOrder = <K extends AllRisk>(type: K): readonly RiskTypeMap[K][][] => {
  switch (type) {
    case 'baseline':
      return [[CheckRisk.High], [CheckRisk.Medium, CheckRisk.Warning]] as RiskTypeMap[K][][]
    case 'license':
      return [[LicenseRisk.High], [LicenseRisk.Middle]] as RiskTypeMap[K][][]
    case 'cve':
      return [[CvssRank.Critical], [CvssRank.High]] as RiskTypeMap[K][][]
  }
  throw new Error('unreachable')
}


// return [from high, to low]
export const getAllRiskShowOrder = <K extends AllRisk>(type: K): {
  risk: RiskTypeMap[K],
  icon: React.FC,
}[] => {
  switch (type) {
    case 'baseline':
      return [{
        risk: CheckRisk.High,
        icon: HighRisk,
      }, {
        risk: CheckRisk.Medium,
        icon: MediumRisk,
      }, {
        risk: CheckRisk.Warning,
        icon: WarningRisk,
      }, {
        risk: CheckRisk.Pass,
        icon: PassRisk,
      }] as {
        risk: RiskTypeMap[K],
        icon: React.FC,
      }[]
    case 'license':
      return [{
        risk: LicenseRisk.High,
        icon: HighRisk,
      }, {
        risk: LicenseRisk.Middle,
        icon: MediumRisk,
      }, {
        risk: LicenseRisk.Low,
        icon: PassRisk,
      }] as {
        risk: RiskTypeMap[K],
        icon: React.FC,
      }[]
    case 'cve':
      return [{
        risk: CvssRank.Critical,
        icon: HighRisk,
      }, {
        risk: CvssRank.High,
        icon: MediumRisk,
      }, {
        risk: CvssRank.Medium,
        icon: WarningRisk,
      }, {
        risk: CvssRank.Low,
        icon: PassRisk,
      }] as {
        risk: RiskTypeMap[K],
        icon: React.FC,
      }[]
  }
  throw new Error('unreachable')
}

const RiskLevelColors: Record<RiskLevel, string> = {
  [RiskLevel.High]: '#E54545',
  [RiskLevel.Medium]: '#FF9D00',
  [RiskLevel.Low]: '#0ABF5B',
}

const AllRiskColorBox = styled.span`
  & > svg {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 5px;

    ${Object.keys(RiskLevel).map(level => `&[data-level="${level}"] path { fill: ${RiskLevelColors[level as unknown as RiskLevel]}; }`)}
  }
  & > span {
    ${Object.keys(RiskLevel).map(level => `&[data-level="${level}"] { color: ${RiskLevelColors[level as unknown as RiskLevel]}; }`)}
  }
`

export const AllRiskColor: Record<AllRisk, Record<string, string>> = {
  baseline: CheckRiskColors,
  license: LicenseRiskColors,
  cve: CVSSRankColor,
}

export const AllRiskPrefix: Record<AllRisk, string> = {
  baseline: 'enum-risk-',
  license: 'enum-license-risk-',
  cve: 'enum-cvss-rank-',
}

export const useGetAllRiskMessage = () => {
  const getMessage = useGetMessage()
  return useCallback(<K extends AllRisk>(type: K, risk: RiskTypeMap[K]) => {
    const prefix = AllRiskPrefix[type]
    return getMessage(prefix + risk)
  }, [getMessage])
}

const AllRiskIcons: Record<AllRisk, React.FC> = {
  baseline: BaselineSvgIcon,
  license: LicenseSvgIcon,
  cve: CveSvgIcon,
}

const RiskFieldBox = styled.div`
  margin-top: 10px;
  svg {
    width: 16px;
    height: 16px;
  }
`

const ItemBox = styled.span`
  display: inline-flex;
  min-width: 45px;
  margin-right: 5px;
  &:last-child {
    margin-right: 0;
  }
`

const RiskItemBox = styled.span`
  & > svg {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 5px;
  }
`

type RiskDataItem<K extends AllRisk> = { risk: RiskTypeMap[K], count: number }
type RiskData<K extends AllRisk> = RiskDataItem<K>[]
function RiskDetail<K extends AllRisk>({ type, data, disabled }: { type: K, data: RiskData<K>, disabled?: boolean }) {
  const order = getAllRiskShowOrder(type)
  const dict = useMemo(() => {
    return Object.fromEntries(data.map(i => [i.risk, i])) as unknown as Record<RiskTypeMap[K], RiskDataItem<K> | undefined>
  }, [data])

  return <RiskFieldBox>
    {order.map(i => [i, dict[i.risk]] as const).map(([i, r]) => {
      const Icon = i.icon
      return <ItemBox key={i.risk}>
        <RiskItemBox>
          <Icon />
          <span>{r?.count ?? 0}</span>
        </RiskItemBox>
      </ItemBox>
    })}
  </RiskFieldBox>
}

export function AllRiskField<K extends AllRisk>({ type, data, disabled }: { type: K, data: RiskData<K>, disabled: boolean }) {
  if (disabled) {
    return <>--</>
  }
  // high risk, middle risk, low risk
  const [hl, ml] = getAllRiskLevelOrder(type);
  let showNum = 0
  const total = data.reduce((p, i) => ([CheckRisk.NotAvailable, LicenseRisk.NotAvailable] as string[]).includes(i.risk) ? p : p + i.count, 0)

  let level = RiskLevel.Low
  for (const r of ml) {
    const count = data.find(i => i.risk === r)?.count ?? 0
    if (count > 0) {
      level = RiskLevel.Medium
      showNum = count
    }
  }
  for (const r of hl) {
    const count = data.find(i => i.risk === r)?.count ?? 0
    if (count > 0) {
      level = RiskLevel.High
      showNum = count
    }
  }

  const Icon = AllRiskIcons[type] as React.FC
  return <Bubble
    placement='right'
    content={<>
      <Localized id={`column-statistic-${type}`} />
      <RiskDetail type={type} data={data} />
    </>}
  >
    <AllRiskColorBox>
      <Icon data-level={level} />
      <span data-level={level}>{showNum}</span> / {total}
    </AllRiskColorBox>
  </Bubble>
}

export const isCommonStatusDisabled = <T extends { status: CommonStatus }>() => (t: T) => t.status !== CommonStatus.Completed
export const isAnalysisStatusDisabled = <T extends { status: AnalysisStatus }>() => (t: T) => t.status !== AnalysisStatus.Success
const AllRiskFieldWidth = 120
export const useAllRiskTableColumn = <T extends {
  risk: AllRiskStatisticsFragment
}>(itemDisabled: (item: T) => boolean) => {
  const { baseline, cve, license } = useReportVariable()
  let result: {
    key: string
    width: number
    render: (item: T) => React.ReactElement
  }[] = []
  if (baseline) {
    result.push({
      key: 'statistic-baseline',
      width: AllRiskFieldWidth,
      render: (item: T) => {
        const disabled = itemDisabled(item)
        return <AllRiskField type='baseline' data={item.risk.baseline ?? []} disabled={disabled} />
      }
    })
  }
  if (license) {
    result.push({
      key: 'statistic-license',
      width: AllRiskFieldWidth,
      render: (item: T) => {
        const disabled = itemDisabled(item)
        return <AllRiskField type='license' data={item.risk.license ?? []} disabled={disabled} />
      }
    })
  }
  if (cve) {
    result.push({
      key: 'statistic-cve',
      width: AllRiskFieldWidth,
      render: (item: T) => {
        const disabled = itemDisabled(item)
        return <AllRiskField type='cve' data={item.risk.cve ?? []} disabled={disabled} />
      }
    })
  }
  return result
}
