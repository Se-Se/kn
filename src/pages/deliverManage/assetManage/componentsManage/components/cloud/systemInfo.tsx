import React, { useState, useEffect } from "react";
import { message, Button, Tabs, Radio, Input } from 'tdesign-react';
import { useParams } from 'react-router-dom'
import 'tdesign-react/es/style/index.css';
import { autoPartsSystemListGroup, autoPartsRelationSystem } from "../../../../util/componentApi";
import style from '@emotion/styled/macro';
import { SearchIcon, } from "tdesign-icons-react";
import { SystemActionList } from './systemActionList';
import { SystemAPIList } from "./systemAPIList";
import { SystemAPPList } from "./systemAPPList";
import { TreeTransferDrawer } from '../../../../component/treeTransfer';
import { SystemListGroupReq } from '../type';

const { TabPanel } = Tabs;
type Props = {
    name: string //用来判断详情页面 appDetail systemDetail appDetail
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
.input-search{
    width:320px;
  }
`;
export const SystemInfo: React.FC<Props> = (props: Props) => {
    const params: any = useParams();
    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
    const [listRadioV, setListRadioV] = useState<any>('1');
    const [searchValue, setSearchValue] = useState<any>({
        retrieveColumn: "system_items.name",
        retrieveLike: true,
        retrieveValue: [],
    });
    const [optList, setOptList] = useState<any>([]);//系统关联
    const [theId, setTheId] = useState<any>('');
    const [saveFlag, setSaveFlag] = useState<boolean>(false);
    const [selectV, setSelectV] = useState<any>([]);

    // 初次加载页面
    useEffect(() => {
        console.log('props---->', props.name, params.componentId);
        setTheId(Number(params.componentId))
    }, []);


    useEffect(() => {
        console.log('listRadioV', listRadioV)
    }, [listRadioV])


    // 获取关联系统drawer list
    const getDrawerList = () => {
        let request: SystemListGroupReq = {
            autoPartsType: 'cloud',
            autoPartsId: Number(params.componentId)
        }
        autoPartsSystemListGroup(request).then((res: any) => {
            if (res?.code === 0) {
                const { OperatingSystem, ApiList, AppList, SelectedIdList } = res;
                if (listRadioV === '1') {
                    const vals: any = getRelationV(JSON.parse(JSON.stringify(OperatingSystem)));
                    const idList: any = vals.filter((item: any) => (SelectedIdList || []).includes(item));
                    formatterOptList(OperatingSystem || [], '操作系统');
                    setSelectV(idList || []);
                } else if (listRadioV === '2') {
                    const vals: any = JSON.parse(JSON.stringify(ApiList)).map((item: any) => item.value);
                    const idList: any = vals.filter((item: any) => (SelectedIdList || []).includes(item));
                    let arr: any = [{
                        value: 'level_0',
                        label: 'API',
                        children: ApiList || []
                    }]
                    setOptList(arr);
                    setSelectV(idList || []);
                } else if (listRadioV === '3') {
                    const vals: any = JSON.parse(JSON.stringify(AppList)).map((item: any) => item.value);
                    const idList: any = vals.filter((item: any) => (SelectedIdList || []).includes(item));
                    let arr: any = [{
                        value: 'level_0',
                        label: 'APP',
                        children: AppList || []
                    }]
                    setOptList(arr);
                    setSelectV(idList || []);
                }
                setDrawerVisible(true);
            }

        })
    }
    // 格式化获取需要绑定的Options
    const formatterOptList = (data: any, text?: any) => {
        const ops: any = data.map((item: any, index: number) => {
            item.value = "level_1" + index;
            return item;
        });
        let arr: any = [{
            value: 'level_0',
            label: text,
            children: ops || []
        }]
        setOptList(arr);
    }

    const getRelationV = (data: any) => {
        let arr: any = [];
        data.map((item: any) => {
            if (item.children?.length) {
                item.children.forEach((c: any) => {
                    arr.push(c.value);
                })
            }
        });
        return arr;
    }

    // 关联回调 
    const save = (keys: any) => {
        console.log('save');
        let params: any = {
            systemIds: keys,
            autoPartIds: [theId]
        }
        autoPartsRelationSystem(params).then((res: any) => {
            if (res.code === 0) {
                message.success("关联成功");
                setDrawerVisible(false);
                setSaveFlag(!saveFlag);
            } else {
                message.error("关联失败");
                setDrawerVisible(false);
            }
        })
    }

    const handleShowDraw = () => {
        getDrawerList();
    }

    // radio 按钮切换
    const handleRadioChange = (v: any) => {
        console.log('radio-change', v);
        setListRadioV(v);
    }
    // 根据名称搜索
    const handleNameSearch = (v: any) => {
        let arr: any = [];
        if (v) {
            arr = [v];
        } else {
            arr = [];
        }
        setSearchValue({
            retrieveColumn: "system_items.name", //之后查看修改
            retrieveLike: true,
            retrieveValue: arr,
        });
    };

    // 点击搜索
    const fetchData = () => {
        // makeParams();
        setSaveFlag(!saveFlag);
    }
    return (
        <Style>
            <CardContentTitle>
                <div>
                    <Button style={{ marginRight: 20 }} onClick={() => handleShowDraw()}>关联系统</Button>
                    <Radio.Group value={listRadioV} onChange={(v) => handleRadioChange(v)}>
                        <Radio.Button value="1">操作系统</Radio.Button>
                        <Radio.Button value="2">API</Radio.Button>
                        <Radio.Button value="3">APP</Radio.Button>
                    </Radio.Group>

                </div>
                <Input
                    type="search"
                    placeholder="请输入你需要搜索的系统信息"
                    className="input-search"
                    onChange={(value) => handleNameSearch(value)}
                    onEnter={() => fetchData()}
                    suffixIcon={<SearchIcon style={{ cursor: 'pointer' }} onClick={() => fetchData()} />}
                ></Input>
            </CardContentTitle>


            <Tabs placement={'top'} size={'medium'} value={listRadioV}>
                <TabPanel value="1" label="操作系统">
                    <div className="tabs-content" >
                        <SystemActionList name="action" searchValue={searchValue} saveFlag={saveFlag} />
                    </div>
                </TabPanel>
                <TabPanel value="2" label="API">
                    <div className="tabs-content" >
                        <SystemAPIList name="API" searchValue={searchValue} saveFlag={saveFlag} />
                    </div>
                </TabPanel>
                <TabPanel value="3" label="APP">
                    <div className="tabs-content" >
                        <SystemAPPList name="APP" searchValue={searchValue} saveFlag={saveFlag} />
                    </div>
                </TabPanel>
            </Tabs>

            <TreeTransferDrawer optList={optList} selectV={selectV} title={'关联系统'} selectTitle="请选择关联系统" save={(v) => save(v)} visible={drawerVisible} onClose={() => setDrawerVisible(false)}></TreeTransferDrawer>
        </Style>
    );
};
