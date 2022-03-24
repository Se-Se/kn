import React, { Dispatch, SetStateAction, useState } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { Modal, Checkbox, Button } from '@tencent/tea-component';
import { useToken } from 'components/TokenService'

type DownLoadModalType = {
    isShow: boolean
    setIsShowAddDialog: Dispatch<SetStateAction<boolean>>
    projectId: string
    // refreshFn:()=>void
}
export const DownLoadModal: React.FC<DownLoadModalType> = (props) => {
    const getValue = useGetMessage();
    const token = useToken();

    const saveBtnClick = () => {

        if(downLoadType.includes('SafeReport')){

            const url = '/download_report/'+props.projectId+'/SafeReport?token='+token;
            window.open(url,'SafeReport');
        }
        
        if(downLoadType.includes('ComplianceReport')){
            
            const url = '/download_report/'+props.projectId+'/ComplianceReport?token='+token;
            // console.log(url);
            window.open(url,'ComplianceReport');
        }


        // props.setIsShowAddDialog(false)
    }
    const [downLoadType, setDownLoadType] = useState<string[]>([]);
    return <> <Modal visible={props.isShow} caption={<Localized id='compliance-createReport'></Localized>}
        onClose={() => { props.setIsShowAddDialog(false) }}>
        <Modal.Body>
            <Checkbox.Group
                value={downLoadType}
                onChange={value => setDownLoadType(value)}
                layout="column"
            >
                <Checkbox name="SafeReport" tooltip="合规检测报告（.pdf）">
                    {getValue('compliance-downLoadTestPdf')}
                </Checkbox>
                <Checkbox name="ComplianceReport" tooltip="Sysauditor安全审计报告">
                    {getValue('compliance-downLoadSysauditorPdf')}
                </Checkbox>
            </Checkbox.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button type="primary" onClick={saveBtnClick}>
                <Localized id={'modal-ok'}></Localized>
            </Button>
            <Button type="weak" onClick={() => { props.setIsShowAddDialog(false) }}>
                <Localized id={'modal-cancel'}></Localized>
            </Button>
        </Modal.Footer>
    </Modal></>
}