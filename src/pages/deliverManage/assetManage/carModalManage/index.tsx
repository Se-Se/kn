import React, { useState, useEffect } from 'react';
import { Localized } from 'i18n';
import { Link } from 'react-router-dom';
import { Layout, Card } from '@tencent/tea-component';
import style from '@emotion/styled/macro';
import { generateLink, Pattern } from 'route';
import { useGetLawListQuery } from 'generated/graphql';
import { ModalList } from './components/modalList';
import { PartsList } from './components/partsList';
import { MyDrawer } from './components/createDrawer';
import { Tabs, Button, Radio, Input, Dropdown, message, } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';
import { createCarModel, getCarModelList, getListGroup, getRelationAutoPartsListGroup, carModelRelationAutoParts } from 'pages/deliverManage/util/carModalApi/api';
import { TreeTransferDrawer } from 'pages/deliverManage/component/treeTransfer';
import { MyStenCil } from './components/antv/stencil';
import { TestAntv } from './components/antv/testAntv/antvApp';
import { AntVPage } from './components/antv/carAntV';


const { DropdownMenu, DropdownItem } = Dropdown;

const { Content, Body } = Layout;
const { TabPanel } = Tabs;

const CardMain = style.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-top: 20px;
`;
const ListCardMain = style.div`
display: flex;
width: 100%;
height: 100%;
justify-content: flex-start;
flex-wrap: wrap;
`
const ContentWrap = style.div`
display: flex;
width: 100%;
height: 100%;
justify-content: flex-start;
flex-wrap: wrap;
.list-content{
    border:1px solid  #dcdcdc;
    width:260px;
    height:100%;
    .list-content-inner{
        width:100%;
        height:100%;
        background-color:#FFFFFF;
        .tea-layout__content-body-inner{
            height: calc(100% - 85px);
        }
    }
    .tea-layout__content-body{
        padding:0;
    }
    .tea-layout__content-body-inner{
        height:100%;
    }
}
.t-tabs__header{
    display:none;
}
.parts-list-content{
  padding:24px;
    .t-tabs{
        background-color:unset;
    }
}

.tea-layout__header-title{
  padding:0px 24px;
  font-size: 14px;
  font-weight: 700;
  color:#000000;
  height:48px;
  line-height:48px;
}

.kn-antv-content{
  .tea-layout__content-body{
    padding:0px !important;
  }
  .tea-layout__content-body-inner{
    height:100%;
  }
  .t-tabs{
    height:100%;
  }
  .t-tabs__content.t-is-top{
    height:100%;
  }
  .t-tab-panel{
    height:100%;
  }
}

`;
const CardContentTitle = style.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  padding:20px 10px;

`;

type carGroup = {
  CarModelGroupId: number,
  carModelGroupName: string,
  count: number,
  carModelList: {
    id: number,
    name: string,
    version: number,
    createUserName: string,
    createUserId: number,
    createTimeFormat: string
  }[]
}[]


export type OptionType = {
  value: number;
  label: string;
};
export const Page: React.FC = () => {
  const [editData, setEditData] = useState<any>({}); //????????????
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [drawerShowId, setDrawerShowId] = useState<string>("");
  const [partsDrawerVisible, setPartsDrawerVisible] = useState<boolean>(false);
  const [tabV, setTabV] = useState<any>('1');
  const [carGName, setCarGName] = useState<string>('')
  const [isShowGroupInput, setIsShowGroupInput] = useState<boolean>(false)
  const [carModalListLoading, setCarModalListLoading] = useState<boolean>(false)
  const [carGrouplist, setCarGroupListData] = useState<carGroup>([])
  const [carModelList, setCarModelList] = useState<OptionType[]>([])
  const [activeModelId, setActiveModelId] = useState<number>(0);
  const [optList, setOptList] = useState<any>([]);//??????
  const [selecV, setSelecV] = useState<any>([])//??????????????????????????????ids
  const [relationFlag, setRelationFlag] = useState<boolean>(false);
  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
    getCarModel()
  }, [])

  // ????????????
  const save = () => {
    fetchData()
  };

  // ??????????????????drawer list
  const getDrawerList = () => {
    let request: any = {
      carModelId: activeModelId
    }
    getRelationAutoPartsListGroup(request).then((res: any) => {
      console.log(res)
      if (res?.code === 0) {
        const { autoPartsList, autoPartsSelectedList } = res;
        formatterOptList(autoPartsList || []);
        setSelecV(autoPartsSelectedList || []);
        setPartsDrawerVisible(true);
      }
    })
  }
  // ??????????????????????????????Options
  const formatterOptList = (data: any) => {
    const ops: any = data.map((item: any, index: number) => {
      item.value = "level_1" + index;
      return item;
    });
    setOptList(ops);
  }

  // ????????????drawer ??????
  const openCreate = () => {
    setDrawerShowId('')
    setDrawerVisible(true);
  }

  // ???????????????
  const openCreateGroup = () => {
    console.log('openCreateGroup')
  }

  // ??????drawer ??????
  const createClose = () => {
    console.log('close', drawerVisible)
    setDrawerVisible(false);
    setDrawerShowId('');

  }
  // ????????????
  const edit = (i: any, CarModelGroupId: number) => {
    setDrawerVisible(true);
    setDrawerShowId(i.id)
    setEditData({ ...i, CarModelGroupId })
  }
  // ??????????????? save
  const partsDrawerSave = (ids: any) => {
    console.log('partsDrawerSave', ids);
    let request: any = {
      autoPartIds: ids,
      carModelId: activeModelId
    }
    carModelRelationAutoParts(request).then((res: any) => {
      if (res?.code === 0) {
        message.success('????????????');
        setRelationFlag(!relationFlag);
      } else {
        message.error('????????????');
      }
      setPartsDrawerVisible(false);
    })
  }
  // ??????????????? btn click
  const openPartsDrawer = () => {
    getDrawerList();
  }

  // ???????????? drawer
  const transDrawerClose = () => {
    setPartsDrawerVisible(false);
    setSelecV([]);
    setOptList([]);
  }

  // radio ????????????
  const handleRadioChange = (v: any) => {
    console.log('radio-change', v);
    setTabV(v);
  }

  // ????????????????????????
  const carModleClick = (id: any) => {
    console.log('carModleClick', id)
    setActiveModelId(id)
  }
  //??????/???????????????????????????
  const resetCreateCarGroup = () => {
    setCarGName('');
    setIsShowGroupInput(false)
  }

  const createCarGroup = async () => {
    try {
      const data = await createCarModel({ carModelGroupName: carGName }) as any
      if (data.code === 0) {
        message.success('?????????????????????');
        resetCreateCarGroup()
        fetchData()
        getCarModel()
      }
    }
    catch (e: any) {
      console.error(e)
      message.error(e)
    }
    finally {

    }
  }
  //?????????????????????
  const fetchData = async () => {
    setCarModalListLoading(true)
    try {
      const resp = await getListGroup() as any
      if (resp.code === 0) {
        setCarGroupListData(formatterNameV(resp.results || []))
      }
      else {
        message.error('??????????????????')
      }
    }
    finally {
      setCarModalListLoading(false)
    }
  }

  // ??????????????????
  const formatterNameV = (data: any) => {
    data.forEach((item: any) => {
      if (item.carModelList?.length) {
        item.carModelList.forEach((c: any) => {
          c.name = c.name + '-' + c.version;
        })
      }
    });
    return data;
  }

  const getCarModel = async () => {
    const data: any = await getCarModelList()
    if (data.code === 0) {
      setCarModelList(data.children)
    }
    else {
      message.error('??????????????????')
    }
  }
  return (
    <>
      <Body>
        <ContentWrap>
          <div className="list-content">
            <Content className="list-content-inner">
              <Content.Header
                title={"????????????"}
                operation={
                  <Dropdown>
                    <Button variant="text">
                      <span
                        style={{ display: "inline-flex", color: "#006eff" }}
                      >
                        ??????
                        <Icon
                          name="chevron-down"
                          size="16"
                          style={{ marginLeft: 5 }}
                        />
                      </span>
                    </Button>
                    <DropdownMenu>
                      <DropdownItem onClick={() => setIsShowGroupInput(true)}>
                        ?????????
                      </DropdownItem>
                      <DropdownItem onClick={() => openCreate()}>
                        ??????
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                }
              ></Content.Header>
              <Content.Body
                style={{ width: "100%", height: "calc(100% - 105px)" }}
                full
              >
                {isShowGroupInput && (
                  <CardContentTitle>
                    <Input
                      maxlength={10}
                      style={{ width: 140 }}
                      value={carGName}
                      placeholder="????????????????????????"
                      onChange={(v) => {
                        setCarGName(v.toString());
                      }}
                    />
                    <Button
                      theme="primary"
                      variant="text"
                      style={{ padding: 0 }}
                      onClick={() => createCarGroup()}
                    >
                      {" "}
                      ??????
                    </Button>
                    <Button
                      theme="primary"
                      variant="text"
                      style={{ padding: 0 }}
                      onClick={() => resetCreateCarGroup()}
                    >
                      {" "}
                      ??????
                    </Button>
                  </CardContentTitle>
                )}
                <ListCardMain>
                  <ModalList
                    carModleClick={carModleClick}
                    createNew={openCreate}
                    edit={edit}
                    list={carGrouplist}
                    getList={() => fetchData()}
                    carModelList={carModelList}
                  ></ModalList>
                </ListCardMain>
              </Content.Body>
            </Content>
          </div>

          <Content className={tabV==='2'?'kn-antv-content':''}>
            <Content.Header
              title={"?????????"}
              subtitle={
                <>
                  <Radio.Group
                    defaultValue="1"
                    onChange={(v) => handleRadioChange(v)}
                  >
                    <Radio.Button value="1">????????????</Radio.Button>
                    <Radio.Button value="2">????????????</Radio.Button>
                  </Radio.Group>
                </>
              }
            ></Content.Header>
            <Content.Body
              style={{ width: "100%", height: "auto" }}
              full
              className="parts-list-content"
            >
              <Tabs placement={"top"} size={"medium"} value={tabV}>
                <TabPanel value="1" label="????????????">
                  <div className="tabs-content" style={{ margin: 20,width:'100%',height:'100%' }}>
                    {/* <PartsList openPartsDrawer={openPartsDrawer} activeId={activeModelId} relationFlag={relationFlag}></PartsList> */}
                     <MyStenCil></MyStenCil>
                    
                    {/* <TestAntv tabV={tabV} /> */}
                    
                    {/* <AntVPage tabV={tabV}/> */}
                    
                  </div>
                </TabPanel>
                <TabPanel value="2" label="????????????">
                  <div className="tabs-content" style={{ margin: 0,padding:0,width:'100%',height:'100%' }}>
                    {/* <TestAntv tabV={tabV} /> */}
                    {/* <MyStenCil></MyStenCil> */}
                    <AntVPage tabV={tabV}/>
                    
                  </div>
                </TabPanel>
              </Tabs>
            </Content.Body>
          </Content>
        </ContentWrap>
      </Body>
      <MyDrawer
        editData={editData}
        visible={drawerVisible}
        id={drawerShowId}
        save={() => save()}
        onClose={() => createClose()}
        carModelList={carModelList}
      ></MyDrawer>
      <TreeTransferDrawer optList={optList} title={'???????????????'} selectTitle="????????????????????????" selectV={selecV} save={(v) => partsDrawerSave(v)} visible={partsDrawerVisible} onClose={() => transDrawerClose()}></TreeTransferDrawer>
    </>
  );
}