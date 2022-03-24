import React, { useState, useEffect } from 'react';
import { Layout } from '@tencent/tea-component';
import style from '@emotion/styled/macro';
import { MyGraph } from './components/antv/graph';
import { HearderList } from './components/headerList';
import car from '../../images/car.svg';
import { IconFont } from 'tdesign-icons-react';
import { carModelShowGetList, carModelShowSaveTopCarModel } from 'pages/deliverManage/util/carDisplay';
import { message } from 'tdesign-react';
import { InfoDrawer } from './components/infoDrawer';

const { Content, Body } = Layout;
const CardMain = style.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
`;
const Style = style.div`
  .tea-layout__content-body:{
    padding:0 !important
  }
`;
const ListItem = style.div`
    font-size: 14px;
    font-weight: 400;
    color: rgba(0,0,0,0.6);
    position:relative;
    padding:5px 10px;
    text-indent:10px;
    cursor:pointer;
    img{
        position:absolute;
        top:50%;
        left:10px;
        transform:translateY(-50%);
    }
    .name{
        color:#0052D9;
        height: 100%;
        text-indent: 20px;
  }
`
const HeaderOperation = style.div`
    display: flex;
    height:100%;
    justify-content: flex-end;
    flex-wrap: wrap;
    font-size: 14px;
    font-weight: 400;
    color:#0052D9;
`
const testTopList = [
    {
        "id": 181,
        "name": "test---181",
        "version": "1",
        "wholeShowInfo": ""
    },
    {
        "id": 191,
        "name": "test--191",
        "version": "1",
        "wholeShowInfo": ""
    },
    {
        "id": 201,
        "name": "test---201",
        "version": "1",
        "wholeShowInfo": ""
    },
    {
        "id": 1233,
        "name": "test---1233",
        "version": "1",
        "wholeShowInfo": ""
    },
    {
        "id": 711,
        "name": "711",
        "version": "123123",
        "wholeShowInfo": ""
    }

]

const testGroupList = [
    {
        "carModelGroupId": 766,
        "carModelGroupName": "新建一个车型1112222",
        "carModelList": [
            {
                "id": 197,
                "name": "test",
                "version": "1",
                "wholeShowInfo": ""
            },
            {
                "id": 188,
                "name": "test188",
                "version": "1",
                "wholeShowInfo": ""
            },
            {
                "id": 131,
                "name": "test131",
                "version": "1",
                "wholeShowInfo": ""
            },
            {
                "id": 141,
                "name": "test--141",
                "version": "1",
                "wholeShowInfo": ""
            },
            {
                "id": 151,
                "name": "test---151",
                "version": "1",
                "wholeShowInfo": ""
            },
            {
                "id": 161,
                "name": "test---161",
                "version": "1",
                "wholeShowInfo": ""
            },
            {
                "id": '171',
                "name": "test---171",
                "version": "1",
                "wholeShowInfo": ""
            },
            {
                "id": 181,
                "name": "test---181",
                "version": "1",
                "wholeShowInfo": ""
            },
            {
                "id": 191,
                "name": "test--191",
                "version": "1",
                "wholeShowInfo": ""
            },
            {
                "id": 201,
                "name": "test---201",
                "version": "1",
                "wholeShowInfo": ""
            },
            {
                "id": 1233,
                "name": "test---1233",
                "version": "1",
                "wholeShowInfo": ""
            },
        ]
    },
    {
        "carModelGroupId": 110,
        "carModelGroupName": "车型组1111",
        "carModelList": [
            {
                "id": 711,
                "name": "711",
                "version": "123123",
                "wholeShowInfo": ""
            }
        ]
    },
    {
        "carModelGroupId": 1234,
        "carModelGroupName": "车型组1111",
        "carModelList": [
            {
                "id": 756,
                "name": "756",
                "version": "123123",
                "wholeShowInfo": ""
            }
        ]
    },

]

export const Page: React.FC = () => {
    const [carName, setcarName] = useState<any>('');
    const [show, setShow] = useState<any>(false);
    const [edit, setEdit] = useState<any>(false);
    const [groupList, setGroupList] = useState<any>([]);
    const [topList, setTopList] = useState<any>([]);
    const [drawerVis, setDrawerVis] = useState<boolean>(false);
    const [theId, setTheId] = useState<any>(null);
    const [comType, setComType] = useState<any>(null);// 展示不同类型的零部件详情 ECU,cloud,mobile

    useEffect(() => {
        getList()
    }, [])

    // 获取list
    const getList = () => {
        carModelShowGetList().then((res: any) => {
            if (res?.code === 0) {
                const arr: any = formatter(res.topCarModelList || [], res.groupCarModelList || [])
                setTopList(res.topCarModelList || []);
                setGroupList(arr || []);

                // 测试数据
                // const arr: any = formatter(testTopList || [], testGroupList || [])
                // setTopList(testTopList);
                // setGroupList(arr || []);
            }
            console.log('res--->', res);
        })
    }

    // 格式化数据
    const formatter = (topArr: any, groupArr: any) => {
        const topIds: any = topArr.map((item: any) => item.id);
        let arr: any = groupArr.map((g: any) => {
            if (g.carModelList?.length) {
                g.carModelList = g.carModelList.map((c: any) => {
                    if (topIds.includes(c.id)) {
                        c.isAdded = true;
                    }
                    return c;
                })
            }
            return g;
        })

        return arr;
    }
    // 车名称改变回调
    const changeCar = (data: any) => {
        setcarName(data);
    }

    // 展开 收起
    const clickShow = () => {
        setShow(!show);
    }
    // 设置
    const clickEdit = () => {
        setEdit(true);
    }
    // 保存
    const save = () => {
        const topCarModelIds: any = topList.map((item: any) => item.id);
        const jsonData: any = {
            topCarModelIds: topCarModelIds
        }
        let request: any = {
            topInfo: JSON.stringify(jsonData)
        };
        carModelShowSaveTopCarModel(request).then((res: any) => {
            if (res?.code === 0) {
                message.success('保存成功');
            } else {
                message.error('保存失败');
            }
        })
        setEdit(false);
    }
    // 取消
    const cancel = () => {
        setEdit(false);
        getList();
    }
    // 添加到置顶回调
    const addChange = (v: any, data: any) => {
        console.log('addChange', v);
        setGroupList(v);
        setTopList([{ ...data }, ...topList]);
    }
    // 删除置顶回调
    const deleteChange = (v: any) => {
        console.log('addChange', v);
        const topArr: any = topList.filter((item: any) => item.id !== v.id);
        const group: any = groupList.map((item: any) => {
            item.carModelList = (item.carModelList || []).map((c: any) => {
                if (c.id === v.id) {
                    c.isAdded = false;
                };
                return c;
            })
            return item;
        })
        setTopList(topArr);
        setGroupList(group)
    }

    // 显示详细信息drawer
    const showDrawer = () => {
        setDrawerVis(true);
        setTheId(76);
        setComType('cloud');
    }
    return <Style>
        <Body>
            <Content>
                <Content.Header
                    title={'整车展示'}
                    subtitle={
                        <>
                            <div >
                                {carName ? <ListItem><img src={car} /><div className='name' onClick={() => showDrawer()}>{carName}</div></ListItem> : null}
                            </div>
                        </>
                    }
                    operation={<HeaderOperation >
                        {!edit ? <div style={{ marginRight: 24, cursor: 'pointer' }} onClick={() => clickEdit()}>设置</div> : null}
                        {edit ? (<div style={{ marginRight: 24, cursor: 'pointer' }} onClick={() => save()}>保存</div>) : null}
                        {edit ? (<div style={{ marginRight: 24, cursor: 'pointer' }} onClick={() => cancel()}>取消</div>) : null}
                        <div style={{ marginRight: 5, cursor: 'pointer' }} onClick={() => clickShow()}>{!show ? '展开' : '收起'}</div>
                        <div style={{ cursor: 'pointer' }} onClick={() => clickShow()} >{!show ? <IconFont name='chevron-down' /> : <IconFont name='chevron-up' />}</div>
                    </HeaderOperation>}
                >

                </Content.Header>

                <Content.Body style={{ width: '100%', height: 'auto' }} full>
                    <HearderList deleteChange={(v) => deleteChange(v)} addChange={(v, data) => addChange(v, data)} edit={edit} show={show} topList={topList} groupList={groupList} changeCar={(v) => changeCar(v)}></HearderList>
                    <CardMain>
                        <MyGraph></MyGraph>
                    </CardMain>
                </Content.Body>
            </Content>
        </Body>
        <InfoDrawer comType={comType} onClose={() => setDrawerVis(false)} theId={theId} visible={drawerVis} />
    </Style>
}