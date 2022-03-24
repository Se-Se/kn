import React from 'react';
import { Overview } from './Overview';
import { Signature, Components, Permission } from './Detail';
import { Report } from 'icons';
import { BaselineAudits } from './statistics/Statistics';
import { GenericReport } from './generic-report/GenericReport';
import { CheckItemFragment } from 'generated/graphql';

export type RouteItem = {
  id: string
  title?: string
  component: React.FC
};
export type RouteCategory = {
  icon?: string
  title?: string
  noSub?: boolean
  children: RouteItem[]
};
export type RouteTypes = [string, RouteCategory?][];

export const useRoute = (audits: CheckItemFragment[]): RouteTypes => [
  ['overview', {
    icon: Report.RawData,
    children: [{
      id: 'overview',
      component: Overview,
    }, {
      id: 'apkRisk',
      component: BaselineAudits,
    }],
  }],
  ['detail', {
    icon: Report.DetailReport,
    children: [{
      id: 'signature',
      component: Signature,
    }, {
      id: 'component',
      component: Components,
    }],
  }],
  ['sensitive-info'],
  ['permission', {
    icon: Report.RawData,
    noSub: true,
    children: [{
      id: 'permission',
      component: Permission,
    }],
  }],
  ['statistics'],
  ['apkRisk', {
    icon: Report.BaselineAudit,
    children: audits.map(i => ({
      id: i.key,
      title: i.class,
      component: GenericReport,
    })),
  }],
];
