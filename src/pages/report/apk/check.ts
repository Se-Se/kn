import { ApkRuleFragment, CheckRisk } from 'generated/graphql';
import { AllRiskOrder } from 'components/RiskField';
import { ContentsItem } from 'components/Contents/Contents';

export interface Check<T = unknown> {
  riskLevel: CheckRisk
  checkName: string
  vulInfo?: {
    type: string
    data: T[]
  }
  name: string
  description: string
  remediation: string
  catalog: string
  extra: {
    Impact: string
    OWASPLink: string
    OWASPRisk: string
    Reason: string
  },
}
const parse = (s: string) => {
  try {
    return JSON.parse(s);
  } catch (e) {
    return;
  }
};
export const convert = (rules: ApkRuleFragment[]): Check<unknown>[] => rules.map(({ riskReason, riskContent, riskLevel, ruleName, description, remediation, catalog, extra }) => {
  const info: {
    Type: string
    Json: string
  } | undefined = parse(riskContent);
  const vulInfoData = info ? parse(info.Json) : undefined;
  return {
    checkName: riskReason,
    vulInfo: info ? {
      type: info.Type,
      data: vulInfoData,
    } : undefined,
    riskLevel,
    name: ruleName,
    description,
    remediation,
    catalog,
    // TODO: do some runtime check here
    extra: extra as any,
  };
});

export const sortCheck = (check: Check<unknown>[]): Check<unknown>[] => check.sort((a, b) => {
  let d = AllRiskOrder.indexOf(a.riskLevel) - AllRiskOrder.indexOf(b.riskLevel);
  if (d) {
    return d;
  }
  d = (a.vulInfo?.data.length ?? 0) - (b.vulInfo?.data.length ?? 0);
  if (d) {
    return -d;
  }
  return a.checkName.localeCompare(b.checkName);
});

export const sortCheckToReport = (check: Check<unknown>[]): Check<unknown>[] => check.sort((a, b) => {
  let d = a.catalog.localeCompare(b.catalog);
  if (d) {
    return d;
  }
  d = AllRiskOrder.indexOf(a.riskLevel) - AllRiskOrder.indexOf(b.riskLevel);
  if (d) {
    return d;
  }
  d = (a.vulInfo?.data.length ?? 0) - (b.vulInfo?.data.length ?? 0);
  if (d) {
    return -d;
  }
  return a.checkName.localeCompare(b.checkName);
});

export const getContent = (check: Check<unknown>[]): ContentsItem[] => {
  if (check.length === 0) {
    return [];
  }
  const makeCatelog = (check: Check<unknown>): ContentsItem => ({
    id: `t_${check.catalog}`,
    title: check.catalog,
    children: [],
  });
  let curCatelog: ContentsItem = makeCatelog(check[0]);
  const out: ContentsItem[] = [];
  for (const c of check) {
    if (`t_${c.catalog}` !== curCatelog.id) {
      out.push(curCatelog);
      curCatelog = makeCatelog(c);
    }
    curCatelog.children?.push({
      id: `c_${c.checkName}`,
      title: c.name,
    });
  }
  out.push(curCatelog);
  return out;
};
