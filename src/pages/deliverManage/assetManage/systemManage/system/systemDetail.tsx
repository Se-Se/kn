import React, { useState, useEffect } from "react";
import { Layout } from "@tencent/tea-component";
import { Tabs, Breadcrumb, message } from 'tdesign-react';
import { Row, Col } from 'tdesign-react';
import style from "@emotion/styled/macro";
import styled from "@emotion/styled/macro";
import { useHistory, useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { systemDetail, systemGetRetrieveList } from '../../../util/api';
import { PartsList } from './systemPartsList';
import { SoftList } from '../components/detailSoftList';
import { IconFont } from 'tdesign-icons-react';
import { MyDrawer } from "./systemDraw";
import { systemGetAutoPartsGroup, } from "../../../util/api";
import { Empty } from "pages/deliverManage/component/empty";
import { ProgressTag } from "../../../component/progressTag";
const { BreadcrumbItem } = Breadcrumb;

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
  background-color:#fff;
  padding:16px;
`;
const TableContent = style.div`
  width: 100%;
  height: 100%;
  background-color:#fff;
  margin-top:20px;
  .t-tabs__header{
    padding-left:20px;
  }
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
  .progress-icon{
    font-weight: bold;
  }
  .t-progress__bar{
    border-radius: unset;
    height:8px; 
  }
  .t-progress__inner{
    border-radius: unset; 
  }
  .kn-ellipsis{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;  
  }
`
const Ellipsis = style.div`
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
`
const DetailTitle = style.div`
  color: rgba(0,0,0,0.9);
  font-size: 16px;
  font-weight: 700;
  display:inline-block;
`
export const Page: React.FC = () => {
    const history = useHistory();
    const params: any = useParams();
    const [detailData, setDetailData] = useState<any>({});
    const [tableValue, setTableValue] = useState<any>('1');
    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
    const [partsList, setPartsList] = useState<any>([]); //获取需要绑定的零部件list
    const [editData, setEditData] = useState<any>({}); //编辑数据
    const [drawerShowId, setDrawerShowId] = useState<string>("");
    const [systemOptions, setSystemOptions] = useState<any>([]);//系统options

    // 初次加载页面
    useEffect(() => {
        fetch();
        getPartsList();
        getRetrieveList();
    }, []);


    // 获取详情信息
    const fetch = () => {
        systemDetail({ id: Number(params.systemId) }).then((res: any) => {
            console.log('resData', res);
            if (res?.code === 0) {
                const { belongAutoPartIds, Result } = res;
                let data: any = { ...Result, belongAutoPartIds }
                setDetailData(data || {});
                setEditData(data || {});
            } else {
                // message.error('网络异常')
            }
        })
    }
    // 获取需要绑定的零部件
    const getPartsList = () => {
        systemGetAutoPartsGroup().then((res: any) => {
            formatterPartsList(res.results);
        });
    };
    // 格式化获取需要绑定的零部件
    const formatterPartsList = (data: any) => {
        const ops: any = data.map((item: any, index: number) => {
            item.value = "level_1" + index;
            return item;
        });
        setPartsList(ops);
    };

    const handleTableChange = (v: any) => {
        setTableValue(v)
    }

    // 编辑
    const openEdit = () => {
        setDrawerVisible(true);
        setDrawerShowId(params.systemId);
    }
    // 保存回调
    const save = () => {
        console.log('save');
        fetch();
    };
    //：获取搜索框下拉列表
    const getRetrieveList = () => {
        systemGetRetrieveList().then((res: any) => {
            if (res?.code === 0) {
                const { retrieveListSystemTypeList } = res;

                const systems: any = (retrieveListSystemTypeList || []).map((item: any) => {
                    return {
                        value: item.systemTypeId.toString(),
                        label: item.systemTypeName,
                    };
                });
                setSystemOptions(systems || []);
            }
        });
    };

    // 解除关联后回调
    const relieveCallback = () => {
        systemDetail({ id: Number(params.systemId) }).then((res: any) => {
            console.log('relieveCallback', res);
            if (res?.code === 0) {
                const { belongAutoPartIds, Result } = res;
                let data: any = { ...Result, belongAutoPartIds }
                setEditData(data || {});
            }
        })
    }

    return (
        <Style>
            <Body>
                <Content>
                    <Content.Header title={
                        <Breadcrumb maxItemWidth="200px" theme="light">
                            <BreadcrumbItem onClick={() => history.push('/lingshu/assetsManage/systemManage')}>系统管理</BreadcrumbItem>
                            <BreadcrumbItem >系统详情</BreadcrumbItem>
                        </Breadcrumb>
                    }></Content.Header>
                    <Content.Body style={{ width: '100%', height: 'auto' }} full>
                        <CardMain>
                            <CardContentTitle>
                                <h3 style={{ cursor: 'pointer' }} onClick={() => openEdit()}> <DetailTitle>基本信息</DetailTitle><IconFont style={{ marginLeft: 10 }} name="edit-1" /></h3>
                                <div>
                                    <DetailRow>
                                        <Row>
                                            <Col span={6}>
                                                <Row>
                                                    <Col span={2}><DetaiLabel>系统名称</DetaiLabel></Col>
                                                    <Col span={4}><span>{detailData.name}</span></Col>
                                                </Row>
                                            </Col>
                                            <Col span={6}>
                                                <Row>
                                                    <Col span={2}><DetaiLabel>编译时间</DetaiLabel></Col>
                                                    <Col span={6}><span>{detailData.compileTime}</span></Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </DetailRow>
                                    <DetailRow>
                                        <Row>
                                            <Col span={6}>
                                                <Row>
                                                    <Col span={2}><DetaiLabel>内核版本</DetaiLabel></Col>
                                                    <Col span={4}><span>{detailData.systemCoreVersion}</span></Col>
                                                </Row>
                                            </Col>
                                            <Col span={6}>
                                                <Row>
                                                    <Col span={2}><DetaiLabel>创建人</DetaiLabel></Col>
                                                    <Col span={4}><span>{detailData.createUserName}</span></Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </DetailRow>
                                    <DetailRow>
                                        <Row>
                                            <Col span={6}>
                                                <Row>
                                                    <Col span={2}><DetaiLabel>系统类型</DetaiLabel></Col>
                                                    <Col span={4}><span>{detailData.systemType}</span></Col>
                                                </Row>
                                            </Col>
                                            <Col span={6}>
                                                <Row>
                                                    <Col span={2}><DetaiLabel>创建时间</DetaiLabel></Col>
                                                    <Col span={6}><span>{detailData.createTime}</span></Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </DetailRow>
                                    <DetailRow>
                                        <Row>
                                            <Col span={6}>
                                                <Row>
                                                    <Col span={2}><DetaiLabel>文件进度</DetaiLabel></Col>
                                                    <Col span={2}><ProgressTag progress={detailData.uploadProgress} /></Col>
                                                </Row>
                                            </Col>
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
                                    <TabPanel value="1" label="所属零部件">
                                        <div style={{ padding: 20 }}>
                                            <PartsList relieveCallback={() => relieveCallback()} name='systemDetail' editChange={detailData} />
                                        </div>
                                    </TabPanel>
                                    <TabPanel destroyOnHide value="2" label="软件信息">
                                        <div style={{ padding: 20 }}>
                                            <SoftList name='systemDetail' theId={params.systemId} />
                                        </div>
                                    </TabPanel>
                                    <TabPanel value="3" label="漏洞信息">
                                        <div style={{ padding: 20 }}>
                                            {/* <BugList name='systemDetail' /> */}
                                            <Empty></Empty>
                                        </div>
                                    </TabPanel>

                                </Tabs>

                            </TableContent>
                        </CardMain>
                    </Content.Body>
                </Content>
            </Body>
            <MyDrawer
                optList={partsList}
                editData={editData}
                systemOptions={systemOptions}
                visible={drawerVisible}
                id={drawerShowId}
                save={() => save()}
                onClose={() => setDrawerVisible(false)}
            ></MyDrawer>
        </Style>
    );
};
