import React, { useState, useEffect } from 'react';
import { Localized } from 'i18n';
import { useGetCommonalityAutoTaskReportQuery } from 'generated/graphql';
import { Table, Status } from '@tencent/tea-component';
interface RpDetailFileSubType {
    projectId: string
    caseId: string
    caseStepId: string
    path: string
}
const { autotip,expandable } = Table.addons;

export const RpDetailFileSub: React.FC<RpDetailFileSubType> = (props) => {

    const dataColumns: any = [
        {
            key: "name",
            header: "文件名称",
        },
        {
            key: "type",
            header: "类型",
        },
        {
            key: "perm",
            header: "perm",
        }
    ];

    const [listData, setListData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [expandedKeys, setExpandedKeys] = useState<string[]>(['sysAnalysisId'])

    const renderSubTable = (record: any) => {
        console.log(record);
        return <div>
            <RpDetailFileSub path={record.name} caseStepId={props.caseStepId} projectId={props.projectId} caseId={props.caseId}></RpDetailFileSub>
        </div>;
    };

    const teamId = 'team_items;1';

    const dataHook = useGetCommonalityAutoTaskReportQuery({
        variables: {
            teamId: teamId,
            component: '',
            version: '',
            path: props.path,
            projectId: props.projectId,
            caseId: props.caseId,
            caseStepId: props.caseStepId,
            search: {}
        },
        fetchPolicy:'network-only'
    })
    useEffect(() => {
        console.log(dataHook.data);

        setListData(dataHook.data?.getCommonalityAutoTaskReport?.reportFile || []);
        if (dataHook.data?.getCommonalityAutoTaskReport?.reportFile) {
            setIsLoading(false);
        }
    }, [dataHook.data])
    useEffect(() => {
        setIsLoading(true);
        setListData([]);
    }, [])

    return <div>
        <Table columns={dataColumns} records={listData} addons={[
             expandable({
                expandedKeys: expandedKeys,
                render(record) {
                    const subtable = renderSubTable(record);
                    return subtable
                    // return <div>dom</div>
                },
                onExpandedKeysChange: (keys, { event }) => {
                    setExpandedKeys(keys)
                },
                shouldRecordExpandable:(record)=>{
                    if(record.type==='TypeDir'){
                        return true;
                    }
                    else return false;
                }
            }),
            autotip({
                isLoading: isLoading,
                emptyText: <div>
                    <Status icon={'blank'} title={<Localized id="compliance-nodata"></Localized>}></Status>
                </div>
            })
        ]}></Table>
    </div>
}