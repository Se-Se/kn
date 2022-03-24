import React, { useState, useEffect } from "react";
import { Table, TableSort, Button, message, Tooltip } from 'tdesign-react';
import { useHistory, useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { systemBelongSoftware, systemRelieveRelationSoftWare, systemGetSoftwareGroup } from '../../../util/api';
import { MyDrawer } from './teaTransfer';
import styled from "@emotion/styled/macro";


type Props = {
    name: string //用来判断详情页面 appDetail systemDetail appDetail
    theId?: string
}
const Ellipsis = styled.div`
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
width:110px;
`
export const SoftList: React.FC<Props> = (props: Props) => {
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
    const [relateSoft, setRelateSoft] = useState<any>([]);
    const [selectV, setSelectV] = useState<any>([])

    // 初次加载页面
    useEffect(() => {
        console.log('props---->', props.name);

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
            id: Number(props.theId),
            retrieve: {
                offset: {
                    currentPage: current,
                    pageSize: pageSize
                },
                // sortData: sort
            }


        }

        systemBelongSoftware(request).then((res: any) => {
            console.log('systemBelongSoftware--List---res', res);
            if (res) {
                const { result, count } = res;
                setTotal(count || 0);
                formatterList(result || []);
            }
        });

        console.log(sort, tableValue)
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
    const jumpToDetail = (row: any) => {
        if (row.type === '应用服务') {
            history.push(`/lingshu/assetsManage/softwareManage/appserverDetail/${Number(row?.id)}`);
        } else if (row.type === '第三方模块') {
            history.push(`/lingshu/assetsManage/softwareManage/thirdPartsDetail/${Number(row?.id)}`);
        } else if (row.type === '配置') {
            history.push(`/lingshu/assetsManage/softwareManage/configDetail/${Number(row?.id)}`);
        } else if (row.type === '密钥') {
            history.push(`/lingshu/assetsManage/softwareManage/encryptionkeyDetail/${Number(row?.id)}`);
        } else if (row.type === 'Log文件') {
            history.push(`/lingshu/assetsManage/softwareManage/logsFileDetail/${Number(row?.id)}`);
        } else if (row.type === '证书') {
            history.push(`/lingshu/assetsManage/softwareManage/certificateDetail/${Number(row?.id)}`);
        } else if (row.type === '固件') {
            history.push(`/lingshu/assetsManage/softwareManage/firmDetail/${Number(row?.id)}`);
        }
    }

    //解除关联
    const relationParts = (id: any) => {
        let request: any = {
            softwareId: Number(id),
            systemId: Number(props.theId)
        }
        systemRelieveRelationSoftWare(request).then((res: any) => {
            if (res?.code === 0) {
                message.success('解除成功');
                makeParams();
            } else {
                message.error('解除失败');
            }
        })
    }

    const save = () => {
        message.success('关联成功');
        makeParams();
    }
    const handleShowDraw = () => {
        getSoftwareGroup(props.theId)

    }

    const getSoftwareGroup = (id: any) => {
        let params: any = {
            "retrieve": {
                "retrieveData": [],
            },
            "systemId": Number(id)
        }
        systemGetSoftwareGroup(params).then((res: any) => {
            console.log('systemGetSoftwareGroup', res);
            if (res?.code === 0) {
                const { results, selectedIdList } = res;
                formatterSoftwareGroup(results || []);
                setSelectV(selectedIdList || []);
                setDrawerVisible(true);
            } else {
                message.error('请求失败');
            }
        })
    }

    // 格式化
    const formatterSoftwareGroup = (data: any) => {
        const ops: any = data.map((item: any, index: number) => {
            item.value = "level_1" + index;
            return item;
        });
        setRelateSoft(ops);
    };

    const searchChange = (v: any) => {
        console.log('searchChange', v)
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
            title: '软件名称',
            sorter: true,
            render(cell: any) {
                return <span><a onClick={() => jumpToDetail(cell.row)}>{cell.row.name}</a></span>
            }
        },
        {
            align: 'left',
            width: 150,
            minWidth: 150,
            colKey: 'type',
            title: '属性',
            sorter: true
        },
        {
            align: 'left',
            width: 200,
            minWidth: 200,
            colKey: 'belongSystems',
            title: '所属系统',
            sorter: true,
            render(cell: any) {
                if (cell.row.belongSystems?.length) {
                    return <Tooltip theme="light" showArrow={false} content={cell.row?.belongSystems.map((item: any) => item.systemName).join('/')}>
                        <Ellipsis>{cell.row?.belongSystems.map((item: any) => item.systemName).join('/')}</Ellipsis>
                    </Tooltip>
                }
                return '-'
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
            <Button style={{ marginBottom: 20 }} onClick={() => handleShowDraw()}>关联软件资产</Button>
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
            <MyDrawer save={() => save()} theId={props.theId} searchChange={searchChange} selectV={selectV} optList={relateSoft} visible={drawerVisible} onClose={() => setDrawerVisible(false)}></MyDrawer>
        </>
    );
};
