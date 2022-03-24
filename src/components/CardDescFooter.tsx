import React from 'react'
import { Card } from '@tencent/tea-component'
import styled from '@emotion/styled'

const Desc = styled.p`
  padding: 20px;
  color: grey;
`

export const CardDescFooter: React.FC = ({ children }) => {
  return <>
    <Card.Footer>
      <Desc>
        {children}
      </Desc>
    </Card.Footer>
  </>
}
