import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Menu } from '@tencent/tea-component'
import { RoleGate, Perms } from './PermissionGate'
import { Maybe } from 'generated/graphql'

export const LinkItem: React.FC<{
  title: React.ReactNode
  to: string
  icon?: string
  perm?: Maybe<Perms>
}> = ({ title, to, icon, perm }) => {
  const { pathname } = useLocation()
  const toStr = unescape(to)

  return <RoleGate perm={perm}>
    <Menu.Item
      title={title}
      selected={pathname.startsWith(toStr)}
      render={i => <Link to={to}>{i}</Link>}
      icon={icon}
    />
  </RoleGate>
}
