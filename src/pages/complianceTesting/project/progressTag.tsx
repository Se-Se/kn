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
`;
const ProcessIng = style.li`
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
const SuccessText=style.div`
    font-size: 14px;
    font-weight: 400;
    color:#0E9D61;
`
const FailText=style.div`
    font-size: 14px;
    font-weight: 400;
    color:#E34D59;
`
const IgnoreText=style.div`
    font-size: 14px;
    font-weight: 400;
    color: rgba(0,0,0,0.55);
`
type DrawerProps = {
    progress: any
    type?:string;
};


export const ProgressTag: React.FC<DrawerProps> = (props: DrawerProps) => {
    // 上传图标状态
    const progressIconFn = (text: any) => {
        if (text === 4) {
            return (
                <UnUploadLi><span className='li-round'></span>未处理</UnUploadLi>
            )
        } else if (text === 5) {
            return (
                <ProcessIng><span className='li-round'></span>处理中</ProcessIng>
            )
        } else if ([1,2,3].includes(text)) {
            return (

                <SuccessTdLi> <span className='li-round'></span>已处理</SuccessTdLi>
            )
        } else {
            return (
                <UnUploadLi><span className='li-round'></span>未处理</UnUploadLi>
            )
        }
    }

        // 测试结果状态
        const resultFn = (text: any) => {
            if ([4,5].includes(text)) {
                return '-'
            } else if (text===1) {
                return (
                    <SuccessText>通过</SuccessText>
                )
            } else if(text===2) {
                return (
                    <FailText>未通过</FailText>
                )
            }else if(text===3) {
                return (
                    <IgnoreText>忽略</IgnoreText>
                )
            }
        }
    return (
        <>
            {props.type!=='result'?progressIconFn(props.progress):resultFn(props.progress)}
        </>
    );
};
