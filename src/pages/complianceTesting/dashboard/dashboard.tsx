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
import connectImag from '../../../image/connect.png';
import bannerImag from '../../../image/banner.jpg';

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
  const [ticker,setTicker] = useState<any>();


  useEffect(()=>{
    if(!ticker){
      let tickerId = setInterval(() => {
        connectHook.refetch();
      }, 1000);
      setTicker(tickerId);
    }
  },[])
  useEffect(() => {
    return ()=>{
      window.clearInterval(ticker);
    }
  }, [ticker])

  useEffect(() => {
    setConnectData(connectHook.data?.getOnlineUsbDeviceList);
  }, [connectHook.data])

  useEffect(() => {

    const _MyProjectStatusData = [
      { type: getValue('studio-myProject-checking'), value: myProjectDataHook?.data?.getMyProjectStatistics?.projectCheckingNumber ||0 },
      { type: getValue('studio-myProject-checkPass'), value:  myProjectDataHook?.data?.getMyProjectStatistics?.projectPassNumber ||0 },
      { type: getValue('studio-myProject-checkUnPass'), value:  myProjectDataHook?.data?.getMyProjectStatistics?.projectUnPassNumber ||0 }
    ];

    const _MyProjectPassData = [
      { type: getValue('studio-myProject-checking'), value: myProjectDataHook?.data?.getMyProjectStatistics?.passingRatePass ||0 },
      { type: getValue('studio-myProject-checkUnPass'), value: myProjectDataHook?.data?.getMyProjectStatistics?.passingRateUnPass ||0 }
    ];

    setMyProjectData(myProjectDataHook.data?.getMyProjectStatistics);


    setMyProjectStatusData(_MyProjectStatusData);
    setMyProjectPassData(_MyProjectPassData);

  }, [myProjectDataHook.data])


  //#endregion

  //#region render functions
  const renderWelcomeFunc = () => {
    return <div style={{height:30,width:'100%',marginTop:-75}}>
      {viewerData.data?.viewer ?
        <div style={{color:'white'}}>
          <span>{viewerData.data.viewer.username}</span>
          <Localized id='studio-welcome-word'></Localized>
        </div> :
        <Redirect to='/login' />}
    </div>
  };
  const renderGroceriesFunc = () => {
    return <div>
      <Row>
        <Col span={12}>
          <Card style={{ width: '100%', height: 150 }}>
            <Card.Body>
              <Row showSplitLine>
                <Col span={12}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:15 }}>
                    <img alt={""} src={connectImag} height={80}></img>
                    {connectData?.isConnected ? <Icon style={{ marginLeft: 10, marginRight: 10 }} type="success" size="l" /> : <Icon style={{ marginLeft: 20, marginRight: 10 }} type="error" size="l" />}
                    <div>
                      {connectData?.isConnected ? <H3>client已连接</H3> : <H3>client未连接</H3> || <H3>client未连接</H3>}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <H3>当前连接设备</H3>
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
        <Col span={12}>
          <Card style={{ width: '100%', height: 150 }}>
            <Card.Body title={<Localized id="project-system-info"></Localized>}>
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
                textStyle="font-size:16px;color:#666;"
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
                textStyle="font-size:16px;color:#666;"
              />
            </Annotation>
          </BasicPie>
        </Col>
      </Row>
    </div>

  };
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
    <Card.Body title={<Localized id='studio-matter-list'></Localized>}>
      {renderProjectTable()}
    </Card.Body>
  </Card>
  const renderProjectCpn = useApolloData(viewerData, renderProjectFunc);
  //#endregion
  return (
    <Body>
      <Content>
        
          <div style={{width:'100%'}}>
            <img src={bannerImag} style={{width:'100%'}}></img>
          </div>
        <Content.Body full>
          {renderWelcomeCpn}
          <div>
            {renderGroceriesCpn}
          </div>
          <Card style={{marginTop:20}}>
            <Card.Body title={<Localized id='studio-myProject-title'></Localized>}>
              {renderProjectCpn}
            </Card.Body>
          </Card>
          {renderMatterListCpn}
        </Content.Body>
      </Content>
    </Body>
  )
}
