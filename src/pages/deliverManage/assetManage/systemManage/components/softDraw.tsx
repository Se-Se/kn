import React, { useState, useEffect, useRef } from 'react';
import style from '@emotion/styled/macro';
import { Button, Transfer, Drawer, Form, Tree, Input } from 'tdesign-react';
import styled from '@emotion/styled/macro';
import { MyCasCader } from './cascader';
import { ProjectProcess } from 'pages/report/sys/detail/Process';
import { SearchIcon, IconFont } from "tdesign-icons-react";


const FootButtonGroup = style.div`
  display: flex;
  height: 100%;
  justify-content: flex-end;
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
    width:50%;
}
`;
type DrawerProps = {
    visible?: boolean;
    id?: string;
    onClose: () => void;
    save: () => void;
    editData?: any;
    optList?: any;
    selectV?: any[];
    searchChange: (v: any) => void;

};


export const MyDrawer: React.FC<DrawerProps> = (props: DrawerProps) => {
    const [theV, setTheV] = useState<any>([]);
    const [theAllV, setTheAllV] = useState<any>([]);
    const [searchV1, setSearchV1] = useState<any>([]);
    const [searchV2, setSearchV2] = useState<any>([]);
    const [checkV, setCheckV] = useState<any>([]);
    const [allOptions, setAllOptions] = useState<any>([]);
    const [theOptions, setTheOptions] = useState<any>([]);

    const formRef = useRef<any>(null);
    const TreeNode = (props: any) => <Tree
        {...props}
        expandAll={true}
        hover={true}
        checkable
        transition={true}
    />;




    useEffect(() => {
        setTheV(props.selectV);
        setTheAllV(props.selectV);
    }, [props.selectV]);

    useEffect(() => {
        setTheOptions(props.optList);
        setAllOptions(props.optList);
    }, [props.optList]);

    // 确认关联
    const handleSave = () => {
        console.log('save');
        props.onClose();
    }

    const valueChange = (v: any) => {
        console.log('111v', v);
        setTheV(v);
        setTheAllV(v);
    }

    function handSearch1(event: any, value: any) {
        console.log(123, event, value);
        event.preventDefault();
        if (event.code === 'Enter') {
            setSearchV1(event.target.value);
        }
    }
    function handSearch2(event: any, value: any) {
        event.preventDefault();
        if (event.code === 'Enter') {
            console.log(event.target.value)
            setSearchV2(event.target.value);
        }
    }

    // 右侧搜索
    const filterSearch = (v: any) => {
        if (v) {
            let arr: any = [];
            theOptions.map((item: any) => {
                item.children.map((c: any) => {
                    if (c.label.includes(v) && theV.includes(c.value)) {
                        arr.push(c.value);
                    }
                })
            });
            setTheV((v: any) => {
                v = [];
                return arr;
            });
        } else {
            setTheV(theAllV);
        }
    }

    // 左侧搜索
    const filterSoruceSearch = (v: any) => {
        if (v) {
            let arr: any = [];
            theOptions.map((item: any) => {
                return item.children.filter((c: any) => {
                    if (c.label.includes(v)) {
                        let obj: any = {
                            children: [c],
                            label: item.label,
                            value: item.value
                        }
                        arr.push(obj);
                    }
                })
            });
            setTheOptions((v: any) => {
                v = [];
                return arr;
            });
        } else {
            setTheOptions(allOptions);
        }
    }

    // const addEvent = () => {
    //     const input: any = document.getElementsByClassName('t-input__inner');
    //     input[1]?.addEventListener("keyup", handSearch1, true);
    //     input[2]?.addEventListener('keyup', handSearch2, false);
    // }
    // const removeEvent = () => {
    //     const input: any = document.getElementsByClassName('t-input__inner');
    //     input[1]?.removeEventListener("keyup", handSearch1, false);
    //     input[2]?.removeEventListener('keyup', handSearch2, false);
    // }
    function handleChange() {
        console.log('11111')
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
                        {props.id ? '编辑APP' : '关联软件资产'}
                    </span>
                }
                footer={
                    <FootButtonGroup>
                        <Button
                            variant='outline'
                            theme='default'
                            className='button-footer'
                            onClick={() => { props.onClose() }}
                        >
                            取消
                        </Button>
                        <Button
                            theme='primary'
                            style={{ marginLeft: 10 }}
                            className='button-footer'
                            onClick={() => handleSave()}

                        >
                            确认关联
                        </Button>
                    </FootButtonGroup>
                }
            >
                <div className='transfer-content'>
                    <div className='transfer-header'>
                        <div style={{ marginRight: 282 }}>请选择关联软件 </div>
                        <div>已选择</div>
                    </div>
                    <div className='transfer-header'>
                        <Input
                            type="search"
                            placeholder="搜索"
                            style={{ marginRight: 38 }}
                            className="input-search"
                            onChange={(value) => { filterSoruceSearch(value) }}
                            onEnter={() => { }}
                            suffixIcon={
                                <SearchIcon
                                    onClick={() => { }}
                                    style={{ cursor: "pointer" }}
                                />
                            }
                        ></Input>
                        <Input
                            type="search"
                            placeholder="搜索"
                            className="input-search"
                            onChange={(value) => { filterSearch(value) }}
                            onEnter={() => { }}
                            suffixIcon={
                                <SearchIcon
                                    onClick={() => { }}
                                    style={{ cursor: "pointer" }}
                                />
                            }
                        ></Input>
                    </div>
                    {props.visible ? <Transfer
                        value={theV}
                        onChange={(v) => valueChange(v)}
                        data={theOptions}
                        tree={TreeNode}
                    ></Transfer> : null}

                </div>
            </Drawer>
        </Style>
    );
};
