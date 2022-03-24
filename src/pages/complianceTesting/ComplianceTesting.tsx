import React, { useContext, useEffect, useMemo, createContext } from 'react';
import { useApolloData } from 'hooks/common';
import { useViewerQuery, useTeamSelectListQuery } from 'generated/graphql';
import { Layout, Menu, Select, Blank } from '@tencent/tea-component';
import { Redirect, useLocation, Switch, Route } from 'react-router-dom';
import { Localized } from 'i18n';
import { useData } from 'pages/template/common';
import { useInput } from 'hooks/useInput';
import { Loading } from 'components/Loading';
import { PermTeamProvider } from 'components/PermissionGate';
import { Ahead } from 'components/Ahead';
import { LinkItem } from 'components/LinkItem';
import { IconMenu } from 'components/IconMenu';
import { ComplianceStatuscCtrl } from './ComplianceStatuscCtrl';
import iconMananger from '../../image/2.svg'
import iconDashBroad from '../../image/3.svg'
import iconSuite from '../../image/4.svg'
import iconCase from '../../image/5.svg'
import iconCar from '../../image/6.svg'
import iconUser from '../../image/8.svg'

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

  return useApolloData(useViewerQuery(), data => {
    return (
      <PermTeamProvider value={teamVal?.teamId}>
        {/* <ComplianceStatuscCtrl></ComplianceStatuscCtrl> */}
          <Body>
            <Sider>
              <IconMenu collapsable>
                <Menu.Group title={<Ahead><Localized id='nav-studio' /></Ahead>}>
                  <LinkItem
                    title={<Localized id='dashboard-overview' />}
                    to='/complianceTesting/dashboard/'
                    icon={iconDashBroad}
                  />
                  <LinkItem
                    title={<Localized id='compliance-testCenter' />}
                    to='/complianceTesting/studio/'
                    icon={iconMananger}
                  />
                  {/* <LinkItem
                  title={<Localized id='compliance-checkConfig-carModule' />}
                  to='/complianceTesting/carModel/Manage'
                  icon={Dashboard.Overview}
                />
                <LinkItem
                  title={<Localized id='compliance-checkConfig-law' />}
                  to='/complianceTesting/law'
                  icon={Dashboard.Overview}
                />
                <LinkItem
                  title={<Localized id='compliance-suite' />}
                  to='/complianceTesting/law'
                  icon={Dashboard.Overview}
                /> */}
                  <LinkItem
                    title={<Localized id='compliance-suiteManage' />}
                    to='/complianceTesting/suite/'
                    icon={iconSuite}
                  />
                  <LinkItem
                    title={<Localized id='compliance-caseManage' />}
                    to='/complianceTesting/case/'
                    icon={iconCase}
                  />
                  <LinkItem
                    title={<Localized id='compliance-checkConfig-carModule' />}
                    to='/complianceTesting/carModel/Manage'
                    icon={iconCar}
                  />
                  <LinkItem
                    title={<Localized id='management-user' />}
                    to='/complianceTesting/user/'
                    icon={iconUser}
                  />
                  {/* <Menu.SubMenu defaultOpened title={<Localized id="nav-management"></Localized>} icon={iconCenter}> */}


                  {/* <LinkItem
                    title={<Localized id='management-team' />}
                    to='/complianceTesting/team/'
                    icon={Dashboard.Overview}
                  /> */}

                  {/* </Menu.SubMenu> */}


                  {/* <LinkItem
                 title={<Localized id='management' />}
                 to='/management/status/'
                 icon={Dashboard.Overview}
               /> */}
                  {/* <LinkItem
                  title={<Localized id='compliance-checkProject' />}
                  to='/complianceTesting/project/'
                  icon={Dashboard.Team}
                />
                <Menu.SubMenu
                  title={<Localized id='compliance-checkConfig' />}
                  icon={Dashboard.Settings}
                >
                  <LinkItem
                    title={<Localized id='compliance-checkConfig-law' />}
                    to='/complianceTesting/config/law'
                  />
                  <LinkItem
                    title={<Localized id='compliance-checkConfig-carModule' />}
                    to='/complianceTesting/config/carModule'
                  />
                </Menu.SubMenu> */}
                </Menu.Group>
              </IconMenu>
            </Sider>
            <Content>
              {/* {!data.viewer && <Redirect to='/login' />} */}
              <Switch>
                <Route>
                  {loading ? <Loading /> : teamVal ? <>
                    <TeamSelectCtx.Provider value={teamSelect}>
                      <TeamCtx.Provider value={teamVal}>
                        {children}
                      </TeamCtx.Provider>
                    </TeamSelectCtx.Provider>
                  </> : <Empty />}
                </Route>
              </Switch>
            </Content>
          </Body>
      </PermTeamProvider>
    )
  }, () => <Redirect to='/login' />)
}
