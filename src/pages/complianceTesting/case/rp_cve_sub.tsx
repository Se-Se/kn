import React, { useState, useEffect } from 'react';
import { useGetCommonalityAutoTaskReportQuery } from 'generated/graphql';
import { Table } from '@tencent/tea-component';

interface RpCveSubType {
    projectId: string
    caseId: string
    caseStepId: string
    version:string
    component:string
}

export const RpCveSub: React.FC<RpCveSubType> = (props) => {

    const dataColumns: any = [
        {
            key: "name",
            header: "ID"
        }, {
            key: "cvssRank",
            header: '风险等级'
        }, {
            key: "cvss",
            header: 'CVSS'
        }, {
            key: "status",
            header: '状态'
        }, {
            key: "poc",
            header: 'Poc'
        }, {
            key: "patch",
            header: 'Patch'
        }
    ];

    const [listData, setListData] = useState<any[]>([]);

    const teamId = 'team_items;1';

    const dataHook = useGetCommonalityAutoTaskReportQuery({
        variables: {
            teamId: teamId,
            component: props.component,
            version: props.version,
            path: '',
            projectId: props.projectId,
            caseId: props.caseId,
            caseStepId: props.caseStepId,
            search: {}
        }
    })
    useEffect(() => {
        console.log(dataHook.data);

        setListData(dataHook.data?.getCommonalityAutoTaskReport?.reportCVESec || [])
    }, [dataHook.data])

    return <div>
        <Table columns={dataColumns} records={listData}></Table>
    </div>
    }