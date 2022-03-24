import React from 'react'
import { Layout, Text } from '@tencent/tea-component'
import { LayoutContentHeaderProps } from '@tencent/tea-component/lib/layout/LayoutContent'
import { TeamSelect } from './Dashboard'
import { Localized } from 'i18n'

const { Content } = Layout

export const Header: React.FC<Omit<LayoutContentHeaderProps, 'children'>> = ({ children, ...props }) => {
  return <Content.Header {...props}>
    <Text reset theme='label' verticalAlign='middle'><Localized id='current-team' /></Text>
    <span style={{ marginRight: 10 }} />
    <TeamSelect />
  </Content.Header>
}
