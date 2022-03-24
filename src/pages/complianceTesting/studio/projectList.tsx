import React, { useEffect, useState } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { Link } from 'react-router-dom';
import { generateLink, Pattern } from 'route';
import { Icon, TableColumn, Button, Modal, Status, Table, notification } from '@tencent/tea-component';
import { useComplianceProjectListQuery, useComplianceDeleteProjectMutation } from 'generated/graphql';
import style from '@emotion/styled/macro';
const IconBlockDisplay = style.div`
    display:flex;
    width:250px;
`;
const IconDisplay = style.div`
    width:50px;
`;
interface ProjectListType {
    pageQueryInfo: any
    refreshFn: any
    setPageQueryInfo: any
}
const { pageable, scrollable, autotip } = Table.addons;

export const ProjectList: React.FC<ProjectListType> = (props) => {
    const teamId = 'team_items;1';

    const getValue = useGetMessage();
    const [deleteProject] = useComplianceDeleteProjectMutation();
    // const dataHookOject = useComplianceProjectListQuery({
    //     variables: {
    //         teamId: teamId,
    //         search: {
    //             offset: {
    //                 offset: 0,
    //                 limit: 10
    //             },
    //             search: "",
    //             searchField: "",
    //             orderBy: {
    //                 field: "id",
    //                 order: Order.Desc
    //             }
    //         }
    //     }
    // });
    const [projectListData, setProjectListData] = useState<any[]>([]);
    const [projectListDataCount, setProjectListDataCount] = useState<number>(0);
    // const [pageQueryInfo, setPageQueryInfo] = useState<any>(props.pageQueryInfo);
    // const [pageQueryInfo, setPageQueryInfo] = useState<any>({
    //     offset: {
    //         offset: 0,
    //         limit: 10
    //     },
    //     search: "",
    //     searchField: "",
    //     orderBy: {
    //         field: "id",
    //         order: Order.Desc
    //     }
    // });

    const _projectListDataHook = useComplianceProjectListQuery({
        variables: {
            teamId: teamId,
            search: props.pageQueryInfo
        }
    });

    const deleteFn = async (id: string) => {

        const yes = await Modal.confirm({
            message: getValue('compliance-deleteConfirm'),
            description: getValue("compliance-deleteDesc"),
            okText: getValue("operation-delete"),
            cancelText: getValue("modal-cancel"),
        });
        if (yes) {

            await deleteProject({
                variables: {
                    teamId: teamId,
                    input: [id]
                }
            }).catch((error) => {
                notification.error({
                    description: error.toString()
                })
            })
            props.refreshFn();
            notification.success({
                description: getValue('compliance-oprationSuccess')
            })
        }

    };
    const projectTablecolumns: TableColumn[] = [
        {
            key: "name",
            header: getValue('column-projectName'),
            width: 120,
            render: (value: any) => {
                const pathparams = {
                    projectId: value?.id,
                }
                return <Link to={generateLink(Pattern.ComplianceTestingProjectOverView, pathparams)}>{value?.name}</Link>
            }
        },
        {
            key: "lawStandard",
            header: getValue('compliance-suite'),
            width: 180
        }, {
            key: "caseNumber",
            header: getValue('column-caseCount'),
            width: 80
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
        }, 
        {
            key: "taskStatus",
            header: getValue('column-taskStatus'),
            width: 100,
            render: (value: any) => {
                switch (value.taskStatus) {
                    case 1: return <span style={{ color: '#29cc85' }}><Localized id="compliance-checkPass"></Localized></span>;
                    case 2: return <span style={{ color: '#ff584c' }}><Localized id="compliance-checkUnPass"></Localized></span>;
                    case 3: return <span style={{ color: '#f28f2c' }}><Localized id="enum-status-checking"></Localized></span>;
                    case 4: return <span style={{ color: '#888' }}><Localized id="compliance-unCheck"></Localized></span>;
                }
            }
        },
        {
            key: "id",
            header: getValue('column-testResult'),
            width: 250,
            // fixed: 'right',
            render: (value: any) => {
                return (<IconBlockDisplay>
                    <IconDisplay>
                        <Icon type="success" /><span style={{ padding: 5 }}>{value.testResult.passNumber}</span>
                    </IconDisplay>
                    <IconDisplay>
                        <Icon type="error" /><span style={{ padding: 5 }}>{value.testResult.unPassNumber}</span>
                    </IconDisplay>
                    <IconDisplay>
                        <Icon type="pending" /><span style={{ padding: 5 }}>{value.testResult.testingNumber}</span>
                    </IconDisplay>
                    <IconDisplay>
                        <Icon type="pending-gray" /><span style={{ padding: 5 }}>{value.testResult.unTestNumber}</span>
                    </IconDisplay>
                    <IconDisplay>
                        <Icon type="infoblue" /><span style={{ padding: 5 }}>{value.testResult.ignoreNumber}</span>
                    </IconDisplay>
                </IconBlockDisplay>)
            }
        },
        {
            key: "dutyUser",
            header: getValue('column-dutyUser'),
            width: 100
        },
        {
            key: "submitTime",
            header: getValue('column-submitTime'),
            width: 150
        },
        {
            key: "operation",
            header: getValue('column-operation'),
            width: 160,
            fixed: 'right',
            render: (value: any) => {
                const pathparams = {
                    projectId: value?.id,
                }
                return (<div>
                    <Link to={generateLink(Pattern.ComplianceTestingProjectOverView, pathparams)}>
                        <Localized id='see-detail'></Localized>
                    </Link>
                    <Button type="link" style={{ marginLeft: 10 }} onClick={async (e) => { await deleteFn(value.id) }}>
                        <Localized id='operation-delete'></Localized>
                    </Button>
                </div>)
            }
        }
    ];

    useEffect(() => {
        setProjectListData(_projectListDataHook.data?.projectList?.projectInfo || []);
        setProjectListDataCount(_projectListDataHook.data?.projectList?.count || 0);
    }, [_projectListDataHook.data]);

    useEffect(() => {
        _projectListDataHook.refetch({ teamId: teamId, search: props.pageQueryInfo })
    }, [props.pageQueryInfo]);

    // useEffect(() => {
    //     setPageQueryInfo(pageQueryInfo);
    //     console.log(props.pageQueryInfo);
    // }, [props.pageQueryInfo])

    return <>

        <Table columns={projectTablecolumns}
            recordKey='id'
            records={projectListData}
            bordered
            addons={[
                pageable({
                    recordCount: projectListDataCount,
                    onPagingChange: (value) => {
                        let query = props.pageQueryInfo;
                        query.offset.offset = (value.pageIndex as number - 1) * (value.pageSize as number);
                        query.offset.limit = value.pageSize;
                        props.setPageQueryInfo(JSON.parse(JSON.stringify(query)))
                    }
                }),
                scrollable({
                    minWidth: 1600
                }),
                autotip({
                    emptyText: <div>
                        <Status icon={'blank'} size={'s'} title={<Localized id="compliance-nodata"></Localized>}></Status>
                    </div>,
                })
            ]}></Table>
    </>
}