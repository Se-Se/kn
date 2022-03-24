import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Localized, useGetMessage } from 'i18n';
import style from '@emotion/styled/macro';
import { Modal, Table, Layout, Status, H3, List, Card } from '@tencent/tea-component';
// import { useReportViewActionQuery } from 'generated/graphql';
import { Loading } from './loading';
const MarkdownRender = React.lazy(() => import('./markDownRender'));
const { expandable, autotip } = Table.addons;

const AppTitle = style.div`
    padding: 10px;
`
const MdArea = style.div`
    background: white;
`
const MdRow = style.div`
    display: flex
`
const MdATitle = style.div`
    padding: 10px;
    width: 150px;
`
const MdAContent = style.div`
    padding: 10px;
    width: 100%;
    min-width: 50px;
`
const MdRender = style.div`
    display: block;
    overflow-x: auto;
    padding: 0.5em;
    background: rgb(240, 240, 240);
    color: rgb(68, 68, 68);
`

type ReportModel = {
    reportData: any
    toolType: string
}
const { Body, Content } = Layout;
export const ReportModal: React.FC<ReportModel> = (props) => {
    const getValue = useGetMessage();
    // const [expandedKeys, setExpandedKeys] = useState<any>([])
    const compliancColumns = [
        {
            key: "ruleName",
            header: getValue('column-ruleName')
        },
        {
            key: "riskLevel",
            header: getValue('column-riskLevel')
        }, {
            key: "catalog",
            header: getValue('column-catalog')
        }
    ];
    const RenderRiskContentApkPecker = (riskContent: any) => {
        if (riskContent) {
            let contentObj = JSON.parse(riskContent);
            let jsonObj = JSON.parse(contentObj.Json);
            return <div style={{ border: '1px solid #e7eaef' }}>
                {
                    jsonObj.map((value: any, key: any) => {
                        return <MdArea key={key}>
                            <List split="divide">
                                <List.Item style={{ borderBottom: '1px solid #e7eaef' }}>
                                    <MdRow style={{ alignItems: 'center' }}>
                                        <MdATitle>漏洞方法</MdATitle>
                                        <MdAContent>
                                            <React.Suspense fallback={<Loading></Loading>}>
                                                <MdRender >{value.caller}</MdRender>
                                            </React.Suspense>
                                        </MdAContent>
                                    </MdRow>
                                    <MdRow style={{ alignItems: 'center' }}>
                                        <MdATitle>漏洞触发点</MdATitle>
                                        <MdAContent>
                                            <React.Suspense fallback={<Loading></Loading>}>
                                                <MdRender >{value.callSite}</MdRender>
                                            </React.Suspense>
                                        </MdAContent>
                                    </MdRow>
                                </List.Item>
                            </List>
                        </MdArea>
                    })
                }
            </div>
        }
        else {
            return <></>
        }
    }
    const RenderRiskContentSySAuditor = (riskContent: any) => {
        if (riskContent) {
            let contentObj = JSON.parse(riskContent);
            return <div>
                <Table columns={contentObj?.column || []} records={contentObj?.nodes || []}></Table>
            </div>
        }
        else {
            return <></>
        }
    }
    const renderSubTable = (record: any) => {
        return <div>
            <MdArea>
                <List split="divide">
                    <List.Item>
                        <MdRow>
                            <MdATitle style={{ paddingTop: 35 }}><Localized id="column-ruleDescription"></Localized></MdATitle>
                            <MdAContent>
                                <React.Suspense fallback={<Loading></Loading>}>
                                    <MarkdownRender value={record.description}></MarkdownRender>
                                </React.Suspense>
                            </MdAContent>
                        </MdRow>
                    </List.Item>
                    <List.Item>
                        <MdRow>
                            <MdATitle style={{ paddingTop: 35 }}><Localized id="column-riskContent"></Localized></MdATitle>
                            <MdAContent>
                                <React.Suspense fallback={<Loading></Loading>}>
                                    {/* <MarkdownRender value={record.riskContent}></MarkdownRender> */}
                                    {
                                        props.toolType === 'ApkPecker' ? RenderRiskContentApkPecker(record.riskContent) :
                                            RenderRiskContentSySAuditor(record.riskContent)
                                    }
                                </React.Suspense>
                            </MdAContent>
                        </MdRow>
                    </List.Item>
                    <List.Item>
                        <MdRow>
                            <MdATitle style={{ paddingTop: 35 }}><Localized id="column-riskReason"></Localized></MdATitle>
                            <MdAContent>
                                <React.Suspense fallback={<Loading></Loading>}>
                                    <MarkdownRender value={record.riskReason}></MarkdownRender>
                                </React.Suspense>
                            </MdAContent>
                        </MdRow>
                    </List.Item>
                    <List.Item>
                        <MdRow>
                            <MdATitle style={{ paddingTop: 35 }}><Localized id="column-remediation"></Localized></MdATitle>
                            <MdAContent>
                                <React.Suspense fallback={<Loading></Loading>}>
                                    <MarkdownRender value={record.remediation}></MarkdownRender>
                                </React.Suspense>
                            </MdAContent>
                        </MdRow>
                    </List.Item>
                </List>
            </MdArea>
        </div>;
    };
    // const [reportData, setReportData] = useState<any>();
    const [AppExpandList, setAppExpandList] = useState<any>({});



    useEffect(() => {

        // console.log(props.reportData[0].sysAuditorReportList[0].riskContent);
        // reportHook.refetch();

        if (props.reportData) {
            let item: any = {};
            for (let sub of props.reportData) {
                item[sub.appName] = [];

                for (let _sub of sub.sysAuditorReportList) {
                    item[sub.appName].push(_sub.analysisResultId);
                }
            }
            console.log(item);
            setAppExpandList(item);
        }
    }, [])

    const RenderAppCard = () => {
        if (props.reportData) {
            return <div>
                {
                    props.reportData.map((value: any, key: any) => {
                        return <div key={key}>
                            <AppTitle>
                                <H3>{value.appName}</H3>
                            </AppTitle>
                            <Card>
                                <Card.Body>
                                    <Table columns={compliancColumns}
                                        records={value.sysAuditorReportList}
                                        recordKey="analysisResultId"
                                        addons={[
                                            // pageable({
                                            //     recordCount: 666,
                                            //     onPagingChange:(value)=>{
                                            //     }
                                            // }),
                                            expandable({
                                                expandedKeys: AppExpandList[value.appName],
                                                render(record) {
                                                    const subtable = renderSubTable(record);
                                                    return subtable
                                                    // return <div>dom</div>
                                                },
                                                onExpandedKeysChange: (keys, { event }) => {
                                                    console.log(value);
                                                    // setExpandedKeys(keys)
                                                    let obj = JSON.parse(JSON.stringify(AppExpandList));

                                                    obj[value.appName] = keys;
                                                    setAppExpandList(obj);
                                                    console.log(obj);
                                                }
                                            }),
                                            autotip({
                                                emptyText: <div>
                                                    <Status icon={'blank'} title={<Localized id="compliance-nodata"></Localized>}></Status>
                                                </div>,
                                            }),
                                        ]}></Table>
                                </Card.Body>
                            </Card>
                        </div>
                    })
                }
            </div>
        }
    }
    return <>
        <Layout>
            <Body>
                <Content>
                    <Content.Body>
                        {RenderAppCard()}
                    </Content.Body>
                </Content>
            </Body>
        </Layout>
    </>
}