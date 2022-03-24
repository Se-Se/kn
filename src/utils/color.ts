import { CheckRisk, CvssRank, LicenseRisk, ProcRiskLevel } from 'generated/graphql'

export const CVSSRankColor: Record<CvssRank, string> = {
  Critical: '#ff584c',
  High: '#ff9c19',
  Medium: '#ffc218',
  Low: '#5eba66',
}

export const LicenseRiskColors: Record<LicenseRisk, string> = {
  High: '#ff584c',
  Middle: '#ff9c19',
  Low: '#46c84e',
  NotAvailable: '#006dff',
}

export const ProcRiskColors: Record<ProcRiskLevel, string> = {
  High: '#e54545',
  Medium: '#ff9d00',
  Low: '#ffc218',
  Pass: '#006dff',
}

export const CheckRiskColors: Record<CheckRisk, string> = {
  [CheckRisk.High]: '#ff584c',
  [CheckRisk.Medium]: '#ff9c19',
  [CheckRisk.Warning]: '#ffc218',
  [CheckRisk.Pass]: '#47cc50',
  [CheckRisk.NotAvailable]: '#006dff',
}
