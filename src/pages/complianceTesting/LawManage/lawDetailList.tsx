import React, { useState, useEffect } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Layout, Card, Table, Bubble, Status } from '@tencent/tea-component';
import "markdown-navbar/dist/navbar.css";
import { useLawDetailQuery, useLawCatalogueDetailQuery } from 'generated/graphql';

const { expandable, autotip } = Table.addons;

const { Content, Body } = Layout;


interface ProjectMatch {
    suiteId: string
}
export const Page: React.FC = () => {
    const teamId = 'team_items;1';
    const history = useHistory();
    const getValue = useGetMessage();
    const pageParam = useRouteMatch<ProjectMatch>().params;
    const [complianceList, setComplianceList] = useState<any[]>([]);
    const lawId = pageParam.suiteId;
    const lawDetailHook = useLawDetailQuery({ variables: { lawId: lawId } });
    // const projectId = 'project_items;24';
    const LawCataLogeDataHook = useLawCatalogueDetailQuery({ variables: { teamId: teamId, lawId: lawId }, fetchPolicy: 'network-only' });

    const [lawDetailData, setLawDetailData] = useState<any>({});
    const [expandedKeys, setExpandedKeys] = useState<string[]>(['lawCatalogueId']);


    const compliancColumns = [
        {
            key: "dutyLawCatalogueName",
            header: getValue('column-require'),
            width: 700,
            render: (value: any) => {
                return <Bubble content={<span style={{ whiteSpace: 'pre-wrap' }}>{value.dutyLawCatalogueName}</span>}>
                    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        <span>{value.dutyLawCatalogueName}</span>
                    </div>
                </Bubble>
            }
        },
        {
            key: "dutyLawClassify1",
            header: getValue('column-categray'),
            render: (value: any) => {
                const wordList = value.dutyLawClassify2.trim().split('-');
                return <Bubble content={wordList.map((value: any, key: any) => {
                    return <p key={key}>{key > 0 ? '-' : ""}{value}</p>
                })}>
                    {<span>{value.dutyLawClassify1}</span>}
                </Bubble>
            }
        }
    ];

    const subTableColumns = [
        {
            key: "caseName",
            header: getValue('column-case'),
            render: (value: any) => {
                return <div>
                    <Bubble content={<span>
                        {value.caseName}
                    </span>}>
                        <span>{value.caseName}</span>
                    </Bubble>
                </div>
            }
        }, {
            key: "caseSerialNumber",
            header: getValue('compliance-caseId')
        }
    ];

    const renderSubTable = (record: any) => {
        return <div>
            <Table columns={subTableColumns} records={record.caseClassifyResultRep}></Table>
        </div>;
    };
    useEffect(() => {
        if (LawCataLogeDataHook.data) {
            setComplianceList(LawCataLogeDataHook.data.lawCatalogueDetail);
            let expandKeyList:any = [];
            for(let item of LawCataLogeDataHook.data.lawCatalogueDetail){
                expandKeyList.push(item?.lawCatalogueId);
            }
            setExpandedKeys(expandKeyList);
        }
    }, [LawCataLogeDataHook.data]);
    useEffect(() => {
        setLawDetailData(lawDetailHook.data?.lawDetail);
    }, [lawDetailHook.data])
    useEffect(() => {
    }, [])
    return <>
        <Body>
            <Content>
                <Content.Header
                    showBackButton onBackButtonClick={history.goBack}
                    title={lawDetailData ? lawDetailData.title : ''}
                ></Content.Header>
                <Content.Body full>
                    <Card>
                        <Table columns={compliancColumns}
                            records={complianceList}
                            recordKey="lawCatalogueId"
                            addons={[
                                // pageable({
                                //     recordCount: 666,
                                //     onPagingChange:(value)=>{
                                //     }
                                // }),
                                expandable({
                                    expandedKeys: expandedKeys,
                                    render(record) {
                                        const subtable = renderSubTable(record);
                                        return subtable
                                    },
                                    onExpandedKeysChange: (keys, { event }) => {
                                        setExpandedKeys(keys)
                                    }
                                }),
                                autotip({
                                    emptyText: <div>
                                        <Status icon={'blank'} title={<Localized id="compliance-nodata"></Localized>}></Status>
                                    </div>,
                                }),
                            ]}></Table>
                    </Card>
                </Content.Body>
            </Content>
        </Body>
    </>
}