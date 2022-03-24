import React, { useMemo } from 'react'
import { Documentation, Match, useDocumentationPath } from './Documentation'
import { Switch, Route, Redirect, Link, useRouteMatch } from 'react-router-dom'
import { generateLink, Pattern } from 'route'
import ReactMarkdown from 'react-markdown'
import matter from 'gray-matter'
import { Layout, Menu } from '@tencent/tea-component'
import { Ahead } from 'components/Ahead'
import { useFetchDownload } from 'components/Download'
import { IconMenu } from 'components/IconMenu'
import { Loading } from 'components/Loading'

const useMenu = () => {
  const getDocPath = useDocumentationPath()
  const { params: { path } } = useRouteMatch<Match>()
  const { loading, data: txt, error } = useFetchDownload(getDocPath('index.md'))
  const result = useMemo(() => {
    if (txt) {
      return matter(txt)
    }
  }, [txt])
  return {
    loading,
    error,
    data: result?.data as {
      index: string
    },
    menu: useMemo(() => {
      if (!result) {
        return
      }
      const { content } = result
      return <ReactMarkdown
        source={content}
        renderers={{
          heading({ children }) {
            return <Menu.Group title={<Ahead>{children}</Ahead>} />
          },
          listItem(props) {
            const item = props?.children?.[0]?.props
            if (!item) {
              return <></>
            }
            return <Menu.Item
              selected={item.href === path}
              title={item.children?.[0]?.props?.value}
              render={(i) => <Link to={`/documentation/${item.href}`}>{i}</Link>}
            ></Menu.Item>
          }
        }}
        className='markdown'
      />
    }, [result, path])
  }
}

const { Content, Body, Sider } = Layout

export const Page: React.FC = () => {
  const { menu, data, loading, error } = useMenu()
  return <>
    <Body>
      <Sider>
        <IconMenu>
          {loading ? <Loading /> : menu}
        </IconMenu>
      </Sider>
      <Content>
        {loading ? <Loading /> : error ? <>{error}</> : <Switch>
          <Route exact path={generateLink(Pattern.Documentation)}>
            <Redirect to={generateLink(Pattern.Documentation, { path: data?.index })} />
          </Route>
          <Route path={Pattern.Documentation} component={Documentation} />
        </Switch>}
      </Content>
    </Body>
  </>
}
