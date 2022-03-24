import React from 'react'
import { useApolloData } from 'hooks/common'
import { useViewerQuery } from 'generated/graphql'
import { Layout } from '@tencent/tea-component'
import { Redirect } from 'react-router-dom'

const { Content, Body } = Layout

export const Page: React.FC = ({ children }) => {
  return useApolloData(useViewerQuery(), data => {
    return (
      <Body>
        <Content>
          <Content.Body>
            {data.viewer ? children : <Redirect to='/login' />}
          </Content.Body>
        </Content>
      </Body>
    )
  }, () => <Redirect to='/login' />)
}
