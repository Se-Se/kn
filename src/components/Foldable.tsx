import React, { useCallback, useMemo } from 'react'
import styled from '@emotion/styled/macro'
import { useSwitch } from 'hooks/common'
import { Icon } from '@tencent/tea-component'

const FoldWrapper = styled.div`
  padding: 5px;
  justify-content: space-between;
  display: flex;
`
const IconBox = styled.div`
  cursor: pointer;
`
const Box = styled.div`
  flex: 1;
  width: 0;
`

type FoldableProps = {
  extra?: () => React.ReactNode
  onChange?: (folded: boolean) => void
  className?: string
  padding?: number
}
export const Foldable: React.FC<FoldableProps> = ({ padding, className, extra, onChange, children }) => {
  const [folded, switchFolded] = useSwitch(true)
  const IconBoxStyle = useMemo(() => ({
    paddingTop: padding
  }), [padding])

  const handleClick = useCallback(() => {
    onChange && onChange(!folded)
    switchFolded()
  }, [switchFolded, onChange, folded])

  return <FoldWrapper className={className}>
    <IconBox style={IconBoxStyle} onClick={handleClick}>
      <Icon type={folded ? 'arrowright' : 'arrowdown'}></Icon>
    </IconBox>
    <Box>
      {children}
      {!folded && extra && extra()}
    </Box>
  </FoldWrapper>
}
