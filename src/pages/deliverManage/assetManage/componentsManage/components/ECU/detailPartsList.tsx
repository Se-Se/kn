import React, { useState, useEffect } from "react";
import { Table, TableSort, Button, Input, message, Tooltip } from 'tdesign-react';
import { useHistory, useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { TransferDraw } from '../../../../component/relationDrawer';
import { SearchIcon } from 'tdesign-icons-react';
import style from "@emotion/styled/macro";
import { autoPartsHardwareDetail, autoPartsRelieveRelationHardware, autoPartsHardwareListGroupe, autoPartsRelationHardware } from "../../../../util/componentApi";
import { HardwareDetailReq, RelieveRelationHardwareReq, RelationHardwareReq } from '../type';

type Props = {
    name: string //用来判断详情页面 appDetail systemDetail appDetail
}

const CardContentTitle = style.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  .input-search{
    width:320px;
  }
`;
const Ellipsis = style.div`
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
width:110px;
`
export const PartsList: React.FC<Props> = (props: Props) => {
    const history = useHistory();
    const params: any = useParams();


    const [pageSize, setPageSize] = useState<number>(10);
    const [current, setCurrent] = useState<number>(1);
    const [total, setTotal] = useState(50)
    const [sort, setSort] = useState<TableSort>([]);
    const [tableLoading, setTableLoading] = useState<boolean>(false);

    const [list, setList] = useState<any>([]);
    const [tableValue, setTableValue] = useState<any>('1');
    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<any>({ retrieveColumn: "hardware_items.name", retrieveLike: true, retrieveValue: [] });
    const [optList, setOptList] = useState<any>([]);//系统关联
    const [selectV, setSelectV] = useState<any>([])//已选择的关联 id数组

    // 初次加载页面
    useEffect(() => {
        console.log('props---->', props.name)
    }, []);


    // pageSize current sort 变化查询列表
    useEffect(() => {
        makeParams()
    }, [pageSize, current, sort]);

    // page信息变化
    const rehandleChange = (pageInfo: { current: number, pageSize: number }) => {
        const { current, pageSize } = pageInfo;
        setCurrent(current);
        setPageSize(pageSize);
    }

    // 获取零部件列表
    const makeParams = () => {
        const paramArr = [searchValue].filter((item: any) => item.retrieveValue.length !== 0)
        const request: HardwareDetailReq = {
            autoPartsId: Number(params.componentId),
            retrieve: {
                offset: {
                    currentPage: current,
                    pageSize: pageSize
                },
                retrieveData: paramArr,
                sortData: sort as any
            },
        }
        autoPartsHardwareDetail(request).then((res: any) => {
            console.log('autoPartsHardwareDetail--List---res', res);
            if (res?.code === 0) {
                const { result, count } = res;
                setTotal(count || 0);
                formatterList(result || []);
            } else {
                message.error(res?.msg || "网络异常！");
            }
        });
    }

    // 格式化列表数据
    const formatterList = (data: any) => {
        const newList: any = data.map((item: any, index: number) => {
            item.index = index + 1;
            return item;
        });
        setList((v: any) => {
            v = [];
            return newList || []
        })
    }

    // 排序
    const handleSort = (data: any) => {
        setSort(data)
    }

    // 跳转到详情页
    const jumpToDetail = (id: string) => {
        const w: any = window.open('about:blank');
        w.location.href = `/lingshu/assetsManage/hardwareManage/hardwareDetail/${Number(id)}`;
    }

    // 硬件解除零部件关联
    const relationParts = (id: any) => {
        let request: RelieveRelationHardwareReq = {
            autoPartId: Number(params.componentId),
            hardwareId: Number(id)
        }
        autoPartsRelieveRelationHardware(request).then((res: any) => {
            if (res?.code === 0) {
                message.success('解除成功');
                makeParams();
            } else {
                message.error("解除失败");
            }
        })
    }


    // 根据硬件名称搜索
    const handleNameSearch = (v: any) => {
        let arr: any = [];
        if (v) {
            arr = [v]
        } else {
            arr = []
        }
        setSearchValue({
            retrieveColumn: "hardware_items.name",
            retrieveLike: true,
            retrieveValue: arr
        })

    }
    // 点击搜索
    const fetchData = () => {
        makeParams();
    }
    const handleShowDraw = () => {
        getDrawerList();
    }
    // 获取关联系统drawer list
    const getDrawerList = () => {
        let request: any = {
            autoPartsId: Number(params.componentId),
        }
        autoPartsHardwareListGroupe(request).then((res: any) => {
            if (res?.code === 0) {
                const { result, selectedList } = res;
                if (result?.length) {
                    setOptList(result);
                }
                if (selectedList?.length) {
                    setSelectV(selectedList.map((item: any) => item.value));
                    // setSelectV([56,54,53,50])
                }
                setDrawerVisible(true);
            }
        })
    }

    // 关联回调 
    const TransferDrawSave = (keys: any) => {
        console.log('TransferDrawSave', keys)
        let request: RelationHardwareReq = {
            belongAutoPartIds: [Number(params.componentId)],
            idList: keys
        }
        autoPartsRelationHardware(request).then((res: any) => {
            if (res.code === 0) {
                message.success("关联成功");
                setDrawerVisible(false);
                makeParams();
            } else {
                message.error("关联失败");
                setDrawerVisible(false);
            }
        })
    }
    const columns = [
        {
            align: 'left',
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
            title: '硬件名称',
            sorter: true,
            render(cell: any) {
                return <span><a onClick={() => jumpToDetail(cell.row.id)}>{cell.row.name}</a></span>
            }
        },
        {
            align: 'left',
            width: 150,
            minWidth: 150,
            colKey: 'category',
            title: '硬件类别',
            sorter: true
        },
        {
            align: 'left',
            width: 100,
            minWidth: 100,
            colKey: 'manufacturer',
            title: '厂家',
            sorter: true
        },
        {
            align: 'left',
            width: 150,
            minWidth: 150,
            colKey: 'belongAutoParts',
            title: '所属零部件',
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
            title: '所属车型',
            sorter: true,
            // ellipsis: true,
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
            align: 'left',
            width: 150,
            minWidth: 150,
            className: 'row',
            colKey: 'remark',
            title: '备注',
            render(cell: any) {
                if (cell.row?.remark) {
                    return <Tooltip
                        content={cell.row?.remark}
                        theme="light"
                        showArrow={false}>
                        <Ellipsis>
                            {cell.row?.remark}
                        </Ellipsis>
                    </Tooltip>
                } else {
                    return '-'
                }
            }
        },
        {
            align: 'left',
            width: 104,
            minWidth: 104,
            className: 'row',
            colKey: 'edit',
            title: '操作',
            fixed: 'right',
            render(cell: any) {
                return <span><a style={{ textAlign: 'left' }} onClick={() => relationParts(cell.row.id)}>解除关联</a></span>

            }
        },

    ]

    return (
        <>
            <CardContentTitle>
                <Button style={{ marginBottom: 20 }} onClick={() => handleShowDraw()}>关联硬件资产</Button>
                <Input
                    type="search"
                    placeholder="请输入你需要搜索的硬件信息"
                    className="input-search"
                    onChange={(value) => handleNameSearch(value)}
                    onEnter={() => fetchData()}
                    suffixIcon={<SearchIcon onClick={() => fetchData()} style={{ cursor: 'pointer' }} />}
                ></Input>
            </CardContentTitle>

            <Table
                rowKey="id"
                data={list}
                loading={tableLoading}
                style={{ border: '1px solid #eaeaea' }}
                //@ts-ignore
                columns={columns}
                // sort={sort} //后端接口请求后打开
                multipleSort={true}
                onSortChange={(sort) => handleSort(sort)}
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
            <TransferDraw optList={optList} title={'关联硬件资产'} selectTitle="请选择关联硬件" selectV={selectV} save={(v) => TransferDrawSave(v)} visible={drawerVisible} onClose={() => setDrawerVisible(false)}></TransferDraw>
        </>
    );
};
