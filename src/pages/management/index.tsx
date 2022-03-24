import React from 'react'
import { Layout, Menu } from '@tencent/tea-component'
import { Redirect } from 'react-router-dom'
import { Localized } from 'i18n'
import { useApolloData } from 'hooks/common'
import { useViewerQuery } from 'generated/graphql'
import { Ahead } from 'components/Ahead'
import { LinkItem } from 'components/LinkItem'
import { Management, Dashboard } from 'icons'
import { IconMenu } from 'components/IconMenu'

const { Body, Sider, Content } = Layout

export const Page: React.FC = ({ children }) => {
  return useApolloData(useViewerQuery(), data => {
    return (
      <Body>
        <Sider>
          <IconMenu>
            <Menu.Group title={<Ahead><Localized id='management' /></Ahead>}>
              <LinkItem
                title={<Localized id='management-status' />}
                to='/management/status/'
                icon={Management.Status}
              />
              <LinkItem
                title={<Localized id='management-user' />}
                to='/management/user/'
                icon={Management.User}
              />
              <LinkItem
                title={<Localized id='management-team' />}
                to='/management/team/'
                icon={Dashboard.Team}
              />
              <LinkItem
                title={<Localized id='management-project' />}
                to='/management/project/'
                icon={Dashboard.Project}
              />
              <LinkItem
                title={<Localized id='management-agent' />}
                to='/management/agent/'
                icon={Management.Agent}
              />
              <LinkItem
                title={<Localized id='management-task' />}
                to='/management/task/'
                icon={Management.Task}
              />
              <LinkItem
                title={<Localized id='management-log' />}
                to='/management/log/'
                icon={Management.Log}
              />
              <LinkItem
                title={<Localized id='management-license' />}
                to='/management/license/'
                icon={Management.License}
              />
              <Menu.SubMenu
                title={<Localized id='management-settings' />}
                icon={Management.Settings}
              >
                <LinkItem
                  title={<Localized id='management-settings-system' />}
                  to='/management/settings/system'
                />
                <LinkItem
                  title={<Localized id='management-settings-sso' />}
                  to='/management/settings/sso'
                />
              </Menu.SubMenu>
            </Menu.Group>
          </IconMenu>
        </Sider>
        <Content>
          {data.viewer ? children : <Redirect to='/login' />}
        </Content>
      </Body>
    )
  }, () => <Redirect to='/login' />)
}
