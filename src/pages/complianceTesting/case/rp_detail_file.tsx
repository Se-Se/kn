import React, { useState, useEffect } from 'react';
import { Localized } from 'i18n';
import { useGetCommonalityAutoTaskReportQuery } from 'generated/graphql';
import { Modal, Table, Status } from '@tencent/tea-component';
import { RpDetailFileSub } from './rp_detail_file_sub'

interface RpDetailFileType {
    reportData: any
    projectId: string
    caseId: string
    caseStepId: string
}
const { pageable, scrollable, autotip, expandable } = Table.addons;

export const RpDetailFile: React.FC<RpDetailFileType> = (props) => {

    const dataColumns: any = [{
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
    const [listCount] = useState<number>(0);
    const [pageQueryInfo, setPageQueryInfo] = useState<any>({});
    const [expandedKeys, setExpandedKeys] = useState<string[]>(['sysAnalysisId'])

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

    const renderSubTable = (record: any) => {
        console.log(record);
        return <div>
            <RpDetailFileSub path={record.name} caseStepId={props.caseStepId} projectId={props.projectId} caseId={props.caseId}></RpDetailFileSub>
        </div>;
    };

    useEffect(() => {
        setListData(dataHook.data?.getCommonalityAutoTaskReport?.reportFile || [])
    }, [dataHook.data])

    return <Table columns={dataColumns}
        recordKey='name'
        records={listData}
        addons={[
            pageable({
                recordCount: listCount,
                onPagingChange: (value) => {
                    let query = pageQueryInfo;
                    query.offset.offset = (value.pageIndex as number - 1) * (value.pageSize as number);
                    query.offset.limit = value.pageSize;
                    setPageQueryInfo(JSON.parse(JSON.stringify(query)))
                }
            }),
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
                shouldRecordExpandable: (record) => {
                    if (record.type === 'TypeDir') {
                        return true;
                    }
                    else return false;
                }
            }),
            scrollable({
                maxHeight: 700,
            }),
            autotip({
                loadingText: <div>
                    <Status icon={'loading'} title={'Loading'}></Status>
                </div>,
            })
        ]}></Table>
}