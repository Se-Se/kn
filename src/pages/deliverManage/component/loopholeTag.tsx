import React from 'react';
import style from '@emotion/styled/macro';

const LoopholeTag = style.div`
border:1px solid #e54545;
width:69px;
height:20px;
display:inline-block;
margin-right:8px;
line-height:18px;
.level{
    color: rgba(255,255,255,1);
    font-size: 12px;
    font-weight: 400;
    display:inline-block;
    width: 50%;
    text-align: center;
}
.num{
    color: rgba(255,255,255,1);
    font-size: 12px;
    font-weight: 400;
    display:inline-block;
    width: 50%;
    text-align: center;
}
`
type DrawerProps = {
    loophole: any

};


export const Loophole: React.FC<DrawerProps> = (props: DrawerProps) => {
    const loopholeTag = (loophole: any) => {
        return (
            <span>
                <LoopholeTag>
                    <span className="level" style={{ color: '#ffff', backgroundColor: '#E34D59', }}>高危</span>
                    <span className="num" style={{ color: '#E34D59', backgroundColor: '#ffff', }}>{loophole?.highRisk}</span>
                </LoopholeTag>
                <LoopholeTag style={{borderColor:'#ED7B2F'}}>
                    <span className="level" style={{ color: '#ffff', backgroundColor: '#ED7B2F', }}>中危</span>
                    <span className="num" style={{ color: '#ED7B2F', backgroundColor: '#ffff', }}>{loophole?.warning}</span>
                </LoopholeTag>
                <LoopholeTag style={{borderColor:'#FFBB00'}}>
                    <span className="level" style={{ color: '#ffff', backgroundColor: '#FFBB00', }}>低危</span>
                    <span className="num" style={{ color: '#FFBB00', backgroundColor: '#ffff', }}>{loophole?.lowRisk}</span>
                </LoopholeTag>
            </span>
        )
    }
    return (
        <>
            {loopholeTag(props.loophole)}
        </>
    );
};
