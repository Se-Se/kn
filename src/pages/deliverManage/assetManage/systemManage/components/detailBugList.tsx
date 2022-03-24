import React, { useState, useEffect } from "react";
import { Table, TableSort } from 'tdesign-react';
import { useHistory, useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
// import { hardwaregetDetail, hardwaregetAutoParts, hardwaregetRelationParts } from '../../util/api';

type Props={
    name:string //用来判断详情页面 appDetail systemDetail appDetail
}
export const BugList: React.FC<Props> = (props:Props) => {
    const history = useHistory();
    const params: any = useParams();
    const [pageSize, setPageSize] = useState<number>(10);
    const [current, setCurrent] = useState<number>(1);
    const [total, setTotal] = useState(50)
    const [sort, setSort] = useState<TableSort>([]);
    const [tableLoading, setTableLoading] = useState<boolean>(false);

    const [list, setList] = useState<any>([]);
    const [tableValue, setTableValue] = useState<any>('1')

    // 初次加载页面
    useEffect(() => {
        console.log('props---->',props.name)
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
        const request: any = {
            id: Number(params.hardwareId),
            offset: {
                currentPage: current,
                pageSize: pageSize
            },
            sortData: sort
        }
        // hardwaregetAutoParts(request).then((res: any) => {
        //   console.log('hardwaregetAutoParts--List---res', res);
        //   const { result, count } = res;
        //   setTotal(count || 0);
        //   formatterList(result||[]);
        // });

        console.log(sort, tableValue)
        // 测试数据
        let arr: any = [];
        for (let i = 1; i < 15; i++) {
            let obj: any = {
                belongCarModelName: "车型1",
                id: 0 + i,
                loophole: {
                    highRisk: 0,
                    lowRisk: 2,
                    warning: 3
                },
                name: "零部件名称1" + i,
                systemName: "系统版本11",
                version: "1.1"
            };
            arr.push(obj);
        };
        setTotal(0);
        formatterList(arr || []);
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

    // 跳转到零部件详情页
    const jumpToDetail = (id: string) => {
        history.push(`/lingshu/assetsManage/hardwareManage/hardwareDetail/${id}`)
    }

    // 硬件解除零部件关联
    const relationParts = (id: any) => {
        let request: any = {
            autoPartId: Number(id),
            hardwareId: Number(params.hardwareId)
        }
        // hardwaregetRelationParts(request).then(() => {
        //   makeParams();
        // })
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
            width: 200,
            minWidth: 200,
            colKey: 'id',
            title: '系统版本',
            sorter: true
        },
        {
            align: 'left',
            width: 150,
            minWidth: 150,
            colKey: 'belongCarModelName',
            title: '所属车型',
            sorter: true
        },
        {
            align: 'left',
            width: 300,
            minWidth: 300,
            colKey: 'loophole',
            title: '漏洞分布',
            sorter: true,
            render(cell: any) {
                return <span>
                    <span style={{ color: 'white', backgroundColor: '#e54545', padding: '3px 25px 3px 3px', fontWeight: "bold" }}>高危{' ' + cell.row.loophole?.highRisk}</span>
                    <span style={{ color: 'white', backgroundColor: '#ff9d00', padding: '3px 25px 3px 3px', fontWeight: "bold" }}>警告{' ' + cell.row.loophole?.warning}</span>
                    <span style={{ color: 'white', backgroundColor: '#bbbbbb', padding: '3px 25px 3px 3px', fontWeight: "bold" }}>低危{' ' + cell.row.loophole?.lowRisk}</span>
                </span>
            }
        },
        {
            align: 'left',
            width: 200,
            minWidth: 200,
            className: 'row',
            colKey: 'edit',
            title: '操作',
            fixed: 'right',
            render(cell: any) {
                // return <span><a style={{ marginLeft: 10 }} onClick={() => relationParts(cell.row.id)}>解除关联</a></span>
                return <div><a >编辑</a> <a style={{ marginLeft: 10 }} >解除关联</a></div>
            }
        },

    ]

    return (
        <>
            <Table
                rowKey="id"
                data={[]}
                loading={tableLoading}
                style={{ border: '1px solid #eaeaea' }}
                //@ts-ignore
                columns={columns}
                sort={sort}
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
