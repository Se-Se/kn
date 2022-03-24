import React, { useEffect, useState, useMemo } from 'react';
// import { Icon, H3 } from '@tencent/tea-component';
import style from '@emotion/styled/macro';
import { Steps, Dialog, Table } from 'tdesign-react';
import { Button as TButton } from '@tencent/tea-component';
import { useHistory, Link, useRouteMatch } from 'react-router-dom';
import { SelectAppModal } from './selectAppModal_td';
import {
    useGetProjectAutoTaskProgressV2LazyQuery,
    useGetSelectedAppListLazyQuery,
    useGetAnalysisAppListLazyQuery
} from 'generated/graphql';


type currenStepper = {
}
interface ProjectMatch {
    projectId: string
}



const ContentGroupTitle = style.div`
    font-weight: 700;
`;
const BaseInfoGroup = style.div`
    margin-top: 23px;
    display: flex;
    .t-steps--horizontal.t-steps--dot-anchor .t-steps-item .t-steps-item__title{
        font-size:14px
    }
`;
const BaseInfoGroupDescContent = style.div`
    width:100%;
    color: #737373;
`;
const { StepItem } = Steps;

export const ReadyStepper: React.FC<currenStepper> = ({ }) => {

    const pageParam = useRouteMatch<ProjectMatch>().params;
    const projectId = pageParam.projectId;
    const teamId = 'team_items;1';

    const [showAppDialog, setShowAppDialog] = useState<boolean>(false);
    const [showAutoTestDialog, setShowAutoTestDialog] = useState<boolean>(false);
    const [showSelectAppModal, setShowSelectAppModal] = useState<boolean>(false);

    // const stepHook = useGetProjectAutoTaskProgressQuery({ variables: { teamId: teamId, projectId: projectId }, fetchPolicy: 'network-only' });

    const [getStep, stepHook] = useGetProjectAutoTaskProgressV2LazyQuery();
    const [getSelectedAppList, selectedAppListHook] = useGetSelectedAppListLazyQuery();
    const [getAnalysisAppList, analysisAppLisHook] = useGetAnalysisAppListLazyQuery();

    const [stepData, setStepData] = useState<any>();

    const [selectAppData, setSelectAppData] = useState<any>([]);
    const [analysisAppData, setAnalysisAppData] = useState<any>([]);

    const [statusTimer, setStatusTimer] = useState<any>();



    const renderDescription = (word: string, type: number) => {
        let list = word.split('#');
        if (list.length === 3) {
            return <>
                <span>
                    {list[0]}
                </span>
                <TButton style={{ marginTop: -3, fontSize: 14 }} type='link' onClick={(() => {
                    console.log(type);
                    if (type === 2) {
                        getSelectedAppList({ variables: { teamId: teamId, projectId: projectId } })
                        setShowAppDialog(true);
                    }
                    else if (type === 3) {
                        getAnalysisAppList({ variables: { teamId: teamId, projectId: projectId } });
                        setShowAutoTestDialog(true);
                    }
                })}>{list[1]}</TButton>
                <span>
                    {list[2]}
                </span>
            </>
        }
        else {
            return <span>
                {word}
            </span>
        }
    }

    const renderStep = useMemo(() => {
        if (stepData && stepData.stepConfig && stepData.stepConfig.length > 0) {
            return <Steps theme="dot" current={stepData.currentIndedx - 1}>
                {
                    stepData.stepConfig.map((value: any, key: any) => {
                        return <StepItem key={key} title={value.title} style={{ fontSize: 14 }}>
                            <BaseInfoGroupDescContent>
                                {
                                    renderDescription(value.description, value.alertType)
                                }
                            </BaseInfoGroupDescContent>
                        </StepItem>
                    })
                }
            </Steps>
        }
        else {
            return <div style={{ textAlign: 'center' }}>
                <h3>数据加载中....</h3>
            </div>
        }
    }, [stepData])

    useEffect(() => {
        if (selectedAppListHook.data?.getSelectedAppList) {
            setSelectAppData(selectedAppListHook.data.getSelectedAppList || []);
        }

    }, [selectedAppListHook.data])

    useEffect(() => {
        if (analysisAppLisHook.data?.getAnalysisAppList) {
            setAnalysisAppData(analysisAppLisHook.data?.getAnalysisAppList || []);
        }

    }, [analysisAppLisHook.data])

    useEffect(() => {
        if(stepData){
            let current = stepData.currentIndedx;
            console.log(stepData);
            if(stepData.stepConfig&&stepData.stepConfig[current-1]&&stepData.stepConfig[current-1].alertType===1){
                setShowSelectAppModal(true)
            }
            // if(stepData.currentIndedx===1){
            //     setShowSelectAppModal(true)
            // }
        }
    }, [stepData])

    useEffect(() => {
        return () => {
            window.clearInterval(statusTimer);
        }
    }, [statusTimer])

    useEffect(() => {
        if (!statusTimer) {
            const _timer = setInterval(() => {
                getStep({ variables: { teamId: teamId, projectId: projectId } });
            }, 1000);
            setStatusTimer(_timer);
        }
    }, [])

    useEffect(() => {

        if (stepHook.data?.getProjectAutoTaskProgressV2) {
            setStepData(stepHook.data?.getProjectAutoTaskProgressV2);
        }

    }, [stepHook.data]);

    return <>
        <ContentGroupTitle>
            <span>
                {stepData?.title || ''}
            </span>
        </ContentGroupTitle>
        <BaseInfoGroup style={{ width: '100%', marginTop: 30 }}>
            <div style={{ width: '100%', height: 108 }}>

                {renderStep}

            </div>
            <div style={{ width: 154, height: 108, marginRight: 60, marginTop: -30 }}>
                <span style={{ fontSize: 72, color: '#0E9D61', fontFamily: 'tdiv' }}>{stepData?.progressPercent}</span>
                <span style={{ fontSize: 32, color: '#0E9D61' }}>{stepData?.progressPercent>-1 ? '%' : ''}</span>
            </div>
        </BaseInfoGroup>
        <SelectAppModal isShow={showSelectAppModal}
            setIsShowAddDialog={setShowSelectAppModal}>
        </SelectAppModal>
    </>
}