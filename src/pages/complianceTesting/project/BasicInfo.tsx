import React, { } from 'react';
import { Card, Justify, Icon, Button, Row, Col, Table } from "@tencent/tea-component";
import style from '@emotion/styled/macro';
import { Localized, useGetMessage } from 'i18n';
import { Link } from 'react-router-dom';
import { generateLink, Pattern } from 'route';

const DetailListDom = style.div`
    display: flex;
    margin-top: 10px;
`;
const DetailListDomTitle = style.div`
    width:80px;
    color:#ccc;
`;
const CheckStatusWords = style.div`
    color:orange;
    margin-left: 10px;
`;
const OverviewTitle = style.div`
    height:30px
`;
const BlockTitle = style.div`
    color:#888
`;
const LargeFont = style.span`
    font-family: "TCloud Number";
    font-weight: 700;
    font-size: 40px;
    margin-right: 5px;
`;

type ProjectDetailType = {
    projectDetail: any
}

export const BasicInfo: React.FC<ProjectDetailType> = ({ projectDetail }) => {

    const getValue = useGetMessage();
    const toolListColumns = [
        {
            key: "name",
            header: getValue('column-tool')
        }, {
            key: "status",
            header: getValue('column-taskStatus'),
            render: (value:any) => {
                switch (value.status){
                    case 1: return <span style={{color:'#29cc85'}}><Localized id="compliance-checkPass"></Localized></span>;
                    case 2: return <span style={{color:'#ff584c'}}><Localized id="compliance-checkUnPass"></Localized></span>;
                    case 3: return <span style={{color:'#f28f2c'}}><Localized id="compliance-unCheck"></Localized></span>;
                    case 4: return <span style={{color:'#888'}}><Localized id="compliance-igore"></Localized></span>;
                }
            }
        }, {
            key: "dutyUser",
            header: getValue('column-dutyUser')
        }, {
            key: "caseNumber",
            header: getValue('column-caseCount'),
            render: (value: any) => {
                return <div>{value.toolResult.caseNumber}</div>
            }
        }, {
            key: "passRate",
            header: getValue('column-passRate'),
            render: (value: any) => {
                return <div>{value.toolResult.passRate + '%'}</div>
            }
        }, {
            key: "checkResultInfo",
            header: getValue('column-checkResultInfo'),
            width:200,
            render:(value:any)=>{
                return  <div>
                    <Icon type="success" /><span style={{padding:5}}>{value.toolResult.passNumber}</span>
                    <Icon type="error" /><span style={{padding:5}}>{value.toolResult.unPassNumber}</span>
                    <Icon type="pending" /><span style={{padding:5}}>{value.toolResult.unTestNumber}</span>
                    <Icon type="pending-gray" /><span style={{padding:5}}>{value.toolResult.ignoreNumber}</span>
                </div>
            }
        }, {
            key: "operation",
            header: getValue('column-operation'),
            render: (value:any) => {
                const pathparams = {
                    toolId:value?.id,
                    projectId:value?.projectId
                }
                return <Link to={generateLink(Pattern.ComplianceTestingToolDetail,pathparams)}><Localized id='see-detail'></Localized></Link>
            }
        }
    ];
    const renderCheckStatus = () => {

        switch (projectDetail.projectResult?.taskStatus) {
            case 1:
                return <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon type={'success'} size="l" />
                    <CheckStatusWords style={{ fontSize: 16 }}><Localized id='studio-myProject-checkPass'></Localized></CheckStatusWords>
                </div>
            case 2:
                return <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon type={'error'} size="l" />
                    <CheckStatusWords style={{ fontSize: 16 }}><Localized id='studio-myProject-checkUnPass'></Localized></CheckStatusWords>
                </div>
            case 3:
                return <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon type={'warning'} size="l" />
                    <CheckStatusWords style={{ fontSize: 16 }}><Localized id='enum-status-checking'></Localized></CheckStatusWords>
                </div>
        }
        return <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon type={'warning'} size="l" />
            <CheckStatusWords style={{ fontSize: 16 }}><Localized id='enum-status-checking'></Localized></CheckStatusWords>
        </div>
    };
    return <div>
        <Card>
            <Card.Body title={<Localized id="compliance-basicInfo"></Localized>}>
                <Row showSplitLine>
                    <Col span={12}>
                        <DetailListDom>
                            <DetailListDomTitle><Localized id={'column-projectName'}></Localized></DetailListDomTitle>
                            <div>{projectDetail?.projectResult?.name || '--'}</div>
                        </DetailListDom>
                        <DetailListDom>
                            <DetailListDomTitle><Localized id={'column-submitTime'}></Localized></DetailListDomTitle>
                            <div>{projectDetail?.projectResult?.submitTime || '--'}</div>
                        </DetailListDom>
                        <DetailListDom>
                            <DetailListDomTitle><Localized id={'column-dutyUser'}></Localized></DetailListDomTitle>
                            <div>{projectDetail?.projectResult?.dutyUser || '--'}</div>
                        </DetailListDom>
                    </Col>
                    <Col span={12}>
                        <DetailListDom>
                            <DetailListDomTitle>
                                <Localized id={'column-lawStandard'}></Localized>
                            </DetailListDomTitle>
                            <Link to={generateLink(Pattern.ComplianceTestingProject)}>
                                <div>{projectDetail?.projectResult?.lawStandard || '--'}</div>
                            </Link>
                        </DetailListDom>
                        <DetailListDom>
                            <DetailListDomTitle><Localized id={'column-module'}></Localized></DetailListDomTitle>
                            <div>{projectDetail?.projectResult?.module || '--'}</div>
                        </DetailListDom>
                        <DetailListDom>
                            <DetailListDomTitle><Localized id={'column-carModel'}></Localized></DetailListDomTitle>
                            <div>{projectDetail?.projectResult?.carModel || '--'}</div>
                        </DetailListDom>
                        <DetailListDom>
                            <DetailListDomTitle><Localized id={'column-version'}></Localized></DetailListDomTitle>
                            <div>{projectDetail?.projectResult?.version || '--'}</div>
                        </DetailListDom>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
        <Card>
            <Card.Header style={{ padding: 20 }}>
                <Justify left={renderCheckStatus()}
                    right={
                        <Button type={'primary'}>
                            <Localized id={"compliance-stopCheckingTask"}></Localized>
                        </Button>
                    }
                ></Justify>
            </Card.Header>
            <Card.Body>
                <OverviewTitle>
                    <h3><Localized id="project-title-overview"></Localized></h3>
                </OverviewTitle>
                <Row showSplitLine>
                    <Col span={4}>
                        <BlockTitle>
                            <Localized id='compliance-totalCaseCount'></Localized>
                        </BlockTitle>
                        <div>
                            <LargeFont>{projectDetail?.projectResult?.testResult?.caseNumber}</LargeFont>
                            <Localized id='dashboard-project-count-unit'></Localized>
                        </div>
                    </Col>
                    <Col span={4}>
                        <BlockTitle>
                            <Localized id='compliance-checkPass'></Localized>
                        </BlockTitle>
                        <div>
                            <LargeFont style={{ color: '#29cc85' }}>
                                {projectDetail?.projectResult?.testResult?.passNumber}
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
                                {projectDetail?.projectResult?.testResult?.unPassNumber}
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
                                {projectDetail?.projectResult?.testResult?.unTestNumber}
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
                                {projectDetail?.projectResult?.testResult?.ignoreNumber}
                            </LargeFont>
                            <Localized id='dashboard-project-count-unit'></Localized>
                        </div>
                    </Col>
                    <Col span={4}>
                        <BlockTitle>
                            <Localized id='compliance-check-passRate'></Localized>
                        </BlockTitle>
                        <div>
                            <LargeFont>
                                {projectDetail?.projectResult?.testResult?.passRate}
                            </LargeFont>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
        <Card>
            <Card.Body title={<Localized id={"compliance-checkDetail"}></Localized>}>
                <Table columns={toolListColumns} records={projectDetail?.toolResult as [] || []}></Table>
            </Card.Body>
        </Card>
    </div>

}