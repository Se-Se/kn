export type VulRank = 'LOW_RISK' | 'MIDDLE_RISK' | 'HIGH_RISK'
export const RankLevelMap: Record<VulRank, number> = {
  LOW_RISK: 1,
  MIDDLE_RISK: 2,
  HIGH_RISK: 3
}
// TODO: remove EXPLOIT_CHAIN in the future
export type VulCategory = 'ICC' | 'STORAGE' | 'COMMUNICATION' | 'WEBVIEW' | 'CRYPTO' | 'SDK' | 'MISC' | 'CUSTOM_CHECK' | 'EXPLOIT_CHAIN'
export const CategoryOrder: VulCategory[] = [
  'ICC',
  'STORAGE',
  'COMMUNICATION',
  'WEBVIEW',
  'CRYPTO',
  'SDK',
  'MISC',
  'CUSTOM_CHECK',
  'EXPLOIT_CHAIN',
]
export function defaultVulCategoryDict<T>(): Record<VulCategory, T[]> {
  return {
    ICC: [],
    STORAGE: [],
    COMMUNICATION: [],
    WEBVIEW: [],
    CRYPTO: [],
    SDK: [],
    MISC: [],
    CUSTOM_CHECK: [],
    EXPLOIT_CHAIN: [],
  }
}

export interface CommonVulDescription {
  check_name: string
  vul_title: string
  vul_rank: VulRank
  vul_category: VulCategory
  vul_type_title: string
  vul_type_link: string
  vul_cause: string
  vul_impact: string
  vul_sug: string
}
export interface SubVulDescription {
  sub_check_name: string
  vul_title: string
  vul_type_title: string
  vul_type_link: string
  vul_cause: string
  vul_impact: string
  vul_sug: string
  // vul_poc must be present in SDKCheck
  vul_poc?: string
}
export interface CombinationVulDescription {
  check_name: string
  vul_title: string
  vul_rank: VulRank
  vul_category: VulCategory
  sub_vul_descs: SubVulDescription[]
}
export interface VulnDescResponse {
  common_vul_descs: CommonVulDescription[]
  combination_vul_descs: CombinationVulDescription[]
}
export const VulCateGoryMap: Record<VulCategory, string> = {
  'ICC': '组件间通信',
  'STORAGE': '存储',
  'COMMUNICATION': '网络通信',
  'WEBVIEW': 'WebView',
  'CRYPTO': '加密',
  'SDK': '第三方SDK',
  'MISC': '其他',
  'CUSTOM_CHECK': '自定义检测项',
  'EXPLOIT_CHAIN': '漏洞利用链'
}

export interface ExportedComponent {
  name: string
}
export interface CFGData {
  callSite: string
  caller: string
}
export type ICFGPathData = [{
  location: string
  stmt: string
  start: string
}, ...{
  location: string
  stmt: string
  from: string
  to: string
}[]]
export interface ICFGData {
  component: string
  sink: string
  source: string
  path: ICFGPathData
}
export interface WebviewFileRegionCSRFData {
  vulMethods: CFGData[]
  activityName: string
}
export interface BinaryResultData {
  noASLR: string[]
  noCanary: string[]
}
export interface ConstantKeyData extends CFGData {
  hardcode: string
}

export const RankDict = {
  'HIGH_RISK': '高危',
  'MIDDLE_RISK': '中危',
  'LOW_RISK': '低危',
}
