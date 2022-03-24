import React from 'react';
import { Table,Icon } from '@tencent/tea-component';
import { Localized, useGetMessage } from 'i18n';
import { Link } from 'react-router-dom';
import { generateLink, Pattern } from 'route';
import { useMyItemsGetToolListByUserIdQuery } from 'generated/graphql'

const { pageable } = Table.addons;

export const ToolTable: React.FC = () => {

    const getValue = useGetMessage();

    const teamId = 'team_items;1';

    const toolTableColumns = [
        {
            key: "name",
            header: getValue('column-tool')
        }, {
            key: "projectName",
            header: getValue('column-belongProjectName')
        }, {
            key: "status",
            header: getValue('status')
        }, {
            key: "dutyUser",
            header: getValue('column-dutyUser')
        }, {
            key: "checkCaseNumber",
            header: getValue('column-checkCaseNumber'),
            render:(value:any)=>{
                return value.toolResult.caseNumber;
            }
        }, {
            key: "checkFilterNumber",
            header: getValue('column-checkFilterNumber')
        }, {
            key: "checkResultInfo",
            header: getValue('column-checkResultInfo'),
            width:200,
            render:(value:any)=>{
                return  <div>
                    <Icon type="success" /><span style={{padding:5}}>{value.toolResult.passNumber}</span>
                    <Icon type="error" /><span style={{padding:5}}>{value.toolResult.unPassNumber}</span>
                    <Icon type="pending" /><span style={{padding:5}}>{value.toolResult.unTestNumber}</span>
                    <Icon type="pending-gray" /><span style={{padding:5}}>{value.toolResult.ignoreNumber}</span>
                </div>
            }
        }, {
            key: "operation",
            header: getValue('column-operation'),
            render: (value:any) => {
                const pathparams = {
                    toolId:value?.id,
                    projectId:value?.projectId
                }
                return <Link to={generateLink(Pattern.ComplianceTestingToolDetail,pathparams)}><Localized id='see-detail'></Localized></Link>
            }
        }
    ];
    const toolListData = useMyItemsGetToolListByUserIdQuery({ variables: { teamId: teamId, search: { offset: { offset: 0, limit: 10 } } } }).data?.myItems?.getToolListByUserId || [] as [];

    return <Table columns={toolTableColumns} records={toolListData} addons={[pageable()]}></Table>
}