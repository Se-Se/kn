import React, { CSSProperties } from 'react'
import styled from '@emotion/styled/macro'
import { Bubble, Card, Icon } from '@tencent/tea-component'
import { PaginationBox } from 'components/PaginationBox'
import { useSysPositionQuery, SysReportPage } from 'generated/graphql'
import { useAnalysisId } from 'pages/report/context'
import { getSysReport } from '.'
import { useJump } from '../sys/route'

export const ProjectCard = styled(Card)`
  max-width: 1360px;
`

export const Hr = styled.div`
  border-top: 1px solid #D3DAE6;
  height: 0;
`

export {
  PaginationBox
}

const Inner = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const NormalLink = styled.span`
  i {
    filter: grayscale(100%);
    flex: none;
  }
  &:hover {
    color: #006eff;
    cursor: pointer;
    i {
      filter: grayscale(0);
    }
  }
  display: flex;
`

export type CommonRefProps = {
  title: string
  showBubble?: boolean
  params: Record<string, any>
  page: SysReportPage
  url: string
  hideIcon?: boolean
  style?: CSSProperties
  onClick?: () => void
}
export const CommonRef: React.FC<CommonRefProps> = ({ title, showBubble, params, page, url, hideIcon, style, onClick }) => {
  const jump = useJump()
  const id = useAnalysisId()
  const { refetch, loading } = useSysPositionQuery({
    skip: true,
    variables: {
      id,
      page,
      field: params,
    }
  })
  const onLinkClick = async () => {
    const { data, error } = await refetch()
    if (!error && data) {
      const report = getSysReport(data.analysis)
      if (report?.position === undefined || report?.position === null) {
        console.error('no report')
        return
      }
      onClick?.()
      jump(url, report.position)
    } else {
      console.error(error)
    }
  }
  return <>
    {showBubble ?
      <Bubble content={title} placement='auto'>
        <NormalLink onClick={onLinkClick} style={style}>
          <Inner title={title}>{title}</Inner><Icon type={loading ? 'loading' : (hideIcon ? '' : 'externallink')} />
        </NormalLink>
      </Bubble> :
      <NormalLink onClick={onLinkClick} style={style}>
        <Inner title={title}>{title}</Inner><Icon type={loading ? 'loading' : (hideIcon ? '' : 'externallink')} />
      </NormalLink>}
  </>
}

type CommonProps = Omit<CommonRefProps, 'title' | 'params' | 'page' | 'url'>

export const FileRef: React.FC<{
  path: string,
} & CommonProps> = ({ path, showBubble = false, ...rest }) => {
  return <CommonRef title={path} showBubble params={{ name: path }} page={SysReportPage.File} url='file/allfile/' {...rest} />
}

export const ProcessRef: React.FC<{
  pid: string,
} & CommonProps> = ({ pid, ...rest }) => {
  return <CommonRef title={pid} params={{ pid }} page={SysReportPage.Process} url='process/process/' {...rest} />
}
