import React, { useState, useEffect } from "react";
import { Layout } from '@tencent/tea-component';
import { Table, TableSort, Tabs, message, Breadcrumb } from 'tdesign-react';
import { Row, Col } from 'tdesign-react';
import style from "@emotion/styled/macro";
import styled from "@emotion/styled/macro";
import { ArrowLeftIcon } from 'tdesign-icons-react';
import { useHistory, useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { getSoftwareDetail } from "pages/deliverManage/util/softwareApi/api";
import { SystemDataTable } from "../systemDataTable";
import { Empty } from "pages/deliverManage/component/empty";
const { TabPanel } = Tabs;

const {BreadcrumbItem} = Breadcrumb
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
  color:#808080;
`;
const DetailRow = style.div`
  margin-top:10px;
`
const DetailContant = style.div`
  margin-bottom:10px;
  display:'flex'
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
  .select-customer{
    margin-left:20px;
  }
`
const data: any[] = []

export const Page: React.FC = () => {
  const history = useHistory();
  const params: any = useParams();

  const [detailData, setDetailData] = useState<any>({});

  // 初次加载页面
  useEffect(() => {
    fetch()
  }, []);

  // 获取详情信息
  const fetch = () => {
    getSoftwareDetail({softwareId:Number(params.thirdPartDetailId)}).then((res:any)=>{
     if(res.code === 0){
       const data = res.result
       data.moduleString = res.moduleString
      setDetailData(res.result)
     }else{
       message.error('请求失败')
     }
    })
  }
  return (
    <Style>
      <Body>
        <Content>
          <Content.Header title={<div style={{ display: 'flex', alignItems: 'center', }}>
            {/* <ArrowLeftIcon style={{ width: 18, height: 18, color: '#006eff', cursor: 'pointer', marginRight: 10 }} onClick={() => history.push('/lingshu/assetsManage/softwareManage')} />
            {'软件名称'} */}
             <Breadcrumb maxItemWidth="200px" theme="light" style={{lineHeight:'32px'}}>
                <BreadcrumbItem onClick={()=>{history.push(`/lingshu/assetsManage/softwareManage`)}}>软件管理</BreadcrumbItem>
                <BreadcrumbItem>软件详情</BreadcrumbItem>
              </Breadcrumb>
            
            </div>
          }></Content.Header>
          <Content.Body style={{ width: '100%', height: 'auto' }} full>
            <CardMain>
              <CardContentTitle>
                <h3>基本信息</h3>
                <div>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>软件编号</DetaiLabel></Col>
                          <Col span={2}><span>{detailData.id}</span></Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>是否可商用</DetaiLabel></Col>
                          <Col span={2}><span>{detailData.moduleIsCommercialUse?'是':'否'}</span></Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>软件名称</DetaiLabel></Col>
                          <Col span={2}><span>{detailData.name}</span></Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>是否修改</DetaiLabel></Col>
                          <Col span={2}><span>{detailData.moduleIsModify?'是':'否'}</span></Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>版本</DetaiLabel></Col>
                          <Col span={2}><span>{detailData.moduleVersion}</span></Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>创建人</DetaiLabel></Col>
                          <Col span={2}><span>{detailData.createUser}</span></Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>属性</DetaiLabel></Col>
                          <Col span={2}><span>{detailData.moduleString}</span></Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>创建时间</DetaiLabel></Col>
                          <Col span={4}><span>{detailData.createTimeFormat}</span></Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>业务使用</DetaiLabel></Col>
                          <Col span={2}><span>{detailData.moduleBusinessUsedString}</span></Col>
                        </Row>
                      </Col>
                      
                    </Row>
                  </DetailRow>
                </div>
              </CardContentTitle>
              <TableContent>
                <Tabs placement={'top'} size={'medium'} defaultValue={'1'} >
                  <TabPanel value="1" label="详细信息">
                    <div style={{ padding: '20px 20px 20px 20px', height: '100%', minHeight: 350 }}>
                      <DetailContant style={{ display: 'flex' }}><DetaiLabel style={{ width: 200 }}>Lisence：</DetaiLabel><span>{detailData.moduleLicense}</span></DetailContant>
                      <DetailContant style={{ display: 'flex' }}><DetaiLabel style={{ width: 200 }}>Lisence风险：</DetaiLabel><span>{detailData.moduleLicenseRisk}</span></DetailContant>
                      <DetailContant style={{ display: 'flex' }}><DetaiLabel style={{ width: 200 }}>组件描述：</DetaiLabel>{detailData.moduleDescription}</DetailContant>
                      <DetailContant style={{ display: 'flex' }}><DetaiLabel style={{ width: 200 }}>备注：</DetaiLabel><span>{detailData.remark}</span></DetailContant>
                    </div>
                  </TabPanel>
                  <TabPanel value="2" label="系统信息">
                    <SystemDataTable softWareId={Number(params.thirdPartDetailId)}></SystemDataTable>
                  </TabPanel>
                  <TabPanel value="3" label="漏洞信息">
                    <Empty></Empty>
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
