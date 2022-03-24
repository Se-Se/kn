import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { Modal, Transfer, Button, SearchBox, Table, notification, Tree } from '@tencent/tea-component';
import { useAddUserCustomCaseIntoSuiteMutation, useGetAllCaseListQuery } from 'generated/graphql';
import { isDefaultClause } from 'typescript';

interface AddRelModalType {
    isShow: boolean
    setIsShowAddDialog: Dispatch<SetStateAction<boolean>>
    suiteId: string
    refreshFn: any
}

export const AddRelModal: React.FC<AddRelModalType> = (props) => {
    const [inputValue, setInputValue] = useState("");
    const [addRel] = useAddUserCustomCaseIntoSuiteMutation();

    const getValue = useGetMessage();
    const { removeable } = Table.addons;

    const [selectedKeys, setSelectedKeys] = useState<any[]>([]);

    const teamId = 'team_items;1';

    const [sourceData, setSourceData] = useState<any[]>([]);
    const [selectData, setSelectData] = useState<any[]>([]);


    const DataListHook = useGetAllCaseListQuery({
        variables: {
            teamId: teamId,
            suiteId: props.suiteId,
            search: {
                // offset: {
                //     offset: -1,
                //     limit: -1
                // }
            }
        },
        fetchPolicy:'network-only'
    })
    const selectColumns = [

        {
            key: "content",
            header: getValue('compliance-caseName'),
            width: 150
        }
    ];
    const [expandList, setIsExpandList] = useState<any>([]);

    useEffect(() => {
        // setSourceData(DataListHook.data?.getAllCaseList?.resultList || []);
        if (DataListHook.data?.getAllCaseList?.groupResultList) {
            let groupList = [];
            for (let index = 0; index < DataListHook.data?.getAllCaseList?.groupResultList?.length; index++) {
                let item = DataListHook.data.getAllCaseList.groupResultList[index] || {};
                let childrenList = [];
                for (let caseItem of item.resultList || []) {
                    childrenList.push(
                        {
                            id: caseItem?.id,
                            content: caseItem?.name
                        }
                    )
                }
                groupList.push({
                    id: (index + 1).toString(),
                    content: item.name,
                    children: childrenList
                })
            }
            setSourceData(groupList)
        }
    }, [DataListHook.data?.getAllCaseList?.resultList]);

    useEffect(() => {
        setSelectedKeys(DataListHook.data?.getAllCaseList?.selectCaseId || []);

    }, [DataListHook.data?.getAllCaseList?.selectCaseId])

    useEffect(() => {
        let _selectData: any[] = [];

        selectedKeys.map((looper: any, key: any) => {
            // let item = sourceData.filter((_value: any) => {
            //     if (_value.id === looper) {
            //         return _value
            //     }
            // });

            if (DataListHook.data?.getAllCaseList?.groupResultList) {

                for (let item of DataListHook.data?.getAllCaseList?.groupResultList) {
                    if (item?.resultList) {

                        for (let itemCase of item.resultList) {
                            if (itemCase && looper === itemCase.id) {
                                _selectData.push({
                                    content: itemCase.name,
                                    id: itemCase.id
                                });
                            }
                        }
                    }
                }
            }

        })
        setSelectData(_selectData);
    }, [selectedKeys])


    useEffect(() => {
        if (DataListHook.data?.getAllCaseList?.groupResultList) {
            let groupList = [];
            let _expandList: any[] = [];
            for (let index = 0; index < DataListHook.data?.getAllCaseList?.groupResultList?.length; index++) {
                let item = DataListHook.data.getAllCaseList.groupResultList[index] || {};
                let childrenList = [];
                for (let caseItem of item.resultList || []) {
                    if ((inputValue && caseItem?.name && caseItem?.name.toUpperCase().indexOf(inputValue.toUpperCase()) > -1) || inputValue === '') {
                        childrenList.push(
                            {
                                id: caseItem?.id,
                                content: caseItem?.name
                            }
                        )
                        _expandList.push((index + 1).toString());
                    }

                }
                groupList.push({
                    id: (index + 1).toString(),
                    content: item.name,
                    children: childrenList
                })
            }

            setSourceData(groupList)
            setIsExpandList(_expandList);

            console.log(inputValue);
        }
    }, [inputValue])


    useEffect(() => {
        if (props.isShow) {
            // setSelectedKeys([]);
            // setSourceData([]);
            DataListHook.refetch();
            setSelectedKeys(DataListHook.data?.getAllCaseList?.selectCaseId || []);
        }
        // else{
        //     setSelectedKeys([]);
        //     setSourceData([]);
        // }
    }, [props.isShow])

    return <> <Modal size={'80%'} visible={props.isShow} caption={'管理用例'} onClose={() => { props.setIsShowAddDialog(false) }}>
        <Modal.Body>
            <Transfer
                leftCell={
                    <Transfer.Cell
                        title={<Localized id='compliance-selectCase'></Localized>}
                        // tip={<Localized id="compliance-dragSupport"></Localized>}
                        header={
                            <SearchBox
                                value={inputValue}
                                onChange={value => setInputValue(value)}
                                onClear={() => { setInputValue('') }}
                            />
                        }
                    >
                        <Tree
                            // selectStrictly
                            style={{width:'100%'}}
                            selectValueMode={'onlyLeaf'}
                            data={sourceData}
                            selectable
                            selectedIds={selectedKeys}
                            defaultExpandedIds={[]}
                            expandedIds={expandList}
                            onSelect={(value, context) => {
                                setSelectedKeys(value);
                            }}
                            onExpand={(idList, context) => {
                                setIsExpandList(idList)
                            }}
                        />
                        {/* <Table
                            records={sourceData.filter((value:any)=>{
                                // console.log(value);
                                if(value.name.indexOf(inputValue)>-1||value.serialNumber.indexOf(inputValue)>-1){
                                    return value
                                }})}
                            recordKey="id"
                            // rowDisabled={record => record.status === "stopped"}
                            // rowClassName={record => record.status}
                            columns={columns}
                            addons={[
                                scrollable({
                                    maxHeight: 310
                                }),
                                selectable({
                                    value: selectedKeys,
                                    onChange: (value) => {
                                        setSelectedKeys(value);
                                    },
                                    rowSelect: true,
                                }),
                            ]}
                        /> */}
                    </Transfer.Cell>
                }
                rightCell={
                    <Transfer.Cell title={`已选择 (${selectedKeys.length})`}>
                        <Table
                            records={selectData}
                            recordKey="id"
                            columns={selectColumns}
                            addons={
                                [
                                    removeable({
                                        onRemove: (value) => {
                                            let _selectedKeys = selectedKeys;
                                            let result = [];
                                            for (let i = 0; i < _selectedKeys.length; i++) {
                                                if (_selectedKeys[i] !== value) {
                                                    result.push(_selectedKeys[i]);
                                                }
                                            }
                                            setSelectedKeys(result);
                                        }
                                    })
                                ]}
                        />
                    </Transfer.Cell>
                }
            />
        </Modal.Body>
        <Modal.Footer>
            <Button type="primary" onClick={() => {
                addRel({
                    variables: {
                        teamId: teamId,
                        suiteId: props.suiteId,
                        caseIds: selectedKeys
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
                })
            }}>
                <Localized id={'modal-ok'}></Localized>
            </Button>
            <Button type="weak" onClick={() => { props.setIsShowAddDialog(false); }}>
                <Localized id={'modal-cancel'}></Localized>
            </Button>
        </Modal.Footer>
    </Modal>
    </>
}