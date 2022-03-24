import React, { Dispatch, useEffect, useState } from 'react';
import { useGetStepResultQuery } from 'generated/graphql';
type statusControlType = {
    stepId: string,
    teamId: string,
    projectId: string,
    caseId: string,
    setCurrentStep: Dispatch<any>
    setCurrentStatus: Dispatch<any>
    setHeartBeatResult: Dispatch<any>
    setHeartBeatStatus: Dispatch<any>
    setTickResult: Dispatch<any>
}

export const StatusControl: React.FC<statusControlType> = ({ children, setTickResult, stepId, teamId, projectId, caseId, setCurrentStep, setCurrentStatus, setHeartBeatResult, setHeartBeatStatus }) => {

    const [fetchTimer, setFetchTimer] = useState<any>();
    useEffect(() => {
        startFetch();
    }, [])
    useEffect(() => {
        return ()=>{
            window.clearInterval(fetchTimer)
        }
    }, [fetchTimer])

    const fetchHook = useGetStepResultQuery({ variables: { teamId: teamId, projectId: projectId, caseId: caseId, stepId: stepId } });
    const [stepStatusResult, setStepStatusResult] = useState<any>('');
    // const listenResult = ()=>{
    //     fetchHook.refetch();
    // }
    useEffect(() => {
        setStepStatusResult(fetchHook.data?.getStepResult)
    }, [fetchHook.data?.getStepResult])
    useEffect(() => {
        if (stepStatusResult !== undefined) {
            setTickResult(stepStatusResult);

            setCurrentStep(stepStatusResult.setpIndex);///设置当前因该是第几步
            setCurrentStatus(stepStatusResult.clientStatus);//设置指定步骤下一步是否可点击
            // setHeartBeatResult(stepStatusResult.result);
            try {
                if (stepStatusResult.result !== undefined && stepStatusResult.result !== '') {


                    const _word = stepStatusResult.result;

                    const newValue = JSON.stringify(JSON.parse(_word).result);


                    setHeartBeatResult(JSON.parse(newValue));
                    setHeartBeatStatus(JSON.parse(stepStatusResult.result).success)
                }
                else if (stepStatusResult.result === '') {
                    setHeartBeatResult(null);
                }
            }
            catch (e) {
            }
            if (stepStatusResult.stepStatus === 2) {
                window.clearInterval(fetchTimer);
            }
        }
        else {
            setHeartBeatResult(null);
        }

    }, [stepStatusResult])
    const startFetch = () => {
        if (!fetchTimer) {
            const _timer = setInterval(() => {
                fetchHook.refetch();
            }, 1000);
            setFetchTimer(_timer)
        }
    }
    return <div>
        {children}
    </div>
}