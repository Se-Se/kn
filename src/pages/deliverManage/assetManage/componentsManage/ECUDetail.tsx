import React, { useState, useEffect } from "react";
import { Layout } from "@tencent/tea-component";
import { Tabs, message } from 'tdesign-react';
import { Row, Col} from 'tdesign-react';
import style from "@emotion/styled/macro";
import styled from "@emotion/styled/macro";
import { useHistory, useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { PartsList } from './components/ECU/detailPartsList';
import { SystemList } from './components/ECU/systemInfo';
import { Loophole } from '../../component/loopholeTag';
import { Empty } from "pages/deliverManage/component/empty";
import { autoPartsBaseDetail } from "../../util/componentApi";
import { BreadcrumbPage } from '../../component/BreadcrumbPage';

const { TabPanel } = Tabs;
const { Content, Body } = Layout;


const CardMain = style.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
`;
const CardContentTitle = style.div`
  width: 100%;
  height: 100%;
  background-color:white;
  padding:16px;
`;
const TableContent = style.div`
  width: 100%;
  height: 100%;
  background-color:white;
  margin-top:20px;
`;
const DetaiLabel = style.div`
color: rgba(0,0,0,0.9);
font-size: 14px;
font-weight: 400;
`;
const DetailRow = style.div`
  margin-top:10px;
  color: rgba(0,0,0,0.6);
`
const Style = styled.div`
  .button-margin{
    margin-left:10px;
  }
  .input-search{
    width:400px;
  }
  .select-group{
    display:flex;
    padding-left:25px;
  }

`
const DetailTitle=style.div`
  color: rgba(0,0,0,0.9);
  font-size: 16px;
  font-weight: 700;
`

export const Page: React.FC = () => {
  const history = useHistory();
  const params: any = useParams();
  const [detailData, setDetailData] = useState<any>({});
  const [tableValue, setTableValue] = useState<any>('1');
  const [breadcrumbList, setBreadcrumbList] = useState<any>([]);

  // 初次加载页面
  useEffect(() => {
    fetch();
    checkRoute();
  }, []);

  const checkRoute = () => {
    const paramsss = new URLSearchParams(history.location.search);
    if (paramsss.get("jumbFrom") === 'hardwareDetail') {
      const fromHardwareDetail = [
        { text: '硬件管理', path: '/lingshu/assetsManage/componentManage' },
        { text: '硬件详情', path: `/lingshu/assetsManage/hardwareManage/hardwareDetail/${paramsss.get("id")}` },
        { text: '零部件详情', path: '' },
      ]
      setBreadcrumbList(fromHardwareDetail);
    } else {
      const fromComponent = [
        { text: '零部件管理', path: '/lingshu/assetsManage/componentManage' },
        { text: '零部件详情', path: '' }
      ]
      setBreadcrumbList(fromComponent);
    }
  }

  // 获取详情信息
  const fetch = () => {
    autoPartsBaseDetail({ autoPartsId: Number(params.componentId) }).then((res: any) => {
      if (res?.code === 0) {
        setDetailData(res || {});
      } else {
        message.error(res.msg || "网络异常！");
      }
    });
  }


  const handleTableChange = (v: any) => {
    console.log(1111, v);
    setTableValue(v)
  }


  return (
    <Style>
      <Body>
        <Content>
          <Content.Header title={<BreadcrumbPage list={breadcrumbList} />}></Content.Header>
          <Content.Body style={{ width: '100%', height: 'auto' }} full>
            <CardMain>
              <CardContentTitle>
              <DetailTitle>基本信息</DetailTitle>
                <div>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>ECU名称</DetaiLabel></Col>
                          <Col span={8}><span>{detailData.name}</span></Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>关联车型</DetaiLabel></Col>
                          <Col span={8}><span>{detailData.belongCarModelString}</span></Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>版本号</DetaiLabel></Col>
                          <Col span={8}><span>{detailData.version}</span></Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>漏洞分布</DetaiLabel></Col>
                          <Col span={8}>{detailData.loophole ? <Loophole loophole={detailData.loophole} /> : null}</Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>创建人</DetaiLabel></Col>
                          <Col span={8}><span>{detailData.createUser}</span></Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>创建时间</DetaiLabel></Col>
                          <Col span={8}><span>{detailData.createTime}</span></Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>备注</DetaiLabel></Col>
                          <Col span={8}><span>{detailData.remark}</span></Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                </div>
              </CardContentTitle>
              <TableContent>
                <Tabs placement={'top'} size={'medium'} value={tableValue} onChange={(v) => handleTableChange(v)} defaultValue={'1'} >
                  <TabPanel value="1" label="硬件信息">
                    <div style={{ padding: 20 }}>
                      <PartsList name='hardware' />
                    </div>
                  </TabPanel>
                  <TabPanel value="2" label="系统信息">
                    <div style={{ padding: 20 }}>
                      <SystemList name='System' />
                    </div>
                  </TabPanel>
                  <TabPanel value="3" label="漏洞信息">
                    <div style={{ padding: 20 }}>
                      {/* <BugList name='loop' /> */}
                      <Empty></Empty>
                    </div>
                  </TabPanel>

                </Tabs>

              </TableContent>
            </CardMain>
          </Content.Body>
        </Content>
      </Body>

    </Style>
  );
};
