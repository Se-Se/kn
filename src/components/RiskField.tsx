import React, { useMemo } from 'react'
import { CvssRank, CheckRisk, CvssRankStatistics, CheckRiskStatistics, CommonRisk, AnalysisStatus, AllRiskStatisticsFragment } from 'generated/graphql'
import styled from '@emotion/styled/macro'
import { ReactComponent as HighRisk } from 'icons/Risk/high.svg'
import { ReactComponent as MediumRisk } from 'icons/Risk/medium.svg'
import { ReactComponent as WarningRisk } from 'icons/Risk/warning.svg'
import { ReactComponent as PassRisk } from 'icons/Risk/pass.svg'
import { ReactComponent as NARisk } from 'icons/Risk/na.svg'
import { useGetMessage } from 'i18n'
import { TitledPie } from './TitledPie'

export const RiskColors: Record<CheckRisk, string> = {
  [CheckRisk.High]: '#ff584c',
  [CheckRisk.Medium]: '#ff9c19',
  [CheckRisk.Warning]: '#ffc218',
  [CheckRisk.Pass]: '#47cc50',
  [CheckRisk.NotAvailable]: '#006dff',
}

export const CommonRiskColors: Record<CommonRisk, string> = {
  [CommonRisk.High]: '#ff584c',
  [CommonRisk.Medium]: '#ff9c19',
  [CommonRisk.Low]: '#46c84e',
}

export const RiskItemBox = styled.span`
  & > svg {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 5px;
  }
`

const RiskCountBox = styled.span`
  ${Object.keys(RiskColors).map(risk => `&[data-risk="${risk}"] { fill: ${RiskColors[risk as CheckRisk]}; }`)}
`

export const RiskIcons: Record<CheckRisk, React.FC> = {
  [CheckRisk.High]: HighRisk,
  [CheckRisk.Medium]: MediumRisk,
  [CheckRisk.Warning]: WarningRisk,
  [CheckRisk.Pass]: PassRisk,
  [CheckRisk.NotAvailable]: NARisk,
}

const ItemBox = styled.span`
  display: inline-flex;
  width: 45px;
  margin-right: 5px;
  &:last-child {
    margin-right: 0;
  }
`
export const RiskFieldWidth = 270
export const RiskTableColumn = {
  key: 'riskStatistic',
  width: RiskFieldWidth,
  render: (item: { risk: AllRiskStatisticsFragment, status: AnalysisStatus }) => {
    const disabled = item.status !== AnalysisStatus.Success
    return <RiskField risk={item.risk.baseline ?? []} disabled={disabled} />
  }
}

const RiskFieldBox = styled.div`
  svg {
    width: 16px;
    height: 16px;
  }
`
const ItemCount = styled.span`
`

export type ShowRisk = CheckRisk.High | CheckRisk.Medium | CheckRisk.Warning
export const RiskOrder: ShowRisk[] = [CheckRisk.High, CheckRisk.Medium, CheckRisk.Warning]
export const AllRiskOrder = [CheckRisk.High, CheckRisk.Medium, CheckRisk.Warning, CheckRisk.Pass, CheckRisk.NotAvailable]
export const isShowRisk = (i: string): i is ShowRisk => RiskOrder.includes(i as ShowRisk)

const Item: React.FC<{ risk: CheckRisk, count: number, disabled?: boolean }> = ({ risk, count, disabled }) => {
  return <ItemBox>
    <RiskItem hideText risk={risk}></RiskItem>
    <ItemCount>{disabled ? '-' : count}</ItemCount>
  </ItemBox>
}

type RiskFieldProps = {
  risk: CheckRiskStatistics[]
  disabled?: boolean
}

export const RiskField: React.FC<RiskFieldProps> = ({ risk, disabled }) => {
  const dict = useMemo(() => {
    return Object.fromEntries(risk.map(i => [i.risk, i])) as Record<CheckRisk, CheckRiskStatistics | undefined>
  }, [risk])

  return <RiskFieldBox>
    {RiskOrder.map(i => [i, dict[i]] as const).map(([i, r]) => <Item
      key={i}
      risk={i}
      count={r?.count ?? 0}
      disabled={disabled}
    />)}
  </RiskFieldBox>
}

export const useGetRiskMessage = () => {
  const getMessage = useGetMessage()
  return (id: CheckRisk, params?: Record<string, string> | undefined, defaultText?: string | undefined) => getMessage(
    `enum-risk-${id}`, params, defaultText
  )
}

export const RiskColorCount: React.FC<{}> = () => {
  return <RiskCountBox>

  </RiskCountBox>
}

export const RiskItem: React.FC<{ risk: CheckRisk, hideText?: boolean }> = ({ risk, hideText, children }) => {
  const Icon = RiskIcons[risk]
  const getRiskMessage = useGetRiskMessage()
  return <RiskItemBox>
    <Icon data-risk={risk} />
    {!hideText ? <span style={{ color: RiskColors[risk] }}>{getRiskMessage(risk)}</span> : children}
  </RiskItemBox>
}

export const RiskPie: React.FC<{
  title: React.ReactNode
  data: CheckRiskStatistics[]
}> = ({ title, data }) => {
  const getRiskMessage = useGetRiskMessage()
  return <TitledPie
    title={title}
    circle
    height={250}
    dataSource={data}
    position='count'
    color={{
      key: 'risk',
      colors: (i) => {
        return RiskColors[i as CheckRisk]
      },
    }}
    legend={{
      formatter: (i) => {
        return getRiskMessage(i as CheckRisk)
      }
    }}
  />
}

export type GeneralRiskPieProps<K extends string> = {
  title: React.ReactNode
  data: {
    risk: K,
    count: number,
  }[]
  colorMap: Record<K, string>
  prefix: string
}
export function GeneralRiskPie<T extends string>({ title, data, colorMap, prefix }: GeneralRiskPieProps<T>) {
  const getMessage = useGetMessage()
  return <TitledPie
    title={title}
    circle
    height={250}
    dataSource={data}
    position='count'
    color={{
      key: 'risk',
      colors: (c) => {
        return colorMap[c as T]
      },
    }}
    legend={{
      formatter: (i) => {
        return getMessage(prefix + i)
      }
    }}
  />
}

// TODO need some refactor
export const CvssRankToRisk: Record<CvssRank, CheckRisk> = {
  [CvssRank.Critical]: CheckRisk.High,
  [CvssRank.High]: CheckRisk.Medium,
  [CvssRank.Medium]: CheckRisk.Warning,
  [CvssRank.Low]: CheckRisk.Pass,
}
export const CvssRanksToRisks = (risk: CvssRankStatistics[]): CheckRiskStatistics[] => {
  return risk.map((i): CheckRiskStatistics => {
    return {
      count: i.count,
      risk: CvssRankToRisk[i.risk],
    }
  })
}

type CvssRiskFieldProps = {
  cvssRank: CvssRankStatistics[]
  disabled?: boolean
}
const CvssRiskOrder: CheckRisk[] = [CheckRisk.High, CheckRisk.Medium, CheckRisk.Warning, CheckRisk.Pass]
export const CvssRiskField: React.FC<CvssRiskFieldProps> = ({ cvssRank, disabled }) => {
  const risk = CvssRanksToRisks(cvssRank)
  const dict = useMemo(() => {
    return Object.fromEntries(risk.map(i => [i.risk, i])) as Record<CheckRisk, CheckRiskStatistics | undefined>
  }, [risk])

  return <RiskFieldBox>
    {CvssRiskOrder.map(i => [i, dict[i]] as const).map(([i, r]) => <Item
      key={i}
      risk={i}
      count={r?.count ?? 0}
      disabled={disabled}
    />)}
  </RiskFieldBox>
}

export const useGetCvssRiskMessage = () => {
  const getMessage = useGetMessage()
  return (id: CheckRisk, params?: Record<string, string> | undefined, defaultText?: string | undefined) => getMessage(
    `enum-cvssrisk-${id}`, params, defaultText
  )
}
export const CvssRiskItem: React.FC<{ cvssRank: CvssRank, hideText?: boolean }> = ({ cvssRank, hideText, children }) => {
  const risk = CvssRankToRisk[cvssRank]
  const Icon = RiskIcons[risk]
  const getCvssRiskMessage = useGetCvssRiskMessage()
  return <RiskItemBox>
    <Icon data-risk={cvssRank} />
    {!hideText ? <span style={{ color: RiskColors[risk] }}>{getCvssRiskMessage(risk)}</span> : children}
  </RiskItemBox>
}
