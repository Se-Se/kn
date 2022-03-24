import React from 'react';
import style from '@emotion/styled/macro';


const SuccessTdLi = style.li`
    background-color:#E7F6F0;
    padding:0px 5px;
    width:54px;
    height:20px;
    list-style:none;
    color: #0E9D61;
    font-size: 12px;
    font-weight: 100;
    .li-round{
        width: 4px;
        height: 4px;
        margin-right:4px;
        background: #0E9D61;
        display: inline-block;
        transform: translateY(-2px);
        border-radius: 50%;
    }
`;
const UnUploadLi = style.li`
    background-color:#FFF6E6;
    padding:0px 5px;
    width:54px;
    height:20px;
    list-style:none;
    color: #FF9D00;
    font-size: 12px;
    font-weight: 100;
    .li-round{
    width: 4px;
    height: 4px;
    margin-right:4px;
    background: #FF9D00;
    display: inline-block;
    transform: translateY(-2px);
    border-radius: 50%;
    }
`
const ProgressTdLi = style.li`
    background-color:#E6EEFC;
    padding:0px 5px;
    width:54px;
    height:20px;
    list-style:none;
    color: #0052D9;
    font-size: 12px;
    font-weight: 100;
    .li-round{
    width: 4px;
    height: 4px;
    margin-right:4px;
    background: #0052D9;
    display: inline-block;
    transform: translateY(-2px);
    border-radius: 50%;
    }
`;
type DrawerProps = {
    progress: any

};


export const ProgressTag: React.FC<DrawerProps> = (props: DrawerProps) => {
    // 上传图标状态
    const progressIconFn = (text: any) => {
        if (text === 0) {
            return (
                <UnUploadLi><span className='li-round'></span>未上传</UnUploadLi>
            )
        } else if (text === 2) {
            return (
                <ProgressTdLi><span className='li-round'></span>上传中</ProgressTdLi>
            )
        } else if (text === 1) {
            return (

                <SuccessTdLi > <span className='li-round'></span>已完成</SuccessTdLi>
            )
        } else {
            return (
                <UnUploadLi><span className='li-round'></span>未上传</UnUploadLi>
            )
        }
    }
    return (
        <>
            {progressIconFn(props.progress)}
        </>
    );
};
