import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { Modal, Input, Button, Form, Select, notification, Cascader } from '@tencent/tea-component';
import { useCreateProjectMutation, useProjectTaskItemListQuery,useGetCarInfoListSelectorQuery } from 'generated/graphql';

type AddProjectType = {
    isShow: boolean
    setIsShowAddDialog: Dispatch<SetStateAction<boolean>>
    refreshFn: () => void
}
export const AddNewProjectModal: React.FC<AddProjectType> = (props) => {

    const [add] = useCreateProjectMutation();

    const teamId = 'team_items;1';

    const projectOptionData = useProjectTaskItemListQuery({ variables: { teamId: teamId },fetchPolicy:'network-only' });
    const [formData, setFormData] = useState<any>({
        name: "",
        description: "",
        lawId: "",
        carModelId: "",
        principalUserId: "",
        version: "1"
    });
    const [cascederValue,setCascederValue] = useState<any>();
    const getValue = useGetMessage();
    const [lawOptions, setLawOptions] = useState<{
        value: string;
        text: string;
        tooltip: string;
        disabled?: undefined;
    }[]>([]);
    const [, setModuleOptions] = useState<{
        value: string;
        text: string
    }[]>([]);
    const [, setCarModelOptions] = useState<{
        value: string;
        text: string;
        tooltip: string;
        disabled?: undefined;
    }[]>([]);
    const [dutyUserOptions, setDutyUserOptions] = useState<{
        value: string;
        text: string;
        tooltip: string;
        disabled?: undefined;
    }[]>([]);
    const [isValidate, setIsValidate] = useState(false);
    const [isEtablish, setIsEtablish] = useState(false);

    const carModuleHook = useGetCarInfoListSelectorQuery({variables:{
        teamId:teamId,
        search:{}
    },fetchPolicy:'network-only'})

    const [CascaderData, setCascaderData] = useState<any>();
    
    useEffect(()=>{
        if(carModuleHook.data?.getCarInfoListSelector){
            let carModel:any = {
                title:'车型',
                options:[]
            }
            for(let item of carModuleHook.data.getCarInfoListSelector){
                let addItem:any = {
                    label:item?.modelName,
                    value:item?.id,
                    child:{
                        title:'零部件',
                        col: 2,
                        options:[],
                    }
                }

                for(let _item of item?.modelList||[]){
                    // console.log(_item);
                    let _addItem:any = {
                        label:_item?.modelName,
                        value:_item?.modelName,
                        child:{
                            title:'版本',
                            col:1,
                            options:[]
                        }
                    };
                    for(let s_item of _item?.versions||[]){
                        let s_addItem:any = {
                            label:s_item?.versionName,
                            value:s_item?.id
                        };
                        _addItem.child.options.push(s_addItem);
                    }
                    addItem.child.options.push(_addItem);
                }
                carModel.options.push(addItem);
            }
            setCascaderData(carModel);
        }
        // console.log(carModuleHook.data?.getCarInfoListSelector);


    },[carModuleHook.data?.getCarInfoListSelector])

    const changeFromData = (key: string, value: string | number) => {
        const _origin = JSON.parse(JSON.stringify(formData));
        _origin[key] = value;
        setFormData(_origin);
    }
    const renderStatus = (key: string) => {
        if (formData[key] !== '') {
            return 'success'
        }
        else {
            if (isValidate) {
                return 'error'
            }
            else {
                return undefined
            }
        }
    }
    const validateFrom = () => {
        setIsValidate(true);
        let result = true;
        for (let item in formData) {
            if (formData[item] === '' && item !== 'description') {
                result = false
            }
        }
        return result;
    }
    const saveBtnClick = async () => {
            console.log(formData);
        if (validateFrom()) {
            setIsEtablish(true);
            

            await add({
                variables: {
                    teamId: teamId,
                    input: formData
                }
            }).then(() => {
                
                notification.success({
                    description: getValue('compliance-oprationSuccess')
                })
                props.refreshFn();
            }).catch((error) => {
                notification.error({
                    description: error.toString()
                })
                return
            }).finally(() => {
                props.setIsShowAddDialog(false);
                setIsEtablish(false);
                setIsValidate(false);
                setFormData({
                    name: "",
                    description: "",
                    lawId: "",
                    carModelId: "",
                    principalUserId: "",
                    version: "1"
                })
            })
        }

    }

    useEffect(() => {

        const _lawOptions = projectOptionData.data?.projectTaskItemList?.lawList?.map((item) => {
            return {
                value: item?.id,
                text: item?.name,
                tooltip: item?.name
            }
        }) as { value: string; text: string; tooltip: string; disabled?: undefined; }[];
        const _moduleOptions = projectOptionData.data?.projectTaskItemList?.modelList?.map((item) => {
            return {
                value: item?.id,
                text: item?.name
            }
        }) as {
            value: string;
            text: string
        }[];

        const _carModelOption = projectOptionData.data?.projectTaskItemList?.carModelList?.map((item) => {
            return {
                value: item?.id,
                text: item?.name,
                tooltip: item?.name
            }
        }) as { value: string; text: string; tooltip: string; disabled?: undefined; }[];

        const _dutyUserOptions = projectOptionData.data?.projectTaskItemList?.principalList?.map((item) => {
            return {
                value: item?.id,
                text: item?.name,
                tooltip: item?.name
            }
        }) as { value: string; text: string; tooltip: string; disabled?: undefined; }[];
        setLawOptions(_lawOptions);
        setModuleOptions(_moduleOptions);
        setCarModelOptions(_carModelOption);
        setDutyUserOptions(_dutyUserOptions);

    }, [projectOptionData.data]);

    useEffect(() => {
        if (props.isShow) {
            let origin = {
                name: "",
                description: "",
                lawId: "",
                carModelId: "",
                principalUserId: "",
                version: "1"
            };
            setFormData(origin);
            setCascederValue(undefined);
        }
    }, [props.isShow])


    return <> <Modal visible={props.isShow} caption={<Localized id='compliance-project-add'></Localized>} onClose={() => { props.setIsShowAddDialog(false) }}>
        <Modal.Body>
            <Form>
                <Form.Item label={<Localized id='column-projectName'></Localized>} status={renderStatus('name')}>
                    <Input value={formData.name} onChange={(value) => { changeFromData('name', value) }} placeholder={getValue('license-upload-placeholder')} size='full' />
                </Form.Item>
                <Form.Item label={<Localized id='compliance-suite'></Localized>} status={renderStatus('lawId')}>
                    <Select
                        matchButtonWidth
                        type="simulate"
                        appearance="button"
                        options={lawOptions}
                        value={formData.lawId}
                        onChange={(value) => {
                            changeFromData('lawId', value);
                        }}
                        listWidth={300}
                        placeholder={getValue('license-upload-placeholder')}
                        size='full'
                    />
                </Form.Item>
                {/* <Form.Item label={<Localized id='column-module'></Localized>} status={renderStatus('moduelId')}>
                    <Radio.Group value={formData.moduelId} onChange={(value) => { changeFromData('moduelId', value) }}>
                        {moduleOptions?.map((value, key) => {
                            return <Radio key={key} name={value.value}>{value.text}</Radio>
                        })}
                    </Radio.Group>
                </Form.Item> */}
                <Form.Item label={<Localized id="compliance-editCarType"></Localized>} status={renderStatus('carModelId')}>
                    {/* <Select
                        type="simulate"
                        appearance="button"
                        options={carModelOptions}
                        value={formData.carModelId}
                        onChange={(value) => {
                            changeFromData('carModelId', value);
                        }}
                        size='full'
                        listWidth={300}
                        placeholder={getValue('license-upload-placeholder')}
                    /> */}
                    <Cascader
                        
                        style={{width:'100%'}}
                        value={cascederValue}
                        data={CascaderData}
                        onChange={(value,options) => {
                            setCascederValue(value);
                            changeFromData('carModelId', value[2]);
                        }}
                    />
                </Form.Item>
                {/* <Form.Item label={<Localized id="column-version"></Localized>} status={renderStatus('version')}>
                    <Input value={formData.version} size='full' onChange={(value) => { changeFromData('version', value) }} placeholder={getValue('license-upload-placeholder')} />
                </Form.Item> */}
                <Form.Item label={<Localized id="column-dutyUser"></Localized>} status={renderStatus('principalUserId')}>
                    <Select
                        matchButtonWidth
                        type="simulate"
                        appearance="button"
                        options={dutyUserOptions}
                        value={formData.principalUserId}
                        onChange={(value) => {
                            changeFromData('principalUserId', value);
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
            <Button type="primary" onClick={saveBtnClick} loading={isEtablish}>
                <Localized id={'modal-ok'}></Localized>
            </Button>
            <Button type="weak" onClick={() => { props.setIsShowAddDialog(false) }}>
                <Localized id={'modal-cancel'}></Localized>
            </Button>
        </Modal.Footer>
    </Modal></>
}