import React, { useState, useEffect } from "react";
import { Layout } from "@tencent/tea-component";
import { Tabs, Breadcrumb } from 'tdesign-react';
import { Row, Col } from 'tdesign-react';
import style from "@emotion/styled/macro";
import styled from "@emotion/styled/macro";
import { useHistory, useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { SystemAppList } from './components/moble/systemInfo';
import { Loophole } from '../../component/loopholeTag';
import { Empty } from "pages/deliverManage/component/empty";
import { autoPartsBaseDetail, } from "../../util/componentApi";



const { TabPanel } = Tabs;
const { Content, Body } = Layout;
const { BreadcrumbItem } = Breadcrumb;


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
  .t-tabs__nav-container{
    padding-left:20px;
  }
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

  // 初次加载页面
  useEffect(() => {
    fetch();
  }, []);

  // 获取详情信息
  const fetch = () => {
    autoPartsBaseDetail({ autoPartsId: Number(params.componentId) }).then((res: any) => {
      if (res?.code === 0) {
        setDetailData(res || {});
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
          <Content.Header title={<Breadcrumb maxItemWidth="200px" theme="light">
            <BreadcrumbItem onClick={() => history.push('/lingshu/assetsManage/componentManage')}>零部件管理</BreadcrumbItem>
            <BreadcrumbItem >零部件详情</BreadcrumbItem>
          </Breadcrumb>
          }></Content.Header>
          <Content.Body style={{ width: '100%', height: 'auto' }} full>
            <CardMain>
              <CardContentTitle>
              <DetailTitle>基本信息</DetailTitle>
                <div>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>移动端名称</DetaiLabel></Col>
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
                  <TabPanel value="1" label="系统信息">
                    <div style={{ padding: 20 }}>
                      <SystemAppList name='system' />
                    </div>
                  </TabPanel>
                  <TabPanel value="2" label="漏洞信息">
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
