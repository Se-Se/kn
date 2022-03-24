import React, { useState, useEffect } from "react";
import { Button, Dialog, Input, Select, Table, TableSort, message, Tooltip } from 'tdesign-react';
import style from "@emotion/styled/macro";
import styled from "@emotion/styled/macro";
import { SearchIcon } from 'tdesign-icons-react';
import { MyDrawer } from './drawer';
import { UploadDrawer } from './uploadDrawer'
import { MyCasCader } from "./cascader";
import { useHistory } from 'react-router-dom';
import { Loophole } from '../../../component/loopholeTag';
import { autoPartsGetList, autoPartsGetRetrieveList, autoPartsGetCreateRetrieveListGroup, autoPartsRelationCarModel, autoPartsDelete } from '../../../util/componentApi';

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
  .button-margin{
    margin-left:8px;
  }
  .input-search{
    width:320px;
  }
  .select-group{
    display:flex;
    padding-left:25px;
    flex-wrap:wrap;
  }
  .select-customer{
    margin-left:20px;
  }
  .kn-button-color-w{
    background: rgba(255,255,255,1);
  }
`
const SelectTitle = style.div`
  height:32px;
  line-height:32px;
  margin-right:24px;
`
const Ellipsis = styled.div`
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
width:110px;
`

type Props = {
    tabV: string;
}
export const ListPanel: React.FC<Props> = (props: Props) => {
    const history = useHistory();

    const [searchValue, setSearchValue] = useState<any>({ retrieveColumn: "auto_parts_items.name", retrieveLike: true, retrieveValue: [] });
    const [carModel, setCarModel] = useState<any>({ retrieveColumn: 'car_model_items.id', retrieveValue: [], retrieveLike: false });
    const [systemT, setSystemT] = useState<any>({ retrieveColumn: 'system_items.system_type', retrieveValue: [], retrieveLike: false });
    const [pageSize, setPageSize] = useState<number>(10);
    const [current, setCurrent] = useState<number>(1);
    const [total, setTotal] = useState<any>(0)
    const [sort, setSort] = useState<TableSort>([]);
    const [tableLoading] = useState<boolean>(false);
    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
    const [drawerShowId, setDrawerShowId] = useState<string>('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [batchAccssoryLoading] = useState<boolean>(false);
    const [uploadDrawerVisible, setUploadDrawerVisible] = useState<boolean>(false);
    const [deleteDialog, setDeleteDialog] = useState<any>(false);
    const [deleteId, setDeleteId] = useState<any>([]);
    const [isGroupDelete, setIsGroupDelete] = useState<any>(false);
    const [editData, setEditData] = useState<any>({})//编辑数据;
    const [theText, settheText] = useState<any>('ECU');
    const [list, setList] = useState<any>([]);
    const [selectOptionsOne, setSelectOptionsOne] = useState<any>([]);//系统options
    const [selectOptionsTwo, setSelectOptionsTwo] = useState<any>([]);//车型options
    const [optList, setOptList] = useState<any>([]);//新建drawer 车型options
    const [relateionV, setRelateionV] = useState<any>(null);//批量关联的value



    // tabV切换 时监听回调
    useEffect(() => {
        console.log('tabV', props.tabV);
        textCordingTab(props.tabV);

    }, [props.tabV]);

    useEffect(() => {
        getDrawerOptions();
        getRetrieveList();
    }, [])

    useEffect(() => {
        makeParams()
    }, [pageSize, current, sort, theText]);

    // tabV切换 切换文字
    const textCordingTab = (v: any) => {
        if (v === 'ecu') {
            settheText('ECU');
        } else if (v === 'cloud') {
            settheText('TSP');
        } else if (v === 'mobile') {
            settheText('移动端');
        }
    };

    const getRetrieveList = () => {
        let request: any = {
            autoPartsType: props.tabV
        };
        autoPartsGetRetrieveList(request).then((res: any) => {
            if (res?.code === 0) {
                const { belongCarModelSelectorList, systemVersionSelectorList } = res;
                setSelectOptionsOne(formatterOptions(systemVersionSelectorList || []) || []);
                setSelectOptionsTwo(formatterOptions(belongCarModelSelectorList || []) || []);
            }
        })
    }

    // 改变option value 为字符串
    const formatterOptions = (arr: any) => {
        return arr.map((item: any) => {
            item.value = item.value.toString();
            return item;
        })
    }


    // 获取所属车型Options列表
    const getDrawerOptions = () => {
        autoPartsGetCreateRetrieveListGroup().then((res: any) => {
            if (res?.code === 0) {
                const { results } = res;
                formatterOptList(results || [])
            }
        })
    }

    // 格式化获取需要绑定的Options
    const formatterOptList = (data: any) => {
        const ops: any = data.map((item: any, index: number) => {
            item.value = "level_1" + index;
            if (item.children.length) {
                item.children.forEach((i: any) => {
                    i.value = i.value.toString();
                })
            }
            return item;
        });
        setOptList(ops);
    }

    // reset按钮
    const reseatSelectGroup = () => {
        setCarModel({ retrieveColumn: 'car_model_items.id', retrieveValue: [], retrieveLike: false });
        setSystemT({ retrieveColumn: 'system_items.system_type', retrieveValue: [], retrieveLike: false });
    }

    const rehandleChange = (pageInfo: { current: number, pageSize: number }) => {
        const { current, pageSize } = pageInfo;
        setCurrent(current);
        setPageSize(pageSize);
    }

    // 点击搜索
    const fetchData = () => {
        makeParams();
    }
    const create = () => {
        setDrawerShowId('');
        setDrawerVisible(true);
        setEditData({})
    }
    const jumpToDetail = (id: string) => {
        console.log('id===', id)
        if (props.tabV === 'ecu') {
            history.push(`/lingshu/assetsManage/componentManage/ECUDetail/${Number(id)}`)
        } else if (props.tabV === 'cloud') {
            history.push(`/lingshu/assetsManage/componentManage/cloudDetail/${Number(id)}`)
        } else if (props.tabV === 'mobile') {
            history.push(`/lingshu/assetsManage/componentManage/mobleDetail/${Number(id)}`)
        }
    }
    const makeParams = () => {
        const paramArr = [systemT, carModel, searchValue].filter((item: any) => item.retrieveValue.length !== 0)
        let params = {
            autoPartsType: props.tabV,
            retrieve: {
                offset: {
                    currentPage: current,
                    pageSize: pageSize
                },
                retrieveData: paramArr,
                sortData: sort
            }
        }
        console.log('params', params);
        autoPartsGetList(params).then((res: any) => {
            if (res?.code === 0) {
                const { results, count } = res;
                setTotal(count || 0);
                formatterList(results || [])
            }
        })
    }

    // 添加index
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

    // 零束云和移动端列表-删除关联系统列
    const getColumns = (columns: any) => {
        if (props.tabV === 'cloud' || props.tabV === 'mobile') {
            return columns.filter((item: any) => item.colKey !== 'belongSystemVersionString');
        } else {
            return columns;
        }
    }
    const columns = [
        {
            colKey: 'row-select',
            type: 'multiple',
            width: 50,
        },
        {
            align: 'middle',
            width: 80,
            minWidth: 80,
            colKey: 'index',
            title: '序号',
        },
        {
            align: 'left',
            width: 100,
            minWidth: 100,
            colKey: 'number',
            title: '编号',
            sorter: true
        },
        {
            align: 'left',
            width: 150,
            minWidth: 150,
            colKey: 'name',
            title: '零部件',
            sorter: true,
            render(cell: any) {
                return <span><a onClick={() => jumpToDetail(cell.row.id)}>{cell.row.name}</a></span>
            }
        },
        {
            align: 'left',
            width: 150,
            minWidth: 150,
            colKey: 'version',
            title: '版本号',
            sorter: true
        },
        {
            align: 'left',
            width: 150,
            minWidth: 150,
            colKey: 'belongSystemVersionString',
            title: '操作系统',
            sorter: true,
            render(cell: any) {
                if (cell.row?.belongSystemVersionString !== '-') {
                    return <Tooltip theme="light" showArrow={false} content={cell.row?.belongSystemVersionString}><Ellipsis>{cell.row?.belongSystemVersionString}</Ellipsis></Tooltip>
                } else {
                    return '-'
                }
            }
        },
        {
            align: 'left',
            width: 150,
            minWidth: 150,
            colKey: 'belongCarModelString',
            title: '所属车型',
            sorter: true,
            render(cell: any) {
                if (cell.row?.belongCarModelString !== '-') {
                    return <Tooltip theme="light" showArrow={false} content={cell.row?.belongCarModelString}><Ellipsis>{cell.row?.belongCarModelString}</Ellipsis></Tooltip>
                } else {
                    return '-'
                }
            }
        },
        {
            align: 'left',
            width: 350,
            minWidth: 350,
            colKey: 'loophole',
            title: '漏洞分布',
            sorter: true,
            render(cell: any) {
                return <Loophole loophole={cell.row.loophole} />;
            }
        },
        {
            align: 'left',
            width: 128,
            minWidth: 128,
            className: 'row',
            colKey: 'edit',
            title: '操作',
            fixed: 'right',
            render(cell: any) {
                return <span><a onClick={() => handleEdit(cell.row)}>编辑</a> <a style={{ marginLeft: 10 }} onClick={() => handleDelete(cell.row?.id)}>删除</a></span>
            }
        },
    ]
    function onSelectChange(value: any[]) {
        setSelectedRowKeys(value);
    }

    const batchModal = () => {
        return (
            <Dialog
                visible={dialogVisible}
                header={"关联所属车型版本"}
                onClose={() => {
                    setDialogVisible(false);
                    setRelateionV(null)

                }}
                destroyOnClose
                width={480}
                confirmBtn={<Button theme='primary' loading={batchAccssoryLoading} onClick={() => submitBatchAccssory()}>确认关联</Button>}
            >
                <MyCasCader
                    onChange={(value) => setRelateionV(value)}
                    value={relateionV}
                    visible={true}
                    optList={optList}
                    statusIcon={false}
                    label="所属车型版本"
                    placeholder="请选择"
                    className="kn-dialog-cascader"
                ></MyCasCader>
            </Dialog>
        );
    };

    // 批量关联
    const submitBatchAccssory = () => {
        let ids: any = [...selectedRowKeys];
        ids = ids.map((item: any) => Number(item));
        let request: any = {
            belongCarModelId: Number(relateionV),
            idList: ids,
        };
        console.log('request', request)
        if (!ids.length || !relateionV) {
            setDialogVisible(false);
            setRelateionV(null);
            return;
        }
        autoPartsRelationCarModel(request).then((res: any) => {
            if (res?.code === 0) {
                message.success("关联成功");
                setDialogVisible(false);
                setRelateionV(null);
                makeParams();
            } else {
                message.error("关联失败");
                setDialogVisible(false);
                setRelateionV(null);
            }
        });
        setDialogVisible(false);
    }

    // 批量关联
    const handleRelate = () => {
        setDialogVisible(true)
    }

    const carModelOnChange = (value: any) => {
        const carModel = { retrieveColumn: 'car_model_items.id', retrieveValue: value, retrieveLike: false }
        setCarModel(carModel)
    }
    const systemTOnChange = (value: any) => {
        const t = { retrieveColumn: 'system_items.system_type', retrieveValue: value, retrieveLike: false }
        setSystemT(t)
    }

    // 删除确认
    const handleDeleteConfirm = () => {
        console.log('confirm', isGroupDelete, deleteId);
        let request: any = {
            idList: [],
        };
        if (isGroupDelete) {
            let arr: any = selectedRowKeys.map((item: any) => {
                return Number(item);
            });
            request.idList = arr;
        } else {
            request.idList = deleteId;
        }
        autoPartsDelete(request).then((res: any) => {
            if (res?.code === 0) {
                message.success("删除成功");
                setIsGroupDelete(false);
                makeParams();
            } else {
                message.error("删除失败");
            }
        });
        setDeleteDialog(false);
    }
    // 删除
    const handleDelete = (e: any) => {
        setIsGroupDelete(false);
        setDeleteDialog(true);
        setDeleteId([Number(e)]);

    };
    // 批量删除
    const handleGroupDelete = () => {
        setDeleteDialog(true);
        setIsGroupDelete(true);
    };
    // 删除dialog 关闭
    const deleteDialogClose = () => {
        setDeleteDialog(false);
        setDeleteId([]);
        setIsGroupDelete(false);
    }

    // 编辑
    const handleEdit = (data: any) => {
        setEditData((v: any) => {
            v = {};
            return { ...data }
        })
        setDrawerVisible(true);
        setDrawerShowId(data.id);

    }
    // 根据名称搜索
    const handleNameSearch = (v: any) => {
        console.log(v)
        let arr: any = [];
        if (v) {
            arr = [v]
        } else {
            arr = []
        }
        setSearchValue({
            retrieveColumn: "auto_parts_items.name",
            retrieveLike: true,
            retrieveValue: arr
        });

    }

    // 查询btn click
    const handleSearch = () => {
        makeParams();
    }

    // 保存回调
    const save = () => {
        makeParams();
    };

    // 导入取消
    const uploadClose = () => {

        setUploadDrawerVisible(false);
    }
    // 导入成功回调
    const uploadSave = () => {
        makeParams();
    }
    return (
        <Style>

            <CardMain>
                <CardContentTitle>
                    <div>
                        <Button theme="primary" onClick={() => create()}>新建零部件</Button>
                        <Button theme="default" className="button-margin kn-button-color-w" onClick={() => setUploadDrawerVisible(true)} >
                            导入零部件
                        </Button>
                        <Button theme="default" className="button-margin kn-button-color-w" onClick={() => handleRelate()} >
                            批量关联车型
                        </Button>
                        <Button theme="default" className="button-margin kn-button-color-w" onClick={() => handleGroupDelete()} >
                            批量删除
                        </Button>

                    </div>
                    <Input
                        type="search"
                        placeholder="请输入你需要搜索的零部件"
                        className="input-search"
                        onChange={(value) => handleNameSearch(value)}
                        onEnter={() => fetchData()}
                        suffixIcon={<SearchIcon onClick={() => fetchData()} style={{ cursor: 'pointer' }} />}
                    ></Input>
                </CardContentTitle>
                <TableContent>
                    <div className="select-group">
                        {props.tabV === 'ecu' ? <SelectTitle >系统类型</SelectTitle> : null}
                        {props.tabV === 'ecu' ? <Select
                            value={systemT.retrieveValue}
                            minCollapsedNum={1}
                            onChange={systemTOnChange}
                            placeholder="请选择系统类型"
                            multiple
                            style={{ width: "200px", marginRight: 24, marginBottom: 24 }}
                            options={selectOptionsOne}
                        /> : null}
                        <SelectTitle >所属车型</SelectTitle>
                        <Select
                            value={carModel.retrieveValue}
                            minCollapsedNum={1}
                            onChange={carModelOnChange}
                            placeholder="请选择所属车型"
                            multiple
                            style={{ width: "200px", marginRight: 32, marginBottom: 24 }}
                            options={selectOptionsTwo}
                        />
                        <Button theme='primary' onClick={() => handleSearch()}>查询</Button>
                        <Button theme='default' style={{ marginLeft: 8 }} onClick={() => reseatSelectGroup()}>重置</Button>
                    </div>
                    <Table
                        rowKey="id"
                        data={list}
                        loading={tableLoading}
                        //@ts-ignore
                        columns={getColumns(columns)}
                        multipleSort={true}
                        onSelectChange={onSelectChange}
                        selectedRowKeys={selectedRowKeys}
                        // sort={sort}
                        onSortChange={(sort) => setSort(sort)}
                        disableDataSort={true}
                        pagination={{
                            current,
                            total,
                            pageSize,
                            showJumper: true,

                            onChange(pageInfo) {
                                console.log(pageInfo, 'onChange pageInfo');
                                rehandleChange(pageInfo);
                            },
                        }}
                    />

                </TableContent>
            </CardMain>
            <MyDrawer editData={editData} save={() => save()} title={theText} tabV={props.tabV} optList={optList} visible={drawerVisible} id={drawerShowId} onClose={() => setDrawerVisible(false)}></MyDrawer>;
            <UploadDrawer save={() => uploadSave()} label="导入零部件" title={theText} tabV={props.tabV} optList={optList} visible={uploadDrawerVisible} onClose={() => uploadClose()}></UploadDrawer>
            {batchModal()}
            <Dialog header="确认删除零部件?" onConfirm={() => handleDeleteConfirm()} visible={deleteDialog} onClose={() => deleteDialogClose()}>
            </Dialog>
        </Style>
    );
};
