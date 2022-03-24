import React from 'react'
import { BasicPie, BasicPieProps, Annotation } from '@tencent/tea-chart'
import styled from '@emotion/styled/macro'
import { H3 } from '@tencent/tea-component'

const Title = styled(H3)`
  text-align: left;
`
const Wrapper = styled.div`
  position: relative;
`

export interface Data {
  [key: string]: number | string | null | undefined;
}
type TitledPieProps = Omit<BasicPieProps, 'dataSource'> & {
  title?: React.ReactNode
  dataSource: Data[]
}

export const CenterTip = styled.span`
  font-size: 20px;
`

export const TitledPie: React.FC<TitledPieProps> = ({ children, title, dataSource, position, ...rest }) => {
  const count = dataSource.reduce((p, i) => p + parseInt(String(i[position])), 0)
  return <>
    <Title>{title}</Title>
    <Wrapper>
      <BasicPie
        {...rest}
        position={position}
        circle
        dataSource={dataSource as any[]}
      >
        <Annotation>
          <Annotation.Label
            content={count}
            position={['50%', '50%']}
            offsetY={10}
            textStyle='font-size:20px;'
          />
        </Annotation>
      </BasicPie>
    </Wrapper>
  </>
}
