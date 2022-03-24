import React, { Dispatch, useEffect, useState } from 'react';
import { useGetStepResultQuery, useGetStepResultLazyQuery } from 'generated/graphql';
type statusControlType = {
    stepId: string,
    teamId: string,
    projectId: string,
    caseId: string,
    // setCurrentStep: Dispatch<any>
    // setCurrentStatus: Dispatch<any>
    // setHeartBeatResult: Dispatch<any>
    // setHeartBeatStatus: Dispatch<any>
    setTickResult: Dispatch<any>
}

export const StatusControl: React.FC<statusControlType> = ({ children, setTickResult, stepId, teamId, projectId, caseId }) => {

    const [fetchTimer, setFetchTimer] = useState<any>();
    useEffect(() => {
        if (stepId) {
            startFetch();
        }
    }, [stepId])
    useEffect(() => {
        return () => {
            window.clearInterval(fetchTimer)
        }
    }, [fetchTimer])

    const [getStepResult, StepResultHook] = useGetStepResultLazyQuery();
    const [stepStatusResult, setStepStatusResult] = useState<any>('');
    // const listenResult = ()=>{
    //     fetchHook.refetch();
    // }
    useEffect(() => {
        setStepStatusResult(StepResultHook.data?.getStepResult)
    }, [StepResultHook.data?.getStepResult])
    useEffect(() => {
        if (stepStatusResult !== undefined) {
            setTickResult(stepStatusResult)
        }
        else {
            setTickResult(null);
        }

    }, [stepStatusResult])
    
    const startFetch = () => {
        if (fetchTimer) {
            window.clearInterval(fetchTimer);
        }
        const _timer = setInterval(() => {
            getStepResult({ variables: { caseId: caseId, projectId: projectId, teamId: teamId, stepId: stepId } });
        }, 1000);
        setFetchTimer(_timer)
    }
    return <div>
        {children}
    </div>
}