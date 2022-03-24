import React, { useContext, useEffect, useMemo, createContext, useState,useCallback } from 'react';
import { useApolloData } from 'hooks/common';
import { Button, Menu } from 'tdesign-react';
import styled from '@emotion/styled/macro';

import { useViewerQuery, useTeamSelectListQuery } from 'generated/graphql';
import { Layout, Select, Blank } from '@tencent/tea-component';
import { Redirect, useLocation, Switch, Route, useHistory } from 'react-router-dom';
import { Localized } from 'i18n';
import { useData } from 'pages/template/common';
import { useInput } from 'hooks/useInput';
import { Loading } from 'components/Loading';
import { PermTeamProvider } from 'components/PermissionGate';
import MenuItem from 'tdesign-react/es/menu/MenuItem';
import SubMenu from 'tdesign-react/es/menu/SubMenu';
import { ViewListIcon, DashboardIcon, ViewModuleIcon, ControlPlatformIcon, ServerIcon, PreciseMonitorIcon, UserCircleIcon } from 'tdesign-icons-react';
import { Pattern } from 'route';
import MenuGroup from 'tdesign-react/es/menu/MenuGroup';
import { ComplianceStatuscCtrl } from './ComplianceStatuscCtrl';

interface TeamCtxValue {
  teamId: string
  teamName: string
}



const TeamCtx = createContext<TeamCtxValue>({ teamId: '', teamName: '' })
export const TeamProvider = TeamCtx.Provider
const TeamSelectCtx = createContext<React.ReactNode>(undefined)
export const TeamSelect: React.FC = () => <>{useContext(TeamSelectCtx)}</>

export const useTeamId = () => useContext(TeamCtx)

const LastTeamId = 'c-last-teamid'
export const useTeamSelect = () => {
  const { state } = useLocation<{ team?: string }>()
  const [teamId, setTeamId] = useInput<string | undefined>(undefined)
  const result = useTeamSelectListQuery()
  const { records, tip } = useData(result, ({ team }) => team)
  const options = useMemo(() => records.map(i => ({
    value: i.id,
    text: i.name,
  })), [records])

  useEffect(() => {
    if (state && state.team) {
      const t = records.find(i => i.name === state.team)
      if (t) {
        setTeamId(t.id)
      }
    }
  }, [state, records, setTeamId])
  useEffect(() => {
    if (teamId.value === undefined && records.length > 0) {
      const lastId = window.localStorage.getItem(LastTeamId)
      if (records.some(i => i.id === lastId)) {
        setTeamId(lastId!)
      } else {
        setTeamId(records[0].id)
      }
    }
  }, [teamId.value, records, setTeamId])
  useEffect(() => {
    if (teamId.value !== undefined) {
      window.localStorage.setItem(LastTeamId, teamId.value)
    }
  }, [teamId.value])
  const value: TeamCtxValue | undefined = useMemo(() => {
    const team = records.find(i => i.id === teamId.value)

    return (teamId.value && team) ? {
      teamId: teamId.value,
      teamName: team.name
    } : undefined
  }, [teamId.value, records])


  return {
    teamSelect: <Select
      boxSizeSync
      size='m'
      type='simulate'
      appearance='button'
      autoClearSearchValue={false}
      onScrollBottom={() => {
        // TODO
      }}
      options={options || []}
      bottomTips={tip}
      {...teamId}
    />,
    value,
    /**
     * Because useEffect takes 1 tick to update value, when loading turns to false
     * there will be 1 tick { loading: false, value: undefined }
     * this expression avoid this tick
     */
    loading: result.loading || (records.length > 0 && teamId.value === undefined)
  } as const
}

export function getTeam<T>(d: T): T extends { __typename?: 'Team' } ? T : undefined {
  // @ts-ignore
  return d?.__typename === 'Team' ? d : undefined
}

const { Content, Body, Sider } = Layout

const Empty: React.FC = () => {
  return <Localized id='empty-team' attrs={{
    description: true,
  }}><Blank theme='permission'></Blank></Localized>
}

export const Page: React.FC = ({ children }) => {
  const { teamSelect, value: teamVal, loading } = useTeamSelect()
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('');
  const [expands, setExpands] = useState<Array<string>>();

  const history = useHistory();

  const listenEvent = useCallback(() => {
    history.listen(value => {
      // console.log('============',value);
      // console.log(active);
      // console.log(expands)
      setMenuActive()
    })
  }, [])

  const routerPush = (url: Pattern) => {
    setActive(url);
    // console.log(url)
    history.push(url);
  }

  const setMenuActive = function(){
    
    const domain = history.location.pathname;
    const domainArr = domain.split('/');
    let active = '';
    let expand: any = [];
    if (domainArr.includes('complianceTestingCenter') || domainArr.includes('dashboard') ) {
      active = '/' + domainArr[1] + '/' + domainArr[2] + '/';
      expand = [domainArr[2]];
    }
    else if (domainArr.includes('caseManage')) {
      active = '/' + domainArr[1] + '/' + domainArr[2] + '/' + domainArr[3]+'/';
      expand = [domainArr[2]];
    }
    else {
      active = domain;
      expand = [domainArr[2]];
    }
    // console.log(active);
    // console.log(expand);

    setActive(active)
    setExpands(expand)

  }

  // const initMenuActive = function(){
  //   const domain = history.location.pathname;
  //   const domainArr = domain.split('/');
  //   let active = '';
  //   let expand: any = [];
  //   if (domainArr.includes('complianceTestingCenter') || domainArr.includes('dashboard')) {
  //     active = '/' + domainArr[1] + '/' + domainArr[2] + '/';
  //     expand = [domainArr[2]];
  //   }
  //   else {
  //     active = domain;
  //     expand = [domainArr[2]];
  //   }
  //   console.log(active);
  //   console.log(expand);

  //   setActive(active)
  //   setExpands(expand)
  // }

  // useEffect(()=>{
  //   console.log('expand changed',expands)
  // },[expands])


  useEffect(() => {
    // initMenuActive();
    setMenuActive();
    listenEvent();
  }, [])
  return useApolloData(useViewerQuery(), data => {
    return (
      <PermTeamProvider value={teamVal?.teamId}>
        {/* <ComplianceStatuscCtrl></ComplianceStatuscCtrl> */}
        <Body className=''>
          <Sider>
            <Menu
              expandMutex
              value={active}
              theme="dark"
              style={{ height: "100%" }}
              collapsed={collapsed}
              defaultExpanded={expands}
              operations={
                <ViewListIcon
                  className="t-menu__operations-icon"
                  onClick={() => setCollapsed(!collapsed)}
                />
              }
            >
              <SubMenu
                value="dashboard"
                title={<span>仪表盘</span>}
                icon={<DashboardIcon />}
              >
                <MenuItem
                  value={Pattern.DashBoard}
                  onClick={(e) => {routerPush(Pattern.DashBoard) }}
                >
                  <span>仪表盘</span>
                </MenuItem>
              </SubMenu>
              <SubMenu
                value="complianceTestingCenter"
                title={<span>检测中心</span>}
                icon={<ServerIcon />}
              >

                <MenuItem
                  value={Pattern.ComplianceTestingCenter}
                  onClick={() => routerPush(Pattern.ComplianceTestingCenter)}
                >
                  <span>检测中心</span>
                </MenuItem>
              </SubMenu>
              <MenuGroup title="管理">
                <SubMenu
                  value="caseManage"
                  title={<span>用例管理</span>}
                  icon={<ViewModuleIcon />}
                >
                  <MenuItem
                    value={Pattern.CaseManage}
                    onClick={() =>
                      routerPush(Pattern.CaseManage)
                    }
                  >
                    <span>用例管理</span>
                  </MenuItem>
                  <MenuItem
                    value={Pattern.SuitManage}
                    onClick={() =>
                      routerPush(Pattern.SuitManage)
                    }
                  >
                    <span>用例集管理</span>
                  </MenuItem>
                </SubMenu>
                <SubMenu
                  value="assetsManage"
                  title={<span>资产管理</span>}
                  icon={<ControlPlatformIcon />}
                >
                  <MenuItem
                    value={Pattern.CarDisplay}
                    onClick={() =>
                      routerPush(Pattern.CarDisplay)
                    }
                  >
                    <span>整车展示</span>
                  </MenuItem>
                  <MenuItem
                    value={Pattern.CarModelManage}
                    onClick={() =>
                      routerPush(Pattern.CarModelManage)
                    }
                  >
                    <span>车型管理</span>
                  </MenuItem>
                  <MenuItem
                    value={Pattern.ComponentManage}
                    onClick={() =>
                      routerPush(Pattern.ComponentManage)
                    }
                  >
                    <span>零部件管理</span>
                  </MenuItem>
                  <MenuItem
                    value={Pattern.SystemManage}
                    onClick={() =>
                      routerPush(Pattern.SystemManage)
                    }
                  >
                    <span>系统管理</span>
                  </MenuItem>
                  <MenuItem
                    value={Pattern.HardWareManage}
                    onClick={() =>
                      routerPush(Pattern.HardWareManage)
                    }
                  >
                    <span>硬件管理</span>
                  </MenuItem>
                  <MenuItem
                    value={Pattern.SoftWareManage}
                    onClick={() =>
                      routerPush(Pattern.SoftWareManage)
                    }
                  >
                    <span>软件管理</span>
                  </MenuItem>


                </SubMenu>
                <SubMenu
                  value={Pattern.BugManage}
                  title={<span>漏洞管理</span>}
                  icon={<PreciseMonitorIcon />}
                >
                  <MenuItem
                    value={Pattern.BugManage}
                    onClick={() =>
                      routerPush(Pattern.BugManage)
                    }
                  >
                    <span>漏洞管理</span>
                  </MenuItem>
                </SubMenu>
                <SubMenu
                  value={Pattern.UserManage}
                  title={<span>用户管理</span>}
                  icon={<UserCircleIcon />}
                >
                  <MenuItem
                    value={Pattern.UserManage}
                    onClick={() =>
                      routerPush(Pattern.UserManage)
                    }
                  >
                    <span>用户管理</span>
                  </MenuItem>
                </SubMenu>
              </MenuGroup>
            </Menu>
          </Sider>
          <Content>
            {/* {!data.viewer && <Redirect to='/login' />} */}
            <Switch>
              <Route>
                {loading ? (
                  <Loading />
                ) : teamVal ? (
                  <>
                    <TeamSelectCtx.Provider value={teamSelect}>
                      <TeamCtx.Provider value={teamVal}>
                        {children}
                      </TeamCtx.Provider>
                    </TeamSelectCtx.Provider>
                  </>
                ) : (
                  <Empty />
                )}
              </Route>
            </Switch>
          </Content>
        </Body>
      </PermTeamProvider>
    );
  }, () => <Redirect to='/login' />)
}
