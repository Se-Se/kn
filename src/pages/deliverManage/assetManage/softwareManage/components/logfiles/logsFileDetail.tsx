import React, { useState, useEffect } from "react";
import { Layout, } from '@tencent/tea-component';
import { Breadcrumb, message, Table, TableSort, Tabs, Upload } from 'tdesign-react';
import { Row, Col } from 'tdesign-react';
import style from "@emotion/styled/macro";
import styled from "@emotion/styled/macro";
import { ArrowLeftIcon } from 'tdesign-icons-react';
import { useHistory, useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { CheckCircleFilledIcon,TimeFilledIcon } from 'tdesign-icons-react';
import { getSoftwareDetail } from "pages/deliverManage/util/softwareApi/api";
import { SystemDataTable } from "../systemDataTable";
import { Empty } from "pages/deliverManage/component/empty";
import { MyUpload } from "../reUpload";

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
export const Page: React.FC = () => {
  const history = useHistory();
  const params: any = useParams();

  const [pageSize, setPageSize] = useState<number>(10);
  const [current, setCurrent] = useState<number>(1);
  const [sort, setSort] = useState<TableSort>([]);
  const [detailData, setDetailData] = useState<any>({});
  const [fileName,setFileName]=useState<string>('');

  // 初次加载页面
  useEffect(() => {
    fetch()
  }, []);

  // 获取详情信息
  const fetch = () => {
    getSoftwareDetail({softwareId:Number(params.logsFileId)}).then((res:any)=>{
      if(res.code === 0){
        const data = res.result
        data.moduleString = res.moduleString
       setDetailData(res.result)
      }else{
        message.error('请求失败')
      }
     })
  }

  // pageSize current sort 变化查询列表
  useEffect(() => {
    makeParams()
  }, [pageSize, current, sort]);

  // page信息变化
  const rehandleChange = (pageInfo: { current: number, pageSize: number }) => {
    const { current, pageSize } = pageInfo;
    setCurrent(current);
    setPageSize(pageSize);
  }

  // 获取零部件列表
  const makeParams = () => {
    const request: any = {
      id: Number(params.hardwareId),
      offset: {
        currentPage: current,
        pageSize: pageSize
      },
      sortData: sort
    }
    // hardwaregetAutoParts(request).then((res: any) => {
    //   console.log('hardwaregetAutoParts--List---res', res);
    //   const { result, count } = res;
    //   setTotal(count || 0);
    //   formatterList(result);
    // });

  }



  // 排序
  const handleSort = (data: any) => {
    setSort(data)
  }

  // 跳转到零部件详情页
  const jumpToDetail = (id: string) => {
    history.push(`/lingshu/assetsManage/hardwareManage/hardwareDetail/${id}`)
  }

  // 硬件解除零部件关联
  const relationParts = (id: any) => {
    let request: any = {
      autoPartId: Number(id),
      hardwareId: Number(params.hardwareId)
    }
    // hardwaregetRelationParts(request).then(() => {
    //   makeParams();
    // })
  }
 
  const deleteFile=()=>{

  }
  return (
    <Style>
      <Body>
        <Content>
          <Content.Header
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <Breadcrumb maxItemWidth="200px" theme="light" style={{lineHeight:'32px'}}>
                <BreadcrumbItem onClick={()=>{history.push(`/lingshu/assetsManage/softwareManage`)}}>软件管理</BreadcrumbItem>
                <BreadcrumbItem>软件详情</BreadcrumbItem>
              </Breadcrumb>
              </div>
            }
          ></Content.Header>
          <Content.Body style={{ width: "100%", height: "auto" }} full>
            <CardMain>
              <CardContentTitle>
                <h3>基本信息</h3>
                <div>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}>
                            <DetaiLabel>软件编号</DetaiLabel>
                          </Col>
                          <Col span={2}>
                            <span>{detailData.id}</span>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}>
                            <DetaiLabel>用途</DetaiLabel>
                          </Col>
                          <Col span={2}>
                            <span>{detailData.logPurpose}</span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}>
                            <DetaiLabel>软件名称</DetaiLabel>
                          </Col>
                          <Col span={2}>
                            <span>{detailData.name}</span>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}>
                            <DetaiLabel>文件</DetaiLabel>
                          </Col>
                          <Col span={2}>
                          <span>
                              {detailData.firmwarePackageFileUrl ? (
                                <span>
                                  已上传
                                  <CheckCircleFilledIcon
                                    style={{ color: "#19b17e", marginLeft: 8 }}
                                  />
                                </span>
                              ) : (
                                <span>
                                  待上传
                                  <TimeFilledIcon style={{ marginLeft: 8 }} />
                                </span>
                              )}
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}>
                            <DetaiLabel>属性</DetaiLabel>
                          </Col>
                          <Col span={2}>
                            <span>{detailData.moduleString}</span>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}>
                            <DetaiLabel>创建人</DetaiLabel>
                          </Col>
                          <Col span={2}>
                            <span>{detailData.createUser}</span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}>
                            <DetaiLabel>存放路径</DetaiLabel>
                          </Col>
                          <Col span={2}>
                            <span>{detailData.logPath}</span>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}>
                            <DetaiLabel>创建时间</DetaiLabel>
                          </Col>
                          <Col span={4}>
                            <span>{detailData.createTimeFormat}</span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                  <DetailRow>
                    <Row>
                    <Col span={6}>
                        <Row>
                          <Col span={2}>
                            <DetaiLabel>类型</DetaiLabel>
                          </Col>
                          <Col span={2}>
                            <span>{detailData.logTypeString}</span>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}>
                            <DetaiLabel>备注</DetaiLabel>
                          </Col>
                          <Col span={2}>
                            <span>{detailData.createUserName}</span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                </div>
              </CardContentTitle>
              <TableContent>
                <Tabs placement={"top"} size={"medium"} defaultValue={"1"}>
                  <TabPanel value="1" label="详细信息">
                    <MyUpload softWareId={Number(params.logsFileId)}></MyUpload>
                  </TabPanel>
                  <TabPanel value="2" label="系统信息">
                    <SystemDataTable softWareId={Number(params.logsFileId)}></SystemDataTable>
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
