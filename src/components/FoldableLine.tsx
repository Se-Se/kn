import styled from '@emotion/styled'
import { Button } from '@tencent/tea-component'
import { useToggle } from 'hooks/common'
import { Localized } from 'i18n'
import React, { useMemo, useState } from 'react'

type LineFoldableProps = {
    folderEnd?: boolean
    value?: boolean
    onChange?: (v: boolean) => void
    children: string | string[]
}

type FoldButtonProps = {
    action: () => void
    expanded: boolean
}

const OverflowDiv = styled.div`
    overflow:hidden;
    text-overflow: ellipsis;
    white-space:nowrap;
`

const EndGrid: React.FC = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    width: 100%;
`

const FoldButton: React.FC<FoldButtonProps> = ({ action, expanded }) => {
    return <Button type='link' onClick={action}><Localized id={expanded ? 'fold' : 'unfold'} /></Button>
}

export const LineFoldable: React.FC<LineFoldableProps> = ({ children, value, onChange }) => {
    const [expanded, expand, fold] = useToggle(false, { value, onChange })
    const [action, setAction] = useState(() => expand)
    const clickFoldBtn = () => {
        setAction(() => action === expand ? fold : expand)
        action()
    }
    const strChild: String = useMemo(() => {
        if (Array.isArray(children))
            return children.join('\n')
        return children ?? ''
    }, [children])
    let childContent: React.ReactElement = <OverflowDiv>{strChild}</OverflowDiv>
    if (expanded) {
        childContent = <pre>{strChild}</pre>
    }
    return (
        <EndGrid>{childContent} <FoldButton expanded={expanded} action={clickFoldBtn} /></EndGrid>
    )
}