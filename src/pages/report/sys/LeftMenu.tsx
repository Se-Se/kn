import React, { useState, useEffect } from 'react'
import { Menu } from '@tencent/tea-component'
import { useProjectDetailRoute, RouteTypes } from './route'
import { useRouteMatch } from 'react-router-dom'
import { Localized } from 'i18n'
import { TypedAudits } from './Report'
import { Ahead } from 'components/Ahead'
import { IconMenu } from 'components/IconMenu'
import { MenuGroup } from '@tencent/tea-component/lib/menu/MenuGroup'
import { DetailMenu, AnalysisMatch } from '../Report'
import { AnalysisType } from 'generated/graphql'

type LeftMenuProps = {
  defaultId: string
  analysisType: AnalysisType
  audits: TypedAudits
}

export const LeftMenu: React.FC<LeftMenuProps> = ({ defaultId, analysisType, audits }) => {
  const projectDetailRoute: RouteTypes = useProjectDetailRoute(analysisType, audits)
  const getKeyFromPage = (page: string) => {
    const kv = projectDetailRoute.find(([, value]) => value?.children.some(i => i.id === page))
    if (!kv) {
      return
    }
    return kv[0]
  }
  const { params: { page } } = useRouteMatch<AnalysisMatch>()
  const category = getKeyFromPage(page || defaultId) || ''
  const [opened, setOpened] = useState({
    [category]: true
  })
  useEffect(() => {
    setOpened(old => ({
      ...old,
      [category]: true
    }))
  }, [category])

  const Menus = projectDetailRoute.map(([key, value]) => {
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
          {children.map(({ id, title }) => <DetailMenu key={id} id={id} title={title} />)}
        </Menu.SubMenu>
      )
    } else {
      return <MenuGroup key={`m-${key}`} title={<Localized id={key} />} />
    }
  })

  return <IconMenu>
    <Menu.Group title={<Ahead><Localized id='report' /></Ahead>}>
    </Menu.Group>
    {Menus}
  </IconMenu>
}
