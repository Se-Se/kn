import React, { useState, useEffect } from 'react';
import { Localized } from 'i18n';
import { Link } from 'react-router-dom';
import { Layout, Card, Button } from '@tencent/tea-component';
import style from '@emotion/styled/macro';
import { generateLink, Pattern } from 'route';
import { useGetLawListQuery } from 'generated/graphql';
import { Tabs } from 'tdesign-react';
import { SystemPanel } from './system/systemPanel';
import { APIPanel } from './apiTab/apiPanel';
import {APPPanel}from './appTab/appPanel';

const { Content, Body } = Layout;
const Style = style.div`
.t-tabs{
    background-color:unset;
}
.t-tabs__header{
    background-color:#FFFFFF;
    padding-left: 8px;
}
.tea-layout__header-title{
    padding:0px 24px;
    font-size: 14px;
    font-weight: 700;
    color:#000000;
    height:48px;
    line-height:48px;
}
.tabs-content{
    margin:24px;
}
`;
const { TabPanel } = Tabs;
export const Page: React.FC = () => {
    // const renderCard = useMemo(()=>{

    // },[])
    return <Style>
        <Body>
            <Content>
                <Content.Header
                    title={'系统管理'}>
                </Content.Header>
                <Content.Body style={{ width: '100%', height: 'auto', padding: 0 }} full>
                    <Tabs placement={'top'} size={'medium'} defaultValue={'1'}>
                        <TabPanel value="1" label="操作系统">
                            <div className="tabs-content" >
                                <SystemPanel></SystemPanel>
                            </div>
                        </TabPanel>
                        <TabPanel value="2" label="API">
                            <div className="tabs-content" >
                            <APIPanel></APIPanel>
                            </div>
                        </TabPanel>
                        <TabPanel value="3" label="APP">
                            <div className="tabs-content" >
                            <APPPanel></APPPanel>
                            </div>
                        </TabPanel>
                    </Tabs>
                </Content.Body>
            </Content>
        </Body>
    </Style>
}