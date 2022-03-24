import React, { useEffect, useState } from "react";
import style from '@emotion/styled/macro';
import { Localized } from 'i18n';
import { Loading } from '../case/loading';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Layout, Card, Row, H3, Col } from '@tencent/tea-component';
import { useCaseAllInfoQuery } from 'generated/graphql';
const MarkdownRender = React.lazy(() => import('../case/markDownRender'));

interface CaseDetail {


}
interface ProjectMatch {
    caseId: string
}

const TitleDisplay = style.div`
    width:120px;
    color: #888;
`;
const ContentDisplay = style.div`
    width:100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const Display = style.div`
    display: flex;
    width: 100%;
    align-items: center;
    height:30px;
`;
const MdTitle = style.div`
    padding: 20px;
    border-bottom: 1px solid #ddd;

`;
const MdContent = style.div`
    padding: 20px;
`;

const { Content, Body } = Layout;
export const Page: React.FC<CaseDetail> = (props) => {
    const history = useHistory();
    const pageParam = useRouteMatch<ProjectMatch>().params;
    const caseId = pageParam.caseId;
    const caseDetailHook = useCaseAllInfoQuery({
        variables: {
            caseId: caseId
        }
    });
    const [caseDetail, setCaseDetail] = useState<any>({});
    useEffect(() => {
        if (caseDetailHook.data?.caseAllInfo) {
            console.log(caseDetailHook.data.caseAllInfo);
            setCaseDetail(caseDetailHook.data.caseAllInfo);
        }
    }, [caseDetailHook])

    return <>
        <Body>
            <Content>
                <Content.Header showBackButton onBackButtonClick={history.goBack}
                    title={caseDetail?.caseBaseInfo?.name || ''}
                ></Content.Header>
                <Content.Body full>
                    <Card>
                        <Card.Body title={'基本信息'}>
                            <Row showSplitLine>
                                <Col span={8}>
                                    <Display>
                                        <TitleDisplay>
                                            用例编号
                                        </TitleDisplay>
                                        <ContentDisplay>
                                            {caseDetail?.caseBaseInfo?.serialNumber || ''}
                                        </ContentDisplay>
                                    </Display>
                                    <Display>
                                        <TitleDisplay>
                                            用例名称
                                        </TitleDisplay>
                                        <ContentDisplay>
                                            {caseDetail?.caseBaseInfo?.name || ''}
                                        </ContentDisplay>
                                    </Display>
                                    <Display title={caseDetail?.caseBaseInfo?.caseDesc || ''}>
                                        <TitleDisplay>
                                            描述
                                        </TitleDisplay>
                                        <ContentDisplay>
                                            {caseDetail?.caseBaseInfo?.caseDesc || ''}
                                        </ContentDisplay>
                                    </Display>
                                    <Display title={caseDetail?.caseBaseInfo?.remediation || ''}>
                                        <TitleDisplay>
                                            修复建议
                                        </TitleDisplay>
                                        <ContentDisplay>
                                            {caseDetail?.caseBaseInfo?.remediation || ''}
                                        </ContentDisplay>
                                    </Display>
                                </Col>
                                <Col span={8}>
                                    <Display>
                                        <TitleDisplay>
                                            领域
                                        </TitleDisplay>
                                        <ContentDisplay>
                                            {caseDetail?.caseBaseInfo?.territoryName || ''}
                                        </ContentDisplay>
                                    </Display>
                                    <Display>
                                        <TitleDisplay>
                                            分类
                                        </TitleDisplay>
                                        <ContentDisplay>
                                            {caseDetail?.caseBaseInfo?.classifyName || ''}
                                        </ContentDisplay>
                                    </Display>
                                    <Display>
                                        <TitleDisplay>
                                            操作系统
                                        </TitleDisplay>
                                        <ContentDisplay>
                                            {caseDetail?.caseBaseInfo?.operatingSystemName || ''}
                                        </ContentDisplay>
                                    </Display>
                                    <Display>
                                        <TitleDisplay>
                                        测试类型
                                        </TitleDisplay>
                                        <ContentDisplay>
                                            {caseDetail?.caseBaseInfo?.testMethodName || ''}
                                        </ContentDisplay>
                                    </Display>
                                </Col>
                                <Col span={8}>
                                    <Display>
                                        <TitleDisplay>
                                            风险程度
                                        </TitleDisplay>
                                        <ContentDisplay style={{ color: caseDetail?.caseBaseInfo?.riskLevelType === 'high' ? 'red' : caseDetail?.caseBaseInfo?.riskLevelType === 'warn' ? '#EC9405' : 'black' }}>
                                            {caseDetail?.caseBaseInfo?.riskLevelName || ''}
                                        </ContentDisplay>
                                    </Display>
                                    <Display>
                                        <TitleDisplay>
                                            创建时间
                                        </TitleDisplay>
                                        <ContentDisplay>
                                            {caseDetail?.caseBaseInfo?.submitTime || ''}
                                        </ContentDisplay>
                                    </Display>
                                    <Display>
                                        <TitleDisplay>
                                            创建人
                                        </TitleDisplay>
                                        <ContentDisplay>
                                            {caseDetail?.caseBaseInfo?.submitUserName || ''}
                                        </ContentDisplay>
                                    </Display>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    {
                        !caseDetail?.caseBaseInfo?.canModify ? <>
                            <Card >
                                <MdTitle>
                                    <H3>合规要求</H3>
                                </MdTitle>
                                <MdContent style={{ maxHeight: 240, overflow: 'auto' }}>
                                    {
                                        caseDetail?.complianceRequire?.map((value: any, key: any) => {
                                            return <div key={key}>
                                                <Row>
                                                    <Col span={2}>
                                                        <p style={{ color: '#888888' }}>
                                                            法规名称
                                                        </p>
                                                    </Col>
                                                    <Col span={22}>
                                                        <p style={{ whiteSpace: 'break-spaces', lineHeight: '20px' }}>
                                                            {value.lawName || ''}
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={2}>
                                                        <p style={{ color: '#888888' }}>
                                                            <Localized id="compliance-categray"></Localized>
                                                        </p>
                                                    </Col>
                                                    <Col span={22}>
                                                        <p style={{ whiteSpace: 'break-spaces', lineHeight: '20px' }}>
                                                            {value.dutyLawClassify1 || ''}
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={2}>
                                                        <p style={{ color: '#888888' }}>
                                                            <Localized id="column-require"></Localized>
                                                        </p>
                                                    </Col>
                                                    <Col span={22}>
                                                        <p style={{ whiteSpace: 'break-spaces', lineHeight: '20px' }}>
                                                            {value.dutyLawCatalogueName || ''}
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={2}>
                                                        <p style={{ color: '#888888' }}>
                                                            <Localized id="compliance-testMethod"></Localized>
                                                        </p>
                                                    </Col>
                                                    <Col span={22}>
                                                        <p style={{ whiteSpace: 'break-spaces', lineHeight: '20px' }}>
                                                            {value.description || ''}
                                                        </p>
                                                    </Col>
                                                </Row>
                                                {
                                                    caseDetail?.complianceRequire.length > 1 && key + 1 < caseDetail?.complianceRequire.length ?
                                                        <div style={{ borderBottom: '1px solid #ddd', marginTop: 20, marginBottom: 20, height: 1 }}></div> :
                                                        <></>
                                                }
                                            </div>
                                        })
                                    }
                                </MdContent>
                            </Card>
                        </> : null
                    }
                    <Card>
                        <MdTitle>
                            <H3>用例测试过程</H3>
                        </MdTitle>
                        <div style={{ lineHeight: '30px' }}>
                            <React.Suspense fallback={<Loading></Loading>}>
                                <MarkdownRender value={caseDetail.caseTestProcess}></MarkdownRender>
                            </React.Suspense>
                        </div>
                    </Card>
                </Content.Body>
            </Content>
        </Body>
    </>
}