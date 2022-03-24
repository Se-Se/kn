import React from 'react';
import { Table } from '@tencent/tea-component';
import { Localized, useGetMessage } from 'i18n';
import { Link } from 'react-router-dom';
import { generateLink, Pattern } from 'route';
import { useMyItemsGetCaseListByUserIdQuery } from 'generated/graphql'

const { pageable } = Table.addons;

export const CaseTable: React.FC = () => {

    const getValue = useGetMessage();

    const teamId = 'team_items;1';

    const caseTableColumns = [
        {
            key: "caseName",
            header: getValue('column-case')
        }, {
            key: "projectName",
            header: getValue('column-project')
        }, {
            key: "status",
            header: getValue('status'),
            render:(value:any)=>{
                switch (value.status){
                    case 1: return <span style={{color:'#29cc85'}}><Localized id="compliance-checkPass"></Localized></span>;
                    case 2: return <span style={{color:'#ff584c'}}><Localized id="compliance-checkUnPass"></Localized></span>;
                    case 3: return <span style={{color:'#f28f2c'}}><Localized id="compliance-unCheck"></Localized></span>;
                    case 4: return <span style={{color:'#888'}}><Localized id="compliance-igore"></Localized></span>;
                }
            }
        }, {
            key: "operation",
            header: getValue('column-operation'),
            render: (value:any) => {
                const pathparams = {
                    caseId:value?.id,
                    projectId:value.projectId
                }
                return <Link to={{pathname: generateLink(Pattern.ComplianceTestingCaseDetail,pathparams),state:{caseId:value?.id}}}>
                    <Localized id='see-detail'></Localized>
                </Link>
            }
        }
    ];
    const caseListData = useMyItemsGetCaseListByUserIdQuery({ variables: { teamId: teamId, search: { offset: { offset: 0, limit: 10 } } } }).data?.myItems?.getCaseListByUserId||[] as [];

    return <Table columns={caseTableColumns} records={caseListData} addons={[pageable()]}></Table>
}

generateLink(Pattern.ComplianceTestingCaseDetail)