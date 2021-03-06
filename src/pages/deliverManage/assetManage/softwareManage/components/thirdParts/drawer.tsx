import React, { useState, useEffect, useRef } from 'react';
import style from '@emotion/styled/macro';
import { Button, Drawer, Form, Input, Textarea, Select, TreeSelect, message } from 'tdesign-react';
import styled from '@emotion/styled/macro';
import { MyCasCader } from '../cascader';
import {  CloseCircleFilledIcon } from 'tdesign-icons-react';
import { OptionType } from '../type';
import { createSoftware, editSoftWatre, getSoftWareEcho } from '../../../../util/softwareApi/api';

const { FormItem } = Form;
const { Option }=Select
const FootButtonGroup = style.div`
  display: flex;
  height: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
`;
const FormContentTop = style.div`
  padding:16px;
  padding-bottom: 20px;
`;
const Style = styled.div`
.button-footer {
  width: 60px;
  height:32px;
}
  .t-textarea__inner{
    height:100px;
  }
  .t-drawer__body{
    padding:0;
  }
  .t-drawer__content-wrapper{
    width:480px !important;
  }

`;
type DrawerProps = {
  visible: boolean;
  id: string;
  onClose: (isFetchData:boolean) => void;
  save: () => void;
  optList:any
  moduleBusinessUsedSelector:OptionType[]
};
export const MyDrawer: React.FC<DrawerProps> = (props: DrawerProps) => {
  const formRef = useRef<any>();
  const [loading,setLoading]=useState<boolean>(false);
  const [belongSystemIds,setBelongSystemIds]=useState<any[]>([])
  const [isShowWarning,setIsShowWarning]=useState<boolean>(false)
  const [errcode,setErrcode]=useState<number>(0)
  useEffect(() => {
    if (props.id) {
      fetchData();
    }
  }, [props.id]);

  //@ts-ignore
  const onSubmit = async (e) => {
    console.log('e', e)
    if(belongSystemIds.length==0){
      setIsShowWarning(true)
      return;
    }
    else if (e.validateResult === true) {
      //@ts-ignore
      try {
        setLoading(true)
        setIsShowWarning(false)
        const data = formRef.current.getFieldsValue(true);
        data.moduleIsCommercialUse = Boolean(data.moduleIsCommercialUse)
        data.moduleIsModify = Boolean(data.moduleIsModify)
        data.module = 'module'
        console.log(data)
        data.belongSystemIds=belongSystemIds
        if (props.id) {
          let editRequest: any = { ...data };
          editRequest.id = props.id
          const res:any = await editSoftWatre(editRequest) 
          if(res.code === 0 ){
            setLoading(false)
            message.success('????????????')
            onClose(true)
          }
          else if(res.code === 10006){
            setErrcode(10006)
          }
          else {
            setLoading(false)
            message.error(res.msg)
          }
        
        }
        else {
          const res:any = await createSoftware(data)
          if(res.code === 0 ){
            setLoading(false)
            message.success('????????????')
            onClose(true)
          }
          else if(res.code === 10006){
            setErrcode(10006)
          }
          else {
            message.error('????????????')
          }
        }
      }
      finally{
        setLoading(false)
      }
    }
  };
  const fetchData = () => {
    getSoftWareEcho({Module:'module',softwareId:props.id}).then((res:any)=>{
      if(res.code === 0){
        console.log(res)
        const data = res.result
        let formData :any = {
          name:data.name,
          moduleVersion:data.moduleVersion,
          moduleLicense:data.moduleLicense,
          moduleLicenseRisk:data.moduleLicenseRisk,
          moduleBusinessUsedId:data.moduleBusinessUsed,
          moduleDescription:data.moduleDescription,
          moduleIsCommercialUse:data.moduleIsCommercialUse?1:0,
          moduleIsModify:data.moduleIsModify?1:0,
          remark:data.remark
        }
        formRef.current.setFieldsValue(formData);
        const belongSystem = data.belongSystem.map((item: any) => item.value);
        console.log(belongSystem)
        setBelongSystemIds(belongSystem)
      }else {
        message.error('??????????????????')
      }
    })
  };
  const cascaderOnChange=(value:any[])=>{
    setBelongSystemIds(value)
    if(value.length>0){
      setIsShowWarning(false)
    }
    else {
      setIsShowWarning(true)
    }
  }
  const onClose=(isFetch:boolean)=>{
    setIsShowWarning(false);
    props.onClose(isFetch);
    setBelongSystemIds([]);
    setErrcode(0);
  }
  const statusIconFn = () => {
    if (errcode === 10006) {
      return <CloseCircleFilledIcon style={{ fontSize: 25, color: '#e34d59' }} />
    }
  }
  return (
    <Style>
      <Form labelAlign='left' ref={formRef} labelWidth={120} onSubmit={onSubmit} statusIcon={true}>
        <Drawer
          visible={props.visible}
          onClose={() => onClose(false)}
          destroyOnClose={true}
          size='large'
          header={
            <span style={{ fontWeight: 'bold' }}>
              {props.id ? '?????????????????????' : '?????????????????????'}
            </span>
          }
          footer={
            <FootButtonGroup>
              <Button
                theme='primary'
                className='button-footer'
                type='submit'
              >
                {props.id ? '??????' : '??????'}
              </Button>
              <Button
                theme='default'
                className='button-footer'
                onClick={() => onClose(false)}
              >
                ??????
              </Button>
              
            </FootButtonGroup>
          }
        >
          <FormContentTop>
            <FormItem name='name' statusIcon={statusIconFn()}  requiredMark={true} label='????????????' rules={[{ required: true, message: '?????????????????????', type: 'error' }]}>
              <Input placeholder='?????????????????????' maxlength={15} onChange={()=>{setErrcode(0)}} style={errcode===10006?{borderColor:'#e34d59'}:{}}></Input>
            </FormItem>
            {errcode===10006&&(
            <div className='t-is-error' style={{marginLeft:120,marginTop:-26}}>
              <p className='t-input__extra'>?????????????????????</p>
            </div>
            )}
           
            {/* <FormItem name='belongSystemIds' requiredMark={true} label='????????????' rules={[{ required: true, message: '?????????????????????', type: 'error' }]}>
              <TreeSelect data={props.optList} clearable multiple placeholder="?????????" style={{width:610}}/>
            </FormItem> */}
            <MyCasCader statusIcon={true} optList={props.optList} visible={true} isShowWarning={isShowWarning} value={belongSystemIds}  onChange={(value)=>{cascaderOnChange(value)}} required></MyCasCader>
            <div style={{borderBottom:'1px solid #e7e7e7'}}></div>
            <FormItem name='moduleVersion' requiredMark={true} label='??????'  style={{marginTop:20 }} rules={[{ required: true, message: '???????????????', type: 'error' }]}>
              <Input placeholder='?????????' maxlength={15}></Input>
            </FormItem>
            <FormItem name='moduleLicense' requiredMark={true} label='Lisence' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Input placeholder='?????????'></Input>
            </FormItem>
            <FormItem name='moduleLicenseRisk' requiredMark={true} label='Lisence??????' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Input placeholder='?????????'></Input>
            </FormItem>
            <FormItem name='moduleBusinessUsedId' requiredMark={true} label='????????????' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Select placeholder='?????????????????????'>
                {props.moduleBusinessUsedSelector.map((item,index)=><Option value={item.value} key={index}>{item.label}</Option>)}
              </Select>
            </FormItem>
            <FormItem name='moduleDescription' requiredMark={true} label='????????????' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Input placeholder='?????????' maxlength={40}></Input>
            </FormItem>
            <FormItem name='moduleIsCommercialUse' requiredMark={true} label='???????????????' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Select placeholder='?????????'>
                <Option value={1}>???</Option>
                <Option value={0}>???</Option>
              </Select>
            </FormItem>
            <FormItem name='moduleIsModify' requiredMark={true} label='????????????' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Select placeholder='?????????'>
                <Option value={1}>???</Option>
                <Option value={0}>???</Option>
              </Select>
            </FormItem>
            <FormItem name='remark' requiredMark={true} label='??????' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Textarea placeholder='???????????????' autosize={{ minRows: 6 }} maxlength={50}></Textarea>
            </FormItem>
          </FormContentTop>
        </Drawer>
      </Form>
    </Style>
  );
};
