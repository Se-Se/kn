import React, { useEffect, useState } from "react";
import { Transfer } from "@tencent/tea-component";
import styled from '@emotion/styled/macro';
import { Drawer, Button, Tree, Input, Checkbox } from 'tdesign-react';
import { SearchIcon } from "tdesign-icons-react";


const FootButtonGroup = styled.div`
  display: flex;
  height: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const Style = styled.div`
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
    width:184px !important;
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
    onClose: () => void;
    save: (v:any) => void;
    optList?: any; //树结构原数组
    selectV?: any[]; //目标初始数组
    title?: string;
    selectTitle?:string;

};


export const TreeTransferDrawer: React.FC<DrawerProps> = (props: DrawerProps) => {
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
    const [checkLeft, setCheckLeft] = useState<any>(false);//左侧checkbox
    const [checkRight, setCheckRight] = useState<any>(false);//右侧checkbox



    useEffect(() => {
        setTargetKeys(props.selectV || []);
        console.log('props--->', props);
        getLists();
    }, [props.visible]);

    useEffect(() => {
        getLists();
        console.log('targetKeys', targetKeys)
    }, [targetKeys])

    useEffect(() => {
        console.log(sourceSelectedKeys)
    }, [sourceSelectedKeys])

    useEffect(() => {
        console.log('sourceList--------->>>', sourceList)
    }, [sourceList])
    const getLists = () => {
        let sArr: any = JSON.parse(JSON.stringify(props.optList));
        recurrenceSourceTree(sArr);// 左侧树递归
        setSourceList(sArr);
        setSourceAllList(sArr);
        let tArr: any = JSON.parse(JSON.stringify(props.optList));
        recurrenceTargetTree(tArr);// 目标树递归
        console.log('tarr-----',tArr)
        setTargetList(tArr);
        setTargetAllList(tArr);
    }

    // 目标树递归
    const recurrenceTargetTree = (arr: any) => {
        recurrenceGetTList(arr);
        formatter(arr);
    }

    // 左侧树递归
    const recurrenceSourceTree = (arr: any) => {
        recurrenceGetSList(arr);
        formatter(arr);
    }

    // 递归source fn
    const recurrenceGetSList = (data: any, parentItem?: any) => {
        let childrens: any = [];
        data.forEach((i: any) => {
            if (i.children?.length) {
                childrens.push(i);
                recurrenceGetSList(i.children, i)
            } else {
                if (!targetKeys.includes(i.value)) {
                    childrens.push(i)
                }
            }
        });

        if (parentItem) {
            parentItem.children = childrens.map((item: any) => item);
        }
    }

    // 递归 target fn
    const recurrenceGetTList = (data: any, parentItem?: any) => {
        let childrens: any = [];
        data.forEach((i: any) => {
            if (i.children?.length) {
                childrens.push(i);
                recurrenceGetTList(i.children, i)
            } else {
                if (targetKeys.includes(i.value)) {
                    childrens.push(i)
                }
            }
        });

        if (parentItem) {
            parentItem.children = childrens.map((item: any) => item);
        }

    }

    // 删除递归后多余数据
    const formatter = (arr: any, parent?: any) => {
        if (!arr) {
            return;
        }
        arr.map((item: any, index: number) => {
            if (item.children?.length === 0) {
                arr.splice(index, 1);
                formatter(arr)
            }

            if (item.children && item.children.length) {
                formatter(item.children, arr)
            }
        });

        if (arr.length === 0) {
            formatter(parent)
        }
    }


    // 确认关联
    const handleSave = () => {
        props.save(targetKeys);
    }


    const sourceChange = (v: any) => {
        let val: any = Array.from(new Set(v))
        console.log('source', v, val, sourceList);
        setSourceSelectedKeys(val);
    }
    const targetChange = (v: any) => {
        let val: any = Array.from(new Set(v))
        console.log('target', v, val);
        setTargetSelectedKeys(val)
    }
    // 原穿梭btn
    const optionLeftClick = () => {
        console.log('sourceSelectedKeys', sourceSelectedKeys,);
        let newKeys: any = sourceSelectedKeys.filter((i: any) => !targetKeys.includes(i));
        setTargetKeys((v: any) => [...v, ...newKeys]);
        setSourceSelectedKeys([]);
        setCheckLeft(false);
        setCheckRight(false);
        setSourceSearchValue('');
        setTargetSearchValue('');
    }
    // 目标穿梭btn
    const optionRightClick = () => {
        console.log('targetSelectedKeys', targetSelectedKeys);
        setTargetKeys((targetKeys: any) =>
            targetKeys.filter((i: any) => !targetSelectedKeys.includes(i))
        );
        setTargetSelectedKeys([]);
        setCheckLeft(false);
        setCheckRight(false);
        setSourceSearchValue('');
        setTargetSearchValue('');
    }

    // 搜索树递归fn
    const recurrenceSearch = (arr: any, v: any) => {
        searchVList(arr, v);
        formatter(arr);
    }
    // 搜索树递归f1
    const searchVList = (arr: any, v: any, parentItem?: any) => {
        let childrens: any = [];
        arr.forEach((i: any) => {
            if (i.children?.length) {
                childrens.push(i);
                searchVList(i.children, v, i)
            } else {
                if (i.label.includes(v)) {
                    childrens.push(i)
                }
            }
        });

        if (parentItem) {
            parentItem.children = childrens.map((item: any) => item);
        }

    }

    // 左侧搜索
    const searchLeft = (v: any) => {
        console.log('searchLeft', v, sourceList)
        setSourceSearchValue(v);
        setSourceSelectedKeys([]);
        if (v) {
            let copyList = JSON.parse(JSON.stringify(sourceAllList));
            recurrenceSearch(copyList, v)// 搜索树递归fn
            setSourceList((v: any) => {
                v = [];
                return copyList;
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
            recurrenceSearch(copyList, v)// 搜索树递归fn
            setTargetList((v: any) => {
                v = [];
                return copyList;
            });
        } else {
            setTargetList(targetAllList);
        }
    }

    // 左侧全选择checkbox
    const handleSelecAll = (v: any) => {
        console.log(v, sourceList, targetList);
        setCheckLeft(v);

    }

    // target全选择checkbox
    const handleTargetSelecAll = (v: any) => {
        console.log(v, sourceList, targetList);
        setCheckRight(v);

    }

    // 根据左侧checkbox变化更新树数据
    useEffect(() => {
        if (checkLeft) {
            let sArr: any = []
            getAllV((sourceList || []), sArr);
            setSourceSelectedKeys(sArr);
        } else {
            setSourceSelectedKeys([]);
        }
    }, [checkLeft]);

    // 根据右侧checkbox变化更新树数据
    useEffect(() => {
        if (checkRight) {
            let tArr: any = []
            getAllV((targetList || []), tArr);
            setTargetSelectedKeys(tArr);
        } else {
            setTargetSelectedKeys([]);
        }
    }, [checkRight]);

    // 获取sourceList(左侧)，targetList(目标) 的全部value
    const getAllV = (data: any, arr: any) => {
        data.map((i: any) => {
            if (i.children?.length) {
                getAllV(i.children, arr)
            } else {
                arr.push(i.value)
            }
        });
        return arr;
    }

    return (
        <Style>

            <Drawer
                visible={props.visible}
                onClose={() => { props.onClose() }}
                destroyOnClose={true}
                header={
                    <span style={{ fontWeight: 'bold' }}>
                       { props.title||'关联软件资产'}
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
                <Transfer
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
                            title={props.selectTitle||'请选择关联软件'}
                            header={
                                <TransferHeader>
                                    <CheckboxContent>
                                        <Checkbox className="kn-check-box" checked={checkLeft} onChange={(v) => handleSelecAll(v)}></Checkbox>
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
                            {props.visible ? <Tree
                                value={sourceSelectedKeys}
                                onChange={(v: any) => sourceChange(v)}
                                data={sourceList}
                                expandAll={true}
                                hover={true}
                                checkable
                                transition={true}
                            /> : null}

                        </Transfer.Cell>
                    }
                    rightCell={
                        <Transfer.Cell
                            scrollable={true}
                            title='已选择'
                            header={
                                <TransferHeader>
                                    <CheckboxContent>
                                        <Checkbox className="kn-check-box" checked={checkRight} onChange={(v) => handleTargetSelecAll(v)}></Checkbox>
                                        <span className="box-text">{`${targetSelectedKeys.length}项`}</span>
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
                            {props.visible ? <Tree
                                value={targetSelectedKeys}
                                onChange={(v: any) => targetChange(v)}
                                expandAll={true}
                                hover={true}
                                checkable
                                transition={true}
                                data={targetList}
                            /> : null}
                        </Transfer.Cell>
                    }
                />
            </Drawer>
        </Style>
    );
};
