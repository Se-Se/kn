import React from 'react'
import styled from '@emotion/styled/macro'
import { Menu, MenuProps } from '@tencent/tea-component'

const MyMenu: React.FC<Omit<MenuProps, 'theme'>> = (props) => <Menu theme='dark' {...props} />

export const IconMenu = styled(MyMenu)`
  li.is-selected {
    img {
      filter: invert(1) sepia(1) saturate(5) hue-rotate(175deg);
    }
  }
`
