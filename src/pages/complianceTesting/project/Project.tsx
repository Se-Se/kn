import React, { useState } from 'react';
import { Layout, Justify, Table, Button, SearchBox, Card, Icon  } from '@tencent/tea-component';
import { Localized, useGetMessage } from 'i18n';
import { Link } from 'react-router-dom';
import { generateLink, Pattern } from 'route';
// import { AddNewProjectModal } from './addNewProjectModal';
import { AddNewProjectModal } from './addProjectModal_td';
import { useComplianceProjectListQuery, Order, useComplianceDeleteProjectMutation } from 'generated/graphql'

const { Content, Body } = Layout;
const { pageable } = Table.addons;

export const Page: React.FC = () => {
  //#region common functions

  const teamId = 'team_items;1';
  const getValue = useGetMessage();
  const [deleteProject] = useComplianceDeleteProjectMutation();

  //#endregion

  //#region data

  const dataHookOject = useComplianceProjectListQuery({
    variables: {
      teamId: teamId,
      search: {
        offset: {
          offset: 0,
          limit: 10
        },
        search: "",
        searchField: "",
        orderBy: {
          field: "id",
          order: Order.Desc
        }
      }
    }
  });

  const _projectListData = dataHookOject.data?.projectList?.projectInfo || [];

  const columns = [
    {
      key: "name",
      header: getValue('column-projectName'),
      render: (value: any) => {
        const pathparams = {
          projectId: value?.id,
        };
        return <Link to={generateLink(Pattern.ComplianceTestingProjectDetail, pathparams)}>
          {value.name}
        </Link>
      }
    }, {
      key: "submitTime",
      header: getValue('column-submitTime')
    }, {
      key: "dutyUser",
      header: getValue('column-dutyUser')
    }, {
      key: "taskStatus",
      header: getValue('column-taskStatus'),
      render: (value: any) => {
        switch (value.taskStatus) {
          case 1: return <span style={{ color: '#29cc85' }}><Localized id="compliance-checkPass"></Localized></span>;
          case 2: return <span style={{ color: '#ff584c' }}><Localized id="compliance-checkUnPass"></Localized></span>;
          case 3: return <span style={{ color: '#f28f2c' }}><Localized id="compliance-unCheck"></Localized></span>;
          case 4: return <span style={{ color: '#888' }}><Localized id="compliance-igore"></Localized></span>;
        }
      }
    }, {
      key: "lawStandard",
      header: getValue('column-lawCriterion')
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
      width: 200,
      render: (value: any) => {
        return <div>
          <Icon type="success" /><span style={{ padding: 5 }}>{value.testResult.passNumber}</span>
          <Icon type="error" /><span style={{ padding: 5 }}>{value.testResult.unPassNumber}</span>
          <Icon type="pending" /><span style={{ padding: 5 }}>{value.testResult.unTestNumber}</span>
          <Icon type="pending-gray" /><span style={{ padding: 5 }}>{value.testResult.ignoreNumber}</span>
        </div>
      }
    }, {
      key: "operation",
      header: getValue('column-operation'),
      width: 120,
      render: (value: any) => {
        const pathparams = {
          projectId: value?.id,
        }
        return <div>
          <Link to={generateLink(Pattern.ComplianceTestingProjectDetail, pathparams)}>
            <Localized id='operation-report-primary'></Localized>
          </Link>
          <Button type="link" style={{ marginLeft: 10 }} onClick={(e)=>{deleteFn(value.id)}}>
            <Localized id='operation-delete'></Localized>
          </Button>
        </div>
      }
    }
  ];

  const [isShowAddDialog, setIsShowAddDialog] = useState<boolean>(false);

  const refreshFn = () => { dataHookOject.refetch() };

  const deleteFn = async (id: string) => {
    await deleteProject({
      variables: {
        teamId: teamId,
        input: [id]
      }
    })
    refreshFn();
  }


  //#endregion

  //#region render component

  //#endregion
  return <>
    <Body>
      <Content>
        <Content.Header
          title={<Localized id='compliance-checkProject'></Localized>}
        ></Content.Header>
        <Content.Body full>
          <Table.ActionPanel>
            <Justify left={
              <>
                <Button type="primary" onClick={() => { setIsShowAddDialog(true) }}>
                  <Localized id='operation-new'></Localized>
                </Button>
              </>
            }
              right={
                <>
                  <SearchBox />
                </>
              } />
          </Table.ActionPanel>
          <Card>
            <Table columns={columns} records={_projectListData} addons={[pageable()]} />
          </Card>
        </Content.Body>
      </Content>
    </Body>
    <AddNewProjectModal refreshFn={refreshFn} setIsShowAddDialog={setIsShowAddDialog} isShow={isShowAddDialog}></AddNewProjectModal>
  </>
}
