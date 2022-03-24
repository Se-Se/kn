import React, { useEffect, useState } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { Link, useRouteMatch } from 'react-router-dom';
import { useGetSuiteWithCaseIdsQuery, useGetAllCaseListQuery, useGetCaseStaticCheckedItemsQuery } from 'generated/graphql';
import { AddNewCaseModal } from './addCaseModal';
import { ModifyCaseModal } from './modifyCaseModal';
import { DeleteCaseModal } from './deleteCaseModal';
import { generateLink, Pattern } from 'route';
import { Layout, Card, Table, Button, Status, Icon, SearchBox, Justify, SelectMultiple } from '@tencent/tea-component';
import { CaseRender } from '../case/caseRender';
// import { Editor } from './editor';
// import { MarkdownRender } from './markDownRender';
// import { Localized } from 'i18n';
const { pageable, autotip, scrollable } = Table.addons;

interface ProjectMatch {
    suiteId: string
    suiteName: string
}

export const Page: React.FC = () => {

    const pageParam = useRouteMatch<ProjectMatch>().params;
    const suiteId = pageParam.suiteId;
    const teamId = 'team_items;1';
    const getValue = useGetMessage();

    const [isShowAdd, setIsShowAdd] = useState(false);
    const [isShowModify, setIsShowModify] = useState(false);
    const [isShowDelete, setIsShowDelete] = useState(false);

    const [suiteList, setSuiteList] = useState<any[]>([]);
    const [suiteCount, setSuiteCount] = useState<number>(0);
    const [offsetParam, setOffsetParam] = useState<any>({
        offset: 0,
        limit: 100
    })
    const [searchParam, setSearchParam] = useState<any>({
        retrieveData: [],
        sortData: [{
            SortColumn:'serialNumber',
            SortOrder:'ASC'
        }]
        // sortData:[]
    })

    const [uploadFileUrl, setUploadFileUrl] = useState<string>('')
    const [selectCaseItem, setSelectCaseItem] = useState<any>()
    const [deleteCaseId, setDeleteCaseId] = useState<any>();
    const [pageSize, setPageSize] = useState<any>(100);

    const [areaOptions, setAreaOptions] = useState<any[]>([]);
    const [cataGreyOptions, setCataGreyOptions] = useState<any[]>([]);
    const [systemOptions, setSystemOptions] = useState<any[]>([]);
    const [riskOptions, setRiskOptions] = useState<any[]>([]);

    const [selectArea, setSelectArea] = useState<any>([]);
    const [selectCataGrey, setSelectCataGrey] = useState<any>([]);
    const [selectSystem, setSelectSystem] = useState<any>([]);
    const [selectRisk, setSelectRisk] = useState<any>([]);

    const dataHook = useGetAllCaseListQuery(
        {
            variables: {
                teamId: teamId,
                offset: offsetParam,
                search: searchParam
            },
            fetchPolicy: 'network-only'
        }
    );

    // const bindingHook = useGetSuiteWithCaseIdsQuery({
    //     variables: {
    //         teamId: teamId,
    //         caseIds: deleteCaseId?[deleteCaseId]:null
    //     }
    // });


    const suiteColumns: any = [
        {
            key: "serialNumber",
            header: getValue('compliance-caseId'),
            width: 80
        },
        {
            key: "name",
            header: getValue('compliance-caseName'),
            width: 240,
            render: (value: any) => {
                const pathparams = {
                    caseId: value?.id,
                }
                return <div>
                    <Link title={value?.name} style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        width: 'calc(100% - 10px)',
                        textDecoration: 'none'
                    }} to={generateLink(Pattern.CaseDetail, pathparams)}>{value?.name}</Link>
                </div>
            }
        }, {
            key: "caseDesc",
            header: '描述',
            width: 200,
        }, {
            key: "territoryName",
            header: getValue('compliance-area'),
            width: 100,
        }, {
            key: "classifyName",
            header: getValue('compliance-catagrey'),
            width: 80,
        }, {
            key: "operatingSystemName",
            header: '操作系统',
            width: 80,
        }, {
            key: "riskLevelName",
            header: '风险程度',
            width: 80,
            render: (value: any) => {
                return <span style={{ color: value.riskLevelType === 'high' ? 'red' : value.riskLevelType === 'warn' ? '#EC9405' : 'black' }}>{value.riskLevelName}</span>
            }
        }, {
            
            key: "testMethodName",
            width: 80,
            header: '测试类型',
        },{
            key: "submitUserName",
            header: getValue('column-creator'),
            width: 80,
        }, {
            key: "checkResult",
            header: getValue('column-operation'),
            width: 80,
            fixed: "right",
            render: (value: any) => {
                return <div>
                    <Button disabled={!value.canModify} type="link" onClick={(e) => {
                        setSelectCaseItem(value);
                        setIsShowModify(true);
                    }}>
                        {value.collectStatus === 0 ? <Localized id='operation-edit'></Localized> :
                            <Localized id='operation-edit'></Localized>}

                    </Button>
                    <Button disabled={!value.canModify} type="link" style={{ marginLeft: 10 }} onClick={(e) => { deleteFn(value.id) }}>
                        <Localized id='operation-delete'></Localized>
                    </Button>
                </div>
            }
        }
    ];

    const deleteFn = async (id: string) => {
        setDeleteCaseId(id);
        // const yes = await Modal.confirm({
        //     message: getValue('compliance-deleteConfirm'),
        //     description: getValue("compliance-deleteCaseDesc"),
        //     okText: getValue("operation-delete"),
        //     cancelText: getValue("modal-cancel"),
        // });
        // if (yes) {
        //     await deleteCase({
        //         variables: {
        //             teamId: teamId,
        //             caseId: id
        //         }
        //     }).catch((error) => {
        //         notification.error({
        //             description: error.toString()
        //         })
        //     })
        //     dataHook.refetch();
        // }
        setIsShowDelete(true);
    };

    const optionHook = useGetCaseStaticCheckedItemsQuery({
        variables: {
            teamId: teamId
        }
    });

    const searchValue = () => {
        let retrieveData: any[] = [];

        selectArea.map((value: any, key: any) => {
            retrieveData.push({
                RetrieveColumn: 'territoryId',
                RetrieveValue: value
            })
        })

        selectCataGrey.map((value: any, key: any) => {
            retrieveData.push({
                RetrieveColumn: 'classifyId',
                RetrieveValue: value
            })
        })
        selectSystem.map((value: any, key: any) => {
            retrieveData.push({
                RetrieveColumn: 'operatingSystemId',
                RetrieveValue: value
            })
        })
        selectRisk.map((value: any, key: any) => {
            retrieveData.push({
                RetrieveColumn: 'riskLevelId',
                RetrieveValue: value
            })
        })

        setSearchParam({
            retrieveData: retrieveData,
            sortData: []
        })
    }

    useEffect(() => {

        // setSuiteList([]);
        setSuiteCount(0);
        if (dataHook.data?.getAllCaseList) {
            setSuiteList(dataHook.data.getAllCaseList?.resultList || []);
            setSuiteCount(dataHook.data.getAllCaseList?.count || 0);
            // setSuiteName(dataHook.data.getUserCustomCaseListBySuiteId.suiteName || '');
            setUploadFileUrl(dataHook.data.getAllCaseList.uploadFileUrl || '');
            // setIsBtnEnable(dataHook.data.getUserCustomCaseListBySuiteId.canModify);

        
        }
    }, [dataHook.data])
    useEffect(() => {
        // dataHook.refetch({ teamId: teamId, search: pageQueryInfo })
    }, []);
    // useEffect(() => {
    //     console.log(deleteCaseId);
    //     bindingHook.refetch()
    // }, [deleteCaseId]);

    useEffect(() => {
        let _areaOption: any[] = [];
        let _cataGreyOptions: any[] = [];
        let _systemOptions: any[] = [];
        let _riskOptions: any[] = [];

        optionHook.data?.getCaseStaticCheckedItems?.territoryList?.map((value: any, key: any) => {
            _areaOption.push({
                value: value.id.toString(),
                text: value.name
            })
        })

        optionHook.data?.getCaseStaticCheckedItems?.classifyList?.map((value: any, key: any) => {
            _cataGreyOptions.push({
                value: value.id.toString(),
                text: value.name
            })
        })

        optionHook.data?.getCaseStaticCheckedItems?.operatingSystem?.map((value: any, key: any) => {
            _systemOptions.push({
                value: value.id.toString(),
                text: value.name
            })
        })

        optionHook.data?.getCaseStaticCheckedItems?.riskLevel?.map((value: any, key: any) => {
            _riskOptions.push({
                value: value.id.toString(),
                text: value.name
            })
        })
        setAreaOptions(_areaOption);
        setCataGreyOptions(_cataGreyOptions);
        setSystemOptions(_systemOptions);
        setRiskOptions(_riskOptions);
    }, [optionHook.data?.getCaseStaticCheckedItems]);

    useEffect(() => {
        console.log(optionHook.data?.getCaseStaticCheckedItems);
    }, [optionHook.data?.getCaseStaticCheckedItems]);

    useEffect(() => {
        dataHook.refetch();
        console.log(searchParam);

    }, [offsetParam, searchParam])
    useEffect(() => {
        searchValue();
        console.log(selectArea, selectCataGrey, selectSystem, selectRisk);

    }, [selectArea, selectCataGrey, selectSystem, selectRisk])

    const { Content, Body } = Layout;
    return <>
        <Body>
            <Content>
                <Content.Header
                    title={<Localized id='compliance-caseManage'></Localized>}
                ></Content.Header>
                <Content.Body full>
                    <Justify left={
                        <div>
                            <Button type="primary" onClick={() => {
                                setIsShowAdd(true);
                            }}>
                                <Localized id="compliance-addcase"></Localized>
                            </Button>
                            <SelectMultiple
                                matchButtonWidth
                                staging={false}
                                style={{ marginLeft: 10, width: 120 }}
                                appearance="button"
                                options={areaOptions}
                                allOption={{
                                    value: "all",
                                    text: "全选",
                                }}
                                value={selectArea}
                                onChange={value => setSelectArea(value)}
                                placeholder="请选择领域"
                            />
                            <SelectMultiple
                                matchButtonWidth
                                staging={false}
                                style={{ marginLeft: 10, width: 120 }}
                                appearance="button"
                                options={cataGreyOptions}
                                allOption={{
                                    value: "all",
                                    text: "全选",
                                }}
                                value={selectCataGrey}
                                onChange={(value) => {
                                    setSelectCataGrey(value);
                                    console.log(value);
                                }}
                                placeholder="请选择分类"
                            />
                            <SelectMultiple
                                matchButtonWidth
                                staging={false}
                                style={{ marginLeft: 10, width: 120 }}
                                appearance="button"
                                options={systemOptions}
                                allOption={{
                                    value: "all",
                                    text: "全选",
                                }}
                                value={selectSystem}
                                onChange={value => setSelectSystem(value)}
                                placeholder="请选择操作系统"
                            />
                            <SelectMultiple
                                matchButtonWidth
                                staging={false}
                                style={{ marginLeft: 10, width: 120 }}
                                appearance="button"
                                options={riskOptions}
                                allOption={{
                                    value: "all",
                                    text: "全选",
                                }}
                                value={selectRisk}
                                onChange={value => setSelectRisk(value)}
                                placeholder="请选择风险程度"
                            />
                            <div style={{ display: 'inline-block', marginLeft: 10 }}>
                                <Icon type="refresh-blue" />
                                <Button type='link' onClick={() => {
                                    setSelectArea([]);
                                    setSelectCataGrey([]);
                                    setSelectSystem([]);
                                    setSelectRisk([]);
                                }}>重置</Button>
                            </div>
                        </div>
                    } right={
                        <SearchBox onSearch={(e) => {

                            console.log(e);

                            let result = searchParam;
                            let hasCaseName = false;

                            result.retrieveData.map((value: any, key: any) => {
                                if (value.RetrieveColumn === "caseName") {
                                    hasCaseName = true;
                                }
                            });

                            if (hasCaseName) {

                                for(let i =0;i<result.retrieveData.length;i++){
                                    if(result.retrieveData[i].RetrieveColumn === "caseName"){
                                        result.retrieveData[i].RetrieveValue=e;
                                    }
                                }


                                setSearchParam({
                                    retrieveData: result.retrieveData,
                                    sortData: result.sortData
                                });
                            }
                            else {
                                result.retrieveData.push({
                                    RetrieveColumn: 'caseName',
                                    RetrieveValue: e
                                })
                                setSearchParam({
                                    retrieveData: result.retrieveData,
                                    sortData: result.sortData
                                });
                            }
                        }} onClear={() => {
                            let result: any = [];
                            searchParam.retrieveData.map((value: any, key: any) => {
                                if (value.RetrieveColumn !== "caseName") {
                                    result.push(result);
                                }
                            })

                            let _search = searchParam;
                            _search.retrieveData = result;
                            setSearchParam(_search);

                        }} />
                    } />
                    <Card>
                        <Table columns={suiteColumns} style={{ marginTop: 10 }}
                            records={suiteList}
                            recordKey="id"
                            addons={[
                                scrollable({
                                    minWidth: 1400,
                                }),
                                pageable({
                                    pageSize: pageSize,
                                    recordCount: suiteCount,
                                    onPagingChange: (value) => {

                                        console.log(value);

                                        let offsetParam = {
                                            offset: (value.pageIndex as number - 1) * (value.pageSize as number),
                                            limit: value.pageSize
                                        }

                                        setOffsetParam(offsetParam);

                                        // let query = pageQueryInfo;
                                        // query.offset.offset = (value.pageIndex as number - 1) * (value.pageSize as number);
                                        // query.offset.limit = value.pageSize;
                                        // setPageQueryInfo(JSON.parse(JSON.stringify(query)))

                                        setPageSize(value.pageSize)
                                    }
                                }),
                                autotip({
                                    emptyText: <div>
                                        <Status icon={'blank'} title={<Localized id="compliance-nodata"></Localized>}></Status>
                                    </div>,
                                })
                            ]}></Table>

                    </Card>
                </Content.Body>
            </Content>
        </Body>
        <AddNewCaseModal suiteId={suiteId} uploadFileUrl={uploadFileUrl} refreshFn={() => { dataHook.refetch() }} isShow={isShowAdd} setIsShowAddDialog={setIsShowAdd}></AddNewCaseModal>
        <ModifyCaseModal suiteId={suiteId} uploadFileUrl={uploadFileUrl} caseItem={selectCaseItem} refreshFn={() => { dataHook.refetch() }} isShow={isShowModify} setIsShowAddDialog={setIsShowModify}></ModifyCaseModal>
        <DeleteCaseModal deleteId={deleteCaseId} suiteId={suiteId} deleteCaseId={deleteCaseId} refreshFn={() => { dataHook.refetch() }} isShow={isShowDelete} setIsShowAddDialog={setIsShowDelete}></DeleteCaseModal>
    </>
}