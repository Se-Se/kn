import React from 'react'
import { CommonStatus, CollectorStatus, AnalysisStatus } from 'generated/graphql'
import styled from '@emotion/styled/macro'
import { ReactComponent as Finish } from 'icons/Status/finish.svg'
import { ReactComponent as Fail } from 'icons/Status/fail.svg'
import { ReactComponent as Waiting } from 'icons/Status/waiting.svg'
import { ReactComponent as Processing } from 'icons/Status/processing.svg'
import { ReactComponent as Analyzing } from 'icons/Status/analyzing.svg'
import { ReactComponent as Ready } from 'icons/Status/ready.svg'
import { ReactComponent as Preparing } from 'icons/Status/preparing.svg'
import { useGetMessage } from 'i18n'

export type SupportedStatus = CommonStatus | AnalysisStatus | CollectorStatus

let checked = false
const checkStatus = (getMessage: (id: SupportedStatus) => string) => {
  if (checked) return
  checked = true
  const status: SupportedStatus[] = [...new Set([
    ...Object.keys(CommonStatus),
    ...Object.keys(AnalysisStatus),
    ...Object.keys(CollectorStatus),
  ] as SupportedStatus[])]
  for (const s of status) {
    const result = getMessage(s)
    if (result.startsWith('enum-')) {
      console.log(result, 'is not translated')
    }
  }
}

export const useGetStatusMessage = () => {
  const getMessage = useGetMessage()
  const getter = (id: SupportedStatus, params?: Record<string, string> | undefined, defaultText?: string | undefined) => getMessage(
    `enum-status-${id}`, params, defaultText
  )
  if (process.env.NODE_ENV === 'development') {
    checkStatus(getter)
  }
  return getter
}

const Box = styled.span`
  svg {
    font-size: 0;
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
    &[data-status="Collecting"] {
      animation: spin .6s linear infinite;
    }
  }
`

const Text = styled.span`
  margin-left: 5px;
  vertical-align: middle;
`

type StatusIconProps = {
  className?: string
  text?: boolean
  status: SupportedStatus
}

const StatusMap: Record<SupportedStatus, React.FC> = {
  [CommonStatus.Completed]: Finish,
  [CommonStatus.InProgress]: Analyzing,
  [CommonStatus.Ready]: Ready,
  [CollectorStatus.Collecting]: Processing,
  [CollectorStatus.Failed]: Fail,
  [CollectorStatus.Waiting]: Waiting,
  [CollectorStatus.Success]: Finish,
  [AnalysisStatus.Analyzing]: Analyzing,
  [AnalysisStatus.Preparing]: Preparing,
}
export const StatusIcon: React.FC<StatusIconProps> = ({ className, text, status }) => {
  const getStatusMessage = useGetStatusMessage()
  const Icon = StatusMap[status]
  return <Box className={className}>
    <Icon data-status={status} />
    {text && <Text>{getStatusMessage(status)}</Text>}
  </Box>
}
