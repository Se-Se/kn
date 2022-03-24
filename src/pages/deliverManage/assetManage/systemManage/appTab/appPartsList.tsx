import React, { useState, useEffect } from "react";
import { Table, TableSort, Radio, message, Tooltip } from 'tdesign-react';
import { useHistory, useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { systemBelongAutoParts, systemRelieveRelationAutoPart } from '../../../util/api';
import { Loophole } from '../../../component/loopholeTag';
import style from "@emotion/styled/macro";

type Props = {
    name: string; //用来判断详情页面 appDetail systemDetail appDetail
    editChange: any;
    relieveCallback: () => void;
}
const Style = style.div`
    .t-tabs__header{
        display:none;
    }
`
const RadioContent = style.div`
    margin-bottom: 12px; 
`
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
    const [radioV, setRadioV] = useState<any>('cloud')

    // 初次加载页面
    useEffect(() => {
        console.log('111111111parts-props---->', props);
        makeParams();
    }, [props.editChange]);


    // pageSize current sort,radioV 变化查询列表
    useEffect(() => {
        makeParams()
    }, [pageSize, current, sort, radioV]);

    // page信息变化
    const rehandleChange = (pageInfo: { current: number, pageSize: number }) => {
        const { current, pageSize } = pageInfo;
        setCurrent(current);
        setPageSize(pageSize);
    }

    // 获取零部件列表
    const makeParams = () => {
        const request: any = {
            id: Number(params.systemId),
            autoPartsType: radioV,
            retrieve: {
                offset: {
                    currentPage: current,
                    pageSize: pageSize
                },
                sortData: sort
            }
        }

        systemBelongAutoParts(request).then((res: any) => {
            console.log('systemBelongAutoParts--List---res', res);
            if (res?.code === 0) {
                const { result, count } = res;
                setTotal(count || 0);
                formatterList(result || []);
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

    // 跳转到零部件详情页
    const jumpToDetail = (id: string) => {
        if (radioV === 'ecu') {
            history.push(`/lingshu/assetsManage/componentManage/ECUDetail/${Number(id)}`) //跳转到 ECU\ 零输运\移动端 

        } else if (radioV === 'cloud') {
            history.push(`/lingshu/assetsManage/componentManage/cloudDetail/${Number(id)}`)
        }
    }

    // 解除关联
    const relationParts = (id: any) => {
        let request: any = {
            autoPartId: Number(id),
            systemId: Number(params.systemId)
        }
        systemRelieveRelationAutoPart(request).then((res: any) => {
            if (res?.code === 0) {
                message.success('解除成功');
                props.relieveCallback();
                makeParams();
            } else {
                message.error('解除失败');
            }
        })
    }


    // radio 按钮切换
    const handleRadioChange = (v: any) => {
        setRadioV(v);
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
        <Style>
            <RadioContent>
                <Radio.Group
                    defaultValue="cloud"
                    onChange={(v) => handleRadioChange(v)}
                >
                    <Radio.Button value="cloud">TSP</Radio.Button>
                    <Radio.Button value="mobile">移动端</Radio.Button>
                </Radio.Group>
            </RadioContent>
            <Table
                rowKey="id"
                data={list}
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
        </Style>
    );
};
