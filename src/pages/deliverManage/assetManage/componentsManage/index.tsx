import React, { useState } from 'react';
import { Layout } from '@tencent/tea-component';
import style from '@emotion/styled/macro';
import { Tabs } from 'tdesign-react';
import { ListPanel } from './components/listPanel';


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
`;
const { TabPanel } = Tabs;
export const Page: React.FC = () => {
    const [tabV, setTabV] = useState<any>('ecu');

    const tabChange = (data: any) => {
        setTabV(data);
    }
    return <Style>
        <Body>
            <Content>
                <Content.Header
                    title={'零部件管理'}>
                </Content.Header>
                <Content.Body style={{ width: '100%', height: 'auto', padding: 0 }} full>
                    <Tabs placement={'top'} size={'medium'} value={tabV} onChange={(v) => tabChange(v)}>
                        <TabPanel value="ecu" label="ECU">
                            <div className="tabs-content" style={{ margin: 20 }}>

                                <ListPanel tabV={tabV} />
                            </div>
                        </TabPanel>
                        <TabPanel value="cloud" label="TSP">
                            <div className="tabs-content" style={{ margin: 20 }}>
                                <ListPanel tabV={tabV} />
                            </div>
                        </TabPanel>
                        <TabPanel value="mobile" label="移动端">
                            <div className="tabs-content" style={{ margin: 20 }}>
                                <ListPanel tabV={tabV} />
                            </div>
                        </TabPanel>
                    </Tabs>
                </Content.Body>
            </Content>
        </Body>
    </Style>
}