import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { Modal, Input, Button, Form, Select, notification } from '@tencent/tea-component';
import { useEditProjectMutation,useGetUserSelectorListQuery } from 'generated/graphql';
type EditProjectModalType = {
    isShow: boolean
    setIsShowAddDialog: Dispatch<SetStateAction<boolean>>
    refreshFn: () => void
    projectName:string
    id:string
    userId:string
}
export const EditProjectModal: React.FC<EditProjectModalType> = (props) => {

    const teamId = 'team_items;1';
    const [EditName, setEditName] = useState<string>('');
    const [EditUser, setEditUser] = useState<string>('');
    const [EditNameSt, setEditNameSt] = useState<any>();
    const [EditUserSt, setEditUserSt] = useState<any>();

    const userListHook = useGetUserSelectorListQuery({variables:{
        teamId:teamId
    }});
    const [editProject] = useEditProjectMutation();

    const [userOptions,setUserOpoitons] = useState<any[]>([]);

    const getValue = useGetMessage();
    useEffect(()=>{
        let result:any[] = [];
        userListHook.data?.getUserSelectorList?.map((_value:any,key:any)=>{
            result.push({
                value:_value.userId,
                text:_value.name
            })
        })
        setUserOpoitons(result);

    },[userListHook.data])

    useEffect(()=>{
        if(props.isShow){
            setEditNameSt(undefined);
            setEditUserSt(undefined);
            setEditName(props.projectName)
            setEditUser(props.userId)

        }
    },[props.isShow])

    return <Modal visible={props.isShow} caption="编辑项目基本信息" onClose={() => { props.setIsShowAddDialog(false) }}>
        <Modal.Body>
            <Form>
                <Form.Item label={<Localized id='column-projectName'></Localized>} status={EditNameSt}>
                    <Input value={EditName} onChange={(value) => {
                        setEditName(value);
                        if (value) {
                            setEditNameSt('success')
                        }
                        else {
                            setEditNameSt('error')
                        }
                    }} placeholder={'填写项目名称'} size='full' />
                </Form.Item>
                <Form.Item label={<Localized id="column-dutyUser"></Localized>} status={EditUserSt}>
                    <Select
                    matchButtonWidth
                        type="simulate"
                        appearance="button"
                        options={userOptions}
                        value={EditUser}
                        onChange={(value) => {
                            // changeFromData('principalUserId', value);
                            setEditUser(value);
                        }}
                        size='full'
                        listWidth={300}
                        // placeholder={getValue('license-upload-placeholder')}
                        placeholder={'选择责任人'}
                    />
                </Form.Item>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button type="primary" onClick={async () => {
                 props.setIsShowAddDialog(false) 
                 await editProject({variables:{
                     teamId:teamId,
                     name:EditName,
                     dutyUserId:EditUser,
                     id:props.id
                 }}).then(()=>{
                    notification.success({
                        description: getValue('compliance-oprationSuccess')
                    })
                    props.refreshFn();
                }).catch((error)=>{
                    notification.error({
                        description: error.toString()
                    })
                })
                 }}>
                确定
            </Button>
            <Button type="weak" onClick={() => { props.setIsShowAddDialog(false) }}>
                取消
            </Button>
        </Modal.Footer>
    </Modal>
}