import React, { Dispatch, SetStateAction, useState } from 'react';
import { Localized } from 'i18n';
import { H3 } from '@tencent/tea-component';
import rightIcon from '../../../image/checkRight.svg'
type stepListType = {
    stepList: any[]
    setSelectStep: Dispatch<SetStateAction<string>>
    current: number
    setSelectItem: Dispatch<any>
    selectItem: any
}

export const StepList: React.FC<stepListType> = ({ stepList, current, setSelectStep, selectItem, setSelectItem }) => {
    const [hoverItem, setHoverItem] = useState<any>();
    // const [selectItem, setSelectItem] = useState<any>(0);
    // useEffect(()=>{
    //     if(effectStep){
    //         setSelectItem(effectStep);
    //     }
    //     console.log(effectStep);
    // },[effectStep])

    return <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: 'white' }}>
        <div style={{ width: 'calc(100% - 40px)', height: 10, padding: 20, borderBottom: '1px solid #e7eaef' }}>
            <H3>
                <Localized id="compliance-stepProgress"></Localized>
            </H3>
        </div>
        <ul>
            {
                stepList.map((value: any, key: any) => {
                    return <li key={key}>
                        <div style={{
                            width: '100%', height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center',
                            background: hoverItem === key || selectItem === key ? '#F2F2F2' : 'white'
                        }}
                            onMouseOver={() => { setHoverItem(key); }}
                            onMouseLeave={() => { setHoverItem(null) }}
                            onClick={() => {
                                setSelectItem(key);
                                setSelectStep(value.stepId);
                            }}
                        >
                            <div style={{
                                borderRadius: 28,
                                width: current > key || selectItem === key ? 30 : 28,
                                height: current > key || selectItem === key ? 30 : 28,
                                background: current > key || selectItem === key ? '#006EFF' : 'white',
                                fontSize: 18,
                                fontWeight: 600,
                                color: current > key || selectItem === key ? 'white' : '#BBBBBB',
                                textAlign: 'center',
                                lineHeight: current > key || selectItem === key ? '30px' : '28px',
                                marginLeft: 20,
                                border: current > key || selectItem === key ? 'none' : '#BBBBBB 2px solid',
                            }}>
                                {
                                    (() => {
                                        if (current > key) {
                                            return <img  alt="" src={rightIcon} />
                                        }
                                        else {
                                            return key + 1
                                        }

                                    })()
                                }
                            </div>
                            <div style={{ marginLeft: 10 }}>
                                {value.stepName}
                            </div>
                        </div>
                    </li>
                })
            }
        </ul>
    </div>
}