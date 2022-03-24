import React from 'react';
import { Breadcrumb, Layout, Tabs, TabPanel } from "@tencent/tea-component";
import { useHistory, Link, useRouteMatch } from 'react-router-dom';
import { generateLink, Pattern } from 'route';
import { Localized } from '@fluent/react';
import { BasicInfo } from './BasicInfo';
import { Modify } from './Modify';
import { Report } from './Report';
import { useProjectDetailsQuery } from 'generated/graphql';

const { Body, Content } = Layout;
interface ProjectMatch {
    projectId: string
}

export const Page: React.FC = (props) => {
    const pageParam = useRouteMatch<ProjectMatch>().params;
    const teamId = 'team_items;1';
    const projectId = pageParam.projectId;
    const history = useHistory();
    const tabs = [
        { id: "projectDetail", label: <Localized id="compliance-projectDetail"></Localized> },
        { id: "projecReport", label: <Localized id="compliance-projecReport"></Localized> },
        { id: "modifyHistory", label: <Localized id="compliance-modifyHistory"></Localized> }
    ];

    const projectDetail = useProjectDetailsQuery({ variables: { teamId: teamId, projectId: projectId } }).data?.projectDetails || {};
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
                        <Breadcrumb.Item>{projectDetail?.projectResult?.name || '--'}</Breadcrumb.Item>
                    </Breadcrumb>} showBackButton onBackButtonClick={history.goBack} />
                    <Content.Body>
                        <Tabs tabs={tabs} ceiling>
                            <TabPanel id="projectDetail">
                                <BasicInfo projectDetail={projectDetail}></BasicInfo>
                            </TabPanel>
                            <TabPanel id="projecReport">
                                <Report projectDetail={projectDetail}></Report>
                            </TabPanel>
                            <TabPanel id="modifyHistory">
                                <Modify></Modify>
                            </TabPanel>
                        </Tabs>
                    </Content.Body>
                </Content>
            </Body>
        </Layout>
    </>

}