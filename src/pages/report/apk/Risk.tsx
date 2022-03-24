import React from 'react'
import styled from '@emotion/styled/macro'
import { Style } from './style'
import { Check } from './check'
import { getView } from './ApkReport'

export const ReportView = styled.div(Style)

export const SingleCheckItem: React.FC<{ check: Check }> = ({ check: { checkName, vulInfo } }) => {
  if (!vulInfo) {
    return <>Failed to get view.</>
  }
  const { data, type } = vulInfo
  const View = getView(type)

  return <>
    { View ? <View data={data} /> : <>Failed to get view {checkName} {type}</>}
  </>
}
