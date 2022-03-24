import React, { useState, useEffect } from 'react';
import { Localized } from 'i18n';
import { useGetCommonalityAutoTaskReportQuery } from 'generated/graphql';
import { Modal, Table, Status } from '@tencent/tea-component';
import HighRisk from 'icons/Risk/high.svg'
import MediumRisk from 'icons/Risk/medium.svg'
import WarningRisk from 'icons/Risk/warning.svg'
import PassRisk from 'icons/Risk/pass.svg'
import { RpCveSub } from './rp_cve_sub'

interface RpCveType {
    reportData: any
    projectId: string
    caseId: string
    caseStepId: string
}
const { expandable, autotip } = Table.addons;

export const RpCve: React.FC<RpCveType> = (props) => {

    const [expandedKeys, setExpandedKeys] = useState<string[]>(['id']);
    const dataColumns: any = [{
        key: "component",
        header: "组件名称",
        render: (value: any) => {
            return value.component + ' ' + value.version
        }
    },
    {
        key: "canary",
        header: "漏洞统计",
        render: (value: any) => {
            const CriticalCount = value.risk.filter((item: any) => {
                if (item.risk === 'Critical') {
                    return item;
                }
            })
            const HighkCount = value.risk.filter((item: any) => {
                if (item.risk === 'High') {
                    return item;
                }
            })
            const MediumCount = value.risk.filter((item: any) => {
                if (item.risk === 'Medium') {
                    return item;
                }
            })
            const LowCount = value.risk.filter((item: any) => {
                if (item.risk === 'Low') {
                    return item;
                }
            })

            return (<div style={{ width: 150, display: 'flex', alignContent: 'center', justifyContent: 'space-around' }}>
                <img alt='' width={16} src={HighRisk}></img>{CriticalCount[0].count}
                <img alt='' width={16} src={MediumRisk}></img>{HighkCount[0].count}
                <img alt='' width={16} src={WarningRisk}></img>{MediumCount[0].count}
                <img alt='' width={16} src={PassRisk}></img>{LowCount[0].count}
            </div>)
        }
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
        setListData(dataHook.data?.getCommonalityAutoTaskReport?.reportCVESec || [])
    }, [dataHook.data])

    return <Table columns={dataColumns}
        recordKey='component'
        records={listData}
        addons={[

            expandable({
                expandedKeys: expandedKeys,
                render(record) {
                    // const subtable = renderSubTable(record);

                    return <RpCveSub component={record.component} version={record.version} projectId={props.projectId} caseId={props.caseId} caseStepId={props.caseStepId}></RpCveSub>
                },
                onExpandedKeysChange: (keys, { event }) => {
                    setExpandedKeys(keys)
                }
            }),
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