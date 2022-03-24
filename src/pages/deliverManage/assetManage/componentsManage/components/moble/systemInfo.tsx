import React, { useState, useEffect } from "react";
import { Table, TableSort, Button, Input, message, Tooltip } from 'tdesign-react';
import { useHistory, useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { autoPartsSystemListGroup, autoSystemDetail, autoPartsRelationSystem, autoPartsRelieveRelationSystem } from "../../../../util/componentApi";
import { TreeTransferDrawer } from '../../../../component/treeTransfer';
import { ProgressTag } from "../../../../component/progressTag";
import style from "@emotion/styled/macro";
import { SearchIcon } from 'tdesign-icons-react';
import { SystemListGroupReq } from '../type';

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
export const SystemAppList: React.FC<Props> = (props: Props) => {
    const history = useHistory();
    const params: any = useParams();
    const [pageSize, setPageSize] = useState<number>(10);
    const [current, setCurrent] = useState<number>(1);
    const [total, setTotal] = useState(50)
    const [sort, setSort] = useState<TableSort>([]);
    const [tableLoading] = useState<boolean>(false);
    const [list, setList] = useState<any>([]);
    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
    const [optList, setOptList] = useState<any>([]);//系统关联
    const [theId, setTheId] = useState<any>('');
    const [searchValue, setSearchValue] = useState<any>({
        retrieveColumn: "system_items.name",
        retrieveLike: true,
        retrieveValue: [],
    });
    const [selectV, setSelectV] = useState<any>([]);

    // 初次加载页面
    useEffect(() => {
        console.log('props---->', props.name);
        setTheId(Number(params.componentId))
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
        const paramArr = [searchValue].filter((item: any) => item.retrieveValue.length !== 0);
        const request: any = {
            autoPartsId: Number(params.componentId),
            retrieve: {
                offset: {
                    currentPage: current,
                    pageSize: pageSize
                },
                sortData: sort,
                retrieveData: paramArr,
            },
            systemType: 3
        }
        autoSystemDetail(request).then((res: any) => {
            if (res?.code === 0) {
                const { Result, Count } = res;
                setTotal(Count || 0);
                formatterList(Result || []);
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

    // 根据名称搜索
    const handleNameSearch = (v: any) => {
        let arr: any = [];
        if (v) {
            arr = [v];
        } else {
            arr = [];
        }
        setSearchValue({
            retrieveColumn: "system_items.name", //之后查看修改
            retrieveLike: true,
            retrieveValue: arr,
        });
    };
    // 点击搜索
    const fetchData = () => {
        makeParams();

    }
    // 跳转到情页
    const jumpToDetail = (id: string) => {
        const w: any = window.open('about:blank');
        w.location.href = `/lingshu/assetsManage/systemManage/appDetail/${Number(id)}`;
    }

    // 解除关联
    const relationParts = (id: any) => {
        let request: any = {
            autoPartId: Number(params.componentId),
            systemId: Number(id)
        }
        autoPartsRelieveRelationSystem(request).then((res: any) => {
            if (res?.code === 0) {
                message.success('解除成功');
                makeParams();
            } else {
                message.error("解除失败");
            }
        })
    }
    // 获取关联系统drawer list
    const getDrawerList = () => {
        let request: SystemListGroupReq = {
            autoPartsType: 'mobile',
            autoPartsId: Number(params.componentId)
        }
        autoPartsSystemListGroup(request).then((res: any) => {
            if (res?.code === 0) {
                const { AppList, SelectedIdList } = res;
                let arr: any = [{
                    value: 'level_0',
                    label: 'APP',
                    children: AppList || []
                }]
                setOptList(arr);
                setSelectV(SelectedIdList || []);
                setDrawerVisible(true);
            }
        })
    }

    // 关联回调 
    const save = (keys: any) => {
        console.log('save');
        let params: any = {
            systemIds: keys,
            autoPartIds: [theId]
        }
        autoPartsRelationSystem(params).then((res: any) => {
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
    const handleShowDraw = () => {
        getDrawerList();
    }

    const columns = [
        {
            align: 'left',
            width: 100,
            minWidth: 100,
            colKey: 'index',
            title: '序号',
            sorter: true
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
            title: '名称',
            sorter: true,
            render(cell: any) {
                return <span><a onClick={() => jumpToDetail(cell.row.id)}>{cell.row.name}</a></span>
            }
        },
        {
            align: 'left',
            width: 150,
            minWidth: 150,
            colKey: 'appPath',
            title: '路径',
            sorter: true
        },
        {
            align: 'left',
            width: 200,
            minWidth: 200,
            colKey: 'appFunction',
            title: '功能',
            sorter: true
        },
        {
            align: 'left',
            width: 150,
            minWidth: 150,
            colKey: 'systemUploadProgress',
            title: '文件状态',
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
            width: 104,
            minWidth: 104,
            className: 'row',
            colKey: 'edit',
            title: '操作',
            fixed: 'right',
            render(cell: any) {
                return <span><a onClick={() => relationParts(cell.row.id)}>解除关联</a></span>

            }
        },
    ]

    return (
        <>

            <CardContentTitle>
                <Button style={{ marginBottom: 20 }} onClick={() => handleShowDraw()}>关联系统</Button>
                <Input
                    type="search"
                    placeholder="请输入你需要搜索的系统信息"
                    className="input-search"
                    onChange={(value) => handleNameSearch(value)}
                    onEnter={() => fetchData()}
                    suffixIcon={<SearchIcon style={{ cursor: 'pointer' }} onClick={() => fetchData()} />}
                ></Input>
            </CardContentTitle>


            <Table
                rowKey="id"
                data={list}
                loading={tableLoading}
                style={{ border: '1px solid #eaeaea' }}
                //@ts-ignore
                columns={columns}
                multipleSort={true}
                sort={sort}
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
            <TreeTransferDrawer selectV={selectV} optList={optList} title={'关联系统'} selectTitle="请选择关联系统" save={(v) => save(v)} visible={drawerVisible} onClose={() => setDrawerVisible(false)}></TreeTransferDrawer>
        </>
    );
};
