import React, { useEffect, useState, useMemo } from 'react';
import { Layout, SearchBox, Row, Col, Button, Tabs, TabPanel, Card, Table, Icon, Bubble, Status, H2, H1, notification, Modal } from '@tencent/tea-component';
import { Localized, useGetMessage } from 'i18n';
import { useHistory, Link, useRouteMatch } from 'react-router-dom';
import style from '@emotion/styled/macro';
import { generateLink, Pattern, ParamType } from 'route';
import { ProjectHistoryModal } from './projectHistoryModal';
import { CaseHistoryModal } from './caseHistoryModal';
import { CurrentStepper } from './currentStepper';
import { ReadyStepper } from './readyStepper';
import { useResetProjectMutation, useCheckProjectReportStatusQuery, useStopProjectMutation, useStartProjectDetectionMutation, useProjectDetailsQuery, useLawCatalogueCheckDetailQuery, useGetProjectAutoTaskProgressQuery, useCaseResultListQuery, Order } from 'generated/graphql';
import { SelectAppModal } from './selectAppModal';
import { DownLoadModal } from './downLoadModal';
import { EditProjectModal } from './editProjectModal';
import { useToken } from 'components/TokenService'

const { expandable, autotip, columnsResizable, pageable, sortable } = Table.addons;

const { Content, Body } = Layout;
const DetailListDom = style.div`
    display: flex;
    margin-top: 10px;
`;
const DetailListDomTitle = style.div`
    width:80px;
    color:#888;
`;
const LargeFont = style.span`
    font-family: PingFangSC-Regular;
    font-weight: 400;
    line-height: 36px;
    font-size: 36px;
    margin-right: 5px;
`;
interface ProjectMatch {
    projectId: string
}


export const Page: React.FC = () => {
    const history = useHistory();
    const workFlowLink = (params: ParamType[Pattern.ComplianceTestingStudio]) => generateLink(Pattern.ComplianceTestingStudio, params);

    const pageParam = useRouteMatch<ProjectMatch>().params;
    const projectId = pageParam.projectId;
    const teamId = 'team_items;1';
    const [projectDetail, setProjectDetail] = useState<any>({});
    const [complianceList, setComplianceList] = useState<any[]>([]);
    const [status, setStatus] = useState<number>(0);
    const [expandedKeys, setExpandedKeys] = useState<string[]>(['lawCatalogueId'])
    const [statusTimer, setStatusTimer] = useState<any>();
    const [, setShowSuccessIcon] = useState<boolean>(false);
    const [complianceDetail, setComplianceDetail] = useState<any>({});
    const token = useToken();

    const [testList, setTestList] = useState<any[]>([]);
    const [testListCount, setTestListCount] = useState<number>(0);

    const [taskStatus, setTaskStatus] = useState<number>();
    const getValue = useGetMessage();
    const projectDetailHook = useProjectDetailsQuery({ variables: { teamId: teamId, projectId: projectId }, fetchPolicy: 'network-only' })
    const LawCataLogeDataHook = useLawCatalogueCheckDetailQuery({ variables: { teamId: teamId, projectId: projectId }, fetchPolicy: 'network-only' });
    const stepHook = useGetProjectAutoTaskProgressQuery({ variables: { teamId: teamId, projectId: projectId }, fetchPolicy: 'network-only' });

    const [searchParam, setSearchParam] = useState<any>({ search: "", offset: { offset: 0, limit: 100 }, orderBy: { field: 'case_id', order: Order.Asc } });

    const testListHook = useCaseResultListQuery({ variables: { teamId: teamId, projectId: projectId, search: {} }, fetchPolicy: 'network-only' });
    const downLoadStatusHook = useCheckProjectReportStatusQuery({ variables: { projectId: projectId } })
    // const [isEnableDownLoad, setIsEnableDownLoad] = useState<boolean>();

    const [showSreachBox, setShowSreachBox] = useState<boolean>(true);
    const [showSelectAppModal, setShowSelectAppModal] = useState<boolean>(false);
    // const [showDownLoadModal, setShowDownLoadModal] = useState<boolean>(false);
    const [selectCaseId, setSelectCaseId] = useState<string>('');

    const [showEditModal, setShowEditMoadl] = useState<boolean>(false);

    const [sorts, setSorts] = useState<any>([]);

    const [startTestFunc] = useStartProjectDetectionMutation();
    const [stopProject] = useStopProjectMutation();
    const [resetProject] = useResetProjectMutation();

    const [pageSize, setPageSize] = useState<any>(100);

    const tableTabs = [
        { id: "test", label: <Localized id="compliance-testDimension"></Localized> },
        { id: "compliance", label: <Localized id="compliance-compDimension"></Localized> }
    ];
    const testColumns: any = [{
        key: "serialNumber",
        header: getValue('compliance-caseId'),
        width: 100
    },
    {
        key: "caseName",
        header: '用例名',
        width: 250,
        render: (value: any) => {
            return <Bubble content={<span>{value.caseName}</span>}>
                <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    <span>{value.caseName}</span>
                </div>
            </Bubble>
        }
    }, {
        key: "territoryName",
        header: '领域',
        width: 100
    }, {
        key: "classifyName",
        header: '分类',
        width: 150
    }, {
        key: "operatingSystemName",
        header: '操作系统',
        width: 100
    }, {
        key: "riskLevelName",
        header: '风险程度',
        width: 100
    },
    // {
    //     key: "catalogue",
    //     header: getValue('column-belongLaw'),
    //     width: 200,
    //     render: (value: any) => {
    //         return <Bubble content={<span style={{ whiteSpace: 'pre-wrap' }}>{value.catalogue}</span>}>
    //             <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
    //                 <span>{value.catalogue}</span>
    //             </div>
    //         </Bubble>
    //     }
    // }, 
    {
        key: "testMethodName",
        header: '测试类型',
        width: 100
    },
    {
        key: "status",
        header: getValue('column-esStatus'),
        width: 100,
        render: (value: any) => {
            switch (value.status) {
                case 1: return <span style={{ color: '#29cc85' }}><Localized id="compliance-checkPass"></Localized></span>;
                case 2: return <span style={{ color: '#ff584c' }}><Localized id="compliance-checkUnPass"></Localized></span>;
                case 3: return <span style={{ color: '#888' }}><Localized id="compliance-unCheck"></Localized></span>;
                case 4: return <span style={{ color: '#006EFF' }}><Localized id="compliance-igore"></Localized></span>;
                case 5: return <span style={{ color: '#f28f2c' }}><Localized id="studio-myProject-checking"></Localized></span>;
            }
        }
    }, {
        key: "handlerUser",
        header: getValue('column-dealUser'),
        width: 100,
    }, {
        key: "operation",
        width: 150,
        header: getValue('column-operation'),
        fixed: 'right',
        render: (value: any) => {
            const pathparams = {
                caseId: value?.caseId,
                projectId: projectId
            }
            return <>
                {
                    value.testMethodId === 24 || status === 6 ?
                        <Link target="_blank" to={generateLink(Pattern.ComplianceTestingCaseTaskFlow, pathparams)}>
                            测试执行
                        </Link> :
                        <span style={{ color: '#ccc', cursor: 'default' }}>
                            测试执行
                        </span>
                }
                <Button type='link' style={{ marginLeft: 10 }}
                    onClick={() => { showCaseHistroyClick(value.caseId) }} >
                    <Localized id='compliance-modifyHistory'></Localized>
                </Button>
            </>
        }
    }
    ];
    const compliancColumns = [
        {
            key: "dutyLawCatalogueName",
            header: '技术要求',
            render: (value: any) => {
                return <Bubble content={<span style={{ whiteSpace: 'pre-wrap' }}>{value.dutyLawCatalogueName}</span>}>
                    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        <span>{value.dutyLawCatalogueName}</span>
                    </div>
                </Bubble>
            }
        }, {
            key: "lawName",
            header: '法规名称',
            render: (value: any) => {
                return <Bubble content={<span style={{ whiteSpace: 'pre-wrap' }}>{value.dutyLawCatalogueName}</span>}>
                    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        <span>{value.lawName}</span>
                    </div>
                </Bubble>
            }
        }, {
            key: "dutyLawClassify1",
            header: '所属分类',
            width: 200,
            render: (value: any) => {
                const wordList = value.dutyLawClassify2.trim().split('-');
                return <Bubble content={wordList.map((value: any, key: any) => {
                    return <p key={key}>{key > 0 ? '-' : ""}{value}</p>
                })}>
                    {<span>{value.dutyLawClassify1}</span>}
                </Bubble>
            }
        }, {
            key: "checkResult",
            header: getValue('column-checkResult'),
            width: 150,
            render: (value: any) => {
                const word = '（' + value.checkPassResultCount + '/' + value.checkResultCount + '）';
                switch (value.passStatus) {
                    case 4: return <span style={{ color: '#006EFF' }}><Localized id="compliance-igore"></Localized></span>;
                    case 3: return <span style={{ color: '#888' }}><Localized id="compliance-unCheck"></Localized>{word}</span>;
                    case 2: return <span style={{ color: '#E54545' }}><Localized id="compliance-checkUnPass"></Localized>{word}</span>;
                    case 1: return <span style={{ color: '#0ABF5B' }}><Localized id="compliance-checkPass"></Localized>{word}</span>;
                }
            }
        }
    ];

    const subTableColumns = [
        {
            key: "caseSerialNumber",
            header: getValue('compliance-caseId'),
            width: 120
        }, {
            key: "caseName",
            header: getValue('column-case'),
            render: (value: any) => {
                const pathparams = {
                    caseId: value?.caseId,
                    projectId: projectId,
                    lawCatalogueId: value.lawCatalogueId
                }
                return <div>
                    <Bubble content={<span>
                        {value.caseName}
                    </span>}>
                        <Link target='_blank' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}
                            to={generateLink(Pattern.ComplianceTestingCaseTaskFlow, pathparams)}>{value.caseName}</Link>
                    </Bubble>
                </div>
            }
        }, {
            key: "taskStatus",
            header: getValue('column-taskStatus'),
            width: 80,
            render: (value: any) => {
                switch (value.taskStatus) {
                    case 5: return <span style={{ color: '#EC9405' }}><Localized id="studio-myProject-checking"></Localized></span>;
                    case 4: return <span style={{ color: '#006EFF' }}><Localized id="compliance-igore"></Localized></span>;
                    case 3: return <span style={{ color: '#888' }}><Localized id="compliance-unCheck"></Localized></span>;
                    case 2: return <span style={{ color: '#E54545' }}><Localized id="compliance-checkUnPass"></Localized></span>;
                    case 1: return <span style={{ color: '#0ABF5B' }}><Localized id="compliance-checkPass"></Localized></span>;
                    // case 0: return <span style={{ color: '#ff584c' }}><Localized id="compliance-checkUnPass"></Localized></span>;
                }
            }
        }, {
            key: "hanlder",
            header: getValue('column-dealUser'),
            width: 100
        }, {
            key: "operation",
            header: getValue('column-operation'),
            width: 180,
            render: (value: any) => {
                // console.log(value);
                const pathparams = {
                    caseId: value?.caseId,
                    projectId: projectId,
                    lawCatalogueId: value.lawCatalogueId
                    // ComplianceTestingCaseTaskFlow:
                }
                return <>
                    <Link target='_blank' to={generateLink(Pattern.ComplianceTestingCaseTaskFlow, pathparams)}><Localized id='compliance-enterCase'></Localized></Link>
                    <Button type='link' style={{ marginLeft: 10 }} onClick={() => { showCaseHistroyClick(value.id) }}>
                        <Localized id='compliance-modifyHistory'></Localized>
                    </Button>
                </>
            }
        }
    ];
    const renderSubTable = (record: any) => {
        return <div>
            <Table columns={subTableColumns} records={record.caseClassifyResultRep}></Table>
        </div>;
    };
    const [steps, setSteps] = useState<any[]>([]);
    const [showProjectHistory, setShowProjectHistory] = useState<boolean>(false);

    const [showCaseHistory, setShowCaseHisory] = useState<boolean>(false);

    useEffect(() => {
        testListHook.refetch({ teamId: teamId, projectId: projectId, search: searchParam });
    }, [searchParam])
    useEffect(() => {
        if (projectDetailHook.data) {
            setProjectDetail(projectDetailHook.data.projectDetails);
            setComplianceDetail(projectDetailHook.data.complianceResult);
            setTaskStatus(projectDetailHook.data.projectDetails?.projectResult?.taskStatus);

            if (projectDetailHook.data.projectDetails?.projectResult?.messages) {
                let stepList = [];
                for (let i = 0; i < projectDetailHook.data.projectDetails?.projectResult?.messages?.length; i++) {
                    const item = {
                        id: (i + 1).toString(),
                        label: projectDetailHook.data.projectDetails.projectResult.messages[i]
                    }
                    if (item.id === '1') {
                        item.id = '-1';
                    }
                    stepList.push(item);
                }
                setSteps(stepList);
            }
        }
    }, [projectDetailHook.data]);
    useEffect(() => {
        if (LawCataLogeDataHook.data) {
            setComplianceList(LawCataLogeDataHook.data.lawCatalogueCheckDetail);
        }
    }, [LawCataLogeDataHook.data]);
    useEffect(() => {
        if (stepHook.data && stepHook.data?.getProjectAutoTaskProgress?.maxIndex === stepHook.data?.getProjectAutoTaskProgress?.index) {
            window.clearInterval(statusTimer);
            setShowSuccessIcon(true);
            testListHook.refetch({ teamId: teamId, projectId: projectId, search: searchParam });
            projectDetailHook.refetch();
        }
        if (stepHook.data && stepHook.data?.getProjectAutoTaskProgress?.index === 3) {
            setShowSelectAppModal(true);
        }
        setStatus(stepHook.data?.getProjectAutoTaskProgress?.index || 0);
    }, [stepHook.data]);

    useEffect(() => {
        console.log(testListHook.data)
        if (testListHook.data) {
            // if (testListHook.data && testListHook.data.caseResultList && testListHook.data.caseResultList?.caseResultList) {
            //     let _testListHookList = [];
            //     for (let i = 0; i < testListHook.data.caseResultList?.caseResultList.length || 0; i++) {
            //         let item: any = JSON.parse(JSON.stringify(testListHook.data.caseResultList.caseResultList[i]));
            //         item.orderId = i;
            //         _testListHookList.push(item)
            //     }
            //     console.log(_testListHookList);
            //     setTestList(_testListHookList || [])
            // }

            setTestList(testListHook.data.caseResultList?.caseResultList || [])
            setTestListCount(testListHook.data.caseResultList?.count || 0)
        }
    }, [testListHook.data]);

    useEffect(() => {
        if (!statusTimer) {
            const _timer = setInterval(() => {
                stepHook.refetch();
            }, 1000);
            setStatusTimer(_timer);
        }
    }, [])
    useEffect(() => {
        return () => {
            window.clearInterval(statusTimer);
        }
    }, [statusTimer])

    useEffect(() => {
        // isEnableDownLoad
        console.log(downLoadStatusHook.data?.checkProjectReportStatus);
    }, [downLoadStatusHook.data])

    const showButtons = useMemo(() => {
        if (taskStatus === 4) {
            return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Icon type="pending-gray"></Icon>
                <span style={{ fontSize: 12, marginLeft: 10 }}>
                    <Localized id="compliance-unCheck"></Localized>
                </span>
                <Button onClick={async () => {
                    await startTestFunc({
                        variables: {
                            teamId: teamId,
                            projectId: projectId
                        }
                    }).catch((error) => {
                        notification.error({
                            description: error.toString()
                        })
                    }).then((data: any) => {
                        let result = data['data']['startProjectDetection'];
                        if (result.id === '-101') {
                            Modal.alert({
                                // type: "pending",
                                message: "测试终端已被占用",
                                description: `因测试终端已被${result.name}项目占用，导致当前项目无法连接测试终端。若要继续检测，请联系相关责任人结束${result.name}项目，结束后，当前项目将自动开始。`,
                                buttons: [
                                    <Button type="primary" onClick={() => console.log("已确认")}>
                                        我知道了
                                    </Button>,
                                ],
                            });
                        }
                    })
                    projectDetailHook.refetch();
                }} type="primary"><Localized id="compliance-startTesting"></Localized></Button>
            </div>
        }
        else if (taskStatus === 1) {
            return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Icon type="success"></Icon>
                <span style={{ fontSize: 12, marginLeft: 10 }}>
                    <Localized id="compliance-checkPass"></Localized>
                </span>
                <Button onClick={async () => {
                    await resetProject({
                        variables: {
                            teamId: teamId,
                            projectId: projectId
                        }
                    }).catch((error) => {
                        notification.error({
                            description: error.toString()
                        })
                    }).then((data: any) => {
                        let result = data['data']['resetProject'];
                        if (result.id === '-101') {
                            Modal.alert({
                                // type: "pending",
                                message: "测试终端已被占用",
                                description: `因测试终端已被${result.name}项目占用，导致当前项目无法连接测试终端。若要继续检测，请联系相关责任人结束${result.name}项目，结束后，当前项目将自动开始。`,
                                buttons: [
                                    <Button type="primary" onClick={() => console.log("已确认")}>
                                        我知道了
                                    </Button>,
                                ],
                            });
                        }
                    })
                    projectDetailHook.refetch();
                    const _timer = setInterval(() => {
                        stepHook.refetch();
                    }, 1000);
                    setStatusTimer(_timer);
                }}>
                    <Localized id="compliance-replaccecheck"></Localized>
                </Button>
            </div>
        }
        else if (taskStatus === 2) {
            return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Icon type="error"></Icon>
                <span style={{ fontSize: 12, marginLeft: 10 }}>
                    <Localized id="compliance-checkUnPass"></Localized>
                </span>
                <Button onClick={async () => {
                    const yes = await Modal.confirm({
                        message: "重新检测项目",
                        description: "确定重新检测项目？",
                        okText: "确定",
                        cancelText: "取消",
                    });
                    if (yes) {
                        await resetProject({
                            variables: {
                                teamId: teamId,
                                projectId: projectId
                            }
                        }).catch((error) => {
                            notification.error({
                                description: error.toString()
                            })
                        }).then((data: any) => {
                            let result = data['data']['resetProject'];
                            if (result.id === '-101') {
                                Modal.alert({
                                    // type: "pending",
                                    message: "测试终端已被占用",
                                    description: `因测试终端已被${result.name}项目占用，导致当前项目无法连接测试终端。若要继续检测，请联系相关责任人结束${result.name}项目，结束后，当前项目将自动开始。`,
                                    buttons: [
                                        <Button type="primary" onClick={() => console.log("已确认")}>
                                            我知道了
                                        </Button>,
                                    ],
                                });
                            }
                        })
                        projectDetailHook.refetch();
                        const _timer = setInterval(() => {
                            stepHook.refetch();
                        }, 1000);
                        setStatusTimer(_timer);

                    }
                }}>
                    <Localized id="compliance-replaccecheck"></Localized>
                </Button>
            </div>
        }
        else if (taskStatus === 3) {
            return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Icon type="warning"></Icon>
                <span style={{ fontSize: 12, marginLeft: 10 }}>
                    <Localized id="studio-myProject-checking"></Localized>
                </span>
                <Button onClick={async () => {
                    const yes = await Modal.confirm({
                        message: "结束检测项目",
                        description: "结束检测后，检测用例内容将不可变更，当前检测中用例将转为未检测。",
                        okText: "确定",
                        cancelText: "取消",
                    });
                    if (yes) {
                        await stopProject({
                            variables: {
                                teamId: teamId,
                                projectId: projectId
                            }
                        }).catch((error) => {
                            notification.error({
                                description: error.toString()
                            })
                        })
                        projectDetailHook.refetch();
                    }
                }} type="error">
                    <Localized id="compliance-stopTest"></Localized>
                </Button>
            </div>
        }
    }, [taskStatus])

    const showProjectHistroyClick = () => {
        setShowProjectHistory(true);
    }
    const showCaseHistroyClick = (id: any) => {
        setShowCaseHisory(true);
        setSelectCaseId(id)
    }

    const calculateRate = () => {
        let result;
        result = stepHook.data?.getProjectAutoTaskProgress?.index as number / steps.length * 100;
        if (result >= 0) {
            return result
        }
        else {
            return 0;
        }
        // return result
    }

    const setSatusFilter = (status: any) => {
        let query = searchParam;
        query.search = status.toString();
        query.searchField = 'status';

        if (status === -1) {

            query.search = '';
            query.searchField = '';

        }

        setSearchParam(JSON.parse(JSON.stringify(query)))
    }

    return <>
        <Body>
            <Content>
                <Content.Header
                    title={projectDetail?.projectResult?.name || '--'}
                    showBackButton onBackButtonClick={() => {
                        // history.push(workFlowLink({ projectId: projectId }));
                        history.goBack();
                    }}
                    operation={showButtons}
                ></Content.Header>
                <div>
                    <Link to={generateLink(Pattern.ProjectReport, {caseId:'case_items;1287',projectId:'project_items;33'})}>
                        测试执行test
                    </Link>
                </div>
                <Content.Body full>
                    <Row>
                        <Col span={24}>
                            <Card>
                                <Card.Body title={<div> <Localized id="compliance-basicInfo"></Localized> <Icon style={{ cursor: 'pointer' }} type="pencil" onClick={() => { setShowEditMoadl(true) }} /></div>} operation={<Button type='link' onClick={() => { showProjectHistroyClick() }}>
                                    <Localized id='compliance-modifyHistory'></Localized>
                                </Button>}>
                                    <Row showSplitLine>
                                        <Col span={8}>
                                            <DetailListDom>
                                                <DetailListDomTitle><Localized id={'column-projectName'}></Localized></DetailListDomTitle>
                                                <div>{projectDetail?.projectResult?.name || '--'}</div>
                                            </DetailListDom>
                                            <DetailListDom>
                                                <DetailListDomTitle><Localized id={'column-dutyUser'}></Localized></DetailListDomTitle>
                                                <div>{projectDetail?.projectResult?.dutyUser || '--'}</div>
                                            </DetailListDom>
                                        </Col>
                                        <Col span={8}>
                                            <DetailListDom>
                                                <DetailListDomTitle>
                                                    <Localized id={'column-lawStandard'}></Localized>
                                                </DetailListDomTitle>
                                                <div>{projectDetail?.projectResult?.lawStandard || '--'}</div>
                                            </DetailListDom>
                                            <DetailListDom>
                                                <DetailListDomTitle><Localized id={'column-carModel'}></Localized></DetailListDomTitle>
                                                <div>{projectDetail?.projectResult?.carModel || '--'}</div>
                                            </DetailListDom>
                                        </Col>
                                        <Col span={8}>
                                            <DetailListDom>
                                                <DetailListDomTitle><Localized id={'column-submitTime'}></Localized></DetailListDomTitle>
                                                <div>{projectDetail?.projectResult?.submitTime || '--'}</div>
                                            </DetailListDom>
                                            <DetailListDom>
                                                <DetailListDomTitle>{'零部件-版本'}</DetailListDomTitle>
                                                <div>{projectDetail?.projectResult?.module + '-' + projectDetail?.projectResult?.version || '--'}</div>
                                            </DetailListDom>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {
                        steps.length === status ? <Row>
                            <Col span={24}>
                                <Card>
                                    <Card.Body>
                                        <Row>
                                            <CurrentStepper current={status} steps={steps}></CurrentStepper>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row> : <></>
                    }
                    {
                        steps.length === status ? <></> : <Row>
                            <Col span={24}>
                                <Card>
                                    <Card.Body title={<Localized id="compliance-testPreparing"></Localized>}>
                                        <Row>
                                            <Col span={24} style={{ textAlign: 'center', marginTop: 40 }}>
                                                <H1>{calculateRate().toString().slice(0, 5) + '%' || '0%'}</H1>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24} style={{ textAlign: 'center', marginTop: 10 }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <H2 style={{ marginLeft: 0 }}>{steps[status - 1]?.label ? steps[status - 1]?.label + getValue('compliance-ing') : getValue('compliance-envNotReady')}</H2>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24} style={{ textAlign: 'center', marginTop: 25 }}>
                                                <ReadyStepper current={status} steps={steps}></ReadyStepper>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col span={24}>
                            <Card>
                                <Card.Body>
                                    <Tabs tabs={tableTabs} addon={
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: -20 }}>
                                            {showSreachBox ?
                                                <SearchBox
                                                    style={{ width: 200, marginRight: 20 }}
                                                    placeholder={getValue('compliance-searchCase')}
                                                    onSearch={(value) => {
                                                        let query = searchParam;
                                                        query.search = value;
                                                        query.searchField = 'name';
                                                        setSearchParam(JSON.parse(JSON.stringify(query)))
                                                    }}
                                                    onClear={() => {
                                                        let query = searchParam;
                                                        query.search = '';
                                                        query.searchField = 'name';
                                                        setSearchParam(JSON.parse(JSON.stringify(query)))
                                                    }}
                                                /> : null
                                            }
                                            <Button type="link" onClick={() => {
                                                downLoadStatusHook.refetch().then((data) => {
                                                    // console.log(data);
                                                    // setShowDownLoadModal(true)
                                                    const url = '/download_report/' + projectId + '?token=' + token;
                                                    window.open(url, 'SafeReport');
                                                }).catch((e) => {
                                                    notification.error({
                                                        description: e.toString()
                                                    })
                                                })
                                            }}>
                                                <Localized id='compliance-createReport'></Localized>
                                            </Button>
                                        </div>}
                                        onActive={(e) => {
                                            if (e.id === 'test') {
                                                setShowSreachBox(true);
                                            }
                                            else {
                                                setShowSreachBox(false);
                                            }
                                        }}
                                    >
                                        <TabPanel id="test">
                                            <Row style={{ marginTop: 10, padding: '0px 10px' }}>
                                                <Col>
                                                    <Row showSplitLine>
                                                        <Col>
                                                            <Localized id='compliance-totalCaseCount'></Localized>
                                                            <div style={{ marginTop: 10 }}>
                                                                <LargeFont onClick={() => { setSatusFilter(-1) }} style={{ cursor: 'pointer' }}>{projectDetail?.projectResult?.testResult?.caseNumber}</LargeFont>
                                                                <Localized id='dashboard-project-count-unit'></Localized>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <Localized id='compliance-check-passRate'></Localized>
                                                            <div style={{ marginTop: 10 }}>
                                                                <LargeFont>
                                                                    {projectDetail.projectResult ? projectDetail?.projectResult?.testResult?.passRate + '%' || '0%' : '0%'}
                                                                </LargeFont>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <Localized id='compliance-checkPass'></Localized>
                                                            <div style={{ marginTop: 10 }}>
                                                                <LargeFont onClick={() => { setSatusFilter(1) }} style={{ color: '#29cc85', cursor: 'pointer' }}>
                                                                    {projectDetail?.projectResult?.testResult?.passNumber}
                                                                </LargeFont>
                                                                <Localized id='dashboard-project-count-unit'></Localized>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <Localized id='compliance-checkUnPass'></Localized>
                                                            <div style={{ marginTop: 10 }}>
                                                                <LargeFont onClick={() => { setSatusFilter(2) }} style={{ color: '#ff584c', cursor: 'pointer' }}>
                                                                    {projectDetail?.projectResult?.testResult?.unPassNumber}
                                                                </LargeFont>
                                                                <Localized id='dashboard-project-count-unit'></Localized>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <Localized id='studio-myProject-checking'></Localized>
                                                            <div style={{ marginTop: 10 }}>
                                                                <LargeFont onClick={() => { setSatusFilter(5) }} style={{ color: '#f28f2c', cursor: 'pointer' }}>
                                                                    {projectDetail?.projectResult?.testResult?.testingNumber}
                                                                </LargeFont>
                                                                <Localized id='dashboard-project-count-unit'></Localized>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <Localized id='compliance-unCheck'></Localized>
                                                            <div style={{ marginTop: 10 }}>
                                                                <LargeFont onClick={() => { setSatusFilter(3) }} style={{ color: '#888', cursor: 'pointer' }}>
                                                                    {projectDetail?.projectResult?.testResult?.unTestNumber}
                                                                </LargeFont>
                                                                <Localized id='dashboard-project-count-unit'></Localized>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <Localized id='compliance-igore'></Localized>
                                                            <div style={{ marginTop: 10 }}>
                                                                <LargeFont onClick={() => { setSatusFilter(4) }} style={{ color: '#006EFF', cursor: 'pointer' }}>
                                                                    {projectDetail?.projectResult?.testResult?.ignoreNumber}
                                                                </LargeFont>
                                                                <Localized id='dashboard-project-count-unit'></Localized>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    {
                                                        testList ?
                                                            <Table columns={testColumns} records={testList} recordKey={'id'}
                                                                style={{ marginTop: 20 }}
                                                                bordered
                                                                addons={[
                                                                    pageable({
                                                                        recordCount: testListCount,
                                                                        pageSize: pageSize,
                                                                        onPagingChange: (value) => {
                                                                            let query = searchParam;
                                                                            query.offset.offset = (value.pageIndex as number - 1) * (value.pageSize as number);
                                                                            query.offset.limit = value.pageSize;
                                                                            setSearchParam(JSON.parse(JSON.stringify(query)))
                                                                            setPageSize(value.pageSize)
                                                                            // setSearchParam(JSON.parse(`{"search":"","offset":{"offset":20,"limit":10},"orderBy":{"field":"catalogue_union_id","order":"ASC"}}`))
                                                                        }
                                                                    }),
                                                                    autotip({
                                                                        emptyText: <div>
                                                                            <Status icon={'blank'} title={<Localized id="compliance-nodata"></Localized>}></Status>
                                                                        </div>,
                                                                    }),
                                                                    columnsResizable({
                                                                        minWidth: 100,
                                                                        maxWidth: 1000,
                                                                        onResizeEnd: columns => {
                                                                        },
                                                                    }),
                                                                    sortable({
                                                                        columns: ['status', 'handlerUser'],
                                                                        // 这两列支持排序，其中 age 列优先倒序，mail 采用自定义排序方法
                                                                        value: sorts,
                                                                        onChange: (value) => {

                                                                            let result = [];

                                                                            console.log(value);

                                                                            if (value.length === 2 && value[0].by === sorts[0].by) {
                                                                                result.push(value[1]);
                                                                            }
                                                                            else if (value.length === 2 && value[1].by === sorts[0].by) {
                                                                                result.push(value[0]);
                                                                            }
                                                                            else if (value.length < 2 && value[0]) {
                                                                                result.push(value[0] || null);
                                                                            }
                                                                            setSorts(result);

                                                                            let query = searchParam;
                                                                            if (result[0]) {
                                                                                query.orderBy.field = result[0].by;
                                                                                query.orderBy.order = result[0].order === 'asc' ? Order.Asc : Order.Desc;
                                                                            }
                                                                            else {
                                                                                query.orderBy.field = "case_id";
                                                                                query.orderBy.order = Order.Asc;
                                                                            }
                                                                            setSearchParam(JSON.parse(JSON.stringify(query)));

                                                                            // let query = searchParam;
                                                                            // query.offset.offset = (value.pageIndex as number - 1) * (value.pageSize as number);
                                                                            // query.offset.limit = value.pageSize;
                                                                            // setSearchParam(JSON.parse(JSON.stringify(query)))
                                                                        }
                                                                    }),
                                                                ]}></Table> : null
                                                    }
                                                </Col>
                                            </Row>
                                        </TabPanel>
                                        <TabPanel id="compliance">
                                            <Row style={{ marginTop: 10, padding: '0px 10px' }}>
                                                <Col>
                                                    <Row showSplitLine>
                                                        <Col>
                                                            <Localized id='compliance-totalcount'></Localized>
                                                            <div style={{ marginTop: 10 }}>
                                                                <LargeFont>{complianceDetail?.catalogueNumber}</LargeFont>
                                                                <Localized id='dashboard-project-count-unit'></Localized>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <Localized id='compliance-check-passRate'></Localized>
                                                            <div style={{ marginTop: 10 }}>
                                                                <LargeFont>
                                                                    {complianceDetail?.passRate + '%' || '0%'}
                                                                </LargeFont>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <Localized id='compliance-checkPass'></Localized>
                                                            <div style={{ marginTop: 10 }}>
                                                                <LargeFont style={{ color: '#29cc85' }}>
                                                                    {complianceDetail?.passNumber}
                                                                </LargeFont>
                                                                <Localized id='dashboard-project-count-unit'></Localized>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <Localized id='compliance-checkUnPass'></Localized>
                                                            <div style={{ marginTop: 10 }}>
                                                                <LargeFont style={{ color: '#ff584c' }}>
                                                                    {complianceDetail?.unPassNumber}
                                                                </LargeFont>
                                                                <Localized id='dashboard-project-count-unit'></Localized>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <Localized id='compliance-unCheck'></Localized>
                                                            <div style={{ marginTop: 10 }}>
                                                                <LargeFont style={{ color: '#888' }}>
                                                                    {complianceDetail?.unTestNumber}
                                                                </LargeFont>
                                                                <Localized id='dashboard-project-count-unit'></Localized>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <Localized id='compliance-igore'></Localized>
                                                            <div style={{ marginTop: 10 }}>
                                                                <LargeFont style={{ color: '#006EFF' }}>
                                                                    {complianceDetail?.ignoreNumber}
                                                                </LargeFont>
                                                                <Localized id='dashboard-project-count-unit'></Localized>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Table columns={compliancColumns}
                                                        style={{ marginTop: 20 }}
                                                        bordered
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
                                                </Col>
                                            </Row>
                                        </TabPanel>
                                    </Tabs>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Content.Body>
            </Content>
        </Body>
        <ProjectHistoryModal projectId={projectId}
            isShow={showProjectHistory}
            setIsShowAddDialog={setShowProjectHistory}>
        </ProjectHistoryModal>
        <CaseHistoryModal projectId={projectId}
            caseId={selectCaseId}
            isShow={showCaseHistory}
            setIsShowAddDialog={setShowCaseHisory}
        >
        </CaseHistoryModal>
        <SelectAppModal isShow={showSelectAppModal}
            setIsShowAddDialog={setShowSelectAppModal}>
        </SelectAppModal>
        {/* <DownLoadModal projectId={projectId} isShow={showDownLoadModal}
            setIsShowAddDialog={setShowDownLoadModal}>
        </DownLoadModal> */}
        <EditProjectModal id={projectDetail?.projectResult?.id} userId={projectDetail?.projectResult?.dutyUserId} projectName={projectDetail?.projectResult?.name} refreshFn={() => { projectDetailHook.refetch() }} isShow={showEditModal} setIsShowAddDialog={setShowEditMoadl}>

        </EditProjectModal>
    </>
}