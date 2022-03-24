import React from 'react';
import style from '@emotion/styled/macro';
import empty from '../images/empty.svg'
const EmptyImg = style.div`
  height: 168px;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const Empty:React.FC=()=>{
  return<EmptyImg>
    <img src={empty} />
  </EmptyImg>

  
}