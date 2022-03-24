import React,{ useEffect,useState } from 'react';
import { Table,Icon,Status } from '@tencent/tea-component';
import { Localized, useGetMessage } from 'i18n';
import { Link } from 'react-router-dom';
import { generateLink, Pattern } from 'route';
import { useMyItemsGetProjectListByUserIdQuery } from 'generated/graphql'

const { pageable,autotip} = Table.addons;

export const ProjectTable: React.FC = () => {

    const getValue = useGetMessage();

    const teamId = 'team_items;1';

    const projectTableColumns = [
        {
            key: "name",
            header: getValue('column-projectName')
        }, {
            key: "submitTime",
            header: getValue('column-submitTime')
        }, {
            key: "dutyUser",
            header: getValue('column-dutyUser')
        }, {
            key: "lawStandard",
            header: getValue('column-lawStandard')
        }, {
            key: "carModel",
            header: getValue('column-carModel')
        }, {
            key: "version",
            header: getValue('column-version')
        }, {
            key: "caseNumber",
            header: getValue('column-caseCount')
        }, {
            key: "testResult",
            header: getValue('column-testResult'),
            width:200,
            render: (value:any) => {
                return <div>
                    <Icon type="success" /><span style={{padding:5}}>{value.testResult.passNumber}</span>
                    <Icon type="error" /><span style={{padding:5}}>{value.testResult.unPassNumber}</span>
                    <Icon type="pending" /><span style={{padding:5}}>{value.testResult.unTestNumber}</span>
                    <Icon type="pending-gray" /><span style={{padding:5}}>{value.testResult.ignoreNumber}</span>
                </div>
            }
        }, {
            key: "operation",
            header: getValue('column-operation'),
            render: (value:any) => {
                const pathparams = {
                    projectId:value?.id,
                }
                return <Link to={generateLink(Pattern.ComplianceTestingProjectOverView,pathparams)}><Localized id='see-detail'></Localized></Link>
            }
        }
    ];

    const [queryInfo] = useState<any>({teamId: teamId, search: { offset: { offset: 0, limit: 10 } } });


    const projectListDataHook = useMyItemsGetProjectListByUserIdQuery({ variables: queryInfo})
    const [projectListData,setProjectListData] = useState<any>([]);
    useEffect(()=>{
        setProjectListData(projectListDataHook.data?.myItems?.getProjectListByUserId||[])
    },[projectListDataHook.data]);
    return <Table columns={projectTableColumns} records={projectListData} addons={[pageable(),autotip({
        emptyText: <div>
            <Status size='s' icon={'blank'} title={<Localized id="compliance-nodata"></Localized>}></Status>
        </div>,
    })]}></Table>
}