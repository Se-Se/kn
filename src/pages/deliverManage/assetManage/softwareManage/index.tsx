import React, { useEffect, useState } from "react";
import { Layout } from "@tencent/tea-component";
import style from "@emotion/styled/macro";
import { message, Tabs } from "tdesign-react";
import { ThirdParts } from "./components/thirdParts/thirdParts";
import { Encryptionkey } from "./components/encryptionkey/encryptionkey";
import { FirmWare } from "./components/firmware/firmware";
import { Certificate } from "./components/certificate/certificate";
import { AppServer } from "./components/appServer/appServer";
import { LogsFile } from "./components/logfiles/logsFile";
import { Configuration } from "./components/configuration/configuration";
import {
  getRelationSystemSelectorList,
  getResourceList,
  softwaregetGetRetrieveList,
} from "pages/deliverManage/util/softwareApi/api";
import {
  configTypeSelectorType,
  OptionType,
  relationSystemGroupOptionsType,
  relationSystemOptionsType,
  retrieveListType,
} from "./components/type";
import { GetRelationSystemSelectorGroupList } from "../../util/softwareApi/api";
const { TabPanel } = Tabs;

const { Content, Body } = Layout;
const CardMain = style.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;    
`;
const Style = style.div`
  .tea-layout__content-body{
    padding:0
  }
  .t-tabs{
    width:100%
  }
  .tabs-content{
    margin:0px;
    padding:20px;
    background-color:#f3f4f7;
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
export const Page: React.FC = () => {
  const [model, setModel] = useState<string>("module");
  const [modelsOptions, setModelsOption] = useState<
    { label: string; value: any }[]
  >([]);
  const [systemOptions, setSystemOptions] = useState<
    { label: string; value: any }[]
  >([]);
  const [partsOptions, setPartsOptions] = useState<
    { label: string; value: any }[]
  >([]);
  const [businessOptions, setBusinessOptions] = useState<
    { label: string; value: any }[]
  >([]);
  const [relationSystemOptions, setRelationSystemOptions] = useState<
    { label: string; value: any }[]
  >([]);
  const [relationSystemGroupOptions, setRelationSystemGroupOptions] = useState<
    {
      label: string;
      children: {
        value: any;
        label: string;
      }[];
    }[]
  >([]);
    const [configTypeSelector, setConfigTypeSelector] = useState<OptionType[]>([])
    const [logTypeSelector, setLogTypeSelector] = useState<OptionType[]>([])
    const [moduleBusinessUsedSelector, setModuleBusinessUsedSelector] = useState<OptionType[]>([])

  useEffect(() => {
    getRetriveveList();
  }, [model]);
  useEffect(() => {
    getRelationSystemList();
    getRelationSystemGroupList();
    getResource();
  }, []);
  const getRetriveveList = () => {
    softwaregetGetRetrieveList({ module: model }).then((res) => {
      const resp = res as retrieveListType;
      if (resp?.code === 0) {
        setModelsOption(formatter(resp.belongCarInfoSelector));
        setSystemOptions(formatter(resp.belongSystemSelector));
        setPartsOptions(formatter(resp.belongAutoPartsSelector));
        setBusinessOptions(formatter(resp.ModuleBusinessUsedSelector));
      } else {
        message.error(resp.msg || "网络异常！");
      }
    });
  };

  // 格式化value number->string;
  const formatter=(data:any)=>{
   return  (data||[]).map((item:any)=>{
       item.value=item.value.toString();
       return item;
     })
  }

  const getRelationSystemList = () => {
    getRelationSystemSelectorList().then((res) => {
      const resp = res as relationSystemOptionsType;
      if (resp?.code === 0) {
        setRelationSystemOptions(resp.result);
      } else {
        message.error(resp.msg || "网络异常！");
      }
    });
  };
  const getRelationSystemGroupList = () => {
    GetRelationSystemSelectorGroupList().then((res) => {
      const resp = res as relationSystemGroupOptionsType;
      if (resp?.code === 0) {
        resp.results.map((item:any)=>{
          item.children.map((childitem:any)=>{
            childitem.label=item.label+'-'+childitem.label
          })  
        })
        setRelationSystemGroupOptions(resp.results);
      } else {
        message.error(resp.msg || "网络异常！");
      }
    });
  };
  const getResource = () =>{
    getResourceList().then((res)=>{
      const resp = res as configTypeSelectorType
      if(resp?.code === 0 ){
        setConfigTypeSelector(resp.configTypeSelector)
        setModuleBusinessUsedSelector(resp.moduleBusinessUsedSelector)
        setLogTypeSelector(resp.logTypeSelector)
      }
    })
  }
  return (
    <Style>
      <Body>
        <Content>
          <Content.Header title={"软件管理"}></Content.Header>
          <Content.Body style={{ width: "100%", height: "auto" }} full>
            <CardMain>
              <Tabs
                placement={"top"}
                size={"medium"}
                defaultValue={"module"}
                value={model}
                onChange={(value) => setModel(value.toString())}
              >
                <TabPanel value="module" label="第三方组件">
                  <div className="tabs-content">
                    <ThirdParts
                      modelsOptions={modelsOptions}
                      systemOptions={systemOptions}
                      partsOptions={partsOptions}
                      businessOptions={businessOptions}
                      relationSystemOptions={relationSystemOptions}
                      relationSystemGroupOptions={relationSystemGroupOptions}
                      moduleBusinessUsedSelector={moduleBusinessUsedSelector}
                    ></ThirdParts>
                  </div>
                </TabPanel>
                <TabPanel value="firmware" label="固件">
                  <div className="tabs-content">
                    <FirmWare
                      modelsOptions={modelsOptions}
                      systemOptions={systemOptions}
                      partsOptions={partsOptions}
                      relationSystemOptions={relationSystemOptions}
                      relationSystemGroupOptions={relationSystemGroupOptions}
                    ></FirmWare>
                  </div>
                </TabPanel>
                <TabPanel value="secretKey" label="密钥">
                  <div className="tabs-content">
                    <Encryptionkey
                      modelsOptions={modelsOptions}
                      systemOptions={systemOptions}
                      partsOptions={partsOptions}
                      relationSystemOptions={relationSystemOptions}
                      relationSystemGroupOptions={relationSystemGroupOptions}
                    ></Encryptionkey>
                  </div>
                </TabPanel>
                <TabPanel value="certificate" label="证书">
                  <div className="tabs-content">
                    <Certificate
                      modelsOptions={modelsOptions}
                      systemOptions={systemOptions}
                      partsOptions={partsOptions}
                      relationSystemOptions={relationSystemOptions}
                      relationSystemGroupOptions={relationSystemGroupOptions}
                    ></Certificate>
                  </div>
                </TabPanel>
                <TabPanel value="service" label="应用服务">
                  <div className="tabs-content">
                    <AppServer
                      modelsOptions={modelsOptions}
                      systemOptions={systemOptions}
                      partsOptions={partsOptions}
                      relationSystemOptions={relationSystemOptions}
                      relationSystemGroupOptions={relationSystemGroupOptions}
                    ></AppServer>
                  </div>
                </TabPanel>
                <TabPanel value="log" label="log文件">
                  <div className="tabs-content">
                    <LogsFile
                      modelsOptions={modelsOptions}
                      systemOptions={systemOptions}
                      partsOptions={partsOptions}
                      relationSystemOptions={relationSystemOptions}
                      relationSystemGroupOptions={relationSystemGroupOptions}
                      logTypeSelector={logTypeSelector}
                    ></LogsFile>
                  </div>
                </TabPanel>
                <TabPanel value="config" label="配置">
                  <div className="tabs-content">
                    <Configuration
                      modelsOptions={modelsOptions}
                      systemOptions={systemOptions}
                      partsOptions={partsOptions}
                      relationSystemOptions={relationSystemOptions}
                      relationSystemGroupOptions={relationSystemGroupOptions}
                      configTypeSelector={configTypeSelector}
                    ></Configuration>
                  </div>
                </TabPanel>
              </Tabs>
            </CardMain>
          </Content.Body>
        </Content>
      </Body>
    </Style>
  );
};
