import React, { useEffect, useState } from 'react';
// import style from '@emotion/styled/macro';
import { Localized, useGetMessage } from 'i18n';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useGetUserCustomCaseListBySuiteIdQuery, Order } from 'generated/graphql';
import { Layout, Card, Table, Button, Status } from '@tencent/tea-component';
import { AddRelModal } from './addRelModal';

const { pageable, autotip, columnsResizable } = Table.addons;

interface ProjectMatch {
    suiteId: string
    suiteName: string
}

export const Page: React.FC = () => {

    const pageParam = useRouteMatch<ProjectMatch>().params;
    const suiteId = pageParam.suiteId;
    const teamId = 'team_items;1';
    const getValue = useGetMessage();
    const history = useHistory();
    const [suiteList, setSuiteList] = useState<any[]>([]);
    const [suiteCount, setSuiteCount] = useState<number>(0)
    const [isBtnEnable, setIsBtnEnable] = useState<boolean>(false)
    const [pageQueryInfo, setPageQueryInfo] = useState<any>({
        offset: {
            offset: 0,
            limit: 10
        },
        search: "",
        searchField: "",
        orderBy: {
            field: "id",
            order: Order.Desc
        }
    });
    const [suiteName, setSuiteName] = useState<string>('')
    const dataHook = useGetUserCustomCaseListBySuiteIdQuery({ variables: { teamId: teamId, search: pageQueryInfo, suiteId: suiteId } });
    const [isShowAddRel, setIsShowAddRel] = useState<boolean>(false);

    const suiteColumns = [
        {
            key: "serialNumber",
            header: getValue('compliance-caseId'),
            width: 150
        },
        {
            key: "name",
            header: getValue('compliance-caseName'),
            width: 150
        }, {
            key: "territoryName",
            header: getValue('compliance-area'),
            width: 100,
        }, {
            key: "classifyName",
            header: getValue('compliance-catagrey'),
            width: 100,
        }, {
            key: "submitUserName",
            header: getValue('column-creator'),
            width: 100,
        }, {
            key: "submitTime",
            header: getValue('column-createTime'),
            width: 100,
        }
    ];

    useEffect(() => {
        if (dataHook.data?.getUserCustomCaseListBySuiteId) {
            setSuiteList(dataHook.data.getUserCustomCaseListBySuiteId.resultList || []);
            setSuiteCount(dataHook.data.getUserCustomCaseListBySuiteId.count || 0);
            setSuiteName(dataHook.data.getUserCustomCaseListBySuiteId.suiteName || '');
            setIsBtnEnable(dataHook.data.getUserCustomCaseListBySuiteId.canModify);
        }
    }, [dataHook.data?.getUserCustomCaseListBySuiteId])
    useEffect(() => {
        dataHook.refetch({ teamId: teamId, search: pageQueryInfo, suiteId: suiteId })
    }, [pageQueryInfo]);
    const { Content, Body } = Layout;
    return <>
        <Body>
            <Content>
                <Content.Header
                    showBackButton onBackButtonClick={history.goBack}
                    title={suiteName}
                ></Content.Header>
                <Content.Body full>
                    {
                        isBtnEnable ?
                            <Button type="primary" onClick={() => {
                                setIsShowAddRel(true);
                            }}>管理用例</Button> : null
                    }
                    <Card>
                        <Table columns={suiteColumns} style={{ marginTop: 20 }}
                            records={suiteList}
                            recordKey="id"
                            addons={[
                                pageable({
                                    recordCount: suiteCount,
                                    onPagingChange: (value) => {
                                        let query = pageQueryInfo;
                                        query.offset.offset = (value.pageIndex as number - 1) * (value.pageSize as number);
                                        query.offset.limit = value.pageSize;
                                        setPageQueryInfo(JSON.parse(JSON.stringify(query)))
                                    }
                                }),
                                columnsResizable({
                                    minWidth: 100,
                                    maxWidth: 1000,
                                    onResizeEnd: columns => {
                                    },
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
        <AddRelModal refreshFn={() => { dataHook.refetch() }} suiteId={suiteId} isShow={isShowAddRel} setIsShowAddDialog={setIsShowAddRel} ></AddRelModal>
    </>
}