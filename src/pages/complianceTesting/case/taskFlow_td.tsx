import React, { useState, useMemo, useEffect } from 'react';
import style from '@emotion/styled/macro';
import { Layout, Breadcrumb, Button as TButton, DialogPlugin } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { CaseRender } from './caseRender_td';
import { StepList } from './stepList_td';
import { Button } from '@tencent/tea-component';
import iconChecked from './../../../image/projectStatus-checked.svg';
import icon_refresh from './../../../image/refresh.svg';
import icon_refresh_gray from './../../../image/refresh-gray.svg';
import { CaseBaseInfoModal } from './caseBaseInfoModal';
import { StatusControl } from './statusControl_td';
import { generateLink, Pattern, ParamType } from 'route';

import {
    useGetCaseDetailLazyQuery,
    useGetCaseStepDetailLazyQuery,
    useSaveStepInfoMutation,
    useSaveStepDialogInfoMutation,
    useResetStepCheckedResultMutation,
    useChangeCaseStatusMutation
} from 'generated/graphql';


const { Header, Footer, Content } = Layout;
const { BreadcrumbItem } = Breadcrumb;
const workFlowLink = (params: ParamType[Pattern.ProjectReport]) => generateLink(Pattern.ProjectReport, params);

interface ProjectMatch {
    caseId: string
    lawCatalogueId: string
    projectId: string
};

export const Page: React.FC = () => {
    const history = useHistory();

    const teamId = 'team_items;1';
    const pageParam = useRouteMatch<ProjectMatch>().params;
    const caseId = pageParam.caseId;
    const projectId = pageParam.projectId;

    const [showBaseInfo, setShowBaseInfo] = useState(false);
    const [isCollapse, setIsCollapse] = useState<boolean>(false);
    const [isDisableBtn,setIsDisableBtn] = useState<boolean>(true);

    const [getCaseDetail, caseDetailHook] = useGetCaseDetailLazyQuery();
    const [getCaseStepDetail, caseStepDetailHook] = useGetCaseStepDetailLazyQuery();

    const [caseName, setCaseName] = useState<string>('');
    const [caseStatus, setCaseStatus] = useState<number>(-1);

    const [stepList, setStepList] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const [currentStepInfo, setCurrentStepInfo] = useState<any>();
    const [currentStepId, setCurrentStepId] = useState<string>('');
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

    const [caseRemark, setCaseRemark] = useState<string>('');
    const [caseRsult, setCaseResult] = useState<string>('');

    const [heartBeatResult, setHeartBeatResult] = useState<any>();

    const [saveStep] = useSaveStepInfoMutation();
    const [saveDialogStep] = useSaveStepDialogInfoMutation();
    const [resetStep] = useResetStepCheckedResultMutation();
    const [changeCaseStatus] = useChangeCaseStatusMutation();

    const buttonClickHandle = async (buttonName: string, buttonType: string) => {

        let result = await saveStep({
            variables: {
                teamId: teamId,
                caseId: caseId,
                projectId: projectId,
                stepId: currentStepId,
                buttonName: buttonName,
                buttonType: buttonType,
                stepType: currentStepInfo.stepType,
                remark: caseRemark,
                result: caseRsult
            }
        })

        if (result.data && result.data.saveStepInfo && buttonType == 'next') {
            setActiveIndex(activeIndex + 1);
            // console.log(heartBeatResult);
            if (stepList[activeIndex + 1] && stepList[activeIndex + 1].stepId) {
                setCurrentStepId(stepList[activeIndex + 1].stepId);
            }
        }
        else if (result.data && result.data.saveStepInfo && (buttonType == 'pass' || buttonType == 'unpass')) {
            history.push(workFlowLink({ projectId: projectId, caseId: caseId }));

        }
    }
    const dialogButtonClickHandle = async (buttonName: string, buttonType: string, cancel: boolean) => {

        let result = await saveDialogStep({
            variables: {
                teamId: teamId,
                caseId: caseId,
                projectId: projectId,
                stepId: currentStepId,
                buttonName: buttonName,
                buttonType: buttonType,
                cancel: cancel
            }
        })

        if (result.data && result.data.saveStepDialogInfo && buttonType == 'next') {
            setActiveIndex(activeIndex + 1);
            // console.log(heartBeatResult);
            console.log(stepList);
            if (stepList[activeIndex + 1] && stepList[activeIndex + 1].stepId) {
                setCurrentStepId(stepList[activeIndex + 1].stepId);
            }
        }
        else if (result.data && result.data.saveStepDialogInfo && (buttonType == 'pass' || buttonType == 'unpass')) {
            history.push(workFlowLink({ projectId: projectId, caseId: caseId }));

        }
    }

    const showButtonDialog = (config: any) => {
        const buttonDialog = DialogPlugin({
            header: <>
                <ErrorCircleFilledIcon style={{ color: '#ED7B2F' }} />
                <span>用例执行已结束</span>
            </>,
            body: config.content,
            footer: <>
                <TButton
                    variant="outline"
                    onClick={() => {
                        if (buttonDialog && buttonDialog.hide) {
                            buttonDialog.hide();
                            dialogButtonClickHandle('取消', 'other', true);
                        }
                    }} >取消</TButton>
                {
                    config.buttons.map((value: any, key: any) => {
                        return <TButton key={key} onClick={() => {
                            console.log('click');
                            dialogButtonClickHandle(value.name, value.buttonType, false);
                            if (buttonDialog && buttonDialog.hide) {
                                buttonDialog.hide();
                            }
                        }}
                            theme={value.primary ? 'primary' : 'default'}
                            variant={value.primary ? 'base' : 'outline'}
                        >{value.name}</TButton>
                    })
                }
            </>,
            onClose: () => {
                console.log('close');
                if (buttonDialog && buttonDialog.hide) {
                    buttonDialog.hide();
                    dialogButtonClickHandle('取消', '', true);
                }
            }
        });
    };

    const renderStepBtnConfig = function (config: any) {
        if (config && config.buttons && config.buttons.length > 0) {
            return <>
                {
                    config.buttons.map((value: any, key: any) => {
                        return <TButton disabled={isDisableBtn} style={{ marginLeft: 8}} key={key} onClick={() => {
                            buttonClickHandle(value.name, value.buttonType);

                            if (value.dialog && value.buttonType === 'dialog') {
                                showButtonDialog(value.dialog)
                                // dialogButtonClickHandle('取消', 'unpass', false);
                            }
                        }} >{value.name}</TButton>
                    })
                }
            </>
        }
    }

    // const renderStepBtnConfig = useMemo(()=>{

    // },[currentStepInfo])


    useEffect(() => {
        if (heartBeatResult) {
            // console.log(heartBeatResult,'======================');
            setCurrentStepIndex(heartBeatResult.stepIndex + 1);
        }
    }, [heartBeatResult])

    useEffect(() => {
        if (caseDetailHook.data) {
            setCaseName(caseDetailHook.data.getCaseAllStep?.caseName || '');
            setCaseStatus(caseDetailHook.data.getCaseAllStep?.caseStatus || -1);
            setStepList(caseDetailHook.data.getCaseAllStep?.stepInfoList || []);
            if (caseDetailHook.data.getCaseAllStep?.stepInfoList && caseDetailHook.data.getCaseAllStep?.stepInfoList.length > 0) {
                setCurrentStepId(caseDetailHook.data.getCaseAllStep?.stepInfoList[caseDetailHook.data.getCaseAllStep?.currentCaseStepIndex]?.stepId || '');
                setActiveIndex(caseDetailHook.data.getCaseAllStep?.currentCaseStepIndex);
                setCurrentStepIndex(caseDetailHook.data.getCaseAllStep?.currentCaseStepIndex + 1);
            }

        }
    }, [caseDetailHook.data])
    useEffect(() => {
        if (caseStepDetailHook.data) {
            setCurrentStepInfo(caseStepDetailHook.data.getCaseStepDetail);
            // renderStepConfig(JSON.parse(caseStepDetailHook.data.getCaseStepDetail.config));
        }
    }, [caseStepDetailHook.data])

    useEffect(() => {
        if (currentStepId) {
            getCaseStepDetail({ variables: { teamId: teamId, caseId: caseId, projectId: projectId, stepId: currentStepId } })
        }
    }, [currentStepId])

    useEffect(()=>{
        if(currentStepInfo){
            if(currentStepInfo.caseEnable){
                if(currentStepInfo.stepType==='scriptExe'){
                    if(heartBeatResult&&heartBeatResult.clientStatus===103){
                        setIsDisableBtn(false)
                    }
                    else{
                        setIsDisableBtn(true);
                    }
                }
                else{
                    setIsDisableBtn(false);
                }
            }
            else{
                setIsDisableBtn(true);
            }
        }
    },[currentStepInfo,heartBeatResult])

    useEffect(() => {
        getCaseDetail({ variables: { teamId: teamId, caseId: caseId, projectId: projectId } })
    }, [])

    return <>
        <StatusControl
            caseId={caseId}
            projectId={projectId}
            stepId={currentStepId}
            teamId={teamId}
            setTickResult={setHeartBeatResult}>
        </StatusControl>
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
                        <BreadcrumbItem>项目详情</BreadcrumbItem>
                        <BreadcrumbItem maxItemWidth={'500px'} style={{ fontWeight: 700 }}>{caseName}</BreadcrumbItem>
                    </Breadcrumb>
                    <img style={{ marginLeft: 10 }} src={iconChecked}></img>
                </div>
                <div>
                    <Button type='link' onClick={()=>{
                        changeCaseStatus({variables:{teamId:teamId,caseId:caseId,projectId:projectId,cmd:4}})
                    }}>忽略此用例</Button>
                    <Button type='link' style={{ marginLeft: 20 }} onClick={() => {
                        setShowBaseInfo(true);
                    }} >用例基本信息</Button>
                </div>
            </Header>
            <Content>
                <CaseRender
                    step={currentStepInfo}
                    currentStepId={currentStepId}
                    heartBeatResult={heartBeatResult}
                    isCollapse={isCollapse}
                    // refreshStep={()=>{
                    //     getCaseStepDetail({ variables: { teamId: teamId, caseId: caseId, projectId: projectId, stepId: currentStepId } });
                    // }}
                >
                </CaseRender>
                <StepList
                    setIsCollapse={setIsCollapse}
                    isCollapse={isCollapse}
                    stepList={stepList}
                    current={currentStepIndex}
                    setSelectStepId={setCurrentStepId}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}>
                </StepList>
            </Content>
            <Footer style={{
                height: 48,
                paddingLeft: 25,
                paddingRight: 25,
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'center',
                background: 'white',
                position: 'fixed',
                bottom: 0,
                width: '100%',
                boxShadow: '-1px 0 10px 0 rgba(0,0,0,0.05), -4px 0 5px 0 rgba(0,0,0,0.08), -2px 0 4px -1px rgba(0,0,0,0.12)'
            }}>
                <TButton theme="default" variant="outline" style={{ position: 'fixed', marginLeft: 0 }}>上一步</TButton>
                <div style={{ display: 'flex', alignItems: 'center', minWidth: 200, justifyContent: 'space-around', position: 'fixed', right: 25 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
                        <img style={{ width: 12, height: 12,marginRight:10 }} src={!currentStepInfo?.resetCheckEnable?icon_refresh_gray:icon_refresh}></img>
                        <Button disabled={!currentStepInfo?.resetCheckEnable} type='link' onClick={async () => {
                            let result =await resetStep({ variables: { teamId: teamId, projectId: projectId, caseId: caseId, stepId: currentStepId } });
                            // console.log(result);
                            if(result && result.data?.resetStepCheckedResult.stepId){
                                getCaseStepDetail({ variables: { teamId: teamId, caseId: caseId, projectId: projectId, stepId: currentStepId } });
                            }

                        }}>重置节点</Button>
                    </div>
                    {renderStepBtnConfig(JSON.parse(currentStepInfo?.config || '{}'))}
                </div>
            </Footer>
        </Layout>
        <CaseBaseInfoModal visible={showBaseInfo} handleClose={setShowBaseInfo}></CaseBaseInfoModal>
    </>;
}