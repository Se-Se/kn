import React, { useState } from 'react';
import style from '@emotion/styled/macro';
import { Tabs } from 'tdesign-react';
import { SystemInfo } from './systemInfo';
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

export const CloudPage: React.FC<Props> = (props: Props) => {
  const [tableValue, setTableValue] = useState<any>('1');

  const handleTableChange = (v: any) => {
    console.log(1111, v);
    setTableValue(v)
  }
  return (
    <>
      <BaseInfoPage name="平台名称" detailData={props.detailData}></BaseInfoPage>
      <TableContent>
        <Tabs placement={'top'} size={'medium'} value={tableValue} onChange={(v) => handleTableChange(v)} defaultValue={'1'} >
          <TabPanel value="1" label="系统信息">
            <div style={{ padding: 20 }}>
              <SystemInfo theId={props.theId} />
            </div>
          </TabPanel>
          <TabPanel value="2" label="漏洞信息">
            <div style={{ padding: 20 }}>
              {/* <BugList name='loop' /> */}
              <Empty></Empty>
            </div>
          </TabPanel>

        </Tabs>

      </TableContent>
    </>


  );
};
