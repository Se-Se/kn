import React, { useState, useEffect } from "react";
import { Layout,  } from "@tencent/tea-component";
import { Breadcrumb, message, Table, TableSort, Tabs, Upload } from 'tdesign-react';
import { Row, Col } from 'tdesign-react';
import style from "@emotion/styled/macro";
import styled from "@emotion/styled/macro";
import { ArrowLeftIcon } from 'tdesign-icons-react';
import { useHistory, useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { CheckCircleFilledIcon } from 'tdesign-icons-react';
import { getSoftwareDetail } from "pages/deliverManage/util/softwareApi/api";
import { SystemDataTable } from "../systemDataTable";
import { Empty } from "pages/deliverManage/component/empty";
const { TabPanel } = Tabs;

const {BreadcrumbItem}=Breadcrumb
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
for (let i = 0; i < 50; i++) {
  data.push({
    index: i,
    platform: '公有',
    type: 'any[]',
    Id: 'ccxz - ' + i.toString(),
    needed: 'Y',
    description: '数据源',
    detail: {
      name: '嵌套信息读取',
    },
  });
}
export const Page: React.FC = () => {
  const history = useHistory();
  const params: any = useParams();

  const [pageSize, setPageSize] = useState<number>(10);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState(50)
  const [sort, setSort] = useState<TableSort>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [query, setQuery] = useState({});
  const [detailData, setDetailData] = useState<any>({});
  const [list, setList] = useState<any>([]);

  // 初次加载页面
  useEffect(() => {
    fetch()
  }, []);

  // 获取详情信息
  const fetch = () => {
    getSoftwareDetail({softwareId:Number(params.configDetailId)}).then((res:any)=>{
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

  // 格式化列表数据
  const formatterList = (data: any) => {
    const newList: any = data.map((item: any, index: number) => {
      item.index = index;
      return item;
    });
    setList((v: any) => {
      v = [];
      return newList || []
    })
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
  const columns = [
    {
      align: 'left',
      width: 100,
      minWidth: 100,
      colKey: 'index',
      title: '序号',
      sorter: true
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'name',
      title: '系统名称',
      sorter: true,
      render(cell: any) {
        return <span><a onClick={() => jumpToDetail(cell.row.id)}>{cell.row.name}</a></span>
      }
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'version',
      title: '系统类型',
      sorter: true
    },
    {
      align: 'left',
      width: 200,
      minWidth: 200,
      colKey: 'id',
      title: '内核版本',
      sorter: true
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'uploadProgress',
      title: '上传进度',
      sorter: true
    },
    {
      align: 'left',
      width: 300,
      minWidth: 300,
      colKey: 'loophole',
      title: '所属零部件',
      sorter: true,
      // render(cell: any) {
      //   return <span>
      //     <span style={{ color: 'white', backgroundColor: '#e54545', padding: '3px 25px 3px 3px', fontWeight: "bold" }}>高危{' ' + cell.row.loophole?.highRisk}</span>
      //     <span style={{ color: 'white', backgroundColor: '#ff9d00', padding: '3px 25px 3px 3px', fontWeight: "bold" }}>警告{' ' + cell.row.loophole?.warning}</span>
      //     <span style={{ color: 'white', backgroundColor: '#bbbbbb', padding: '3px 25px 3px 3px', fontWeight: "bold" }}>低危{' ' + cell.row.loophole?.lowRisk}</span>
      //   </span>
      // }
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'belongCarModelName',
      title: '所属车型',
      sorter: true
    },
    {
      align: 'left',
      width: 200,
      minWidth: 200,
      className: 'row',
      colKey: 'edit',
      title: '操作',
      fixed: 'right',
      render(cell: any) {
        return <span><a style={{ marginLeft: 10 }}>详情</a><a style={{ marginLeft: 10 }} onClick={() => relationParts(cell.row.id)}>解除关联</a></span>
      }
    },

  ]
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
                            <DetaiLabel>路径</DetaiLabel>
                          </Col>
                          <Col span={2}>
                            <span>{detailData.configPath}</span>
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
                            <DetaiLabel>用途</DetaiLabel>
                          </Col>
                          <Col span={2}>
                            <span>{detailData.configPurpose}</span>
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
                            <DetaiLabel>类型</DetaiLabel>
                          </Col>
                          <Col span={2}>
                            <span>{detailData.configTypeString}</span>
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
                            <DetaiLabel>备注</DetaiLabel>
                          </Col>
                          <Col span={2}>
                            <span>{detailData.remark}</span>
                          </Col>
                        </Row>
                      </Col>
                      
                    </Row>
                  </DetailRow>
                </div>
              </CardContentTitle>
              <TableContent>
                <Tabs placement={"top"} size={"medium"} defaultValue={"1"}>
                  <TabPanel value="1" label='详细信息'>
                    <Empty></Empty>
                  </TabPanel>
                  <TabPanel value="2" label="系统信息">
                    <SystemDataTable softWareId={Number(params.configDetailId)}></SystemDataTable>

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
