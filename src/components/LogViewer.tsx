import React, { useEffect, useRef, Fragment } from 'react'
import styled from '@emotion/styled/macro'
import { Code } from './Code'

const Box = styled.div`
  height: 600px;
  overflow: auto;
`

type LogViewerProps = {
  log: string[]
}

export const LogViewer: React.FC<LogViewerProps> = ({ log }) => {
  const box = useRef<HTMLDivElement | null>()
  useEffect(() => {
    if (box.current) {
      box.current.scrollTo(0, box.current.scrollHeight)
    }
  }, [log, log.length])
  return <>
    <Box ref={r => box.current = r}>
      <Code code={log.map((p, i) => <Fragment key={i}>{p}</Fragment>)} />
    </Box>
  </>
}
