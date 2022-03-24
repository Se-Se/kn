import React, { useState, useEffect } from "react";
import { Tabs, Radio } from 'tdesign-react';
import 'tdesign-react/es/style/index.css';
import style from '@emotion/styled/macro';
import { SystemActionList } from './systemActionList';
import { SystemAPIList } from "./systemAPIList";
import { SystemAPPList } from "./systemAPPList";

const { TabPanel } = Tabs;
type Props = {
    theId: any;
}

const CardContentTitle = style.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px;
  .t-radio-group{
      background-color:#fff;
  }
`;
const Style = style.div`
 .t-tabs__header{
 display:none;   
}
`;
export const SystemInfo: React.FC<Props> = (props: Props) => {
    const [listRadioV, setListRadioV] = useState<any>('1');

    // 初次加载页面
    useEffect(() => {
        console.log('props---->', props);
    }, []);


    // radio 按钮切换
    const handleRadioChange = (v: any) => {
        console.log('radio-change', v);
        setListRadioV(v);
    }

    return (
        <Style>
            <CardContentTitle>
                <div>
                    <Radio.Group value={listRadioV} onChange={(v) => handleRadioChange(v)}>
                        <Radio.Button value="1">操作系统</Radio.Button>
                        <Radio.Button value="2">API</Radio.Button>
                        <Radio.Button value="3">APP</Radio.Button>
                    </Radio.Group>

                </div>
            </CardContentTitle>


            <Tabs placement={'top'} size={'medium'} value={listRadioV}>
                <TabPanel value="1" label="操作系统">
                    <div className="tabs-content" >
                        <SystemActionList theId={props.theId} />
                    </div>
                </TabPanel>
                <TabPanel value="2" label="API">
                    <div className="tabs-content" >
                        <SystemAPIList theId={props.theId} />
                    </div>
                </TabPanel>
                <TabPanel value="3" label="APP">
                    <div className="tabs-content" >
                        <SystemAPPList theId={props.theId} />
                    </div>
                </TabPanel>
            </Tabs>

        </Style>
    );
};
