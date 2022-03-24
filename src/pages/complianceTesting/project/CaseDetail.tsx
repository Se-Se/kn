import React, { } from 'react';
import { Breadcrumb, Layout, Button, Card, Justify, TabPanel, Tabs, Table, Icon, Radio } from "@tencent/tea-component";
import { Link,useRouteMatch } from 'react-router-dom';
import { Localized, useGetMessage } from 'i18n';
import { generateLink, Pattern,ParamType } from 'route';
import { useHistory } from 'react-router-dom';
import style from '@emotion/styled/macro';
import {useCaseResultDetailQuery} from 'generated/graphql';

const workFlowLink = (params: ParamType[Pattern.ComplianceTestingCaseWorkFlow]) => generateLink(Pattern.ComplianceTestingCaseWorkFlow, params);

const { Body, Content } = Layout;
interface ProjectMatch {
    projectId: string
    caseId:string
}
const CheckStatusWords = style.div`
    color:orange;
    margin-left: 10px;
`;
const OverviewTitle = style.div`
    height:30px;
    width:100px;
    color:#888;
`;
const SplitLine = style.div`
    width:100%;
    height: 1px;
    border-bottom: 1px solid #ccc;
`;
const OverviewLine = style.div`
    display:flex;
`;
const { pageable} = Table.addons;
export const Page: React.FC = () => {
    const getValue = useGetMessage();
    const history = useHistory();
    const pageParam = useRouteMatch<ProjectMatch>().params;
    
    
    const teamId = "team_items;1";
    const caseId = pageParam.caseId;
    const projectId = pageParam.projectId;

    const pathparams = {
        projectId:projectId
    }

    const caseDetailData = useCaseResultDetailQuery({variables:{teamId:teamId,caseId:caseId,projectId:projectId}}).data?.caseResultDetail;

    const tabs = [
        { id: "projectDetail", label: <Localized id="compliance-caseDetail"></Localized> },
        { id: "projecReport", label: <Localized id="compliance-modifyHistory"></Localized> }
    ];
    const toolListColumns = [
        {
            key: "modifyTime",
            header: getValue('column-modifyTime')
        }, {
            key: "modifyUser",
            header: getValue('column-modifyUser')
        }, {
            key: "modifyObject",
            header: getValue('column-modifyObject')
        }, {
            key: "modifyItem",
            header: getValue('column-modifyItem')
        }
    ];
    const toolListData = [
        {
            id: 'id',
            modifyTime: 'modifyTime',
            modifyUser: 'modifyUser',
            modifyObject: 'modifyObject',
            modifyItem: 'modifyItem'
        }
    ];
    const goToWorkFlow = ()=>{
        history.push(workFlowLink({caseId:caseId,projectId:projectId}));
    }

    const renderCheckStatus = <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon
            type={'warning'}
            size="l"
        />
        <CheckStatusWords style={{ fontSize: 16 }}><Localized id='enum-status-checking'></Localized></CheckStatusWords>
    </div>
    return <>
        <Layout>
            <Body>
                <Content>
                    <Content.Header title={
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to={generateLink(Pattern.ComplianceTestingProject)}>
                                    <Localized id="compliance-checkProject"></Localized>
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to={generateLink(Pattern.ComplianceTestingProjectDetail,pathparams)}>
                                    {caseDetailData?.projectName}
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>{caseDetailData?.caseName||'--'}</Breadcrumb.Item>
                        </Breadcrumb>} showBackButton onBackButtonClick={history.goBack} />
                    <Content.Body>
                        <Tabs tabs={tabs} ceiling>
                            <TabPanel id="projectDetail">
                                <Card>
                                    <Card.Header style={{ padding: 20 }}>
                                        <Justify left={renderCheckStatus}
                                            right={
                                                <Button>
                                                    <Localized id={"compliance-ignoreItem"}></Localized>
                                                </Button>
                                            }
                                        ></Justify>
                                    </Card.Header>
                                    <Card.Body style={{ paddingBottom: 0 }} title={<Localized id="compliance-basicInfo"></Localized>}>
                                        <OverviewLine>
                                            <OverviewTitle>
                                                <Localized id="compliance-caseName"></Localized>
                                            </OverviewTitle>
                                            <span>
                                                {caseDetailData?.caseName||'--'}
                                            </span>
                                        </OverviewLine>
                                        <SplitLine></SplitLine>
                                    </Card.Body>
                                    <Card.Body style={{ paddingBottom: 0 }} title={<Localized id="compliance-belongLaw"></Localized>}>
                                        <OverviewLine>
                                            <OverviewTitle>
                                                <Localized id="compliance-categray"></Localized>
                                            </OverviewTitle>
                                            <span>
                                                {caseDetailData?.dutyLawClassify1||'--'}
                                            </span>
                                        </OverviewLine>
                                        <OverviewLine>
                                            <OverviewTitle>
                                                <Localized id="compliance-subCategray"></Localized>
                                            </OverviewTitle>
                                            <span>
                                                {caseDetailData?.dutyLawClassify2||'--'}
                                            </span>
                                        </OverviewLine>
                                        <OverviewLine>
                                            <OverviewTitle>
                                                <Localized id="compliance-contentName"></Localized>
                                            </OverviewTitle>
                                            <span>
                                                {caseDetailData?.dutyLawName||'--'}
                                            </span>
                                        </OverviewLine>
                                        <SplitLine></SplitLine>
                                    </Card.Body>
                                    <Card.Body style={{ paddingBottom: 0 }} title={<Localized id="compliance-checkMethod"></Localized>}>
                                        <OverviewLine>
                                            <OverviewTitle>
                                                <Localized id="compliance-testMethod"></Localized>
                                            </OverviewTitle>
                                            <span>
                                                {caseDetailData?.checkMethod||'--'}
                                            </span>
                                        </OverviewLine>
                                        <OverviewLine>
                                            <OverviewTitle>
                                                <Localized id="compliance-testCase"></Localized>
                                            </OverviewTitle>
                                            <span>
                                                {caseDetailData?.dutyLawCatalogueName||'--'}
                                            </span>
                                        </OverviewLine>
                                        <SplitLine></SplitLine>
                                    </Card.Body>
                                    <Card.Body title={<Localized id="compliance-submitTestResult"></Localized>}>
                                        <OverviewLine>
                                            <OverviewTitle>
                                                <Localized id="compliance-acceptanceStandard"></Localized>
                                            </OverviewTitle>
                                            <span>
                                                {caseDetailData?.dutyLawCatalogueName||'--'}
                                            </span>
                                        </OverviewLine>
                                        <OverviewLine>
                                            <OverviewTitle>
                                                <Localized id="compliance-fillResult"></Localized>
                                            </OverviewTitle>
                                            <div>
                                                <Radio.Group layout="column">
                                                    <Radio name="prepaid"> {caseDetailData?.resultFail||'--'}</Radio>
                                                    <Radio name="billing"> {caseDetailData?.resultSuccess||'--'}</Radio>
                                                </Radio.Group>
                                            </div>
                                        </OverviewLine>
                                        <div style={{marginTop:20}}>
                                            <Button type="primary" onClick={goToWorkFlow}>
                                                <Localized id="compliance-submitTest"></Localized>
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </TabPanel>
                            <TabPanel id="projecReport">
                                <Card>
                                    <Table columns={toolListColumns} records={toolListData} addons={[ pageable()]}></Table>
                                </Card>
                            </TabPanel>
                        </Tabs>
                    </Content.Body>
                </Content>
            </Body>
        </Layout>
    </>
}