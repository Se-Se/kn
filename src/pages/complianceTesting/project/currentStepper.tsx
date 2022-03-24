import React, { useMemo } from 'react';
import { Icon, H3 } from '@tencent/tea-component';
import style from '@emotion/styled/macro';
import rightIcon from '../../../image/checkRight.svg'

type currenStepper = {
    steps: any[]
    current: number
}
const MainDom = style.div`
    display: flex;
    width: 100%;
    height: 50px;
    align-items: center;
    justify-content: flex-start;
`;
const StepMainDom = style.div`
    display: flex;
    margin-top: 10px;
    margin-left: 80px;
`;
const StepDom = style.div`
    display: flex;
`;
const TextDom = style.div`
    width: 100%;
    text-align: center;
`;
const StepItemDom = style.div`
    position: relative;
`;
const StepItemDomLineActive = style.div`
    width:100px;
    height:2px;
    background-color: #006eff;
    margin-top: 12px;
`;
const StepItemDomLineGray = style.div`
    width:100px;
    height:2px;
    background-color: #ddd;
    margin-top: 12px;
`;
const CircleDomActive = style.div`
    width: 25px;
    height: 25px;
    background-color: #006eff;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
`;
const CircleDomGray = style.div`
    width: 25px;
    height: 25px;
    background-color: #ddd;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
`;
const TestMian = style.div`
    margin-left: 30px;
    display: flex;
    justify-content: space-between;
    width: calc(100% + 16px);
    height: 20px;
    margin-top: 2px;
    color:#888;
`;
export const CurrentStepper: React.FC<currenStepper> = ({ steps, current }) => {
    // const RenderLine = useMemo(() => {
    // }, [steps])
    const renderStep = useMemo(() => {
        return <>
            <StepMainDom>
                {
                    steps.map((value: any, key: any) => {
                        return <StepDom key={key}>
                            <StepItemDom>
                                {key < current ? <CircleDomActive>
                                    <img src={rightIcon} alt=""></img>
                                </CircleDomActive> :
                                    <CircleDomGray>
                                        <img src={rightIcon} alt=""></img>
                                    </CircleDomGray>}
                            </StepItemDom>
                            {
                                key !== steps.length - 1 ? (key < current - 1 ? <StepItemDomLineActive>
                                    <img src={rightIcon} alt=""></img>
                                </StepItemDomLineActive> : <StepItemDomLineGray>
                                    <img src={rightIcon} alt=""></img>
                                </StepItemDomLineGray>) : null
                            }
                        </StepDom>
                    })
                }

            </StepMainDom>
            <TestMian>
                {
                    steps.map((value: any, key: any) => {
                        return <TextDom key={key}>
                            {value.label}
                            {/* <div style={{position:'absolute'}}>
                                {value.label}
                            </div> */}
                        </TextDom>
                    })

                }
            </TestMian>
        </>
    }, [steps])

    return <MainDom>
        {
            current === steps.length ? <>
                <Icon
                    type={'success'}
                    size="l"
                    style={{ marginTop: -2 }}
                />
                <H3 style={{ marginLeft: 10 }}>检测环境准备已完成</H3>
            </> : <>
                <Icon
                    type={'loading'}
                    size="l"
                    style={{ marginTop: -2 }}
                />
            <H3 style={{ marginLeft: 10 }}>{''}</H3>
            </>
        }
        <div>
            {renderStep}
        </div>
    </MainDom>
}