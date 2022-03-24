import React, { useState } from 'react';
import style from '@emotion/styled/macro';
import { Tabs } from 'tdesign-react';
import { SystemAppList } from './systemInfo';
import { Empty } from "pages/deliverManage/component/empty";
import { BaseInfoPage } from '../componentBaseInfo';

const { TabPanel } = Tabs;

const TableContent = style.div`
  width: 100%;
  .t-tabs__nav-container{
    padding-left:20px;
  }
`;
type Props = {
  theId?: string;
  detailData?: any;
};

export const MobilePage: React.FC<Props> = (props: Props) => {
  const [tableValue, setTableValue] = useState<any>('1');

  const handleTableChange = (v: any) => {
    console.log(1111, v);
    setTableValue(v)
  }
  return (
    <>
      <BaseInfoPage name="移动端名称" detailData={props.detailData}></BaseInfoPage>
      <TableContent>
        <Tabs placement={'top'} size={'medium'} value={tableValue} onChange={(v) => handleTableChange(v)} defaultValue={'1'} >
          <TabPanel value="1" label="系统信息">
            <div style={{ padding: 20 }}>
              <SystemAppList theId={props.theId} />
            </div>
          </TabPanel>
          <TabPanel value="2" label="漏洞信息">
            <div style={{ padding: 20 }}>
              <Empty></Empty>
            </div>
          </TabPanel>

        </Tabs>

      </TableContent>
    </>
  );
};
