import React, { useState, useEffect } from 'react';
import { Localized } from 'i18n';
import { useGetCommonalityAutoTaskReportQuery } from 'generated/graphql';
import { Modal, Table, Status } from '@tencent/tea-component';


interface RpDetailPermissionType {
    reportData: any
    projectId: string
    caseId: string
    caseStepId: string
}
const { autotip } = Table.addons;

export const RpDetailPermission: React.FC<RpDetailPermissionType> = (props) => {

    const dataColumns: any = [{
        key: "useName",
        header: "useName",
    },
    {
        key: "UID",
        header: "UID",
    },
    {
        key: "GID",
        header: "GID",
    },
    {
        key: "passwordHash",
        header: "passwordHash",
    },
    {
        key: "shell",
        header: "shell",
    }
    ];
    const [listData, setListData] = useState<any[]>([]);

    const teamId = 'team_items;1';

    const dataHook = useGetCommonalityAutoTaskReportQuery({
        variables: {
            teamId: teamId,
            component: '',
            version: '',
            path: '',
            projectId: props.projectId,
            caseId: props.caseId,
            caseStepId: props.caseStepId,
            search: {}
        }
    })

    useEffect(() => {
        setListData(dataHook.data?.getCommonalityAutoTaskReport?.reportSystemUser || [])
    }, [dataHook.data])

    return <Table columns={dataColumns}
        recordKey='id'
        records={listData}
        addons={[
            // scrollable({
            //     minWidth: 1200,
            // }),
            autotip({
                emptyText: <div>
                    <Status icon={'blank'} title={<Localized id="compliance-nodata"></Localized>}></Status>
                </div>,
            })
        ]}></Table>
    }