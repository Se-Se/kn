import React from 'react';
import style from '@emotion/styled/macro';
import {  Row, Col } from 'tdesign-react';
import { Loophole } from '../../../component/loopholeTag';


const CardContentTitle = style.div`
  background-color:#FFFFFF;
  padding-bottom:24px;
  margin:24px;
  border-bottom:1px solid rgba(231,231,231,1);
`;
const DetailRow = style.div`
  margin-top:10px;
  word-break:break-all;
  color: rgba(0,0,0,0.6);
  font-size: 14px;
  font-weight: 400;

`
const DetaiLabel = style.div`
    color: rgba(0,0,0,0.9);
`;

type DrawerProps = {
    detailData: any;
    name:string;
};

export const BaseInfoPage: React.FC<DrawerProps> = (props: DrawerProps) => {
    return (
            <CardContentTitle>
                <div>
                    <DetailRow>
                        <Row>
                            <Col span={4}>
                                <Row>
                                    <Col span={4}><DetaiLabel>{props.name}</DetaiLabel></Col>
                                    <Col span={8} ><span style={{color:'#0052D9'}}>{props.detailData?.name}</span ></Col>
                                </Row>
                            </Col>
                            <Col span={7} offset={1}>
                                <Row>
                                    <Col span={3}><DetaiLabel>漏洞分布</DetaiLabel></Col>
                                    <Col span={9} offset={0}>{props.detailData?.loophole ? <Loophole loophole={props.detailData?.loophole} /> : null}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </DetailRow>
                    <DetailRow>
                        <Row>
                            <Col span={4}>
                                <Row>
                                    <Col span={4}><DetaiLabel>版本号</DetaiLabel></Col>
                                    <Col span={8} ><span>{props.detailData?.version}</span></Col>
                                </Row>
                            </Col>
                            <Col span={7} offset={1}>
                                <Row>
                                    <Col span={3}><DetaiLabel>创建时间</DetaiLabel></Col>
                                    <Col span={9} ><span>{props.detailData?.createTime}</span></Col>
                                </Row>
                            </Col>
                        </Row>
                    </DetailRow>
                    <DetailRow>
                        <Row>
                            <Col span={4}>
                                <Row>
                                    <Col span={4}><DetaiLabel>创建人</DetaiLabel></Col>
                                    <Col span={8}><span>{props.detailData?.createUser}</span></Col>
                                </Row>
                            </Col>
                            <Col span={7} offset={1}>
                                <Row>
                                    <Col span={3}><DetaiLabel>备注</DetaiLabel></Col>
                                    <Col span={9}><span>{props.detailData?.remark}</span></Col>
                                </Row>
                            </Col>
                        </Row>
                    </DetailRow>
                </div>
            </CardContentTitle>



    );
};
