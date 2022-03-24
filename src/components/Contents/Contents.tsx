import React from 'react'
import styled from '@emotion/styled/macro'

const Wrapper = styled.div`
  position: sticky;
  top: 20px;
  height: calc(100vh - 40px - 50px);
  padding-left: 10px;
  border-left: 2px dotted #252525;
  box-sizing: border-box;
  max-width: 300px;
  flex: auto;
  margin-left: 20px;
  overflow: auto;
  overscroll-behavior: none;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  a {
    color: black;
    line-height: 16px;
    padding: 4px;
    display: inline-block;
    text-decoration: none;
  }
  a.s-active , a:hover {
    color: #039be5;
  }
  a.empty {
    color: #888;
  }
`

export interface ContentsItem {
  children?: ContentsItem[]
  className?: string
  title: React.ReactNode
  id: string | null
}

export interface ContentsProps {
  className?: string
  contents: ContentsItem[]
}

interface ContentsState {
}

const TitleItem: React.FC<ContentsItem> = ({ id, title, children, className }) => {
  return <>
    <li>
      {
        id === null
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          ? <a className={className}>{title}</a>
          : <a className={className} data-id={id} href={`#${id}`}>{title}</a>
      }
    </li>

    { children && <ol style={{ paddingLeft: '1em' }}>
      {children.map((i, id) => <TitleItem key={i.id || id} {...i}></TitleItem>)}
    </ol>}
  </>
}

export class Contents extends React.Component<ContentsProps, ContentsState> {
  render() {
    const { className, contents } = this.props
    return <Wrapper data-scroll='contents' className={className}>
      <ol>
        {contents.map((i, id) => <TitleItem key={i.id || id} {...i}></TitleItem>)}
      </ol>
    </Wrapper>
  }
}
