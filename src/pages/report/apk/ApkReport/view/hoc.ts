import React from 'react';

type SemVer = [number, number, number];
type ViewType = React.ComponentType<ViewProps>;
interface ViewCollectionItem {
  version: SemVer
  view: ViewType
}
const ViewMap: Map<string, ViewCollectionItem[]> = new Map();

function parse(v: string) {
  const semVer = /(\d+)\.(\d+)\.(\d+)/.exec(v);
  if (semVer === null) {
    return null;
  }
  return semVer.slice(1, 4).map(i => parseInt(i)) as [number, number, number];
}

function compare(v1: SemVer, v2: SemVer) {
  let d = v1[0] - v2[0];
  if (d !== 0) {
    return d;
  }
  d = v1[1] - v2[1];
  if (d !== 0) {
    return d;
  }
  d = v1[2] - v2[2];
  return d;
}

function addViewToMap({ name, version }: ViewParam, view: ViewType) {
  let items = ViewMap.get(name);
  if (items === undefined) {
    items = [];
  }
  const semVer = parse(version);
  if (semVer === null) throw new Error(`Version ${version} is not a valid SemVer`);
  items.push({
    version: semVer,
    view,
  });
  items = items.sort((a, b) => -compare(a.version, b.version));
  ViewMap.set(name, items);
}

export interface ViewProps {
  data: unknown
}
export interface ViewParam {
  name: string
  version: string
}
export function AddView(param: ViewParam | ViewParam[]) {
  if (Array.isArray(param)) {
    return <T>(cls: T) => {
      for (const p of param) {
        addViewToMap(p, cls as any);
      }
      return cls;
    };
  }
  return <T>(cls: T) => {
    addViewToMap(param, cls as any);
    return cls;
  };
}
export function getView(name: string, version?: string) {
  if (version === undefined) {
    version = '1.0.0';
  }
  const semVer = parse(version);
  const items = ViewMap.get(name);
  if (items === undefined || semVer === null) {
    return;
  }

  for (const i of items.filter(i => i.version[0] === semVer[0])) {
    // render version: 0.0.2 0.0.0
    // report version >= render version
    // >=: cmp !== -1
    if (compare(semVer, i.version) !== -1) {
      return i.view;
    }
  }
}
