import React, { useEffect, useState } from 'react';
import { useApolloData } from 'hooks/common';
import { Layout, Card, Row, Col, Icon, List, H3 } from '@tencent/tea-component';
import { BasicPie } from "@tencent/tea-chart/lib/basicpie";
import { Annotation } from "@tencent/tea-chart/lib/annotation";
import { Redirect } from 'react-router-dom';
import { useViewerQuery, useSysMessageQuery, useGetOnlineUsbDeviceListQuery, useGetMyProjectStatisticsQuery } from 'generated/graphql';
import { Localized, useGetMessage } from 'i18n';
import { ProjectTable } from './projectTable';
import { CaseTable } from './caseTable';
import connectImag from '../../image/connect.png';

const { Content, Body } = Layout;

export const Page: React.FC = ({ children }) => {
  //#region common functions
  const teamId = 'team_items;1';
  const getValue = useGetMessage();
  const myMessage = useSysMessageQuery({ variables: { teamId: teamId, search: { offset: { offset: 0, limit: 3 }, search: "0", searchField: "occTime" } } }).data?.sysMessage;

  const [myProjectData, setMyProjectData] = useState<any>({});
  // console.log(itemCount);

  const [segmentValue] = useState('project');

  const viewerData = useViewerQuery();

  const connectHook = useGetOnlineUsbDeviceListQuery({
    variables: {
      teamId: teamId
    }
  })

  const myProjectDataHook = useGetMyProjectStatisticsQuery({ variables: { teamId: teamId } })

  const [connectData, setConnectData] = useState<any>({});

  const [myProjectStatusData, setMyProjectStatusData] = useState<{ type: string; value: number; }[]>();
  const [myProjectPassData, setMyProjectPassData] = useState<{ type: string; value: number; }[]>();

  useEffect(() => {
    setInterval(() => {
      connectHook.refetch();
    }, 1000)
  }, [])

  useEffect(() => {
    setConnectData(connectHook.data?.getOnlineUsbDeviceList);
  }, [connectHook.data])

  useEffect(() => {
    const _MyProjectStatusData = [
      { type: getValue('studio-myProject-checking'), value: 183 },
      { type: getValue('studio-myProject-checkPass'), value: 23 },
      { type: getValue('studio-myProject-checkUnPass'), value: 8 }
    ];

    const _MyProjectPassData = [
      { type: getValue('studio-myProject-checking'), value: 2 },
      { type: getValue('studio-myProject-checkUnPass'), value: 8 }
    ];

    console.log(myProjectDataHook.data?.getMyProjectStatistics)
    setMyProjectData(myProjectDataHook.data?.getMyProjectStatistics);


    setMyProjectStatusData(_MyProjectStatusData);
    setMyProjectPassData(_MyProjectPassData);

  }, [myProjectDataHook.data])


  //#endregion

  //#region render functions
  const renderWelcomeFunc = () => {
    return <div>
      {viewerData.data?.viewer ?
        <div>
          <span>{viewerData.data.viewer.username}</span>
          <Localized id='studio-welcome-word'></Localized>
        </div> :
        <Redirect to='/login' />}
    </div>
  };
  const renderGroceriesFunc = () => {
    return <div>
      <Row style={{ marginTop: 15 }}>
        <Col span={10}>
          <Card style={{ width: '100%', height: 150 }}>
            <Card.Body>
              <Row showSplitLine>
                <Col span={12}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img alt={""} src={connectImag} height={100}></img>
                    {connectData?.isConnected ? <Icon style={{ marginLeft: 20, marginRight: 10 }} type="success" size="l" /> : <Icon style={{ marginLeft: 20, marginRight: 10 }} type="error" size="l" />}
                    <div>
                      {connectData?.isConnected ? <H3>client已连接</H3> : <H3>client未连接</H3> || <H3>client未连接</H3>}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <H3 style={{ marginBottom: 10}}>当前连接设备</H3>
                  <div style={{maxHeight:100,overflow:'auto'}}>
                    {
                      connectData?.onlineUsbDevice?.map((value: any, key: any) => {
                        return <div key={key} style={{ marginTop: 8 }}>
                          <span>
                            {value.usbAlertMessage}
                          </span>
                        </div>
                      })
                    }
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col span={14}>
          <Card style={{ width: '100%', height: 150 }}>
            <Card.Body title={<Localized id="project-system-info"></Localized>}
            // operation={<Button type="link">
            //   <Localized id="view-all"></Localized>
            // </Button>
            // }
            >
              <List>
                {
                  myMessage?.map((value, key) => {
                    return <List.Item key={key}>
                      <span>{value.occTime}</span>
                      <span style={{ marginLeft: 20 }}>{value.message}</span>
                    </List.Item>
                  })
                }
              </List>
            </Card.Body>
          </Card>
        </Col>
        {/* <Col span={6}>
          <Card>
            <Card.Body>
              <LinkArea>
                <LinkJumpBlock>
                  <img alt='' src={helpImage} width={'100%'}></img>
                  <Link to='/'><Localized id='compliance-doc'></Localized></Link>
                </LinkJumpBlock>
                <LinkJumpBlock>
                  <img alt='' src={fandqImage} width={'100%'}></img>
                  <Link to='/'><Localized id="compliance-fa">常见问题</Localized></Link>
                </LinkJumpBlock>
                <LinkJumpBlock>
                  <img alt='' src={config} width={'100%'}></img>
                  <Link to="/"> <Localized id="compliance-myconfig">我的设置</Localized></Link>
                </LinkJumpBlock>
              </LinkArea>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
    </div>
  };
  const renderProjectFunc = () => {
    return <div>
      <Row showSplitLine style={{ marginTop: 15 }}>
        <Col span={12}>
          <BasicPie
            circle
            height={250}
            dataSource={myProjectStatusData || []}
            position="value"
            color="type"
            interaction={["element-hover"]}
          // dataLabels
          >
            <Annotation>
              <Annotation.Label
                content={myProjectData?.projectNumber?.toString() || '0'}
                position={["50%", "50%"]}
                offsetX={-10}
                offsetY={-10}
                textStyle="font-size:20px;font-weight:600;"
              />
              <Annotation.Label
                content="个"
                position={["50%", "50%"]}
                offsetX={30}
                offsetY={-10}
                textStyle="font-size:16px;"
              />
              <Annotation.Label
                content={'检测项目'}
                position={["50%", "50%"]}
                offsetX={0}
                offsetY={25}
                textStyle="font-size:16px;color:#ccc;"
              />
            </Annotation>
          </BasicPie>
        </Col>
        <Col span={12}>
          <BasicPie
            circle
            height={250}
            dataSource={myProjectPassData || []}
            position="value"
            color="type"
            interaction={["element-hover"]}
          // dataLabels
          >
            <Annotation>
              <Annotation.Label
                content={myProjectData?.passingRatePass?.toString() || '0'}
                position={["50%", "50%"]}
                offsetX={-10}
                offsetY={-10}
                textStyle="font-size:20px;font-weight:600;"
              />
              <Annotation.Label
                content="%"
                position={["50%", "50%"]}
                offsetX={30}
                offsetY={-10}
                textStyle="font-size:16px;"
              />
              <Annotation.Label
                content={'通过率'}
                position={["50%", "50%"]}
                offsetX={0}
                offsetY={25}
                textStyle="font-size:16px;color:#ccc;"
              />
            </Annotation>
          </BasicPie>
        </Col>
      </Row>
    </div>

  };
  // const renderSegmentTitle = (type: string, count: number) => {
  //   return (
  //     <div>
  //       <span><Localized id={type}></Localized></span>
  //       <span>{count}</span>
  //     </div>
  //   )
  // };
  const renderProjectTable = () => {
    let result: React.ReactElement = <>{'render error'}</>;
    switch (segmentValue) {
      case 'project': result = <div>
        <ProjectTable></ProjectTable>
      </div>; break;
      // case 'tool': result = <div>
      //   <ToolTable></ToolTable>
      // </div>; break;
      case 'case': result = <div>
        <CaseTable></CaseTable>
      </div>; break;
    }
    return result;
  };
  //#endregion

  //#region render components
  const renderWelcomeCpn = useApolloData(viewerData, renderWelcomeFunc);
  const renderGroceriesCpn = useApolloData(viewerData, renderGroceriesFunc);
  const renderMatterListCpn = <Card style={{ marginTop: 20 }}>
    <Card.Body title={<Localized id='studio-matter-list'></Localized>}
    // operation={
    //   <Segment
    //     value={segmentValue}
    //     onChange={changeSelectSegment}
    //     options={[
    //       { text: (renderSegmentTitle('studio-segment-project', itemCount?.projectCount as number || 0)), value: "project" },
    //       // { text: (renderSegmentTitle('studio-segment-tool', itemCount?.toolCount as number || 0)), value: "tool" },
    //       // { text: (renderSegmentTitle('studio-segment-case', itemCount?.caseCount as number || 0)), value: "case" }
    //     ]}
    //   />
    // }
    >
      {renderProjectTable()}
    </Card.Body>
  </Card>
  const renderProjectCpn = useApolloData(viewerData, renderProjectFunc);
  //#endregion
  return (
    <Body>
      <Content>
        {/* <Content.Header
          title={<Localized id='studio-title'></Localized>}
        ></Content.Header> */}
        <Content.Body>
          {renderWelcomeCpn}
          <div>
            {renderGroceriesCpn}
          </div>
          {renderMatterListCpn}
          <Card>
            <Card.Body title={<Localized id='studio-myProject-title'></Localized>}>
              {renderProjectCpn}
            </Card.Body>
          </Card>
        </Content.Body>
      </Content>
    </Body>
  )
  // }, () => <Redirect to='/login' />)
}
