import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Card, Row, Col, Justify, Button, SearchBox} from '@tencent/tea-component';
import { BasicPie } from "@tencent/tea-chart/lib/basicpie";
import { Annotation } from "@tencent/tea-chart/lib/annotation";
import { StackBar } from "@tencent/tea-chart/lib/stackbar";
import { Localized, useGetMessage } from 'i18n';
import { useComplianceTeamOverviewQuery, useComplianceProjectListQuery, Order } from 'generated/graphql';
import { AddNewProjectModal } from '../project/addProjectModal_td';
import { ProjectList } from '../studio/projectList'

const { Content, Body } = Layout;

export const Page: React.FC = () => {
  const getValue = useGetMessage();
  const teamId = 'team_items;1';
  let colorList: any = {
    '检测中': "#FF9D00",
    '检测完成-通过': "#83E3AE",
    '检测完成-未通过': "#EE796C",
    '未检测': "#888",
    'checking': '#FF9D00',
    'checked-passed': '#83E3AE',
    'checked-unpassed': "#EE796C",
    "checked-unstart": '#888'
  };
  let carModuleColorList: any = {
    '检测中': "#FF9D00",
    '检测通过': "#83E3AE",
    '检测未通过': "#EE796C",
    '未检测': "#888",
  };


  const pageDataHook = useComplianceTeamOverviewQuery({
    variables: {
      teamId: teamId
    }
  });
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
  const pageData = useMemo(() => {
    return pageDataHook.data?.teamOverview || {};
  }, [pageDataHook.data?.teamOverview])
  const [pageQueryInfo, setPageQueryInfo] = useState<any>({
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
  });
  const _projectListDataHook = useComplianceProjectListQuery({
    variables: {
      teamId: teamId,
      search: pageQueryInfo
    }
  });
  const [projectTotalCount, setProjectTotalCount] = useState<number>(0);
  const [myProjectStatusData, setMyProjectStatusData] = useState<{ type: string; value: number; }[]>([]);
  const [isShowAddDialog, setIsShowAddDialog] = useState<boolean>(false);
  const [, setProjectListData] = useState<any[]>([]);
  const [, setProjectListDataCount] = useState<number>(0);

  const refreshFn = () => { dataHookOject.refetch(); pageDataHook.refetch(); };
  useEffect(() => {

    let count = (pageData.checkingNumber || 0) + (pageData.passNumber || 0) + (pageData.unPassNumber || 0) + (pageData.unCheckedNumber || 0);
    setProjectTotalCount(count);
    const _myProjectStatusData = [
      { type: getValue('studio-myProject-checking'), value: pageData.checkingNumber || 0 },
      { type: getValue('studio-myProject-checkPass'), value: pageData.passNumber || 0 },
      { type: getValue('studio-myProject-checkUnPass'), value: pageData.unPassNumber || 0 },
      { type: getValue('studio-myProject-unStart'), value: pageData.unCheckedNumber || 0 }
    ];
    setMyProjectStatusData(_myProjectStatusData);

  }, [getValue, pageData]);
  useEffect(() => {
    setProjectListData(_projectListDataHook.data?.projectList?.projectInfo || []);
    setProjectListDataCount(_projectListDataHook.data?.projectList?.count || 0);
  }, [_projectListDataHook.data]);
  useEffect(() => {
    _projectListDataHook.refetch({ teamId: teamId, search: pageQueryInfo })
  }, [pageQueryInfo]);
  return <>
    <Body>
      <Content>
        <Content.Header
          title={'检测中心'}
        ></Content.Header>
        <Content.Body full>
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
                        textStyle="font-size:16px;color:#666;"
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
                    // color="checkStatueMsg"
                    color={
                      {
                        key: 'checkStatueMsg',
                        colors: (key: string, _index: number, _isLast: boolean) => {
                          return carModuleColorList[key];
                        }
                      }

                    }
                    // dataSource={top5carModulData}
                    dataSource={pageData?.carInfoList as [] || []}
                    stackLabels
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Justify left={
                <>
                  <Button type="primary" onClick={() => { setIsShowAddDialog(true) }}>
                    <Localized id='operation-new'></Localized>
                  </Button>
                </>
              }
                right={
                  <>
                    <SearchBox placeholder={getValue('search-placeholder')} onSearch={(value) => {
                      let query = pageQueryInfo;
                      query.search = value;
                      query.searchField = 'name';
                      setPageQueryInfo(JSON.parse(JSON.stringify(query)));
                    }} onClear={() => {
                      let query = pageQueryInfo;
                      query.search = '';
                      query.searchField = 'name';
                      setPageQueryInfo(JSON.parse(JSON.stringify(query)))
                    }} />
                  </>
                } /></Col>
          </Row>
          <Row>
            <Col span={24}>
              <Card>
                <Card.Body>
                  <ProjectList setPageQueryInfo={setPageQueryInfo} refreshFn={refreshFn} pageQueryInfo={pageQueryInfo} ></ProjectList>
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
