import React, { useState, useEffect } from "react";
import { message } from 'tdesign-react';
import { Layout } from "@tencent/tea-component";
import { Table, TableSort, Tabs, Breadcrumb, Dialog } from 'tdesign-react';
import { Row, Col } from 'tdesign-react';
import style from "@emotion/styled/macro";
import styled from "@emotion/styled/macro";
import { useHistory, useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { hardwaregetDetail, hardwaregetAutoParts, hardwaregetRelationParts } from '../../util/api';
import { IconFont } from 'tdesign-icons-react';
import copy from 'copy-to-clipboard';
import { Loophole } from '../../component/loopholeTag';
const { TabPanel } = Tabs;
const { BreadcrumbItem } = Breadcrumb;


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
  margin-top:24px;
  color: rgba(0,0,0,0.6);

`
const DetailContant = style.div`
  margin-bottom:24px;
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
const DetailTitle = style.div`
  color: rgba(0,0,0,0.9);
  font-size: 16px;
  font-weight: 700;
`
export const Page: React.FC = () => {
  const history = useHistory();
  const params: any = useParams();


  const [pageSize, setPageSize] = useState<number>(10);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState(50)
  const [sort, setSort] = useState<TableSort>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<any>({});
  const [list, setList] = useState<any>([]);
  const [relateId, setRelateId] = useState<any>('');
  const [showRelate, setShowRelate] = useState<boolean>(false);

  // 初次加载页面
  useEffect(() => {
    fetch()
  }, []);

  // 获取详情信息
  const fetch = () => {
    hardwaregetDetail({ id: Number(params.hardwareId) }).then((res: any) => {
      console.log('resData', res);
      if (res?.code === 0) {
        setDetailData(res || {})
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
      retrieve: {
        offset: {
          currentPage: current,
          pageSize: pageSize
        },
        sortData: sort
      }
    }
    hardwaregetAutoParts(request).then((res: any) => {
      console.log('hardwaregetAutoParts--List---res', res);
      if (res?.code === 0) {
        const { result, count } = res;
        setTotal(count || 0);
        formatterList(result || []);
      }
    });

  }

  // 格式化列表数据
  const formatterList = (data: any) => {
    const newList: any = data.map((item: any, index: number) => {
      item.index = index + 1;
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
    // history.push(`/lingshu/assetsManage/componentManage/ECUDetail/${id}?jumbFrom=hardwareDetail&id=${params.hardwareId}`)
    const w: any = window.open('about:blank');
    w.location.href = `/lingshu/assetsManage/componentManage/ECUDetail/${id}`;
  }

  // // 硬件解除零部件关联
  // const relationParts = () => {
  //   let request: any = {
  //     autoPartId: Number(relateId),
  //     hardwareId: Number(params.hardwareId)
  //   }
  //   hardwaregetRelationParts(request).then((res: any) => {
  //     if (res?.code === 0) {
  //       message.success('解除关联成功');
  //       makeParams();
  //     } else {
  //       message.error('请求失败');
  //     }
  //   });
  //   setShowRelate(false);
  // }

  // //解除关联弹窗 open
  // const openRelate = (id: any) => {
  //   setRelateId(id);
  //   setShowRelate(true);
  // }

  // //解除关联弹窗close
  // const relationPartsClose=()=>{
  //   setRelateId('');
  //   setShowRelate(false);
  // }
  // 拷贝dateSheet链接
  const handleCopy = () => {
    copy(detailData.datasheetLink);
    message.success({
      content: '复制成功',
      duration: 1000
    });
  }


  //硬件解除零部件关联无弹窗方式
  const handleRelation = (id: any) => {
    let request: any = {
      autoPartId: Number(id),
      hardwareId: Number(params.hardwareId)
    }
    hardwaregetRelationParts(request).then((res: any) => {
      if (res?.code === 0) {
        message.success('解除成功');
        makeParams();
      } else {
        message.error('解除失败');
      }
    });
  }
  const columns = [
    {
      align: 'left',
      width: 80,
      minWidth: 80,
      colKey: 'index',
      title: '序号'
    },
    {
      align: 'left',
      width: 100,
      minWidth: 100,
      colKey: 'number',
      title: '编号',
      sorter: true
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'name',
      title: '零部件',
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
      title: '版本号',
      sorter: true
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'systemName',
      title: '操作系统',
      sorter: true
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
      width: 350,
      minWidth: 350,
      colKey: 'loophole',
      title: '漏洞分布',
      sorter: true,
      render(cell: any) {
        return <Loophole loophole={cell.row.loophole} />;
      }
    },
    {
      align: 'left',
      width: 104,
      minWidth: 104,
      className: 'row',
      colKey: 'edit',
      title: '操作',
      fixed: 'right',
      render(cell: any) {
        // return <span><a onClick={() => openRelate(cell.row.id)}>解除关联</a></span>
        return <span><a onClick={() => handleRelation(cell.row.id)}>解除关联</a></span>
      }
    },

  ]
  return (
    <Style>
      <Body>
        <Content>
          <Content.Header title={
            <Breadcrumb maxItemWidth="200px" theme="light">
              <BreadcrumbItem onClick={() => history.push('/lingshu/assetsManage/hardwareManage')}>硬件管理</BreadcrumbItem>
              <BreadcrumbItem >硬件详情</BreadcrumbItem>
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
                          <Col span={2}><DetaiLabel>硬件编号</DetaiLabel></Col>
                          <Col span={8}><span>{detailData.id}</span></Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>硬件类别</DetaiLabel></Col>
                          <Col span={8}><span>{detailData.category}</span></Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>硬件名称</DetaiLabel></Col>
                          <Col span={8}><span>{detailData.name}</span></Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>厂家</DetaiLabel></Col>
                          <Col span={8}><span>{detailData.manufacturer}</span></Col>
                        </Row>
                      </Col>
                    </Row>
                  </DetailRow>
                  <DetailRow>
                    <Row>
                      <Col span={6}>
                        <Row>
                          <Col span={2}><DetaiLabel>创建人</DetaiLabel></Col>
                          <Col span={8}><span>{detailData.createUserName}</span></Col>
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
                </div>
              </CardContentTitle>
              <TableContent>
                <Tabs placement={'top'} size={'medium'} defaultValue={'1'} >
                  <TabPanel value="1" label="详细信息">
                    <div style={{ padding: '20px 20px 20px 20px', height: '100%', minHeight: 350 }}>
                      <DetailContant style={{ display: 'flex' }}><DetaiLabel style={{ width: 200 }}>SDK名称</DetaiLabel><span>{detailData.sdkName}</span></DetailContant>
                      <DetailContant style={{ display: 'flex' }}><DetaiLabel style={{ width: 200 }}>SDK版本</DetaiLabel><span>{detailData.sdkVersion}</span></DetailContant>
                      <DetailContant style={{ display: 'flex' }}><DetaiLabel style={{ width: 200 }}>dateSheet链接</DetaiLabel>{detailData.datasheetLink} <IconFont name="file-copy" onClick={() => handleCopy()} style={{ cursor: 'pointer', marginLeft: 2, color: '#0052d9' }} /></DetailContant>
                      <DetailContant style={{ display: 'flex' }}><DetaiLabel style={{ width: 200 }}>备注</DetaiLabel><span>{detailData.remark}</span></DetailContant>

                    </div>
                  </TabPanel>
                  <TabPanel value="2" label="所属零部件">
                    <div style={{ padding: 20 }}>
                      <Table
                        rowKey="id"
                        data={list}
                        //@ts-ignore
                        columns={columns}
                        multipleSort={true}
                        loading={tableLoading}
                        sort={sort}
                        style={{ border: '1px solid #eaeaea' }}
                        onSortChange={(sort) => { setSort(sort) }}
                        disableDataSort={true}
                        pagination={{
                          current,
                          total,
                          pageSize,
                          showJumper: true,
                          onChange(pageInfo) {
                            rehandleChange(pageInfo);
                          },
                        }}
                      />
                    </div>
                  </TabPanel>
                </Tabs>

              </TableContent>
            </CardMain>
          </Content.Body>
        </Content>
      </Body>
      {/* <Dialog header="确认解除关联?" onConfirm={() => relationParts()} visible={showRelate} onClose={() => relationPartsClose()}>
      </Dialog> */}
    </Style>
  );
};
