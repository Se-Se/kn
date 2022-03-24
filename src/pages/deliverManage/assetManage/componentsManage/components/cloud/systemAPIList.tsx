import React, { useState, useEffect } from "react";
import { Table, TableSort, message, Tooltip } from 'tdesign-react';
import { useHistory, useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { autoPartsRelieveRelationSystem, autoSystemDetail } from "../../../../util/componentApi";
import styled from "@emotion/styled/macro";

const Ellipsis = styled.div`
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
width:110px;
`
type Props = {
    name: string; //用来判断详情页面 appDetail systemDetail appDetail
    saveFlag?: boolean;
    searchValue?: any;
}
export const SystemAPIList: React.FC<Props> = (props: Props) => {
    const history = useHistory();
    const params: any = useParams();
    const [pageSize, setPageSize] = useState<number>(10);
    const [current, setCurrent] = useState<number>(1);
    const [total, setTotal] = useState(50)
    const [sort, setSort] = useState<TableSort>([]);
    const [tableLoading] = useState<boolean>(false);
    const [list, setList] = useState<any>([]);


    // 初次加载页面
    useEffect(() => {
        console.log('props---->', props.name)
    }, []);


    // pageSize current sort 变化查询列表
    useEffect(() => {
        makeParams()
    }, [pageSize, current, sort, props.saveFlag]);

    // page信息变化
    const rehandleChange = (pageInfo: { current: number, pageSize: number }) => {
        const { current, pageSize } = pageInfo;
        setCurrent(current);
        setPageSize(pageSize);
    }

    // 获取零部件列表
    const makeParams = () => {
        const paramArr = [props.searchValue].filter((item: any) => item.retrieveValue.length !== 0)
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
            systemType: 2
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

    // 跳转到软件详情页
    const jumpToDetail = (id: string) => {
        const w: any = window.open('about:blank');
        w.location.href = `/lingshu/assetsManage/systemManage/apiDetail/${Number(id)}`;
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
    const columns = [
        {
            align: 'left',
            width: 100,
            minWidth: 100,
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
            title: '接口名',
            sorter: true,
            render(cell: any) {
                return <span><a onClick={() => jumpToDetail(cell.row.id)}>{cell.row.name}</a></span>
            }
        },
        {
            align: 'left',
            width: 150,
            minWidth: 150,
            colKey: 'apiFunction',
            title: '功能',
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
            <Table
                rowKey="id"
                data={list}
                loading={tableLoading}
                style={{ border: '1px solid #eaeaea' }}
                //@ts-ignore
                columns={columns}
                multipleSort={true}
                // sort={sort}
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

        </>
    );
};
