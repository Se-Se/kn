import React, { useState, useEffect, useRef } from "react";
import style from "@emotion/styled/macro";
import {
  Button,
  Cascader,
  Divider,
  Drawer,
  Form,
  Input,
  Textarea,
} from "tdesign-react";
import styled from "@emotion/styled/macro";
import { CloseCircleFilledIcon, CheckCircleFilledIcon } from 'tdesign-icons-react';

const Style = styled.div`
  .button-footer {
    width: 100px;
  }
  .t-textarea__inner {
    height: 100px;
  }
  .t-drawer__body {
    padding: 0;
  }
  .t-drawer__body {
    padding: 0;
  }
  .is_error{
    border-color:#e34d59 !important;
  }
`;
const AlertText = style.div`
height: auto;
min-height: 24px;
line-height: 20px;
font-size: 12px;
display: inline-block;
color: #e34d59 !important;
`;
type CascaderProps = {
  onChange: (value: Array<any>) => void;
  value: Array<any>;
  width?: number;
  optList: any;
  visible: boolean;//是否显示Cascader
  required?: boolean;
  isSaved?: boolean;
  isShowWarning:boolean;
  isNotForm?:boolean;
  statusIcon?:boolean;
};

export const MyCasCader: React.FC<CascaderProps> = (props: CascaderProps) => {
  const formRef = useRef();
  const [notEmpty, setNotEmpty] = useState<any>(false);
  const [option,setOption] = useState<any>([])
  useEffect(() => {
    console.log("props", props);
    if (props.value.length) {
      setNotEmpty(false);
    } else {
      setNotEmpty(true);
    }
  }, [props.value]);
  useEffect(()=>{
    const opt = props.optList
    
    setOption(opt)
  },[props.optList])
  const fn = () => {
    return props.optList;
  };
  return (
    <Style>
      <div style={{ display: "flex", paddingBottom: 16}}>
        <div
          className={`t-form__label t-form__label--left ${props.required ? "t-form__label--required" : ""}`}
          style={props.isNotForm?{ flexShrink: 0 }:{width: 120, flexShrink: 0}}
        >
          <label>所属系统{props.isNotForm?':':''}</label>
        </div>
        {props.visible&& option.length>0 ?  (
          <div style={{ width: '100%' }}>
            <div style={{display:'flex'}}>
            <Cascader
              className={`t-form__controls${(props.required  &&props.isShowWarning&& notEmpty) ? " is_error" :""}`}
              options={option}
              onChange={(value) =>{
                console.log(value)
                //@ts-ignore
                props.onChange(value)}
              }
              value={props.value}
              multiple
              clearable
              showAllLevels={true}
              placeholder="请选择所属系统"
              style={props.width?{width:props.width}:{}}
              // valueType="full"
            />
               {props.statusIcon ? <div >
                {props.required &&props.isShowWarning&& notEmpty ? <CloseCircleFilledIcon style={{ color: '#e65e69', fontSize: 25, marginLeft: 8 }} /> : null}
                {props.required &&!props.isShowWarning&& !notEmpty ? <CheckCircleFilledIcon style={{ color: '#19b17e', fontSize: 25, marginLeft: 8 }} /> : null}
              </div> : null}
            </div>
            {props.required &&props.isShowWarning&& notEmpty ? <AlertText className="t-input__extra">请输入所属系统</AlertText> : null}
          </div>
        ) : null}
      </div>
    </Style>
  );
};
