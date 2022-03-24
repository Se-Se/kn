import React, { useEffect, useState } from 'react';
import { SearchBox, Row, Col, Button, Bubble } from '@tencent/tea-component';
import { Localized, useGetMessage } from 'i18n';
import { useHistory, Link, useRouteMatch } from 'react-router-dom';
import style from '@emotion/styled/macro';
import { generateLink, Pattern, ParamType } from 'route';
import { ProjectHistoryModal } from './projectHistoryModal';
import { CaseHistoryModal } from './caseHistoryModal';
import { ProjectStatusCtl } from './projectStatusCtl';
import {
    useResetProjectMutation,
    useCheckProjectReportStatusQuery,
    useStopProjectMutation,
    useStartProjectDetectionMutation,
    useProjectDetailsLazyQuery,
    useLawCatalogueCheckDetailQuery,
    useCaseResultListLazyQuery,
    Order
} from 'generated/graphql';
import { ReadyStepper } from './readyStepper_td';
import { EditProjectModal } from './editProjectModal';
import { useToken } from 'components/TokenService';
import { Layout, Breadcrumb, Button as TButton, Divider, Tabs, Table } from 'tdesign-react';
import { ProgressTag } from './progressTag';
import Micon from 'image/M.svg';
import projectStatusChecked from 'image/projectStatus-checked.svg';
import projectStatusChecking from 'image/projectStatus-checking.svg';
import projectStatusUncheck from 'image/projectStatus-unCheck.svg';

import sysAliOS from 'image/sys-AliOS.svg';
import sysAndriod from 'image/sys-Andriod.svg';
import sysLinux from 'image/sys-Linux.svg';
import sysQNX from 'image/sys-QNX.svg';
import sysRTOS from 'image/sys-RTOS.svg';



// const { expandable, autotip, columnsResizable, pageable, sortable } = Table.addons;

const { Header, Content } = Layout;
const { BreadcrumbItem } = Breadcrumb;
const { TabPanel } = Tabs;

const LargeFont = style.span`
    font-family: PingFangSC-Regular;
    font-weight: 400;
    line-height: 36px;
    font-size: 36px;
    margin-right: 5px;
`;
const ContentGroup = style.div`
    background: white;
    padding:25px;
    min-width: 100%;
`;
const ContentGroupTitle = style.div`
    font-weight: 700;
`;
const BaseInfoGroup = style.div`
    margin-top: 23px;
    display: flex;
`;
const BaseInfoItem = style.div`
    width:33.3%;
`;
const BaseInfoItemGroup = style.div`
    display: flex;
    margin-bottom: 25px;
`;
const BaseInfoItemTitle = style.div`
    width:100px;
`;
const BaseInfoItemContent = style.div`
    width:calc( 100% - 100px);
    color: #737373;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
    const [, setShowSuccessIcon] = useState<boolean>(false);
    const [complianceDetail, setComplianceDetail] = useState<any>({});
    const token = useToken();

    const [testList, setTestList] = useState<any[]>([]);
    const [testListCount, setTestListCount] = useState<number>(0);

    const [taskStatus, setTaskStatus] = useState<number>();
    const getValue = useGetMessage();
    // const projectDetailHook = useProjectDetailsQuery({ variables: { teamId: teamId, projectId: projectId }, fetchPolicy: 'network-only' })

    const [getProjectDetail, projectDetailHook] = useProjectDetailsLazyQuery();

    const LawCataLogeDataHook = useLawCatalogueCheckDetailQuery({ variables: { teamId: teamId, projectId: projectId }, fetchPolicy: 'network-only' });

    const [searchParam, setSearchParam] = useState<any>({ search: "", offset: { offset: 0, limit: 100 }, orderBy: { field: 'case_id', order: Order.Asc } });

    // const testListHook = useCaseResultListQuery({ variables: { teamId: teamId, projectId: projectId, search: {} }, fetchPolicy: 'network-only' });
    const downLoadStatusHook = useCheckProjectReportStatusQuery({ variables: { projectId: projectId } })
    // const [isEnableDownLoad, setIsEnableDownLoad] = useState<boolean>();

    const [showSreachBox, setShowSreachBox] = useState<boolean>(true);
    // const [showDownLoadModal, setShowDownLoadModal] = useState<boolean>(false);
    const [selectCaseId, setSelectCaseId] = useState<string>('');
    const [showEditModal, setShowEditMoadl] = useState<boolean>(false);

    const [sorts, setSorts] = useState<any>([]);

    const [startTestFunc] = useStartProjectDetectionMutation();
    const [stopProject] = useStopProjectMutation();
    const [resetProject] = useResetProjectMutation();

    const [pageSize, setPageSize] = useState<number>(100);
    const [current, setCurrent] = useState<number>(1);
    const [sort, setSort] = useState<any>(null);
    const [total, setTotal] = useState(0);
    const [getList, listHook] = useCaseResultListLazyQuery();
    const [list, setList] = useState<any>([]);
    const [tabV, setTabV] = useState<any>('1');
    const [caseV, setCaseV] = useState<any>('');

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
            {/* <Table columns={subTableColumns} records={record.caseClassifyResultRep}></Table> */}
        </div>;
    };

    const [steps, setSteps] = useState<any[]>([]);
    const [showProjectHistory, setShowProjectHistory] = useState<boolean>(false);

    const [showCaseHistory, setShowCaseHisory] = useState<boolean>(false);

    const showProjectHistroyClick = () => {
        setShowProjectHistory(true);
    }
    const showCaseHistroyClick = (id: any) => {
        setShowCaseHisory(true);
        setSelectCaseId(id)
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

    const handleTableChange = (v: any) => {
        console.log('handleTableChange', v);
        setTabV(v);
    }
    const rehandleChange = (pageInfo: { current: number, pageSize: number }) => {
        const { current, pageSize } = pageInfo;
        setCurrent(current);
        setPageSize(pageSize);
    }

    // 用例名称搜索
    const handleCaseNameSearch = (v: any) => {
        setCaseV(v);
    }
    // 用例搜索
    const caseSearch = (v: any) => {
        setSearchParam({ ...searchParam, searchField: 'caseName', search: v });
    }

    const renderButton = () => {
        if (projectDetail && projectDetail.taskStatus) {
            if (projectDetail.taskStatus === 1 || projectDetail.taskStatus === 2) {
                return <TButton theme='warning' onClick={async () => {
                    let result = await resetProject({ variables: { teamId: teamId, projectId: projectId } });
                    if (result) {
                        getProjectDetail({ variables: { teamId: teamId, projectId: projectId } })
                    }
                }}>重置检测</TButton>
            }
            else if (projectDetail.taskStatus === 3) {
                return <TButton theme='danger' onClick={async () => {
                    let result = await stopProject({ variables: { teamId: teamId, projectId: projectId } })
                    if (result) {
                        getProjectDetail({ variables: { teamId: teamId, projectId: projectId } })
                    }
                }}>结束检测</TButton>
            }
            else if (projectDetail.taskStatus === 4) {
                return <TButton onClick={async () => {
                    let result = await startTestFunc({ variables: { teamId: teamId, projectId: projectId } })
                    if (result) {
                        getProjectDetail({ variables: { teamId: teamId, projectId: projectId } })
                    }
                }}>开始检测</TButton>
            }
        }
    }

    const renderProjectIcon = () => {
        if (projectDetail && projectDetail.taskStatus) {
            if (projectDetail.taskStatus === 1 || projectDetail.taskStatus === 2) {
                return <img style={{ marginLeft: 8 }} src={projectStatusChecked}></img>
            }
            else if (projectDetail.taskStatus === 3) {
                return <img style={{ marginLeft: 8 }} src={projectStatusChecking}></img>
            }
            else if (projectDetail.taskStatus === 4) {
                return <img style={{ marginLeft: 8 }} src={projectStatusUncheck}></img>
            }
        }
    }

    const renderSystem = (testObj: any) => {
        if (testObj.systemType === 'linux') {
            return <div style={{ display: 'flex' }}>
                <img style={{ marginLeft: 8 }} src={sysLinux}></img>
                <span style={{ background: '#eee', borderRadius: 3, padding: 3, marginLeft: 8, lineHeight: '10px', fontSize: 12, paddingTop: 5 }}>{testObj.systemVersion}</span>
            </div>
        }
        else if (testObj.systemType === 'android') {
            return <div style={{ display: 'flex' }}>
                <img style={{ marginLeft: 8 }} src={sysAndriod}></img>
                <span style={{ background: '#eee', borderRadius: 3, padding: 3, marginLeft: 8, lineHeight: '10px', fontSize: 12, paddingTop: 5 }}>{testObj.systemVersion}</span>
            </div>
        }
        else if (testObj.systemType === 'qnx') {
            return <div style={{ display: 'flex' }}>
                <img style={{ marginLeft: 8 }} src={sysQNX}></img>
                <span style={{ background: '#eee', borderRadius: 3, padding: 3, marginLeft: 8, lineHeight: '10px', fontSize: 12, paddingTop: 5 }}>{testObj.systemVersion}</span>
            </div>
        }
        else if (testObj.systemType === 'rtos') {
            return <div style={{ display: 'flex' }}>
                <img style={{ marginLeft: 8 }} src={sysRTOS}></img>
                <span style={{ background: '#eee', borderRadius: 3, padding: 3, marginLeft: 8, lineHeight: '10px', fontSize: 12, paddingTop: 5 }}>{testObj.systemVersion}</span>
            </div>
        }
        else if (testObj.systemType === 'alios') {
            return <div style={{ display: 'flex' }}>
                <img style={{ marginLeft: 8 }} src={sysAliOS}></img>
                <span style={{ background: '#eee', borderRadius: 3, padding: 3, marginLeft: 8, lineHeight: '10px', fontSize: 12, paddingTop: 5 }}>{testObj.systemVersion}</span>
            </div>
        }
    }


    useEffect(() => {
        getList({ variables: { teamId: teamId, projectId: projectId, search: searchParam } });
    }, [searchParam])
    useEffect(() => {
        if (projectDetailHook.data) {

            console.log(projectDetailHook.data.projectDetails?.projectResult);

            setProjectDetail(projectDetailHook.data.projectDetails?.projectResult);
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
        // isEnableDownLoad
    }, [downLoadStatusHook.data])

    useEffect(() => {
        if (tabV === '1') {
            getList({ variables: { teamId: teamId, projectId: projectId, search: {} } })
        }
    }, [tabV])

    // 列表接口回调
    useEffect(() => {
        if (listHook.data) {
            setList(listHook.data.caseResultList?.caseResultList || []);
            setTotal(listHook.data.caseResultList?.count || 0)
        }
    }, [listHook.data])

    useEffect(() => {
        getProjectDetail({ variables: { teamId: teamId, projectId: projectId } })
    }, [])

    // pageSize, current, sort 变化更新SearchParam
    useEffect(() => {
        let orderBy: any = null;
        if (sort) {
            orderBy = { field: sort.sortBy, order: sort.descending ? Order.Desc : Order.Asc }
        }
        setSearchParam({ ...searchParam, offset: { offset: pageSize * (current - 1), limit: pageSize }, orderBy })
    }, [pageSize, current, sort]);
    return <>
        <ProjectStatusCtl setStatus={setStatus} deviceId={'f772fc0a'}></ProjectStatusCtl>
        <Layout className='testCenterMainLayout'>
            <Header style={{
                height: 48,
                paddingLeft: 25,
                paddingRight: 25,
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex' }}>
                    <Breadcrumb maxItemWidth="200px" theme="light">
                        <BreadcrumbItem>项目概览</BreadcrumbItem>
                        {/* <BreadcrumbItem style={{ fontWeight: 700 }}>项目详情</BreadcrumbItem> */}
                        <BreadcrumbItem style={{ fontWeight: 700 }}>{projectDetail?.name || ''}</BreadcrumbItem>
                    </Breadcrumb>
                    {renderProjectIcon()}
                    {/* <img style={{ marginLeft: 10 }} src={iconChecked}></img> */}
                </div>
                <div>
                    {renderButton()}
                </div>
            </Header>
            <Content style={{ padding: 25 }}>
                <ContentGroup>
                    <ContentGroupTitle>
                        <span>
                            基本信息
                        </span>
                    </ContentGroupTitle>
                    <BaseInfoGroup>
                        <BaseInfoItem>
                            <BaseInfoItemGroup>
                                <BaseInfoItemTitle>
                                    <span>
                                        项目名称
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent>
                                    <span>
                                        {projectDetail?.name || ''}
                                    </span>
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                            <BaseInfoItemGroup style={{ margin: 0 }}>
                                <BaseInfoItemTitle>
                                    <span>
                                        责任人
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent>
                                    <span>
                                        {projectDetail?.dutyUser || ''}
                                    </span>
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>

                        </BaseInfoItem>
                        <Divider style={{ height: 70 }} layout="vertical"></Divider>
                        <BaseInfoItem>
                            <BaseInfoItemGroup>
                                <BaseInfoItemTitle>
                                    <span>
                                        用例集
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent>
                                    <span>
                                        {projectDetail?.lawStandard || ''}
                                    </span>
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                            <BaseInfoItemGroup style={{ margin: 0 }}>
                                <BaseInfoItemTitle>
                                    <span>
                                        测试对象
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent>
                                    <div style={{ display: 'flex' }}>
                                        <div>
                                            {
                                                <span>{(projectDetail?.testObject?.autoPartsName || '') + '/' + (projectDetail?.testObject?.systemName || '')}</span>
                                            }

                                        </div>
                                        <div>
                                            {
                                                projectDetail && projectDetail.testObject ? renderSystem(projectDetail.testObject) : null
                                            }
                                        </div>
                                    </div>
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                        </BaseInfoItem>
                        <Divider style={{ height: 70 }} layout="vertical"></Divider>
                        <BaseInfoItem>
                            <BaseInfoItemGroup>
                                <BaseInfoItemTitle>
                                    <span>
                                        提交时间
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent style={{ display: 'flex' }}>
                                    <span>
                                        {projectDetail?.submitTime || ''}
                                    </span>
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                            <BaseInfoItemGroup style={{ margin: 0 }}>
                                <BaseInfoItemTitle>
                                    <span>
                                        设备ID
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent>
                                    <div>
                                        <div>
                                            {
                                                <span>
                                                    {projectDetail?.testDeviceId || ''}
                                                </span>
                                            }

                                        </div>
                                        <div>
                                            {
                                                status
                                            }
                                        </div>
                                    </div>
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                        </BaseInfoItem>
                    </BaseInfoGroup>
                </ContentGroup>
                <ContentGroup style={{ marginTop: 25, paddingBottom: 0 }}>
                    <ReadyStepper></ReadyStepper>
                </ContentGroup>
                <ContentGroup style={{ marginTop: 25, padding: 0 }}>
                    <Tabs placement={'top'} size={'medium'} value={tabV} onChange={(v) => handleTableChange(v)}>
                        <TabPanel value="1" label="用例维度">
                            <div className="tabs-content" style={{ margin: 20 }}>
                                <Row showSplitLine>
                                    <Col>
                                        <Localized id='compliance-totalCaseCount'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont onClick={() => { setSatusFilter(-1) }} style={{ cursor: 'pointer' }}>{projectDetail?.testResult?.caseNumber}</LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Localized id='compliance-check-passRate'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont>
                                                {projectDetail && projectDetail.projectResult ? projectDetail?.testResult?.passRate + '%' || '0%' : '0%'}
                                            </LargeFont>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Localized id='compliance-checkPass'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont onClick={() => { setSatusFilter(1) }} style={{ color: '#29cc85', cursor: 'pointer' }}>
                                                {projectDetail?.testResult?.passNumber}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Localized id='compliance-checkUnPass'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont onClick={() => { setSatusFilter(2) }} style={{ color: '#ff584c', cursor: 'pointer' }}>
                                                {projectDetail?.testResult?.unPassNumber}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Localized id='studio-myProject-checking'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont onClick={() => { setSatusFilter(5) }} style={{ color: '#f28f2c', cursor: 'pointer' }}>
                                                {projectDetail?.testResult?.testingNumber}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Localized id='compliance-unCheck'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont onClick={() => { setSatusFilter(3) }} style={{ color: '#888', cursor: 'pointer' }}>
                                                {projectDetail?.testResult?.unTestNumber}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Localized id='compliance-igore'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont onClick={() => { setSatusFilter(4) }} style={{ color: '#006EFF', cursor: 'pointer' }}>
                                                {projectDetail?.testResult?.ignoreNumber}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                </Row>
                                <SearchBox placeholder='请输入你需要搜索的用例' value={caseV} onChange={(v) => handleCaseNameSearch(v)} onSearch={caseSearch} style={{ marginTop: 24, marginBottom: 17, width: 320 }}></SearchBox>
                                <div style={{ border: '1px solid #ccc' }}>
                                    <Table
                                        rowKey="id"
                                        data={list}
                                        columns={[
                                            {
                                                align: 'left',
                                                width: 108,
                                                colKey: 'serialNumber',
                                                title: '用例编号',
                                                ellipsis: true
                                            },
                                            {
                                                align: 'left',
                                                width: 280,
                                                colKey: 'caseName',
                                                title: '用例名称',
                                                sorter: true,
                                                ellipsis: true
                                            },
                                            {
                                                align: 'left',
                                                width: 100,
                                                colKey: 'status',
                                                title: '状态',
                                                sorter: true,
                                                ellipsis: true,
                                                render: (cell: any) => {
                                                    return <ProgressTag progress={cell.row.status} />
                                                }
                                            },
                                            {
                                                align: 'left',
                                                width: 100,
                                                colKey: 'testResult',
                                                sorter: true,
                                                title: '检测结果',
                                                ellipsis: true,
                                                render: (cell: any) => {
                                                    return <ProgressTag type='result' progress={cell.row.status} />
                                                }
                                            },
                                            {
                                                align: 'left',
                                                width: 108,
                                                colKey: 'testMethodName',
                                                sorter: true,
                                                title: '测试类型',
                                                ellipsis: true,
                                                render: (cell: any) => {
                                                    return (
                                                        <div className='kn-test-m'><img src={Micon} className="kn-img" />{cell.row.testMethodName}</div>
                                                    )
                                                }
                                            },
                                            {
                                                align: 'left',
                                                width: 120,
                                                colKey: 'classifyName',
                                                ellipsis: true,
                                                title: '分类',
                                            },
                                            {
                                                align: 'left',
                                                width: 120,
                                                colKey: 'operatingSystemName',
                                                ellipsis: true,
                                                title: '操作系统',
                                            },
                                            {
                                                align: 'left',
                                                width: 184,
                                                colKey: 'edit',
                                                title: '操作',
                                                fixed: 'right',
                                                ellipsis: true,
                                                render(cell: any) {
                                                    if (cell.row.status) {
                                                        return <div>
                                                            {
                                                                cell.row.status < 4 ? <Link to={generateLink(Pattern.ProjectReport, { caseId: cell.row.caseId, projectId: projectId })}>
                                                                    查看报告
                                                                </Link> : <Link to={generateLink(Pattern.ComplianceTestingCaseTaskFlow, { caseId: cell.row.caseId, projectId: projectId })}>
                                                                    执行测试
                                                                </Link>
                                                            }
                                                            <Button type='link' style={{ marginLeft: 24 }} >变更历史</Button>
                                                        </div>
                                                    }
                                                }
                                            },
                                        ]}
                                        sort={sort}
                                        onSortChange={(sort) => { setSort(sort) }}
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

                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value="2" label="合规维度">
                            <div className="tabs-content" style={{ margin: 20 }}>
                                <Row showSplitLine>
                                    <Col>
                                        <Localized id='compliance-totalCaseCount'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont onClick={() => { setSatusFilter(-1) }} style={{ cursor: 'pointer' }}>{projectDetail?.testResult?.caseNumber}</LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Localized id='compliance-check-passRate'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont>
                                                {projectDetail?.projectResult ? projectDetail?.testResult?.passRate + '%' || '0%' : '0%'}
                                            </LargeFont>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Localized id='compliance-checkPass'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont onClick={() => { setSatusFilter(1) }} style={{ color: '#29cc85', cursor: 'pointer' }}>
                                                {projectDetail?.testResult?.passNumber}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Localized id='compliance-checkUnPass'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont onClick={() => { setSatusFilter(2) }} style={{ color: '#ff584c', cursor: 'pointer' }}>
                                                {projectDetail?.testResult?.unPassNumber}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Localized id='studio-myProject-checking'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont onClick={() => { setSatusFilter(5) }} style={{ color: '#f28f2c', cursor: 'pointer' }}>
                                                {projectDetail?.testResult?.testingNumber}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Localized id='compliance-unCheck'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont onClick={() => { setSatusFilter(3) }} style={{ color: '#888', cursor: 'pointer' }}>
                                                {projectDetail?.testResult?.unTestNumber}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Localized id='compliance-igore'></Localized>
                                        <div style={{ marginTop: 10 }}>
                                            <LargeFont onClick={() => { setSatusFilter(4) }} style={{ color: '#006EFF', cursor: 'pointer' }}>
                                                {projectDetail?.testResult?.ignoreNumber}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                </Row>
                                <SearchBox style={{ marginTop: 25, marginBottom: 25, width: 320 }}></SearchBox>
                                <Table
                                    data={[]}
                                    columns={[
                                        {
                                            align: 'center',
                                            width: 100,
                                            minWidth: 100,
                                            className: 'row',
                                            ellipsis: true,
                                            colKey: 'index',
                                            title: 'index',
                                        },

                                        {
                                            align: 'left',
                                            width: 100,
                                            minWidth: 100,
                                            className: 'test',
                                            ellipsis: true,
                                            colKey: 'platform',
                                            title: '平台',
                                        },
                                        {
                                            align: 'left',
                                            className: 'test4',
                                            ellipsis: true,
                                            colKey: 'default',
                                            title: '默认值',
                                        },
                                        {
                                            align: 'left',
                                            width: 100,
                                            minWidth: 100,
                                            className: 'test3',
                                            ellipsis: true,
                                            colKey: 'needed',
                                            title: '是否必传',
                                        },
                                        {
                                            align: 'left',
                                            width: 100,
                                            minWidth: 100,
                                            className: 'test3',
                                            ellipsis: true,
                                            colKey: 'detail.name',
                                            title: '详情信息',
                                        },
                                        {
                                            align: 'left',
                                            width: 100,
                                            minWidth: 100,
                                            className: 'row',
                                            ellipsis: true,
                                            colKey: 'description',
                                            title: '说明',
                                        },
                                    ]}
                                    rowKey="index"
                                    tableLayout="auto"
                                    verticalAlign="top"
                                    size="small"
                                    rowClassName={({ rowIndex }) => `${rowIndex}-class`}
                                    // 与pagination对齐
                                    pagination={{
                                        defaultCurrent: 2,
                                        defaultPageSize: 10,
                                        total: 30,
                                        showJumper: true,
                                        // showSizer: true,
                                        // visibleWithOnePage: true,
                                        onChange(pageInfo) {
                                            console.log(pageInfo, 'onChange pageInfo');
                                        },
                                        onCurrentChange(current, pageInfo) {
                                            console.log(current, 'onCurrentChange current');
                                            console.log(pageInfo, 'onCurrentChange pageInfo');
                                        },
                                        onPageSizeChange(size, pageInfo) {
                                            console.log(size, 'onPageSizeChange size');
                                            console.log(pageInfo, 'onPageSizeChange pageInfo');
                                        },
                                    }}
                                    onRowClick={({ row, index, e }) => {
                                        console.log('onRowClick', { row, index, e });
                                    }}
                                />
                            </div>
                        </TabPanel>
                    </Tabs>
                </ContentGroup>
            </Content>
        </Layout>
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
        {/* <DownLoadModal projectId={projectId} isShow={showDownLoadModal}
            setIsShowAddDialog={setShowDownLoadModal}>
        </DownLoadModal> */}
        <EditProjectModal id={projectDetail?.projectResult?.id} userId={projectDetail?.projectResult?.dutyUserId} projectName={projectDetail?.projectResult?.name} refreshFn={() => { projectDetailHook.refetch() }} isShow={showEditModal} setIsShowAddDialog={setShowEditMoadl}>

        </EditProjectModal>
    </>
}