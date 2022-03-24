import React, { useState, useEffect } from "react";
import { Table, TableSort, message, Tooltip } from 'tdesign-react';
import { useHistory } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { autoPartsHardwareDetail } from "../../../../util/componentApi";
import { HardwareDetailReq } from '../../../componentsManage/components/type';
import styled from "@emotion/styled/macro";

type Props = {
    theId: any;
}
const Ellipsis = styled.div`
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
width:110px;
`

export const PartsList: React.FC<Props> = (props: Props) => {
    const history = useHistory();
    const [pageSize, setPageSize] = useState<number>(10);
    const [current, setCurrent] = useState<number>(1);
    const [total, setTotal] = useState(50)
    const [sort, setSort] = useState<TableSort>([]);
    const [tableLoading] = useState<boolean>(false);
    const [list, setList] = useState<any>([]);


    // 初次加载页面
    useEffect(() => {
        console.log('props---->', props)
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
        const request: HardwareDetailReq = {
            autoPartsId: props.theId,
            retrieve: {
                offset: {
                    currentPage: current,
                    pageSize: pageSize
                },
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
        history.push(`/lingshu/assetsManage/hardwareManage/hardwareDetail/${Number(id)}`)
    }

    // 详情
    const openDetail = (id: string) => {
        const w: any = window.open('about:blank');
        w.location.href = `/lingshu/assetsManage/hardwareManage/hardwareDetail/${Number(id)}`;
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
                return <span><a onClick={() => openDetail(cell.row.id)}>{cell.row.name}</a></span>
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
                return <span><a style={{ marginLeft: 10, textAlign: 'left' }} onClick={() => openDetail(cell.row.id)}>详情</a></span>

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
