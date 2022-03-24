import styled from '@emotion/styled/macro'
import React, { useEffect, useState } from 'react'
import { Layout, Menu } from '@tencent/tea-component'
import { ApkReportAnalysisFragment } from 'generated/graphql'
import { useRouteMatch, Redirect } from 'react-router-dom'
import { Localized } from 'i18n'
import { DetailMenu, AnalysisMatch } from '../Report'
import { IconMenu } from 'components/IconMenu'
import { Ahead } from 'components/Ahead'
import { useRoute } from './route'
import { MenuGroup } from '@tencent/tea-component/lib/menu/MenuGroup'
import { getApkReport } from '../common'
import { useReportLink } from '../context'

const { Sider, Content, Body } = Layout

// The height of Sider in Body is fixed in tea. Here is the workaround
const FixedBody = styled(Body)`
  .tea-menu__submenu .tea-menu__list .tea-menu__item {
    height: initial !important;
  }
`

const DefaultId = 'overview'

export const ApkReport: React.FC<{ analysis: ApkReportAnalysisFragment }> = ({ analysis }) => {
  const route = useRoute(getApkReport(analysis)?.audit ?? [])
  const getKeyFromPage = (page: string) => {
    const kv = route.find(([, value]) => value?.children.some(i => i.id === page))
    if (!kv) {
      return
    }
    return kv[0]
  }

  const reportLink = useReportLink()
  const { params: {
    page
  } } = useRouteMatch<AnalysisMatch>()
  const RouteList = route.filter(i => i[1]).flatMap(i => i[1]!.children)
  const category = getKeyFromPage(page || DefaultId) || ''
  const curListItem = RouteList.find(i => i.id === page)
  const [opened, setOpened] = useState({
    [category]: true
  })
  useEffect(() => {
    setOpened(old => ({
      ...old,
      [category]: true
    }))
  }, [category])
  const Menus = route.map(([key, value]) => {
    if (value) {
      const { title, icon, children, noSub } = value
      return noSub ? (
        <DetailMenu key={`d-${key}`} id={children[0].id} title={title} titleId={`project-title-${key}`} icon={icon} />
      ) : (
        <Menu.SubMenu
          opened={opened[key]}
          onOpenedChange={(v) => setOpened({ ...opened, [key]: v })}
          key={`s-${key}`}
          title={title ?? <Localized id={`project-title-${key}`} />}
          icon={icon}
        >
          { children.map(({ id, title }) => <DetailMenu key={id} id={id} title={title} />)}
        </Menu.SubMenu>
      )
    } else {
      return <MenuGroup key={`m-${key}`} title={<Localized id={key} />} />
    }
  })

  if (!page) {
    const defCategory = route.find(([key]) => key === DefaultId)![1]!
    return <Redirect to={reportLink({ page: DefaultId, tab: defCategory.children[0].id })} />
  }
  return <>
    <FixedBody>
      <Sider>
        <IconMenu>
          <Menu.Group title={<Ahead><Localized id='report' /></Ahead>}>
          </Menu.Group>
          {Menus}
        </IconMenu>
      </Sider>
      <Content>
        {curListItem ? <>
          <Content.Header
            title={<Localized id={curListItem.title ?? `detail-title-${curListItem.id}`} />}
          />
          <Content.Body>
            <curListItem.component key={curListItem.id} />
          </Content.Body>
        </> : undefined
        }
      </Content>
    </FixedBody>
  </>
}
