import React, { useState } from 'react';
import { Breadcrumb, Layout, Button, Card, Row, Col, Upload, Table } from "@tencent/tea-component";
import { useHistory,Link,useRouteMatch } from 'react-router-dom';
import { Localized, useGetMessage } from 'i18n';
import { generateLink, Pattern } from 'route';
import style from '@emotion/styled/macro';
import {useCaseOfToolResultQuery} from 'generated/graphql'
interface ProjectMatch {
    projectId: string
    toolId: string
}

const { Body, Content } = Layout;

const BlockTitle = style.div`
    color:#888
`;
const LargeFont = style.span`
    font-family: "TCloud Number";
    font-weight: 700;
    font-size: 40px;
    margin-right: 5px;
`;
export const Page: React.FC = () => {
   
    const pageParam = useRouteMatch<ProjectMatch>().params;

    const teamId = 'team_items;1';
    const toolId = pageParam.toolId;
    const projectId = pageParam.projectId;
    const pathparams = {
        projectId:projectId
    }
    
    const toolDetailData = useCaseOfToolResultQuery({variables:{
        teamId:teamId,
        toolID:toolId,
        projectId:projectId
    }}).data?.caseOfToolResult;

    const history = useHistory();
    const [uploading] = useState();
    const getValue = useGetMessage();
    const basicData = {
        projectName: 'project name',
        toolName: 'toolName',
        totalCaseCount: '114',
        passed: '115',
        unPassed: '116',
        unCheck: '117',
        igore: '118',
        passRate: '10',
    };
    const toolListColumns = [
        {
            key: "caseName",
            header: getValue('column-case')
        }, {
            key: "catalogue",
            header: getValue('column-belongLaw')
        }, {
            key: "status",
            header: getValue('column-lawStatus'),
            render: (value:any) => {
                switch (value.status){
                    case 1: return <span style={{color:'#29cc85'}}><Localized id="compliance-checkPass"></Localized></span>;
                    case 2: return <span style={{color:'#ff584c'}}><Localized id="compliance-checkUnPass"></Localized></span>;
                    case 3: return <span style={{color:'#f28f2c'}}><Localized id="compliance-unCheck"></Localized></span>;
                    case 4: return <span style={{color:'#888'}}><Localized id="compliance-igore"></Localized></span>;
                }
            }
        }, {
            key: "handlerUser",
            header: getValue('column-dealUser')
        }, {
            key: "operation",
            header: getValue('column-operation'),
            render: (value:any) => {
                const pathparams = {
                    caseId:value?.id,
                    projectId:projectId
                }
                return <Link to={generateLink(Pattern.ComplianceTestingCaseDetail,pathparams)}><Localized id='see-detail'></Localized></Link>
            }
        }
    ];
    return <>
        <Layout>
            <Body>
                <Content>
                    <Content.Header title={<Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to={generateLink(Pattern.ComplianceTestingProject)}>
                                <Localized id="compliance-checkProject"></Localized>
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to={generateLink(Pattern.ComplianceTestingProjectDetail,pathparams)}>
                                {basicData.projectName}
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{basicData.toolName}</Breadcrumb.Item>
                    </Breadcrumb>} showBackButton onBackButtonClick={history.goBack} />
                    <Content.Body>
                        <div>
                            <Upload action="https://run.mocky.io/v3/68ed7204-0487-4135-857d-0e4366b2cfad">
                                <Button type="primary" loading={uploading}>
                                    <Localized id="compliance-clickUpdate"></Localized>
                                </Button>
                            </Upload>
                            <Button style={{ marginLeft: 20 }} disabled>
                                <Localized id="compliance-replaccecheck"></Localized>
                            </Button>
                        </div>
                        <Card style={{ marginTop: 20 }}>
                            <Card.Body title={<Localized id="dashboard-overview"></Localized>}>
                                <Row showSplitLine>
                                    <Col span={4}>
                                        <BlockTitle>
                                            <Localized id='compliance-totalCaseCount'></Localized>
                                        </BlockTitle>
                                        <div>
                                            <LargeFont>{toolDetailData?.toolItemBase?.toolResult.caseNumber||'--'}</LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col span={4}>
                                        <BlockTitle>
                                            <Localized id='compliance-checkPass'></Localized>
                                        </BlockTitle>
                                        <div>
                                            <LargeFont style={{ color: '#29cc85' }}>
                                                {toolDetailData?.toolItemBase?.toolResult.passNumber||'--'}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col span={4}>
                                        <BlockTitle>
                                            <Localized id='compliance-checkUnPass'></Localized>
                                        </BlockTitle>
                                        <div>
                                            <LargeFont style={{ color: '#ff584c' }}>
                                                {toolDetailData?.toolItemBase?.toolResult.unPassNumber||'--'}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col span={4}>
                                        <BlockTitle>
                                            <Localized id='compliance-unCheck'></Localized>
                                        </BlockTitle>
                                        <div>
                                            <LargeFont style={{ color: '#f28f2c' }}>
                                                {toolDetailData?.toolItemBase?.toolResult.unTestNumber||'--'}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col span={4}>
                                        <BlockTitle>
                                            <Localized id='compliance-igore'></Localized>
                                        </BlockTitle>
                                        <div>
                                            <LargeFont style={{ color: '#888888' }}>
                                                {toolDetailData?.toolItemBase?.toolResult.ignoreNumber||'--'}
                                            </LargeFont>
                                            <Localized id='dashboard-project-count-unit'></Localized>
                                        </div>
                                    </Col>
                                    <Col span={4}>
                                        <BlockTitle>
                                            <Localized id='compliance-check-passRate'></Localized>
                                        </BlockTitle>
                                        <div>
                                            <LargeFont>{(toolDetailData?.toolItemBase?.toolResult.passRate?.toString() + '%')}</LargeFont>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body title={<Localized id={"compliance-caseDetail"}></Localized>}>
                                <Table columns={toolListColumns} records={toolDetailData?.caseResult||[]}></Table>
                            </Card.Body>
                        </Card>
                    </Content.Body>
                </Content>
            </Body>
        </Layout>
    </>
}