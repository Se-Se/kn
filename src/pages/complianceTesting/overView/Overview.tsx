import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Card, Row, Col, Table, TableColumn, Icon, Justify, Button, SearchBox } from '@tencent/tea-component';
import { BasicPie } from "@tencent/tea-chart/lib/basicpie";
import { Annotation } from "@tencent/tea-chart/lib/annotation";
import { StackBar } from "@tencent/tea-chart/lib/stackbar";
import { Localized, useGetMessage } from 'i18n';
import { Link } from 'react-router-dom';
import { generateLink, Pattern } from 'route';
import { useComplianceTeamOverviewQuery, useComplianceProjectListQuery, Order } from 'generated/graphql';
import { AddNewProjectModal } from '../project/addNewProjectModal';

const { Content, Body } = Layout;
const { pageable, scrollable } = Table.addons;

export const Page: React.FC = () => {
  const getValue = useGetMessage();

  const projectId = 'team_items;1';

  const teamId = 'team_items;1';

  const pageDataHook = useComplianceTeamOverviewQuery({
    variables: {
      teamId: projectId
    }
  })
  const pageData = useMemo(() => {
    return pageDataHook.data?.teamOverview || {};
  }, [pageDataHook.data?.teamOverview])

  let colorList: any = {
    '检测中': "#6A9FF8",
    '检测完成-通过': "#83E3AE",
    '检测完成-未通过': "#EE796C"
  };
  const projectTablecolumns: TableColumn[] = [
    {
      key: "name",
      header: getValue('column-projectName'),
      render: (value: any) => {
        const pathparams = {
          projectId: value?.id,
        }
        return <Link to={generateLink(Pattern.ComplianceTestingProjectDetail, pathparams)}>{value?.name}</Link>
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
    },
    {
      key: "testResult",
      header: getValue('column-testResult'),
      width: 200,
      fixed: 'right',
      render: (value: any) => {
        return <div>
          <Icon type="success" /><span style={{ padding: 5 }}>{value.testResult.passNumber}</span>
          <Icon type="error" /><span style={{ padding: 5 }}>{value.testResult.unPassNumber}</span>
          <Icon type="pending" /><span style={{ padding: 5 }}>{value.testResult.unTestNumber}</span>
          <Icon type="pending-gray" /><span style={{ padding: 5 }}>{value.testResult.ignoreNumber}</span>
        </div>
      }
    }
  ];

  const [_projectTablecolumns] = useState(projectTablecolumns);


  const _projectListData = useComplianceProjectListQuery({
    variables: {
      teamId: projectId,
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
  }).data?.projectList?.projectInfo || [];



  const [projectTotalCount, setProjectTotalCount] = useState<number>(0);
  const [myProjectStatusData, setMyProjectStatusData] = useState<{ type: string; value: number; }[]>([]);
  const [isShowAddDialog, setIsShowAddDialog] = useState<boolean>(false);

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
  const refreshFn = () => { dataHookOject.refetch() };

  useEffect(() => {

    let count = (pageData.checkingNumber || 0) + (pageData.passNumber || 0) + (pageData.unPassNumber || 0);
    setProjectTotalCount(count);
    const _myProjectStatusData = [
      { type: getValue('studio-myProject-checking'), value: pageData.checkingNumber || 0 },
      { type: getValue('studio-myProject-checkPass'), value: pageData.passNumber || 0 },
      { type: getValue('studio-myProject-checkUnPass'), value: pageData.unPassNumber || 0 }
    ];
    setMyProjectStatusData(_myProjectStatusData);

  }, [getValue, pageData])



  return <>
    <Body>
      <Content>
        <Content.Header
          title={<Localized id='project-overview'></Localized>}
        ></Content.Header>
        <Content.Body>
          <Row>
            <Col span={12}>
              <Card>
                <Card.Body title={<Localized id='compliance-project-count'></Localized>}>
                  <BasicPie
                    circle
                    height={250}
                    dataSource={myProjectStatusData}
                    position="value"
                    color={
                      {
                        key: 'type',
                        colors: (key: string, _index: number, _isLast: boolean) => {
                          return colorList[key];
                        }
                      }
                    }
                    interaction={["element-hover"]}
                    legend={{ align: 'right' }}
                    dataLabels
                  >
                    <Annotation>
                      <Annotation.Label
                        content={projectTotalCount}
                        position={["50%", "50%"]}
                        offsetX={-10}
                        offsetY={-10}
                        textStyle="font-size:40px;font-weight:600;"
                      />
                      <Annotation.Label
                        content="个"
                        position={["50%", "50%"]}
                        offsetX={30}
                        offsetY={-10}
                        textStyle="font-size:16px;"
                      />
                      <Annotation.Label
                        content={getValue('compliance-checkProject')}
                        position={["50%", "50%"]}
                        offsetX={0}
                        offsetY={25}
                        textStyle="font-size:16px;color:#ccc;"
                      />
                    </Annotation>
                  </BasicPie>
                </Card.Body>
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Card.Body title={<Localized id='compliance-top5-carModule'></Localized>}>
                  <StackBar
                    percent
                    height={250}
                    position="modelName*value"
                    color="checkStatueMsg"
                    // dataSource={top5carModulData}
                    dataSource={pageData?.carInfoList as [] || []}
                    stackLabels
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Card>
                <Card.Body title={<Localized id='compliance-recentProject'></Localized>}>

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
                  <Table columns={_projectTablecolumns}
                    records={_projectListData}
                    addons={[
                      pageable(),
                      scrollable({
                        minWidth: 1200,
                      })
                    ]}></Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Content.Body>
      </Content>
    </Body>
    <AddNewProjectModal refreshFn={refreshFn} setIsShowAddDialog={setIsShowAddDialog} isShow={isShowAddDialog}></AddNewProjectModal>
  </>
}
