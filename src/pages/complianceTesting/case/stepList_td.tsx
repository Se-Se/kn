import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import style from '@emotion/styled/macro';
import { Layout, Breadcrumb, Button as TButton } from 'tdesign-react';
import { Button } from '@tencent/tea-component';
import rightIcon from '../../../image/checkRight.svg';
import openIcon from '../../../image/iconOpen.svg';
import closeIcon from '../../../image/iconClose.svg';
import checkCircleIcon from '../../../image/check-circle.svg';
import loadingIcon from '../../../image/loading-blue.svg';
import activeIcon from '../../../image/caret-right.svg'

type stepListType = {
    stepList: any[]
    setSelectStepId: Dispatch<SetStateAction<string>>
    current: number
    isCollapse: any
    setIsCollapse: any
    activeIndex:number
    setActiveIndex: Dispatch<SetStateAction<number>>
}
type nodeType = {
    value: any
    index: any
    current: any
    isCollapse: any
    activeIndex: any
    clickHandle: any
}

const ContentGroupBlock = style.div`
    width: 222px;
    height: 36px;
    background: white;
    display: flex;
    cursor: pointer;
`;
const ContentGroupBlockTitle = style.div`
    width: 34px;
    height: 34px;
    background: #078D5C;
    color:white;
    font-size:18px;
    font-weight: 700;
    text-align: center;
    line-height: 33px;
`;
const ContentGroupBlockContent = style.div`
    width: 186px;
    display: flex;
    align-items: center;
`;
const ContentGroupBlockText = style.div`
    width: 147px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 32px;
    margin-left: 8px;
`;
const ConnectLine = style.div`
    width:2px;
    height: 34px;
    margin-left: 110px;
`;
const ActiveIcon = style.div`
    width:8px;
    height:11px;
    position: absolute;
    left: -23px;
    top: 7px;
`;


const { Header, Footer, Content } = Layout;


const ContentGroup: React.FC<nodeType> = ({ value, index, current, isCollapse, activeIndex, clickHandle }) => {

    let borderStyle = '';
    let titleStyle = '';

    if (index + 1 === current) {
        borderStyle = '2px solid #0052D9';
        titleStyle = '#0052D9';
    }
    else if (index + 1 < current) {
        borderStyle = '2px solid #078D5C';
        titleStyle = '#078D5C';
    }
    else {
        borderStyle = '2px solid #DCDCDC';
        titleStyle = '#DCDCDC';
    }
    return <div onClick={clickHandle}>
        <ContentGroupBlock style={{
            border: borderStyle,
            width: isCollapse ? 36 : 222,
            position: 'relative'
        }}>
            {
                index === activeIndex ? <ActiveIcon>
                    <img src={activeIcon}></img>
                </ActiveIcon> : null
            }
            <ContentGroupBlockTitle style={{
                background: titleStyle
            }}>
                {index + 1}
            </ContentGroupBlockTitle>
            {
                isCollapse ? null : <ContentGroupBlockContent>
                    <ContentGroupBlockText title={value.stepName}>
                        {value.stepName}
                    </ContentGroupBlockText>
                    {
                        index + 1 <= current ? <img style={{ width: 16, height: 16 }} src={index + 1 === current ? loadingIcon : checkCircleIcon}></img> : null
                    }

                </ContentGroupBlockContent>
            }
        </ContentGroupBlock>
    </div>
}


export const StepList: React.FC<stepListType> = ({ stepList, current, setSelectStepId, isCollapse, setIsCollapse,activeIndex, setActiveIndex }) => {

    useEffect(() => {
        // console.log(console.log(stepList))
    }, [stepList])


    useEffect(() => {
    }, [])


    return <Layout style={{
        width: isCollapse ? 90 : 270,
        minHeight: 500,
        height: '78%',
        background: 'white',
        boxShadow: '-2px 0 12px 0 rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 98,
        right: 0
    }}>
        <Header style={{
            height: 48,
            justifyContent: 'space-between',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgb(231, 231, 231)',
            marginLeft: isCollapse ? 12 : 25,
            marginRight: isCollapse ? 12 : 25
        }}>
            <div style={{ fontWeight: 700 }}>
                检测流程
            </div>
        </Header>
        <Content style={{ marginTop: 24, maxHeight: '100%', overflowY: 'auto', overflowX: 'hidden', paddingLeft: isCollapse ? 28 : 25 }}>
            {
                stepList.map((value, key) => {
                    return <div key={key}>
                        <ContentGroup clickHandle={() => { 
                            setActiveIndex(key);
                            setSelectStepId(value.stepId); 
                        }}
                            index={key}
                            value={value}
                            current={current}
                            isCollapse={isCollapse}
                            activeIndex={activeIndex}>
                        </ContentGroup>
                        {
                            key < stepList.length - 1 ? <ConnectLine style={{ background: key + 1 < current ? '#078D5C' : '#DCDCDC' }}></ConnectLine> : null
                        }
                    </div>
                })
            }
        </Content>
        <Footer style={{ padding: '17px 0px', display: 'flex', paddingLeft: 25 }}>
            <Button type="link" onClick={() => { setIsCollapse(!isCollapse) }}>{isCollapse ? '展开' : '收起'}</Button>
            <img style={{ marginLeft: 5 }} src={isCollapse ? openIcon : closeIcon}></img>
        </Footer>
    </Layout>
}