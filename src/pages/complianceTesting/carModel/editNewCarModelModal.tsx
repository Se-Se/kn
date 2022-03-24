import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { Modal, Input, Button, Form, Select, notification, Table } from '@tencent/tea-component';
import { useGetCaseStaticCheckedItemsQuery, useEditCarModelInfoMutation } from 'generated/graphql';

type EditNewCarModel = {
    isShow: boolean
    setIsShowAddDialog: Dispatch<SetStateAction<boolean>>
    refreshFn: () => void
    selectItem: any
}
export const EditNewCarModelModal: React.FC<EditNewCarModel> = (props) => {

    const [add] = useEditCarModelInfoMutation();
    const getValue = useGetMessage();

    const teamId = 'team_items;1';
    const [carModuleName, setCarModuleName] = useState<string>('');
    const [carModuleNameSt] = useState<any>('');
    const [optionList, setOptionList] = useState<any>();
    const [partsList, setPartsList] = useState<any[]>([]);
    const [, setPartsListSt] = useState<any>('');

    const optionHook = useGetCaseStaticCheckedItemsQuery({
        variables: {
            teamId: teamId
        }
    })


    const { removeable, scrollable } = Table.addons;
    const columns: any[] = [
        {
            key: "type",
            header: '零部件类型',
            render: (_value: any) => {
                return <>
                    <Select
                        matchButtonWidth
                        size="full"
                        type="simulate"
                        appearance="button"
                        options={optionList}
                        listWidth={280}
                        value={_value.parts}
                        onChange={(value) => {
                            let _partList = JSON.parse(JSON.stringify(partsList));
                            let item = _partList.filter((_item: any) => {
                                if (_item.id === _value.id) {
                                    return _item
                                }
                            })
                            item[0].parts = value;
                            setPartsList(_partList);
                        }}
                    />
                </>
            }
        },
        {
            key: "parts",
            header: getValue('compliance-carParts'),
            render: (_value: any) => {
                return <>
                    <Input size={'full'} value={_value.componentName}
                        onChange={(value) => {
                            let _partList = JSON.parse(JSON.stringify(partsList));
                            let item = _partList.filter((_item: any) => {
                                if (_item.id === _value.id) {
                                    return _item
                                }
                            })
                            item[0].componentName = value;
                            // _partList[_value.id].version = value;
                            setPartsList(_partList);
                        }} />
                </>
                // return <div>dom</div>
            }
        },
        {
            key: "version",
            header: getValue('compliance-versionNum'),
            render: (_value: any) => {
                return <>
                    <Input size={'full'} value={_value.version}
                        onChange={(value) => {
                            let _partList = JSON.parse(JSON.stringify(partsList));
                            let item = _partList.filter((_item: any) => {
                                if (_item.id === _value.id) {
                                    return _item
                                }
                            })
                            item[0].version = value;
                            // _partList[_value.id].version = value;
                            setPartsList(_partList);
                        }} />
                </>
                // return <div>dom</div>
            }
        }
    ];
    // const checkName = () => {

    // }

    const checkPartList = () => {
        let result = true;
        for (let item of partsList) {
            if (!item.version || !item.parts) {
                result = false;
            }
        }
        if (result) {
            setPartsListSt('success');
        }
        else {
            setPartsListSt('error');
        }
        return result;
    }


    const AddBtnFn = () => {
        // if()
        let _partsList = JSON.parse(JSON.stringify(partsList));

        // let item = _partsList[_partsList.length - 1];
        // if (!item.version || !item.parts) {
        //     return
        // }

        _partsList.push({
            parts: '',
            version: '',
            // id: _partsList[_partsList.length - 1].id + 1
        });
        setPartsList(_partsList);
    }

    // const renderStatus = (value: any) => {
    //     if (value) {
    //         return 'success'
    //     }
    //     else {
    //         return 'error'
    //     }
    // }

    const [, setIsValidate] = useState(false);

    useEffect(() => {
        if (props.isShow) {
            // setPartsList([{
            //     parts: '',
            //     version: '',
            //     id: 0
            // }]);

            optionHook.refetch();
            setCarModuleName(props.selectItem.carName);
            let list = [];
            for (let i = 0; i < props.selectItem.carInfoItem.length; i++) {
                list.push({
                    componentName: props.selectItem.carInfoItem[i].modelName,
                    version: props.selectItem.carInfoItem[i].version,
                    id: props.selectItem.carInfoItem[i].id,
                    parts: props.selectItem.carInfoItem[i].modelTypeId
                })
            }
            console.log(list);

            setPartsList(list);
        }
    }, [props.isShow]);

    useEffect(() => {
        let _optionList: any[] = [];
        optionHook.data?.getCaseStaticCheckedItems?.carSpareParts?.map((_value: any, key: any) => {
            _optionList.push({
                value: _value.id, text: _value.name
            })
        })
        setOptionList(_optionList);
    }, [optionHook.data?.getCaseStaticCheckedItems])

    useEffect(() => {
        checkPartList();
    }, [partsList])

    useEffect(() => {
        console.log(props.selectItem);
    }, [props.selectItem])


    const validateFrom = () => {
        checkPartList();

        setIsValidate(true);
        let result = true;
        if (carModuleName === '') {
            result = false
        }
        return result;
    }
    const saveBtnClick = async () => {
        let _componentList = [];
        for (let item of partsList) {
            _componentList.push({
                componentId: item.id ? item.id : '',
                version: item.version,
                componentName: item.componentName,
                carSparePartId: item.parts
            })
        }
        if (validateFrom()) {
            await add({
                variables: {
                    teamId: teamId,
                    carName: carModuleName,
                    componentList: _componentList,
                    id: props.selectItem.id
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
            }).finally(() => {
                props.setIsShowAddDialog(false);
                setCarModuleName('')
                setIsValidate(false)
            })
        }
    }
    return <> <Modal size='l' visible={props.isShow} caption={<Localized id='compliance-editCarModel'></Localized>} onClose={() => { props.setIsShowAddDialog(false) }}>
        <Modal.Body>
            <Form>
                <Form.Item label={<Localized id='compliance-columnCarModel'></Localized>} status={carModuleNameSt}>
                    <Input value={carModuleName} onChange={(value) => { setCarModuleName(value) }} placeholder={getValue('license-upload-placeholder')} size='full' />
                </Form.Item>
                <Form.Item label={<Localized id='compliance-carParts'></Localized>} showStatusIcon={false}>
                    <Table
                        bordered
                        recordKey={'id'}
                        records={partsList}
                        columns={columns}
                        addons={[
                            removeable({
                                onRemove: (value) => {
                                    let _partsList = JSON.parse(JSON.stringify(partsList));
                                    let result: any[] = [];
                                    _partsList.map((_value: any, key: any) => {
                                        if (_value.id !== value) {
                                            result.push(_value);
                                        }
                                    })
                                    if (result.length === 0) { return }
                                    setPartsList(result);
                                }
                            }),
                            scrollable({
                                maxHeight: 300,
                                onScrollBottom: () => console.log("到达底部"),
                            }),
                        ]}
                    />
                    <Button style={{ marginTop: 10 }} type="link" onClick={AddBtnFn}><Localized id="compliance-addCarParts"></Localized></Button>
                </Form.Item>
            </Form>
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