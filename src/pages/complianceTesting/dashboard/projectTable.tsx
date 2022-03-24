import React, { useEffect, useState } from 'react';
import { Table, Icon, Status } from '@tencent/tea-component';
import { Localized, useGetMessage } from 'i18n';
import { Link } from 'react-router-dom';
import { generateLink, Pattern } from 'route';
import { useMyItemsGetProjectListByUserIdQuery } from 'generated/graphql'
import style from '@emotion/styled/macro';
const IconBlockDisplay = style.div`
    display:flex;
    width:200px;
`;
const IconDisplay = style.div`
    width:50px;
`;

const { pageable, autotip, columnsResizable, scrollable } = Table.addons;

export const ProjectTable: React.FC = () => {

    const getValue = useGetMessage();

    const teamId = 'team_items;1';

    const projectTableColumns: any = [
        {
            key: "name",
            header: getValue('column-projectName'),
            width: 150
        },  {
            key: "lawStandard",
            header: getValue('compliance-suite'),
            width: 180
        },  {
            key: "caseNumber",
            header: getValue('column-caseCount'),
            width:  80
        },{
            key: "carModel",
            header: getValue('compliance-editCarType'),
            width: 100
        }, {
            key: "module",
            header: getValue('compliance-carParts'),
            width: 150
        }, {
            key: "version",
            header: getValue('column-version'),
            width: 50
        },{
            key: "testResult",
            header: getValue('column-testResult'),
            width: 200,
            render: (value: any) => {
                return <IconBlockDisplay>
                    <IconDisplay>
                        <Icon type="success" /><span style={{ padding: 5 }}>{value.testResult.passNumber}</span>
                    </IconDisplay>
                    <IconDisplay>
                        <Icon type="error" /><span style={{ padding: 5 }}>{value.testResult.unPassNumber}</span>
                    </IconDisplay>
                    <IconDisplay>
                        <Icon type="pending" /><span style={{ padding: 5 }}>{value.testResult.unTestNumber}</span>
                    </IconDisplay>
                    <IconDisplay>
                        <Icon type="pending-gray" /><span style={{ padding: 5 }}>{value.testResult.ignoreNumber}</span>
                    </IconDisplay>
                </IconBlockDisplay>
            }
        },{
            key: "dutyUser",
            header: getValue('column-dutyUser'),
            width: 80
        },  {
            key: "submitTime",
            header: getValue('column-submitTime'),
            width: 130
        }, {
            key: "operation",
            header: getValue('column-operation'),
            fixed: 'right',
            width: 100,
            render: (value: any) => {
                const pathparams = {
                    projectId: value?.id,
                }
                return <Link to={generateLink(Pattern.ComplianceTestingProjectOverView, pathparams)}><Localized id='see-detail'></Localized></Link>
            }
        }
    ];

    const [queryInfo] = useState<any>({ teamId: teamId, search: { offset: { offset: 0, limit: 10 } } });


    const projectListDataHook = useMyItemsGetProjectListByUserIdQuery({ variables: queryInfo })
    const [projectListData, setProjectListData] = useState<any>([]);
    useEffect(() => {
        setProjectListData(projectListDataHook.data?.myItems?.getProjectListByUserId || [])
    }, [projectListDataHook.data]);
    return <Table recordKey='id' bordered columns={projectTableColumns} records={projectListData} addons={
        [
            pageable(),
            autotip({
                emptyText: <div>
                    <Status size='s' icon={'blank'} title={<Localized id="compliance-nodata"></Localized>}></Status>
                </div>,
            }),
            scrollable({
                // maxHeight: 192,
                minWidth: 1400
            }),
            columnsResizable({
                onResizeEnd: columns => { },
                minWidth: 100,
                maxWidth: 1000,
            }),
        ]}></Table>
}