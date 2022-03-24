import React, { useState, useEffect, useRef } from "react";
import style from "@emotion/styled/macro";
import { Cascader } from "tdesign-react";
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
  .not-required{
    padding-left: 10px;
  }
  .t-form__controls{
    margin:0px !important;
  }
  .kn-dialog-cascader{
    margin-bottom:0px;
    .t-form__label{
      padding:0 !important;
      width:90px !important;
      margin-right:24px;
    }
    .t-popup__reference{
      width:298px;
    }
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
  value?: any;
  width?: number;
  optList?: any;
  visible: boolean;//是否显示Cascader
  required?: boolean;
  isSaved?: boolean;
  statusIcon?: boolean;
  style?: any;
  multiple?: boolean;
  label?: string;
  placeholder?: string;
  className?:string;
};

export const MyCasCader: React.FC<CascaderProps> = (props: CascaderProps) => {
  const formRef = useRef();
  const [notEmpty, setNotEmpty] = useState<any>(false);

  useEffect(() => {
    console.log("props", props);

    if (props.value) {
      setNotEmpty(false);
    } else {
      setNotEmpty(true);
    }
  }, [props.value]);

  const onChange = (value: any) => {
    props.onChange(value)
  };

  return (
    <Style>
      <div className={props.className} style={{ display: "flex", marginBottom: 24 }}>
        <div
          className={`t-form__label t-form__label--left ${props.required ? "t-form__label--required" : "not-required"}`}
          style={{ width: 110, flexShrink: 0 }}
        >
          <label>{props.label}</label>
        </div>
        {props.visible ? (
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex' }}>
              <Cascader
                className={`t-form__controls ${props.required && props.isSaved && notEmpty ? "is_error" : ""}`}
                options={props.optList}
                onChange={(v: any) => onChange(v)}
                value={props.value}
                // multiple
                clearable
                // showAllLevels={false}
                placeholder={props.placeholder}
                style={props.style}
              />
              {props.statusIcon ? <div >
                {props.required && props.isSaved && notEmpty ? <CloseCircleFilledIcon style={{ color: '#e65e69', fontSize: 25, marginLeft: 8 }} /> : null}
                {props.required && props.isSaved && !notEmpty ? <CheckCircleFilledIcon style={{ color: '#19b17e', fontSize: 25, marginLeft: 8 }} /> : null}
              </div> : null}
            </div>

            {props.required && props.isSaved && notEmpty ? <AlertText className="t-input__extra">请输入所属车型</AlertText> : null}
          </div>
        ) : null}
      </div>
    </Style>
  );
};
