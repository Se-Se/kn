import React, { useEffect, useState } from 'react';
import { useClientEventAlertQuery,useSubmitClientDeviceChangeMutation } from 'generated/graphql';
import { Modal, Button } from '@tencent/tea-component';
import {useHistory} from 'react-router-dom'
type statusControlType = {

}
export const ComplianceStatuscCtrl: React.FC<statusControlType> = (props) => {
    const teamId = 'team_items;1';
    // const [terminalId, setTerminalId] = useState<String>('');
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [commitSelect] = useSubmitClientDeviceChangeMutation();
    const [uuid,setUuid] = useState<string>('');
    const [ticker,setTicker] = useState<any>();
    const history = useHistory();
    const [newDeviceName,setNewDeviceName] = useState('');
    const [oldDeviceName,setOldDeviceName] = useState('');

    const statusHook = useClientEventAlertQuery({
        variables: {
            teamId: teamId
        }
    });
    const commitClick = (type:boolean)=>{
        commitSelect({
            variables:{
                teamId:teamId,
                uuid:uuid,
                result:type
            }
        })
    }

    useEffect(() => {
        console.log(statusHook.data);

        if (statusHook.data?.clientEventAlert.hasAlert) {
            setIsShowModal(true);
            if(statusHook.data.clientEventAlert.uuid){
                setUuid(statusHook.data.clientEventAlert.uuid);
            }
            
            if(statusHook.data?.clientEventAlert&&statusHook.data?.clientEventAlert.newDeviceName){
                setNewDeviceName(statusHook.data.clientEventAlert.newDeviceName);
            }
            if(statusHook.data?.clientEventAlert&&statusHook.data?.clientEventAlert.oldDeviceName){
                setOldDeviceName(statusHook.data.clientEventAlert.oldDeviceName);
            }
            console.log(statusHook.data);
        }
        else{
            setIsShowModal(false);
        }
    }, [statusHook.data])


    useEffect(() => {
        if(!ticker){
            let tickerId = setInterval(() => {
                statusHook.refetch();
            }, 1000);
            setTicker(tickerId);
        }
    }, []);
    useEffect(()=>{
        return(()=>{
            window.clearInterval(ticker);
        })
    },[ticker])

    if(statusHook.error&&statusHook.error.toString().indexOf('error-token-invalid')>-1){
        console.log(statusHook.error.toString());
        history.push('/login')
    }

    return <>
        <Modal visible={isShowModal} caption="确定替换车机？" onClose={()=>{commitClick(false)}}>
            <Modal.Body>
                <p>
                    系統检测到「{newDeviceName}」尝试连接，如果确定替换，「{oldDeviceName}」将被停止运行。
                </p>
                <p>
                    如数据线接触不良，请将待测车机重新插入测试终端
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button type="primary" onClick={()=>{
                    commitClick(true)
                }}>
                    确定替换
                </Button>
                <Button type="weak" onClick={()=>{
                    commitClick(false)
                }}>
                    取消
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}