import React, { useState, useEffect } from "react";
import { Button, Dialog, Input, Select, Table, Upload, TableSort, message, Tooltip } from "tdesign-react";
import { ProgressTag } from "../../../component/progressTag";
import style from "@emotion/styled/macro";
import styled from "@emotion/styled/macro";
import { SearchIcon } from "tdesign-icons-react";
import { MyDrawer } from "./appDraw";
import { UploadDrawer } from "../components/uploadDrawer";
import { MyCasCader } from "../components/cascader";
import { useHistory } from "react-router-dom";
import { systemGetRetrieveList, systemGetAutoPartsGroup, systemGetAppList, systemDelete, systemRelationAutoParts } from "../../../util/api";
import axios from 'axios';


const CardMain = style.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
`;
const CardContentTitle = style.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const TableContent = style.div`
    width: 100%;
    height: 100%;
    background-color:#FFFFFF;
    margin-top:12px;
    padding-top:24px;
`;
const Style = styled.div`
  .button-margin {
    margin-left: 8px;
  }
  .input-search {
    width: 320px;
  }
  .select-group {
    display: flex;
    padding-left:25px;
    flex-wrap:wrap;
  }
  .select-customer {
    margin-left: 20px;
  }
  .t-select__popup-reference {
    overflow: hidden;
  }
  .progress-icon{
    font-weight: bold;
  }
  .t-progress__bar{
    border-radius: unset;
    height:8px; 
  }
  .t-progress__inner{
    border-radius: unset; 
  }
  .action-group{
    .t-upload{
        display:inline-block;
    }
`;
const SelectTitle = styled.div`
  height:32px;
  line-height:32px;
  margin-right:24px;
  min-width:56px;
`
const Ellipsis = styled.div`
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
width:110px;
`
export const APPPanel: React.FC = () => {
    const history = useHistory();

    const [searchValue, setSearchValue] = useState<any>({
        retrieveColumn: "system_items.name",
        retrieveLike: true,
        retrieveValue: [],
    });
    const [filterSelectOne, setFilterSelectOne] = useState<any>({
        retrieveColumn: "auto_parts_items.id",
        retrieveValue: [],
        retrieveLike: false,
    });
    const [filterSelectTwo, setFilterSelectTwo] = useState<any>({
        retrieveColumn: "car_model_items.id",
        retrieveValue: [],
        retrieveLike: false,
    });


    const [pageSize, setPageSize] = useState<number>(10);
    const [current, setCurrent] = useState<number>(1);
    const [total, setTotal] = useState(50);
    const [sort, setSort] = useState<TableSort>([]);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
    const [drawerShowId, setDrawerShowId] = useState<string>("");
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [relationParts, setRelationParts] = useState<any[]>([]);
    const [batchAccssoryLoading, setBatchAccssoryLoading] = useState<boolean>(false);
    const [uploadDrawerVisible, setUploadDrawerVisible] = useState<boolean>(false);
    const [list, setList] = useState<any>([]);
    const [partsOptions, setPartsOptions] = useState<any>([]);
    const [modesOptions, setModesOptions] = useState<any>([]);
    const [editData, setEditData] = useState<any>({}); //????????????
    const [partsList, setPartsList] = useState<any>([]); //??????????????????????????????list
    const [deleteDialog, setDeleteDialog] = useState<any>(false);
    const [deleteId, setDeleteId] = useState<any>([]);
    const [isGroupDelete, setIsGroupDelete] = useState<any>(false);

    useEffect(() => {
        makeParams();
    }, [pageSize, current, sort]);

    // ??????????????????
    useEffect(() => {
        initData();
        getPartsList();
    }, []);

    // ???????????????
    const initData = () => {
        getRetrieveList();
    };

    //??????????????????????????????
    const getRetrieveList = () => {
        systemGetRetrieveList().then((res: any) => {
            if (res) {
                const { retrieveListAutoPartsList, retrieveListCarModelList } = res;
                const parts: any = (retrieveListAutoPartsList || []).map((item: any) => {
                    return {
                        value: item.autoPartsId.toString(),
                        label: item.autoPartsNameAndVersion,
                    };
                });
                setPartsOptions(parts || []);
                const models: any = (retrieveListCarModelList || []).map((item: any) => {
                    return {
                        value: item.carModelId.toString(),
                        label: item.carModelNameAndVersion,
                    };
                });
                setModesOptions(models || []);
            }

        });
    };


    // ??????????????????????????????
    const getPartsList = () => {
        systemGetAutoPartsGroup().then((res: any) => {
            formatterPartsList(res.results);
        });
    };
    // ???????????????????????????????????????
    const formatterPartsList = (data: any) => {
        const ops: any = data.map((item: any, index: number) => {
            item.value = "level_1" + index;
            return item;
        });
        setPartsList(ops);
    };

    // ??????btn click
    const reseatSelectGroup = () => {
        setFilterSelectOne({
            retrieveColumn: "auto_parts_items.id",
            retrieveValue: [],
            retrieveLike: false,
        });
        setFilterSelectTwo({
            retrieveColumn: "car_model_items.id",
            retrieveValue: [],
            retrieveLike: false,
        });
    };

    const rehandleChange = (pageInfo: { current: number; pageSize: number }) => {
        const { current, pageSize } = pageInfo;
        setCurrent(current);
        setPageSize(pageSize);
    };
    const fetchData = () => {
        makeParams();
    };
    const createNew = () => {
        setDrawerShowId("");
        setDrawerVisible(true);
    };
    const jumpToDetail = (id: any) => {
        history.push(
            `/lingshu/assetsManage/systemManage/appDetail/${Number(id)}`
        );
    };
    const makeParams = () => {
        const paramArr = [
            filterSelectOne,
            filterSelectTwo,
            searchValue,
        ].filter((item: any) => item.retrieveValue.length !== 0);

        let params = {
            retrieve: {
                offset: {
                    currentPage: current,
                    pageSize: pageSize,
                },
                retrieveData: paramArr,
                sortData: sort,
            },
        };
        console.log("params", params);

        systemGetAppList(params).then((res: any) => {
            const { result, count } = res;
            setTotal(count || 0);
            formatterList(result || []);
        });
    };

    const formatterList = (data: any) => {
        let arr: any = data.map((item: any, index: number) => {
            item.index = index + 1;
            return item;
        });
        console.log("arr===>", arr);
        setList((v: any) => {
            v = [];
            return arr || [];
        });
    };

    // ??????????????????
    const handleNameSearch = (v: any) => {
        let arr: any = [];
        if (v) {
            arr = [v];
        } else {
            arr = [];
        }
        setSearchValue({
            retrieveColumn: "system_items.name",
            retrieveLike: true,
            retrieveValue: arr,
        });
    };

    // ????????????
    const handleDeleteConfirm = () => {
        console.log('confirm', isGroupDelete, deleteId);
        let request: any = {
            systemIds: [],
        };
        if (isGroupDelete) {
            let arr: any = selectedRowKeys.map((item: any) => {
                return Number(item);
            });
            request.systemIds = arr;
        } else {
            request.systemIds = deleteId;
        }
        systemDelete(request).then((res: any) => {
            if (res?.code === 0) {
                message.success('????????????');
                makeParams();
                setSelectedRowKeys([]);
            } else {
                message.error('????????????');
            }

        });
        setDeleteDialog(false);
    }
    // ????????????
    const handleDelete = (e: any) => {
        setDeleteDialog(true);
        setDeleteId([Number(e)]);

    };
    // ????????????
    const handleGroupDelete = () => {
        setDeleteDialog(true);
        setIsGroupDelete(true);
    };
    // ??????dialog ??????
    const deleteDialogClose = () => {
        setDeleteDialog(false);
        setDeleteId([]);
        setIsGroupDelete(false);
    }

    const handleFail = (data: any, row: any) => {
        console.log('fail', data);
        let arr: any = list.map((item: any) => {
            if (item.id === row.id) {
                item.appUploadProgress = 3;
            }
            return item;
        });
        setList(arr);
    }
    const beforeUpload = (file: any, row: any) => {
        console.log('formatResponse', file, row);
        let arr: any = list.map((item: any) => {
            if (item.id === row.id) {
                item.appUploadProgress = 2;
            }
            return item;
        });
        setList(arr);
        // let params = new FormData()
        // params.append('file', file.raw);
        // params.append('systemId', row.id.toString());
        // systemUploadFile(params,onProgress).then((res) => {
        //     console.log('systemUploadFile',res)
        //     makeParams();
        // }).catch((err)=>{
        //   console.log(err)
        // })
        return true
    }
    // ????????????
    const onProgress = (val: any, row: any) => {
        let arr: any = list.map((item: any) => {
            if (item.id === row.id) {
                item.appUploadProgress = 2;
            }
            return item;
        });
        setList(arr);
    }

    // ????????????
    const handleSuccess = (res: any, row: any) => {
        console.log('success--res', res, row);
        if (res.response.code === 0) {
            let arr: any = list.map((item: any) => {
                if (item.id === row.id) {
                    item.appUploadProgress = 1;
                }
                return item;
            });
            setList(arr);
        }
    }
    // ????????????
    const uploadAgain = (row: any) => {
        return (

            <Upload
                onFail={(v) => handleFail(v, row)}
                action={`${axios.defaults.baseURL}` + '/system/uploadFile'}
                data={{ systemId: row.id }}
                showUploadProgress
                headers={{ authorization: `Bearer ${window.localStorage.getItem('sysauditor-token')}` }}
                beforeUpload={(file) => beforeUpload(file, row)}
                onProgress={(val) => onProgress(val, row)}
                onSuccess={(res) => handleSuccess(res, row)}
                theme="custom"
            >
                <span >
                    {row.appUploadProgress === 0 ? '????????????' : '????????????'}
                </span>
            </Upload>

        )
    };


    const columns = [
        {
            colKey: "row-select",
            type: "multiple",
            width: 50,
        },
        {
            align: "left",
            width: 100,
            minWidth: 100,
            colKey: "index",
            title: "??????",
        },
        {
            align: "left",
            width: 100,
            minWidth: 100,
            colKey: "id",
            title: "??????",
            sorter: true,
        },

        {
            align: "left",
            width: 200,
            minWidth: 200,
            colKey: "name",
            title: "??????",
            sorter: true,
            render(cell: any) {
                return (
                    <span>
                        <a onClick={() => jumpToDetail(cell.row.id)}>{cell.row.name}</a>
                    </span>
                );
            },
        },
        {
            align: "left",
            width: 150,
            minWidth: 150,
            colKey: "appPath",
            title: "??????",
            sorter: true,
        },
        {
            align: "left",
            width: 150,
            minWidth: 150,
            colKey: "appFunction",
            title: "??????",
            sorter: true,
        },
        {
            align: "left",
            width: 200,
            minWidth: 200,
            colKey: "appUploadProgress",
            title: "????????????",
            sorter: true,
            render(cell: any) {
                return (
                    <ProgressTag progress={cell.row.appUploadProgress} />
                )
            }
        },
        {
            align: 'left',
            width: 150,
            minWidth: 150,
            colKey: 'belongAutoParts',
            title: '???????????????',
            sorter: true,
            render(cell: any) {
                if (cell.row?.belongAutoParts?.length) {
                    return <Tooltip
                        content={cell.row?.belongAutoParts.map((item: any) => item.autoPartName + '-' + item.autoPartVersion).join('/')}
                        theme="light"
                        showArrow={false}>
                        <Ellipsis>
                            {cell.row?.belongAutoParts.map((item: any) => item.autoPartName + '-' + item.autoPartVersion).join('/')}
                        </Ellipsis>
                    </Tooltip>

                };
                return '-';
            }
        },
        {
            align: 'left',
            width: 150,
            minWidth: 150,
            colKey: 'belongCarModels',
            title: '????????????',
            sorter: true,
            render(cell: any) {
                if (cell.row?.belongCarModels?.length) {
                    return <Tooltip
                        content={cell.row?.belongCarModels.map((item: any) => item.carModelName + '-' + item.carModelVersion).join('/')}
                        theme="light"
                        showArrow={false}>
                        <Ellipsis>
                            {cell.row?.belongCarModels.map((item: any) => item.carModelName + '-' + item.carModelVersion).join('/')}
                        </Ellipsis>
                    </Tooltip>
                };
                return '-';
            }
        },
        {
            align: "left",
            width: 156,
            minWidth: 156,
            className: "row",
            colKey: "edit",
            title: "??????",
            fixed: "right",
            render(cell: any) {
                return (
                    <div className="action-group">
                        <a>{uploadAgain(cell.row)}</a>
                        <a
                            style={{ marginLeft: 10 }}
                            onClick={() => handleDelete(cell.row?.id)}
                        >
                            ??????
                        </a>
                    </div>
                );
            },
        },
    ];

    // ??????????????????
    function onSelectChange(value: any[]) {
        setSelectedRowKeys(value);
    }

    // ???????????????????????????Dialog
    const batchModal = () => {
        return (
            <Dialog
                visible={dialogVisible}
                header={"?????????????????????"}
                onClose={() => {
                    setRelationParts([]);
                    setDialogVisible(false);
                }}
                destroyOnClose
                width={700}
                confirmBtn={
                    <Button
                        theme="primary"
                        loading={batchAccssoryLoading}
                        onClick={() => submitRelationParts()}
                    >
                        ????????????
                    </Button>
                }
            >
                <MyCasCader
                    onChange={(value: any) => setRelationParts(value)}
                    value={relationParts}
                    optList={partsList}
                    visible={true}
                ></MyCasCader>
            </Dialog>
        );
    };


    //?????????????????????
    const submitRelationParts = () => {
        let ids: any = [...selectedRowKeys];
        ids = ids.map((item: any) => Number(item));
        let request: any = {
            autoPartIds: relationParts,
            systemIds: ids,
        };
        if (!ids.length || !relationParts.length) {
            setDialogVisible(false);
            return;
        }
        systemRelationAutoParts(request).then((res: any) => {
            if (res?.code === 0) {
                message.success("????????????");
                setDialogVisible(false);
                setRelationParts([]);
                makeParams();
            } else {

                message.error("????????????");
                setDialogVisible(false);
                setRelationParts([]);
            }
        });
    };
    const selectOneChange = (value: any) => {
        const filterSelectOne = {
            retrieveColumn: "auto_parts_items.id",
            retrieveValue: value,
            retrieveLike: false,
        };
        setFilterSelectOne(filterSelectOne);
    };
    const selectTowChange = (value: any) => {
        const filterSelectTwo = {
            retrieveColumn: "car_model_items.id",
            retrieveValue: value,
            retrieveLike: false,
        };
        setFilterSelectTwo(filterSelectTwo);
    };



    // ????????????
    const save = () => {
        makeParams();
    };

    // ??????btn click
    const handleSearch = () => {
        makeParams();
    };

    const handleDataChange = (data: any) => {
        console.log("data123", data);
    };
    return (
        <Style>
            <CardMain>
                <CardContentTitle>
                    <div>
                        <Button theme="primary" onClick={() => createNew()}>
                            ??????APP
                        </Button>
                        <Button
                            variant="outline"
                            theme="default"
                            className="button-margin"
                            onClick={() => setUploadDrawerVisible(true)}
                        >
                            ??????APP
                        </Button>
                        <Button
                            variant="outline"
                            theme="default"
                            className="button-margin"
                            onClick={() => {
                                setDialogVisible(true);
                                setRelationParts([]);
                            }}
                        >
                            ?????????????????????
                        </Button>
                        <Button
                            variant="outline"
                            theme="default"
                            className="button-margin"
                            onClick={() => handleGroupDelete()}
                        >
                            ????????????
                        </Button>
                    </div>
                    <Input
                        type="search"
                        placeholder="?????????????????????????????????"
                        className="input-search"
                        onChange={(value) => handleNameSearch(value)}
                        onEnter={() => fetchData()}
                        suffixIcon={
                            <SearchIcon
                                onClick={() => fetchData()}
                                style={{ cursor: "pointer" }}
                            />
                        }
                    ></Input>
                </CardContentTitle>
                <TableContent>
                    <div className="select-group">
                        <SelectTitle>???????????????</SelectTitle>
                        <Select
                            value={filterSelectOne.retrieveValue}
                            onChange={selectOneChange}
                            minCollapsedNum={1}
                            placeholder="????????????????????????"
                            multiple
                            style={{ width: 200, marginRight: 24, marginBottom: 24 }}
                            options={partsOptions}
                        />
                        <SelectTitle>????????????</SelectTitle>
                        <Select
                            value={filterSelectTwo.retrieveValue}
                            minCollapsedNum={1}
                            onChange={selectTowChange}
                            placeholder="?????????????????????"
                            multiple
                            style={{ width: 200, marginRight: 32, marginBottom: 24 }}
                            options={modesOptions}
                        />
                        <Button
                            theme="primary"
                            onClick={() => handleSearch()}
                        >
                            ??????
                        </Button>
                        <Button
                            theme="default"
                            style={{ marginLeft: 8 }}
                            onClick={() => reseatSelectGroup()}
                        >
                            ??????
                        </Button>
                    </div>
                    <Table
                        rowKey="id"
                        data={list}
                        loading={tableLoading}
                        //@ts-ignore
                        columns={columns}
                        multipleSort={true}
                        onSelectChange={onSelectChange}
                        selectedRowKeys={selectedRowKeys}
                        // sort={sort} //??????????????? ??????
                        onSortChange={(sort) => {
                            setSort(sort);
                        }}
                        onDataChange={(v) => handleDataChange(v)}
                        disableDataSort={true}
                        pagination={{
                            current,
                            total,
                            pageSize,
                            showJumper: true,
                            onChange(pageInfo) {
                                rehandleChange(pageInfo);
                            },
                        }}
                    />
                </TableContent>
            </CardMain>
            <MyDrawer
                optList={partsList}
                editData={editData}
                visible={drawerVisible}
                id={drawerShowId}
                save={() => save()}
                onClose={() => setDrawerVisible(false)}
            ></MyDrawer>
            <UploadDrawer
                save={() => save()}
                subModule="app"
                label="??????APP"
                optList={partsList}
                visible={uploadDrawerVisible}
                onClose={() => setUploadDrawerVisible(false)}
            ></UploadDrawer>
            {batchModal()}
            <Dialog header="????????????APP?" onConfirm={() => handleDeleteConfirm()} visible={deleteDialog} onClose={() => deleteDialogClose()}>
            </Dialog>
        </Style>
    );
};
