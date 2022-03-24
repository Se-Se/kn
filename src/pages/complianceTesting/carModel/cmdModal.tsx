import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Modal, Input, Button, notification } from '@tencent/tea-component';
import { useCollectorCarInfoMutation } from 'generated/graphql';
// import { useGetMessage } from 'i18n';
type CmdModelType = {
    isShow: boolean
    setIsShowAddDialog: Dispatch<SetStateAction<boolean>>
    modelId: string
}
export const CmdModal: React.FC<CmdModelType> = (props) => {

    const teamId = 'team_items;1';
    const [cmd, setCmd] = useState<string>('');
    const [collectCarInfo] = useCollectorCarInfoMutation();
    // const getValue = useGetMessage();

    const startCollect = async () => {
        // const yes = await Modal.confirm({
        //     message: getValue('compliance-recollectConfirm'),
        //     description: getValue("compliance-recollectDesc"),
        //     okText: getValue("compliance-startCollect"),
        //     cancelText: getValue("modal-cancel"),
        // });
        // if (yes) {
            await collectCarInfo({
                variables: {
                    teamId: teamId,
                    id: props.modelId,
                    connectionCmd:cmd
                }
            }).then(() => {
                props.setIsShowAddDialog(false)
            }).catch((error) => {

                notification.error({
                    description: error.toString()
                });
            })
        // }
    }

    useEffect(() => {
        if (props.isShow) {
            setCmd('');
        }
    }, [props.isShow])

    return <Modal visible={props.isShow} caption="linux配置" onClose={() => { props.setIsShowAddDialog(false) }}>
        <Modal.Body>
            <div style={{ width: 455, height: 110, background: '#E5F0FF', border: '1px solid #97C7FF', color: '#003B80', padding: '12px 20px' }}>
                <p style={{ lineHeight: '40px', fontWeight: 'bold' }}>参数配置提示</p>
                <p>可以在command一栏填写登入用命令比如：</p>

                <p>· ssh xxx@xxx.xxx.xxx bash (使用证书登入方式)</p>
                <p>· sshpass -p password ssh xxx@xxx.xxx.xxx bash (password 替换为登入密码)</p>

                {/* <p style={{ lineHeight: '40px' }}> 由于ssh和adb shell配置简单、数据传输性好，因此它们为推荐方式。</p> */}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
                <div style={{ width: 100, color: '#888' }}>
                    <span>参数配置</span>
                </div>
                <div style={{ width: '100%' }}>
                    <Input placeholder={'请输入配置'} style={{ width: 414 }} value={cmd} onChange={value => setCmd(value)}></Input>
                </div>
            </div>

        </Modal.Body>
        <Modal.Footer>
            <Button type="primary" onClick={startCollect}>
                确定
            </Button>
            <Button type="weak" onClick={()=>{props.setIsShowAddDialog(false)}}>
                取消
            </Button>
        </Modal.Footer>
    </Modal>
}