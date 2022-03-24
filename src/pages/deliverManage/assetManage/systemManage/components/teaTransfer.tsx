import React, { useEffect, useState } from "react";
import { Transfer } from "@tencent/tea-component";
import styled from '@emotion/styled/macro';
import { Drawer, Button, Tree, Input, Checkbox, message } from 'tdesign-react';
import { SearchIcon } from "tdesign-icons-react";
import { systemRelationSoftWare } from '../../../util/api';


const FootButtonGroup = styled.div`
  display: flex;
  height: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const Style = styled.div`
    height:100%;
  .button-footer {
    width: 100px;
  }
  .t-textarea__inner{
    height:100px;
  }
  .t-drawer__body{
    padding:20px;
    height:100%;
  }
.tea-transfer__title{
    color:#8b8b8b;
}
.transfer-content{
    width:100%;
}
.t-transfer__list{
    width:50%
}
.transfer-header{
    display:flex;
    width:100%;
    margin-bottom:2px;
    color:#808080;
}
.input-search{
    margin:10px;
}
.kn-transfer{
    height: calc(100% - 40px);
  .tea-transfer__cell{
    height:100%;   
  }
  .tea-transfer__content{
  height:600px; //之后查看
   
  }
.tea-transfer__inner{
    border-top:unset;
  }
.tea-transfer__inner::-webkit-scrollbar {/*滚动条整体样式*/
    width: 8px;     
    height: 1px;
 }
.tea-transfer__inner::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 8px;
    background: #eee;
 }
.tea-transfer__inner::-webkit-scrollbar-track {/*滚动条里面轨道*/
    border-radius: 8px;
    width:10px;
 }
 .tea-pagination__turnbtn{
    //  background-color:#0052d9;
 }
 .tea-pagination__turnbtn.is-disabled{
    background-color:#e7eaef;
 }
}

.t-drawer__content-wrapper{
    width:480px !important;
  }
  .tea-transfer__body{
      height:100%;
  }
  .input-search {
      width:184px !important;
  }
`;
const TransferHeader = styled.div`
 display: flex;
 width: 100%;
 justify-content: space-between;
 flex-wrap: wrap;
 flex-direction:column;
 border:1px solid #cfd5de;
 border-bottom:unset;

`
const CheckboxContent = styled.div`
  width:100%;
  height:50px;
  padding:0 20px;
  border-bottom:1px solid #cfd5de;
  position:relative;
  .kn-check-box{
      margin-top:17px;
  }
  .box-text{
      height:initial;
      text-align:middle;
      position:absolute;
      top:50%;
      transform:translateY(-50%);
      left: 40px;
  }
`
type DrawerProps = {
    visible?: boolean;
    theId?: string;
    onClose: () => void;
    save: () => void;
    editData?: any;
    optList?: any;
    selectV?: any[];
    searchChange: (v: any) => void;

};

const targetIdsList = [85]



export const MyDrawer: React.FC<DrawerProps> = (props: DrawerProps) => {
    // 右侧框数据 key
    const [targetKeys, setTargetKeys] = useState<any>([]);

    const [sourceSearchValue, setSourceSearchValue] = useState<any>("");//左侧搜索内容
    const [targetSearchValue, setTargetSearchValue] = useState<any>("");//目标搜索内容
    const [sourceSelectedKeys, setSourceSelectedKeys] = useState<any>([]); //左侧选择的keys
    const [targetSelectedKeys, setTargetSelectedKeys] = useState<any>([]); //目标选择的keys
    const [targetList, setTargetList] = useState<any>([]);//目标list
    const [sourceList, setSourceList] = useState<any>([]); //左侧list
    const [targetAllList, setTargetAllList] = useState<any>([]);//目标全部list
    const [sourceAllList, setSourceAllList] = useState<any>([]);//左侧全部list


    useEffect(() => {
        console.log('tttt', props);
        setTargetKeys(props.selectV);
    }, [props.visible]);

    useEffect(() => {
        getTargetList(props.optList)
    }, [targetKeys])

    const getTargetList = (a: any) => {
        let tArr: any = [];
        let sArr: any = [];
        a.map((i: any) => {
            let tobj: any = {
                label: i.label,
                value: i.value,
                children: []
            };
            let sobj: any = {
                label: i.label,
                value: i.value,
                children: []
            };
            tobj.children = i.children.filter((item: any) => targetKeys.includes(item.value));
            sobj.children = i.children.filter((item: any) => !targetKeys.includes(item.value));
            if (tobj.children.length) {
                tArr.push(tobj);
            }
            if (sobj.children.length) {
                sArr.push(sobj);
            }
            return;
        })
        setSourceList(sArr);
        setSourceAllList(sArr);
        setTargetList(tArr);
        setTargetAllList(tArr);
    }

    // 确认关联
    const handleSave = () => {
        console.log('save', targetKeys, targetSelectedKeys);
        let params: any = {
            softwareIds: targetKeys,
            systemIds: [Number(props.theId)]
        }
        systemRelationSoftWare(params).then((res: any) => {
            if (res?.code === 0) {
                props.save();
                props.onClose();
            } else {
                message.error('关联失败')
            }
        })
    }
    const sourceChange = (v: any) => {
        console.log('source', v);
        setSourceSelectedKeys(v)
    }
    const targetChange = (v: any) => {
        console.log('target', v);
        setTargetSelectedKeys(v)
    }
    // 原穿梭btn
    const optionLeftClick = () => {
        console.log('sourceSelectedKeys', sourceSelectedKeys);
        let newKeys: any = sourceSelectedKeys.filter((i: any) => !targetKeys.includes(i));
        setTargetKeys((v: any) => [...v, ...newKeys]);
        setSourceSelectedKeys([]);
    }
    // 目标穿梭btn
    const optionRightClick = () => {
        console.log('targetSelectedKeys', targetSelectedKeys);
        setTargetKeys((targetKeys: any) =>
            targetKeys.filter((i: any) => !targetSelectedKeys.includes(i))
        );
        setTargetSelectedKeys([]);
    }

    // 左侧搜索
    const searchLeft = (v: any) => {
        console.log('searchLeft', v, sourceList)
        setSourceSearchValue(v);
        setSourceSelectedKeys([]);
        if (v) {
            let copyList = JSON.parse(JSON.stringify(sourceAllList));
            let arr: any = []
            copyList.map((s: any) => {
                const children: any = s.children.filter((c: any) => c.label.includes(v));
                if (children.length) {
                    let obj: any = {
                        label: s.label,
                        value: s.value,
                        children
                    };
                    arr.push(obj);
                }
            });
            setSourceList((v: any) => {
                v = [];
                return arr;
            });
        } else {
            setSourceList(sourceAllList);
        }
    }
    // target侧搜索
    const searchRight = (v: any) => {
        console.log('searchRight', v)
        setTargetSearchValue(v);
        setTargetSelectedKeys([]);
        if (v) {
            let copyList = JSON.parse(JSON.stringify(targetAllList));
            let arr: any = []
            copyList.map((s: any) => {
                const children: any = s.children.filter((c: any) => c.label.includes(v));
                if (children.length) {
                    let obj: any = {
                        label: s.label,
                        value: s.value,
                        children
                    };
                    arr.push(obj);
                }
            });
            setTargetList((v: any) => {
                v = [];
                return arr;
            });
        } else {
            setTargetList(targetAllList);
        }
    }

    // 左侧全选择checkbox
    const handleSelecAll = (v: any) => {
        console.log(v, sourceList, targetList);
        if (v) {
            let sArr: any = getAllV(sourceList || []);
            setSourceSelectedKeys(sArr);
        } else {
            setSourceSelectedKeys([]);
        }
    }

    // target全选择checkbox
    const handleTargetSelecAll = (v: any) => {
        console.log(v, sourceList, targetList);
        if (v) {
            let tArr: any = getAllV(targetList || []);
            setTargetSelectedKeys(tArr);
        } else {
            setTargetSelectedKeys([]);
        }
    }

    // 获取sourceList(左侧)，targetList(目标) 的全部value
    const getAllV = (data: any) => {
        let arr: any = [];
        data.map((i: any) => {
            i.children.map((c: any) => {
                arr.push(c.value);
            })
        });
        return arr;
    }

    return (
        <Style>

            <Drawer
                visible={props.visible}
                onClose={() => { props.onClose() }}
                destroyOnClose={true}
                size='large'
                header={
                    <span style={{ fontWeight: 'bold' }}>
                        关联软件资产
                    </span>
                }
                footer={
                    <FootButtonGroup>
                        <Button
                            theme='primary'
                            style={{ width: 88, height: 32 }}
                            className='button-footer'
                            onClick={() => handleSave()}

                        >
                            确认关联
                        </Button>
                        <Button
                            style={{ width: 60, height: 32 }}
                            theme='default'
                            className='button-footer'
                            onClick={() => { props.onClose() }}
                        >
                            取消
                        </Button>

                    </FootButtonGroup>
                }
            >
                {props.visible ? <Transfer
                    className="kn-transfer"
                    operations={[
                        {
                            disabled: sourceSelectedKeys.length === 0,
                            onClick: () => optionLeftClick(),
                            className: 'kn-arrow'
                        },
                        {
                            disabled: targetSelectedKeys.length === 0,
                            onClick: () => optionRightClick(),
                        },
                    ]}
                    leftCell={
                        <Transfer.Cell
                            scrollable={true}
                            title="请选择关联软件"
                            header={
                                <TransferHeader>
                                    <CheckboxContent>
                                        <Checkbox className="kn-check-box" onChange={(v) => handleSelecAll(v)}></Checkbox>
                                        <span className="box-text">{`${sourceSelectedKeys.length}项`}</span>
                                    </CheckboxContent>
                                    <Input
                                        type="search"
                                        placeholder="搜索"
                                        className="input-search"
                                        value={sourceSearchValue}
                                        onChange={(v) => searchLeft(v)}
                                        suffixIcon={
                                            <SearchIcon
                                                style={{ cursor: "pointer" }}
                                            />
                                        }
                                    ></Input>
                                </TransferHeader>

                            }
                        >
                            <Tree
                                value={sourceSelectedKeys}
                                onChange={(v: any) => sourceChange(v)}
                                data={sourceList}
                                expandAll={true}
                                hover={true}
                                checkable
                                transition={true}
                            />
                        </Transfer.Cell>
                    }
                    rightCell={
                        <Transfer.Cell
                            scrollable={true}
                            title='已选择'
                            header={
                                <TransferHeader>
                                    <CheckboxContent>
                                        <Checkbox className="kn-check-box" onChange={(v) => handleTargetSelecAll(v)}></Checkbox>
                                        <span className="box-text">{`${targetKeys.length}项`}</span>
                                    </CheckboxContent>

                                    <Input
                                        type="search"
                                        placeholder="搜索"
                                        className="input-search"
                                        value={targetSearchValue}
                                        onChange={(v) => searchRight(v)}
                                        suffixIcon={
                                            <SearchIcon
                                                style={{ cursor: "pointer" }}
                                            />
                                        }
                                    ></Input>
                                </TransferHeader>

                            }
                        >
                            <Tree
                                value={targetSelectedKeys}
                                onChange={(v: any) => targetChange(v)}
                                expandAll={true}
                                hover={true}
                                checkable
                                transition={true}
                                data={targetList}
                            />
                        </Transfer.Cell>
                    }
                /> : null}

            </Drawer>
        </Style>
    );
};
