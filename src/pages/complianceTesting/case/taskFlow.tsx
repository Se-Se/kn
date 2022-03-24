import React, { useEffect, useState } from 'react';
import style from '@emotion/styled/macro';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Layout, notification, Row, Col, H3, Button, Icon, Bubble, Card } from '@tencent/tea-component';
import { useGetCaseAllStepQuery, useGetCatalogueDetailQuery, useChangeCaseStatusMutation } from 'generated/graphql';
import { StatusControl } from '../case/statusControl';
import { CaseRender } from '../case/caseRender';
import { StepList } from './stepList';
import { Localized, useGetMessage } from 'i18n';
import { generateLink, Pattern, ParamType } from 'route';
import icon_success from './../../../icons/Status/success.svg';
import icon_error from './../../../icons/Status/error.svg';
import icon_pending_gray from './../../../icons/Status/pending-gray.svg';
import icon_infoblue from './../../../icons/Status/infoblue.svg';
import icon_warning from './../../../icons/Status/warning.svg';

const workFlowLink = (params: ParamType[Pattern.ComplianceTestingProjectOverView]) => generateLink(Pattern.ComplianceTestingProjectOverView, params);

const { Content, Body } = Layout;

const MenuContainer = style.div`
    width:200px;
    border-right:1px solid #e7eaef;
    min-height: calc(100vh - 220px);
    max-height: calc(100vh - 70px);
`;
const StepContainer = style.div`
    width:calc(100% - 200px);
    max-height: calc(100vh - 170px);
`;
const CaseContainer = style.div`
    display:flex;
    width: 100%;
    height: calc(100% - 160px);
`;
const HeaderCard = style.div`
    min-height: 50px;
    height:auto;
    padding-left:20px;
    padding-right:20px;
    background: #FFFFFF;
    justify-content: space-between;
    z-index:10;
    align-items: center;
    border: 1px solid #DDDDDD;
`
const StatusCared = style.div`
    height: 55px;
    background: white;
    margin-bottom: 20px;
    border: 1px solid #DDDDDD;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    padding-left: 20px;
    align-items: center;
`
const CollapseTitle = style.div`
    display: flex;
    justify-content: space-between;
`

interface ProjectMatch {
    caseId: string
    lawCatalogueId: string
    projectId: string
}


export const Page: React.FC = () => {

    const pageParam = useRouteMatch<ProjectMatch>().params;
    const history = useHistory();
    const getValue = useGetMessage();

    const teamId = 'team_items;1';
    const caseId = pageParam.caseId;
    const projectId = pageParam.projectId;

    const lawCatalogueId = pageParam.lawCatalogueId;

    const _dataHook = useGetCaseAllStepQuery({
        variables: {
            teamId: teamId,
            caseId: caseId,
            projectId: projectId
        }, fetchPolicy: 'network-only'
    });
    const categrayHook = useGetCatalogueDetailQuery({
        variables: {
            caseId: caseId
        }
    });
    const [changeCaseStatusFn] = useChangeCaseStatusMutation();

    const [selectStep, setSelectStep] = useState<string>('');
    const [stepList, setStepList] = useState<any>([]);
    const [categrayInfo, setCategrayInof] = useState<any>();
    const [currentStatus, setCurrentStatus] = useState<any>(1);
    const [currentStep, setCurrentStep] = useState<any>(0);
    const [heartBeatResult, setHeartBeatResult] = useState<any>();
    // const [effectStep, setEffectStep] = useState<number>();
    const [selectItem, setSelectItem] = useState<any>(0);
    const [isFirstCheck, setIsFirstCheck] = useState<boolean>(true);
    const [, setHeartBeatStatus] = useState(true);
    const [refetchRemark, setRefetchRemark] = useState<number>(0);

    const [casePassUsable, setCasePassUsable] = useState<boolean>(false);

    const [tickResult, setTickResult] = useState<any>();
    const [isShowPanel, setIsShowPanel] = useState<boolean>(false);

    const renderNextStep = () => {
        for (let i = 0; i < stepList.length; i++) {
            if (stepList[i].stepId === selectStep && i < stepList.length - 1) {
                setSelectStep(stepList[i + 1].stepId);
                setSelectItem(i + 1)
            }
        }
    }
    const renderLawPanel = () => {
        return categrayHook.data?.getCatalogueDetail?.map((value: any, key: any) => {
            return <div key={key} style={{borderBottom:"1px solid #ddd",paddingBottom:10,paddingTop:10}}>
                <Row>
                    <Col span={2}>
                        <p style={{ color: '#888888' }}>
                            法规名称
                        </p>
                    </Col>
                    <Col span={22}>
                        <p style={{ whiteSpace: 'break-spaces', lineHeight: '20px' }}>
                            {value.lawName}
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
                            {value.dutyLawClassify1}
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col span={2}>
                        <p style={{ color: '#888888' }}>
                            技术要求
                        </p>
                    </Col>
                    <Col span={22}>
                        <p style={{ whiteSpace: 'break-spaces', lineHeight: '20px' }}>
                            {value.dutyLawCatalogueName}
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col span={2}>
                        <p style={{ color: '#888888' }}>
                            测试方法
                        </p>
                    </Col>
                    <Col span={22}>
                        <p style={{ whiteSpace: 'break-spaces', lineHeight: '20px' }}>
                            {value.description}
                        </p>
                    </Col>
                </Row>
            </div>
        })
    }
    useEffect(() => {
        if (_dataHook.data?.getCaseAllStep?.stepInfoList) {
            setStepList(_dataHook.data.getCaseAllStep.stepInfoList);
            // if(_dataHook.data.getCaseAllStep[0] feature-case=null){
            setSelectStep(_dataHook.data.getCaseAllStep.stepInfoList[0]?.stepId || '');
            // setSelectStep(_dataHook.data.getCaseAllStep.stepInfoList[0]?.stepId || '');
            if (_dataHook.data.getCaseAllStep.projectStatus === 3) {
                setCasePassUsable(true);
            }
            if (_dataHook.data?.getCaseAllStep?.caseStatus === 3) {
                setIsShowPanel(true);
            }
            // }
        }
    }, [_dataHook.data?.getCaseAllStep])
    useEffect(() => {
    }, [selectStep])
    useEffect(() => {
        setCategrayInof(categrayHook.data?.getCatalogueDetail);
        console.log(categrayHook.data);
    }, [categrayHook.data])

    useEffect(() => {
        if (isFirstCheck && currentStep > 0 && stepList[currentStep]) {
            setSelectStep(stepList[currentStep].stepId);
            setSelectItem(currentStep);
            setIsFirstCheck(false);
        }
        if (isFirstCheck && currentStep === stepList.length && stepList[currentStep - 1]) {
            setSelectStep(stepList[currentStep - 1].stepId);
            setSelectItem(currentStep - 1);;
            setIsFirstCheck(false);
        }
    }, [currentStep])

    // useEffect(() => {
    //     analysiResult(tickResult)
    // }, [tickResult])


    // const analysiResult = (tickResult: any) => {
    //     // console.log(tickResult);
    // }

    const setCaseStutas = async (cmd: number) => {

        await changeCaseStatusFn({ variables: { teamId: teamId, caseId: caseId, projectId: projectId, cmd: cmd } })
            .then(() => {
                switch (cmd) {
                    case 4:
                        notification.success({
                            description: getValue('用例已忽略')
                        }); break;
                    case 3:
                        notification.error({
                            description: getValue('用例不通过')
                        }); break;
                    case 2:
                        notification.success({
                            description: getValue('用例已通过')
                        }); break;
                }
            })
            .catch((error) => {
                notification.error({
                    description: error.toString()
                })
            })
        if (cmd !== 1) {
            setTimeout(() => {
                history.push(workFlowLink({ projectId: projectId }));
            }, 1000);
        }
        else {
            setSelectStep(stepList[0].stepId);
            setSelectItem(0);
            setRefetchRemark(Date.now())
        }
        _dataHook.refetch()
    }

    const renderCaseStatus = (status: any) => {

        switch (status) {
            case 1: return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Bubble content={'重置状态后，可以更改用例通过状态，检测步骤将不会被影响'}>
                    <Button disabled={!casePassUsable} onClick={() => { setCaseStutas(1) }}>重置状态</Button>
                </Bubble>

            </div>;
            case 2: return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Bubble content={'重置状态后，可以更改用例通过状态，检测步骤将不会被影响'}>
                    <Button disabled={!casePassUsable} onClick={() => { setCaseStutas(1) }}>重置状态</Button>
                </Bubble>

            </div>;
            case 3: return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Button disabled={!casePassUsable} onClick={() => { setCaseStutas(4) }}><Localized id="compliance-ignore"></Localized></Button>
                <Button disabled={!casePassUsable} onClick={() => { setCaseStutas(3) }}><Localized id="compliance-unpass"></Localized></Button>
                <Button disabled={!casePassUsable} onClick={() => { setCaseStutas(2) }} type="primary"><Localized id="compliance-pass"></Localized></Button>

            </div>;
            case 4: return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Bubble content={'重置状态后，可以更改用例通过状态，检测步骤将不会被影响'}>
                    <Button disabled={!casePassUsable} onClick={() => { setCaseStutas(1) }}>重置状态</Button>
                </Bubble>

            </div>;
            case 5: return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Button disabled={!casePassUsable} onClick={() => { setCaseStutas(4) }}><Localized id="compliance-ignore"></Localized></Button>
                <Button disabled={!casePassUsable} onClick={() => { setCaseStutas(3) }}><Localized id="compliance-unpass"></Localized></Button>
                <Button disabled={!casePassUsable} onClick={() => { setCaseStutas(2) }} type="primary"><Localized id="compliance-pass"></Localized></Button>

            </div>;
        }

    }
    const renderCaseStatusArea = (status: any) => {

        switch (status) {
            case 1: return <StatusCared style={{ background: '#E6F8EE', border: '1px solid #9CE4BC' }}>
                <img style={{ width: 20 }} src={icon_success} alt='' ></img>
                <span style={{ fontSize: 12, marginLeft: 10 }}>
                    <Localized id="compliance-checkPass"></Localized>
                </span>

            </StatusCared>;
            case 2: return <StatusCared>
                <img style={{ width: 20 }} src={icon_error} alt='' ></img>
                <span style={{ fontSize: 12, marginLeft: 10 }}>
                    <Localized id="compliance-checkUnPass"></Localized>
                </span>

            </StatusCared>;
            case 3: return <StatusCared>
                <img style={{ width: 20 }} src={icon_pending_gray} alt='' ></img>
                <span style={{ fontSize: 12, marginLeft: 10 }}>
                    <Localized id="compliance-unCheck"></Localized>
                </span>

            </StatusCared>;
            case 4: return <StatusCared style={{ background: 'rgb(213, 231, 255)' }}>
                <img style={{ width: 20 }} src={icon_infoblue} alt='' ></img>
                <span style={{ fontSize: 12, marginLeft: 10 }}>
                    <Localized id="compliance-igore"></Localized>
                </span>

            </StatusCared>;
            case 5: return <StatusCared>
                <img style={{ width: 20 }} src={icon_warning} alt='' ></img>
                <span style={{ fontSize: 12, marginLeft: 10 }}>
                    <Localized id="studio-myProject-checking"></Localized>
                </span>
            </StatusCared>;
        }

    }

    return (<>
        <StatusControl
            setTickResult={setTickResult}
            setCurrentStatus={setCurrentStatus}
            setHeartBeatStatus={setHeartBeatStatus}
            setCurrentStep={setCurrentStep}
            setHeartBeatResult={setHeartBeatResult}
            teamId={teamId} projectId={projectId} caseId={caseId} stepId={selectStep}>
            <Body>
                <Content>
                    <Content.Header title={_dataHook.data?.getCaseAllStep?.caseName || ''}
                        showBackButton onBackButtonClick={()=>{
                            history.push(workFlowLink({projectId:projectId}));
                        }}
                        operation={<>
                            {renderCaseStatus(_dataHook.data?.getCaseAllStep?.caseStatus)}
                        </>}
                    ></Content.Header>
                    <Content.Body full>
                        <div>
                            {
                                renderCaseStatusArea(_dataHook.data?.getCaseAllStep?.caseStatus)
                            }
                            <HeaderCard>
                                <CollapseTitle style={{ padding: '20px 0px' }}>
                                    <H3>合规要求</H3>
                                    <div>
                                        <span style={{ cursor: 'pointer' }} onClick={() => {
                                            setIsShowPanel(!isShowPanel);
                                        }} >{isShowPanel ? '收起' : '详情'}</span>
                                        {isShowPanel ? <Icon type="arrowup" /> : <Icon type="arrowdown" />}
                                    </div>
                                </CollapseTitle>
                                <div style={{ paddingBottom: 20,display: isShowPanel ? 'block' : 'none' }} >
                                    {
                                        renderLawPanel()
                                    }
                                </div>
                            </HeaderCard>
                            <Card style={{ marginTop: 20, marginBottom: 20 }}>
                                <Card.Header>
                                    <H3>测试执行</H3>
                                </Card.Header>
                                <Card.Body style={{ padding: 0 }}>
                                    <CaseContainer>
                                        <MenuContainer>
                                            <StepList setSelectItem={setSelectItem} selectItem={selectItem} current={currentStep} stepList={stepList} setSelectStep={setSelectStep}></StepList>
                                        </MenuContainer>
                                        <StepContainer>
                                            <CaseRender renderNextStep={renderNextStep}
                                                setHeartBeatResult={setHeartBeatResult}
                                                heartBeatResult={heartBeatResult}
                                                stepId={selectStep}
                                                isLast={selectItem === stepList.length - 1}
                                                refetchRemark={refetchRemark}
                                                // isControlUseable={tickResult?.caseEnable||false}
                                                currentStatus={currentStatus}
                                                tickResult={tickResult}
                                                setCaseStutas={setCaseStutas}
                                            >
                                            </CaseRender>
                                        </StepContainer>
                                    </CaseContainer>
                                </Card.Body>
                            </Card>
                        </div>
                    </Content.Body>
                </Content>
            </Body>
        </StatusControl>
    </>
    );
}