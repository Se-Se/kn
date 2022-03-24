import React, { Dispatch,SetStateAction,useState, useRef, useEffect } from 'react';
import {DisconnectDialog} from './disconnectDialog';
import { useHistory, Link, useRouteMatch } from 'react-router-dom';
import {
    useCheckDeviceHeartbeatLazyQuery
} from 'generated/graphql';
type ReportModel = {
    deviceId:string
    setStatus: Dispatch<SetStateAction<number>>
}
interface ProjectMatch {
    projectId: string
}

export const ProjectStatusCtl: React.FC<ReportModel> = ({ children,deviceId,setStatus }) => {
    const pageParam = useRouteMatch<ProjectMatch>().params;
    const projectId = pageParam.projectId;
    const teamId = 'team_items;1';

    const [display,setDisplay] = useState<string>('hide');
    const [content,setContent] = useState<string>('');

    const [getHeartBeat,heartBeatHook] = useCheckDeviceHeartbeatLazyQuery();
    const [hearBeatId,setHeartBeatId] = useState<any>();
    const startHeartBeat = function(){
        if(!hearBeatId){
            let id = setInterval(()=>{
                getHeartBeat({variables:{teamId:teamId,projectId:projectId,deviceId:deviceId}})
            },1000)
            setHeartBeatId(id);
        }
    }
    useEffect(()=>{
        if(heartBeatHook.data&&heartBeatHook.data.checkDeviceHeartbeat){
            let info = heartBeatHook.data.checkDeviceHeartbeat;
            if(info){
                if(info.isOnline!==1&&info.deviceType){
                    // console.log(info.deviceType)
                    setDisplay(info.deviceType);
                    // setDisplay('linux')
                    setContent('请检查设备链接情况')
                }
                setStatus(info.isOnline);
            }
        }
    },[heartBeatHook.data])

    useEffect(()=>{
        startHeartBeat();
    },[])
    return <>
        <DisconnectDialog setDisplay={setDisplay} display={display} title='设备链接失败' content={content}></DisconnectDialog>
    </>
}