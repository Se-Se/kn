import React, { useCallback } from 'react';
import { ProjectStorage } from './detail/Storage';
import { ProjectCheckSec } from './detail/CheckSec';
import { ProjectCVESec } from './detail/CVESec';
import { ProjectNetwork } from './detail/Network';
import { ProjectFiles } from './detail/File';
import { ProjectProcess } from './detail/Process';
import { ProjectSystem } from './detail/System';
import { ProjectUser } from './detail/User';
import { ProjectCommands } from './detail/Command';
import { ProjectPeripheral } from './detail/Peripheral';
import { useHistory } from 'react-router-dom';
import { TypedAudits } from './Report';
import { Overview } from './overview/Overview';
import { Management, Report } from 'icons';
import { AnalysisType, SysReportAnalysisFragment } from 'generated/graphql';
import { GenericReport } from './generic-report';
import { BaselineAudits, CustomizedAudits } from './statistics/Statistics';
import { CustomGenericReport } from './generic-report/GenericReport';
import { SensitiveUrl, SensitiveIP, SensitiveEmail, SensitiveUriPassword, SensitivePrivKey } from './sensitive-info/SensitiveInfo';
import { ProcessRisk } from './potential-risk/ProcessRisk';
import { AndroidRisk } from './potential-risk/AndroidRisk';
import { ThreatAlert } from './threat-alert/ThreatAlert';
import { useReportLink } from '../context';
import { ProjectLicense } from './detail/License';
import { ReportConfigKeys, ReportFeatureConfig, useReportConfig } from 'components/Config';
import { keys } from 'utils/keys';

export type RouteItem = {
  id: string
  title?: string
  component: React.FC<{ analysis: SysReportAnalysisFragment }>
};
export type RouteCategory = {
  icon?: string
  title?: string
  noSub?: boolean
  children: readonly RouteItem[]
};

export type RouteType = readonly [string, RouteCategory?];
export type RouteTypes = RouteType[];

export function useJump() {
  const history = useHistory();
  const base = useReportLink()({});

  return useCallback((rUrl: string, position?: number, keyword?: string) => {
    let url = `${base}${rUrl}`;
    if (keyword) {
      url += `?highlight=${encodeURIComponent(keyword)}`;
    }
    history.push(url, {
      action: 'jump',
      position,
    });
  }, [history, base]);
}

const ReportRouteList: Record<string, { icon: string, title?: string, noSub?: boolean, children: Record<string, React.FC<any>> }> = {
  overview: {
    icon: Report.RawData,
    children: {
      overview: Overview,
      baseline: BaselineAudits,
      customized: CustomizedAudits,
    },
  },
  detail: {
    icon: Report.DetailReport,
    children: {
      system: ProjectSystem,
      user: ProjectUser,
      network: ProjectNetwork,
      storage: ProjectStorage,
      file: ProjectFiles,
      process: ProjectProcess,
      command: ProjectCommands,
      peripheral: ProjectPeripheral,
    },
  },
  'sensitive-info': {
    icon: Report.SensitiveInfo,
    children: {
      'sensitive-url': SensitiveUrl,
      'sensitive-ip': SensitiveIP,
      'sensitive-email': SensitiveEmail,
      'sensitive-pri-key': SensitivePrivKey,
      'sensitive-uri-password': SensitiveUriPassword,
    },
  },
  'potential-risk': {
    icon: Report.ThreatAlert,
    children: {
      'process-risk': ProcessRisk,
      'attack-chain': ThreatAlert,
      'android-risk': AndroidRisk,
    },
  },
  statistics: {
    icon: '',
    children: {},
  },
  cvesec: {
    icon: Report.AddOnCheck,
    noSub: true,
    children: {
      cvesec: ProjectCVESec,
    },
  },
  license: {
    icon: Management.License,
    noSub: true,
    children: {
      license: ProjectLicense,
    },
  },
  baseline: {
    icon: Report.BaselineAudit,
    children: {
      checksec: ProjectCheckSec,
    },
  },
  customized: {
    icon: Report.BaselineAudit,
    children: {},
  },
};

type DeleteList = { parent?: string[], children?: string[] };

const reportConfigDeleteList: Record<ReportConfigKeys, DeleteList> = {
  detail: {
    parent: ['detail'],
  },
  sensitive: {
    parent: ['sensitive-info'],
  },
  risk: {
    parent: ['potential-risk'],
  },
  cveSec: {},
  cveKernel: {},
  license: {
    parent: ['license'],
  },
  baseline: {
    parent: ['baseline'],
    children: ['baseline'],
  },
  custom: {
    parent: ['customized'],
    children: ['customized'],
  },
};

const analysisTypeDeleteList: Record<AnalysisType, DeleteList> = {
  SystemLinux: {
    parent: ['license'],
    children: ['android-risk'],
  },
  SystemAndroid8: {
    parent: ['license'],
  },
  SystemAndroid9: {
    parent: ['license'],
  },
  SystemAndroid10: {
    parent: ['license'],
  },
  SystemOther: {
    parent: ['license'],
    children: ['android-risk'],
  },
  ArtifactAPK: {
    children: ['baseline', 'Information Audit', 'android-risk'],
  },
  ArtifactPackage: {
    children: [
      ...keys(ReportRouteList.detail.children).filter(i => i !== 'file'),
      ...keys(ReportRouteList['potential-risk'].children),
      'android-risk',
      'baseline',
      'Information Audit',
    ],
  },
  ArtifactRTOS: {
    parent: ['baseline'],
    children: [
      ...keys(ReportRouteList.detail.children),
      ...keys(ReportRouteList['potential-risk'].children),
      'android-risk',
      'baseline',
      'checksec',
      'Information Audit',
    ],
  },
};

const childType = (id: string, component: React.FC<any>, title?: string) => ({ id, title, component });

const routeList = (audits: TypedAudits): RouteTypes => {
  const routeListResult: RouteTypes = [];
  for (const [key, { icon, title, noSub, children }] of Object.entries(ReportRouteList)) {
    const child: RouteItem[] = keys(children).map(i => childType(i, children[i]));

    if (key === 'baseline' && audits.baseline) {
      child.push(...audits.baseline.map(i => childType(i.key, GenericReport, i.class)));
    }
    if (key === 'customized' && audits.customized) {
      child.push(...audits.customized.map(i => childType(i.key, CustomGenericReport, i.class)));
    }

    if (key === 'statistics') routeListResult.push([key]);
    routeListResult.push([key, { icon, title, noSub, children: child }]);
  }
  return routeListResult;
};

const getConfigDeleteList = (reportConfig: ReportFeatureConfig): DeleteList => {
  const parent: string[] = [];
  const children: string[] = [];
  for (const i of keys(reportConfig)) {
    if (!reportConfig[i]) {
      parent.push(...reportConfigDeleteList[i]?.parent ?? []);
      children.push(...reportConfigDeleteList[i]?.children ?? []);
    }
  }
  return {
    parent,
    children,
  };
};

// 返回false代表不需要删除
const isEmptyListFilter = ([listName, item]: RouteType) => {
  // item 为空表示是类型, 起分割作用, 要保留
  if (item === undefined) {
    return false;
  }
  if (listName === 'customized') return false;
  if (item?.noSub) return false;
  if (item?.children === undefined) return false;
  return item.children.length === 0;
};

export function useProjectDetailRoute(analysisType: AnalysisType, audits: TypedAudits): RouteTypes {
  const reportConfig = useReportConfig();
  const configDeleteList = getConfigDeleteList(reportConfig);
  const { cveSec, cveKernel } = reportConfig;

  const projectDetailRoute = routeList(audits);

  const deleteParentList = [configDeleteList.parent, analysisTypeDeleteList[analysisType]?.parent].flatMap(i => i ?? []);
  const deleteChildList = [configDeleteList.children, analysisTypeDeleteList[analysisType]?.children].flatMap(i => i ?? []);

  return projectDetailRoute
    .filter(([category]) => !deleteParentList.includes(category))
    // 筛选父节点、子节点
    .map(([category, item]) => {
      if (!item) {
        return [category] as const;
      }

      return [category, {
        ...item,
        children: item.children.filter(i => !deleteChildList.includes(i.id)),
      }] as const;
    })
    // 筛选子节点为空的状态
    .filter(i => !isEmptyListFilter(i))
    // 筛选特殊情况
    .filter(([category]) => {
      // 仅当cvesec和cvekernel都禁用时删除cvesec分类
      if (!cveSec && !cveKernel && category === 'cvesec') return false;
      return true;
    });
}
