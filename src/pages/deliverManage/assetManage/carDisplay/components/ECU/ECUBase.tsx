import React, { useState } from 'react';
import style from '@emotion/styled/macro';
import { Tabs } from 'tdesign-react';
import { PartsList } from './detailPartsList';
import { SystemList } from './systemInfo';
import { Empty } from "pages/deliverManage/component/empty";
import { BaseInfoPage } from '../componentBaseInfo';

const { TabPanel } = Tabs;

const TableContent = style.div`
  width: 100%;
  background-color:#FFFFFF;
  .t-tabs__nav-container{
    padding-left:20px;
  }
`;
type DrawerProps = {
    theId?: string;
    detailData: any;
};

export const ECUPage: React.FC<DrawerProps> = (props: DrawerProps) => {
    const [tableValue, setTableValue] = useState<any>('1');

    const handleTableChange = (v: any) => {
        console.log(1111, v);
        setTableValue(v)
    }
    return (
        <>
            <BaseInfoPage name="ECU名称" detailData={props.detailData}></BaseInfoPage>
            <TableContent>
                <Tabs placement={'top'} size={'medium'} value={tableValue} onChange={(v) => handleTableChange(v)} defaultValue={'1'} >
                    <TabPanel value="1" label="硬件信息">
                        <div style={{ padding: 20 }}>
                            <PartsList theId={props.theId} />
                        </div>
                    </TabPanel>
                    <TabPanel value="2" label="系统信息">
                        <div style={{ padding: 20 }}>
                            <SystemList theId={props.theId} />
                        </div>
                    </TabPanel>
                    <TabPanel value="3" label="漏洞信息">
                        <div style={{ padding: 20 }}>
                            <Empty></Empty>
                        </div>
                    </TabPanel>

                </Tabs>

            </TableContent>
        </>
    );
};
