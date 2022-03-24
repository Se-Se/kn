import React, { useEffect, useState } from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import { Drawer } from 'tdesign-react';
import styled from '@emotion/styled/macro';

import iconPass from '../../../image/report-pass.svg';
import iconManul from '../../../image/report-manul-manul.svg';
import iconRiskLow from '../../../image/risk-low.svg';
import iconCheck from '../../../image/check-circle-filled.svg';


const CaseDrawerMain = styled.div`
    .t-drawer__body{
        padding:0
    }
`

const MarkdownRender = React.lazy(() => import('../case/markDownRender'));
type CaseBaseParm = {
    visible: boolean
    handleClose: React.Dispatch<React.SetStateAction<boolean>>
    stepMd: string
}
export const CaseMdDrawer: React.FC<CaseBaseParm> = ({ visible, handleClose, stepMd }) => {
    const history = useHistory();
    const params: any = useParams();
    const [lawGroup, setLawGroup] = useState([1, 2]);
    const [stepGroup, setStepGroup] = useState([1, 2, 3, 4, 5]);
    useEffect(() => {
    }, [])
    return <CaseDrawerMain>
        <Drawer placement={'bottom'}
            size={'medium'}
            header={<span style={{ fontSize: 16, fontWeight: 700 }}>测试参考</span>}
            visible={visible}
            onClose={() => { handleClose(false) }}
            footer={false}
            style={{ padding: 0 }}
        >
            <MarkdownRender value={stepMd} style={{paddingBottom:0,height:'calc(100% - 20px)'}}></MarkdownRender>
        </Drawer>
    </CaseDrawerMain>
}