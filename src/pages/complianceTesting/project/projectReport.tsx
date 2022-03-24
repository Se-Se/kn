import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, Breadcrumb, Steps, Table, Divider } from 'tdesign-react';
import styled from '@emotion/styled/macro';
import { generateLink, Pattern } from 'route';
import { ImagePreview, Button } from "@tencent/tea-component";
import iconPass from '../../../image/report-pass.svg';
import iconUnPass from '../../../image/report-unpass.svg';
import iconReportIgnore from '../../../image/report-ignore.svg';
import iconManul from '../../../image/report-manul-manul.svg';
import iconRiskLow from '../../../image/risk-low.svg';
import iconRiskHigh from '../../../image/risk-high.svg';
import iconRiskMid from '../../../image/risk-mid.svg';
import iconCheck from '../../../image/check-circle-filled.svg';
import { useCaseTestProcessRecordLazyQuery } from 'generated/graphql';
import iconHalf from '../../../image/report-manul-half.svg';
import iconAuto from '../../../image/report-manul-auto.svg';


const { Header, Content } = Layout;
const { BreadcrumbItem } = Breadcrumb;
const { StepItem } = Steps;

const ContentGroup = styled.div`
    background: white;
    min-height: 100%;
    padding:25px;
    min-width: 100%;
`;
const ContentGroupTitle = styled.div`
    font-weight: 700;
`;
const BaseInfoGroup = styled.div`
    margin-top: 25px;
    display: flex;
`;
const BaseInfoItem = styled.div`
    width:33.3%;
`;
const BaseInfoItemGroup = styled.div`
    display: flex;
    margin-bottom: 25px;
`;
const BaseInfoItemTitle = styled.div`
    width:100px;
`;
const BaseInfoItemContent = styled.div`
    width:calc( 100% - 100px);
    color: #737373;
`;
const BaseInfoGroupDesc = styled.div`
    margin-bottom: 25px;
    display: flex;
`;
const BaseInfoGroupDescContent = styled.div`
    width:calc( 100% - 100px);
    color: #737373;
    .t-table{
        border:1px solid #E7E7E7;
        border-bottom:0;
    }
`;

const ReportStatusIcon = styled.div`
    width:100px;
    height:100px;
    position:absolute;
    top:55px;
    right:40px;
`;



type CaseReport = {}

export const Page: React.FC<CaseReport> = () => {
    const teamId = 'team_items;1';
    const params: any = useParams();
    const [lawGroup, setLawGroup] = useState<any[]>([]);
    const [stepGroup, setStepGroup] = useState<any>([]);
    const [caseInfoData, setCaseInfoData] = useState<any>({});
    const [getRecord, getRecordHook] = useCaseTestProcessRecordLazyQuery();
    const [reportStatus, setReportStatus] = useState<any>(3);


    useEffect(() => {
        console.log('params', params);
        getRecord({ variables: { teamId: teamId, caseId: params.caseId, projectId: params.projectId } })
    }, [])



    useEffect(() => {
        console.log('getRecordHook', getRecordHook)

        setCaseInfoData(getRecordHook.data?.caseTestProcessRecord || {});
        setLawGroup(getRecordHook.data?.caseTestProcessRecord?.complianceRequire || []);
        setReportStatus(getRecordHook?.data?.caseTestProcessRecord?.caseStatus || 3);
        setStepGroup(getRecordHook?.data?.caseTestProcessRecord?.caseTestProcess || []);
        // setStepGroup(test);

    }, [getRecordHook.data])

    // 风险程度
    const riskLevelFn = (level: any) => {
        if (level === 'high') {
            return (
                <img src={iconRiskHigh}></img>
            )
        } else if (level === 'medium') {
            return (
                <img src={iconRiskMid}></img>
            )
        } else {
            return (
                <img src={iconRiskLow}></img>
            )
        }
    }
    // 报告状态
    const reportStatusFn = (status: any) => {
        if (status === 1) {
            return (
                <img src={iconPass}></img>
            )
        } else if (status === 2) {
            return (
                <img src={iconUnPass}></img>
            )
        } else if (status === 3) {
            return (
                <img src={iconReportIgnore}></img>
            )
        } else {
            return (
                <img src={iconReportIgnore}></img>
            )
        }
    }
    //测试类型
    const testMethodFn = (method: any) => {
        if (method === '手工') {
            return (
                <>
                    <img src={iconManul}></img><span style={{ marginLeft: 5, color: '#0052D9' }}> {caseInfoData?.caseBaseInfo?.testMethodName || '--'}</span>
                </>
            )
        } else if (method === '自动') {
            return (

                <>
                    <img src={iconAuto}></img><span style={{ marginLeft: 5, color: '#0E9D61' }}> {caseInfoData?.caseBaseInfo?.testMethodName || '--'}</span>
                </>
            )
        } else if (method === '半自动') {
            return (

                <>
                    <img src={iconHalf}></img><span style={{ marginLeft: 5, color: '#FF9D00' }}> {caseInfoData?.caseBaseInfo?.testMethodName || '--'}</span>
                </>
            )
        } else {
            return (
                <>
                    <img src={iconManul}></img><span style={{ marginLeft: 5, color: '#0052D9' }}> {caseInfoData?.caseBaseInfo?.testMethodName || '--'}</span>
                </>
            )
        }
    }
    return <>
        <Layout>
            <Header style={{
                height: 48,
                paddingLeft: 25,
                paddingRight: 25,
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Breadcrumb maxItemWidth="200px" theme="light">
                    <BreadcrumbItem>项目概览</BreadcrumbItem>
                    <BreadcrumbItem>项目详情</BreadcrumbItem>
                    <BreadcrumbItem style={{ fontWeight: 700 }}>这里显示具体的用例名称</BreadcrumbItem>
                </Breadcrumb>
                <Link target={'_blank'} to={generateLink(Pattern.ComplianceTestingCaseTaskFlow, { caseId: params.caseId, projectId: params.projectId })}>恢复测试</Link>
            </Header>
            <Content style={{ padding: 25, position: 'relative' }}>
                <ReportStatusIcon>
                    {reportStatusFn(reportStatus)}
                </ReportStatusIcon>
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
                                        用例编号
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent>
                                    <span>
                                        {caseInfoData?.caseBaseInfo?.id || '--'}
                                    </span>
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                            <BaseInfoItemGroup>
                                <BaseInfoItemTitle>
                                    <span>
                                        操作系统
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent>
                                    <span>
                                        {caseInfoData?.caseBaseInfo?.operatingSystemName || '--'}
                                    </span>
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                            <BaseInfoItemGroup>
                                <BaseInfoItemTitle>
                                    <span>
                                        风险程度
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent>
                                    {riskLevelFn(caseInfoData?.caseBaseInfo?.riskLevelType)}
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                        </BaseInfoItem>
                        <Divider style={{ height: 110 }} layout="vertical"></Divider>
                        <BaseInfoItem>
                            <BaseInfoItemGroup>
                                <BaseInfoItemTitle>
                                    <span>
                                        用例名称
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent>
                                    <span>
                                        {caseInfoData?.caseBaseInfo?.name || '--'}
                                    </span>
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                            <BaseInfoItemGroup>
                                <BaseInfoItemTitle>
                                    <span>
                                        绑定设备
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent>
                                    <span>
                                        {caseInfoData?.caseBaseInfo?.bindName || '--'}
                                    </span>
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                            <BaseInfoItemGroup>
                                <BaseInfoItemTitle>
                                    <span>
                                        创建人
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent>
                                    <span>
                                        {caseInfoData?.caseBaseInfo?.submitUserName || '--'}
                                    </span>
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                        </BaseInfoItem>
                        <Divider style={{ height: 110 }} layout="vertical"></Divider>
                        <BaseInfoItem>
                            <BaseInfoItemGroup>
                                <BaseInfoItemTitle>
                                    <span>
                                        测试类型
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent style={{ display: 'flex' }}>

                                    {testMethodFn(caseInfoData?.caseBaseInfo?.testMethodName)}

                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                            <BaseInfoItemGroup>
                                <BaseInfoItemTitle>
                                    <span>
                                        分类
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent>
                                    <span>
                                        {caseInfoData?.caseBaseInfo?.classifyName || '--'}
                                    </span>
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                            <BaseInfoItemGroup>
                                <BaseInfoItemTitle>
                                    <span>
                                        创建时间
                                    </span>
                                </BaseInfoItemTitle>
                                <BaseInfoItemContent>
                                    <span>
                                        {caseInfoData?.caseBaseInfo?.submitTime || '--'}
                                    </span>
                                </BaseInfoItemContent>
                            </BaseInfoItemGroup>
                        </BaseInfoItem>
                    </BaseInfoGroup>
                    <BaseInfoGroupDesc>
                        <BaseInfoItemTitle>
                            <span>
                                描述
                            </span>
                        </BaseInfoItemTitle>
                        <BaseInfoGroupDescContent>
                            <span>
                                {caseInfoData?.caseBaseInfo?.caseDesc || '--'}
                            </span>
                        </BaseInfoGroupDescContent>
                    </BaseInfoGroupDesc>
                    <BaseInfoGroupDesc>
                        <BaseInfoItemTitle>
                            <span>
                                修复建议
                            </span>
                        </BaseInfoItemTitle>
                        <BaseInfoGroupDescContent>
                            <span>
                                {caseInfoData?.caseBaseInfo?.remediation || '--'}
                            </span>
                        </BaseInfoGroupDescContent>
                    </BaseInfoGroupDesc>
                    <Divider></Divider>
                    <ContentGroupTitle style={{ marginTop: 25 }}>
                        <span>
                            关联法规
                        </span>
                    </ContentGroupTitle>
                    {
                        lawGroup.map((value, key) => {
                            return <div key={key}>
                                <BaseInfoGroupDesc style={{ marginTop: 25 }}>
                                    <BaseInfoItemTitle>
                                        <span>
                                            法规名称
                                        </span>
                                    </BaseInfoItemTitle>
                                    <BaseInfoGroupDescContent>
                                        <span>
                                            {value.lawName || '--'}
                                        </span>
                                    </BaseInfoGroupDescContent>
                                </BaseInfoGroupDesc>
                                <BaseInfoGroupDesc>
                                    <BaseInfoItemTitle>
                                        <span>
                                            分类
                                        </span>
                                    </BaseInfoItemTitle>
                                    <BaseInfoGroupDescContent>
                                        <span>
                                            {value.dutyLawClassify1 || '--'}
                                        </span>
                                    </BaseInfoGroupDescContent>
                                </BaseInfoGroupDesc>
                                <BaseInfoGroupDesc>
                                    <BaseInfoItemTitle>
                                        <span>
                                            要求
                                        </span>
                                    </BaseInfoItemTitle>
                                    <BaseInfoGroupDescContent>
                                        <span>
                                            {value.dutyLawCatalogueName || '--'}
                                        </span>
                                    </BaseInfoGroupDescContent>
                                </BaseInfoGroupDesc>
                                <BaseInfoGroupDesc>
                                    <BaseInfoItemTitle>
                                        <span>
                                            测试方法
                                        </span>
                                    </BaseInfoItemTitle>
                                    <BaseInfoGroupDescContent>
                                        <span>
                                            {value.description || '--'}
                                        </span>
                                    </BaseInfoGroupDescContent>
                                </BaseInfoGroupDesc>
                                <Divider></Divider>
                            </div>
                        })
                    }
                    <ContentGroupTitle style={{ marginTop: 25 }}>
                        <span>
                            检测过程
                        </span>
                    </ContentGroupTitle>
                    <div style={{ marginTop: 25 }}>
                        <Steps layout="vertical" current={5}>
                            {
                                stepGroup.map((step: any, key: number) => {
                                    return <StepItem title={step.stepName} key={key}>
                                        <BaseInfoGroupDesc style={{ marginTop: 16 }}>
                                            <BaseInfoItemTitle style={{ width: 55 }}>
                                                <span>
                                                    过程
                                                </span>
                                            </BaseInfoItemTitle>
                                            <BaseInfoGroupDescContent>
                                                <span>
                                                    {step.process || '--'}
                                                </span>
                                            </BaseInfoGroupDescContent>
                                        </BaseInfoGroupDesc>
                                        <BaseInfoGroupDesc>
                                            <BaseInfoItemTitle style={{ width: 55 }}>
                                                <span>
                                                    结果
                                                </span>
                                            </BaseInfoItemTitle>
                                            <BaseInfoGroupDescContent>
                                                <span>
                                                    {step.result || '--'}
                                                </span>
                                            </BaseInfoGroupDescContent>
                                        </BaseInfoGroupDesc>
                                        <BaseInfoGroupDesc>
                                            <BaseInfoItemTitle style={{ width: 55 }}>
                                                <span>
                                                    备注
                                                </span>
                                            </BaseInfoItemTitle>
                                            <BaseInfoGroupDescContent>
                                                <span>
                                                    {step.remark || '--'}
                                                </span>
                                            </BaseInfoGroupDescContent>
                                        </BaseInfoGroupDesc>
                                        {step?.data?.length ? <BaseInfoGroupDesc>
                                            <BaseInfoItemTitle style={{ width: 55 }}>
                                                <span>
                                                    资料
                                                </span>
                                            </BaseInfoItemTitle>
                                            <BaseInfoGroupDescContent style={{ width: 550 }}>
                                                <Table
                                                    data={step?.data || []}
                                                    columns={[
                                                        {
                                                            align: 'center',
                                                            width: 175,
                                                            colKey: 'fileName',
                                                            title: '文件名',
                                                        },
                                                        {
                                                            align: 'left',
                                                            width: 80,
                                                            colKey: 'size',
                                                            title: '大小',
                                                        },
                                                        {
                                                            align: 'left',
                                                            width: 160,
                                                            colKey: 'status',
                                                            title: '状态',
                                                            render: () => {
                                                                return <div style={{ display: 'flex' }}>
                                                                    <img style={{ width: 20, height: 20 }} src={iconCheck}></img>
                                                                    <span style={{ marginLeft: 10, alignItems: 'center' }}>上传成功</span>
                                                                </div>

                                                            }
                                                        },
                                                        {
                                                            align: 'left',
                                                            width: 130,
                                                            colKey: 'operation',
                                                            title: '操作',
                                                            render: (cell) => {
                                                                return <>
                                                                    <ImagePreview
                                                                        previewSrc={cell?.row?.fileUrl}
                                                                        previewTitle="image"
                                                                    >
                                                                        {open => <a style={{ fontSize: 12, marginRight: 24 }} onClick={open}>预览</a>}
                                                                    </ImagePreview>
                                                                    <Button type='link' disabled>删除</Button>
                                                                </>
                                                            }
                                                        }
                                                    ]}
                                                    rowKey="index"
                                                    size="small"

                                                />
                                            </BaseInfoGroupDescContent>
                                        </BaseInfoGroupDesc> : null}
                                    </StepItem>
                                })
                            }
                        </Steps>
                    </div>
                </ContentGroup>
            </Content>
        </Layout>
    </>
}