import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { ThreatAlertFragment } from 'generated/graphql'
import { Foldable } from 'components/Foldable'
import { Interface } from './Interface'
import { Process } from './Process'
import { Kernel } from './Kernel'
import { isExperiment } from 'utils/isExperiment'

const IconSize = 24
const FullFoldable = styled(Foldable)`
  width: 100%;
  .tea-icon {
    width: ${IconSize}px;
    height: ${IconSize}px;
    background-size: ${IconSize}px;
  }
`

const AlertLine = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;
`

const Detail = styled.span`
  flex: 1;
  display: flex;
  overflow-y: auto;
`
const Score = styled.span`

`

export const ScoreRank: React.FC<{ score: number }> = ({ score }) => {
  if (score >= 250) {
    return <span>Risk: High</span>
  }
  if (score >= 200) {
    return <span>Risk: Medium</span>
  }
  return <span>Risk: Low</span>
}

type AlertProps = ThreatAlertFragment

export const Alert: React.FC<AlertProps> = ({
  interface: interf,
  procSecurity,
  kernel,
  score,
}) => {
  const [folded, setFolded] = useState(true)

  return <FullFoldable padding={5} onChange={setFolded}>
    <AlertLine>
      <Detail>
        <Interface {...interf} folded={folded} />
        {procSecurity?.map(i => <Process key={i.name} {...i} folded={folded} />)}
        {kernel && <Kernel {...kernel} folded={folded} />}
      </Detail>
      {
        isExperiment() ? <Score>Score: {score.toFixed(1)}</Score> : <ScoreRank score={score} />
      }
    </AlertLine>
  </FullFoldable>
}
