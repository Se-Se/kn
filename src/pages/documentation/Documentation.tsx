import React, { useMemo, useCallback, useEffect, useContext, useState } from 'react'
import { Layout, Card } from '@tencent/tea-component'
import { CodeBlock, ReactMarkdownHtml } from 'components/Markdown'
import { Contents } from 'components/Contents'
import { useFetchDownload, useDownloadToken } from 'components/Download'
import { Loading } from 'components/Loading'
import { getContents, Heading } from 'components/Contents/utils'
import styled from '@emotion/styled/macro'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { useCurLanguage } from 'i18n'
import { useScrollWrapper } from 'components/Contents/ScrollWrapper'
import matter from 'gray-matter'
import { dirname, join } from 'path'

export const useDocumentationPath = () => {
  const lang = useCurLanguage().substr(0, 2)
  return useCallback((path: string) => `${process.env.REACT_APP_LOCAL_DOC || '/download'}/${lang}/${path}`, [lang])
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;

  .wiki {
    width: 0;
    flex: auto;
    line-height: 30px;
  }
  .contents {
    flex: none;
    min-width: 200px;
  }
`

const { Content } = Layout
const PathContext = React.createContext('')

const DownloadLink: React.FC<{ href: string, children: React.ReactChild }> = ({ href, children }) => {
  const getToken = useDownloadToken()
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    getToken().then(token => window.open(`/${href}?token=${token}`))
  }, [getToken, href])
  if (href.startsWith(`download/`)) {
    return <a href={`/${href}`} onClick={handleClick}>{children}</a>
  }
  return <a href={href}>{children}</a>
}

const DownloadImage: React.FC<{ src?: string }> = ({ src }) => {
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined)
  const getToken = useDownloadToken()
  const docPath = useContext(PathContext)
  const isBase64 = src?.startsWith('data:image/png;base64,') ?? false
  const getDocPath = useDocumentationPath()

  useEffect(() => {
    if (isBase64 || !src) return
    const path = join(dirname(docPath), src)
    getToken().then(token => setImgUrl(`${getDocPath(path)}?token=${token}`))
  }, [src, isBase64, getToken, docPath, getDocPath])

  if (imgUrl || isBase64) {
    return <img alt='' src={imgUrl || src} />
  } else {
    return <Loading />
  }
}

export interface Match {
  path: string
}

export const Documentation: React.FC = () => {
  const history = useHistory()
  const getDocPath = useDocumentationPath()
  const { params: { path } } = useRouteMatch<Match>()
  const { data: txt, error, loading } = useFetchDownload(getDocPath(path))
  const data = useMemo(() => {
    if (txt) {
      const result = matter(txt)
      const param: Partial<{
        title: string
        sidebar: boolean
        sidebarDepth: number
      }> = {
        sidebar: true,
        sidebarDepth: 2,
        ...result.data,
      }
      const contents = getContents(result.content, param.sidebarDepth)
      return {
        ...result,
        contents,
        param,
      }
    }
  }, [txt])
  useEffect(() => {
    if (data?.contents && history.location.hash) {
      window.setTimeout(() => {
        try {
          const el = document.querySelector(history.location.hash) as HTMLElement
          if (!el) {
            console.log('no el', history.location.hash)
            return
          }
          el.scrollIntoView({
            block: 'start'
          })
        } catch (e) {
          return
        }
      }, 0)
    }
  }, [history, data])
  const getRef = useScrollWrapper('.tea-layout__content')

  return <>
    <Content.Header title={loading ? <Loading /> : data?.param.title} />
    <Content.Body>
      {error}
      {loading ? <Loading /> :
        <Card>
          <Card.Body>
            <Wrapper>
              <div className='wiki' data-scroll='containner' ref={getRef}>
                <PathContext.Provider value={path}>
                  <ReactMarkdownHtml
                    escapeHtml={false}
                    source={data?.content}
                    renderers={{
                      heading: Heading,
                      code: CodeBlock,
                      link: DownloadLink,
                      image: DownloadImage,
                      imageReference: DownloadImage,
                    }}
                    className='markdown'
                  />
                </PathContext.Provider>
              </div>
              {data?.contents && <Contents className='contents' contents={data?.contents} />}
            </Wrapper>
          </Card.Body>
        </Card>
      }
    </Content.Body>
  </>
}
