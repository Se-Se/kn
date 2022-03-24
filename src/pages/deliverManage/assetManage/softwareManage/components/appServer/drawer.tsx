import React, { useState, useEffect, useRef, useCallback } from 'react';
import style from '@emotion/styled/macro';
import { Button, Cascader, Divider, Drawer, Form, Input, Textarea, Select, DatePicker,Loading, Upload, TreeSelect, message } from 'tdesign-react';
import styled from '@emotion/styled/macro';
import { MyCasCader } from '../cascader';
// import { postHardwareCreate, hardwaregetDetail, hardwaregetEdit } from '../../../util/api';
import { CloseCircleFilledIcon } from 'tdesign-icons-react';
import axios from 'axios';
import { createSoftware, editSoftWatre, getSoftWareEcho } from 'pages/deliverManage/util/softwareApi/api';

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
  onClose: (isFetch:boolean) => void;
  save: () => void;
  editData?: any,
  optList:any

};

export const MyDrawer: React.FC<DrawerProps> = (props: DrawerProps) => {
  const formRef = useRef<any>();
  const [relationAutoParts, setRelationAutoParts] = useState<any>([]);
  const [belongSystemIds,setBelongSystemIds]=useState<any[]>([])
  const [isShowWarning,setIsShowWarning]=useState<boolean>(false)
  const [loading,setLoading]=useState<boolean>(false)
  const [errcode,setErrcode]=useState<number>(0)

  useEffect(() => {
    if (props.id) {
      fetchData();
    }
    console.log('drawer--props',props)
  }, [props.id, props.editData]);

  //@ts-ignore
  const onSubmit = async (e) => {
    console.log('e', e)
    if(belongSystemIds.length==0){
      setIsShowWarning(true)
      return;
    }
    else if (e.validateResult === true) {
      //@ts-ignore
      setLoading(true)
      setIsShowWarning(false)
      const data = formRef.current.getFieldsValue(true);
      data.moduleIsCommercialUse = Boolean(data.moduleIsCommercialUse)
      data.moduleIsModify = Boolean(data.moduleIsModify)
      data.module = 'service'
      console.log(data)
      data.belongSystemIds=belongSystemIds
      if (props.id) {
        let editRequest: any = { ...data };
        editRequest.id = props.id
        const res:any = await editSoftWatre(editRequest)
          if(res.code === 0 ){
            setLoading(false)
            message.success('编辑成功')
            drawerClose(true)
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
            message.success('新建成功')
            drawerClose(true)
          }
          else if(res.code === 10006){
            setErrcode(10006)
          }
          else {
            setLoading(false)
            message.error(res.msg)
          }
      }
    }
  };
  const fetchData = () => {
    getSoftWareEcho({Module:'service',softwareId:props.id}).then((res:any)=>{
      if(res.code === 0){
        console.log(res)
        const data = res.result
        let formData :any = {
          name:data.name,
          servicePath:data.servicePath,
          serviceScene:data.serviceScene,
          remark:data.remark,
        }
        formRef.current.setFieldsValue(formData);
        const belongSystem = data.belongSystem.map((item: any) => item.value);
        console.log(belongSystem)
        setBelongSystemIds(belongSystem)
      }else {
        message.error('数据获取失败')
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
  const drawerClose =(isFetch:boolean)=>{
    setIsShowWarning(false);
    setBelongSystemIds([]);
    props.onClose(isFetch);
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
          onClose={() => drawerClose(false)}
          destroyOnClose={true}
          size='large'
          header={
            <span style={{ fontWeight: 'bold' }}>
              {props.id ? '编辑应用服务' : '新建应用服务'}
            </span>
          }
          footer={
            <FootButtonGroup>
              <Button
                theme='primary'
                className='button-footer'
                type='submit'
              >
                        
              {props.id ? '编辑' : '新建'}
              </Button>
              <Button
                theme='default'
                className='button-footer'
                onClick={() => drawerClose(false)}
              >
                取消
              </Button>
      
            </FootButtonGroup>
          }
        >
          <FormContentTop>
            <FormItem name='name'  statusIcon={statusIconFn()} requiredMark={true} label='软件名称' rules={[{ required: true, message: '请输入软件名称', type: 'error' }]}>
              <Input placeholder='请输入软件名称' maxlength={15} onChange={()=>{setErrcode(0)}} style={errcode===10006?{borderColor:'#e34d59'}:{}}></Input>
            </FormItem>
            {errcode===10006&&(
            <div className='t-is-error' style={{marginLeft:120,marginTop:-26}}>
              <p className='t-input__extra'>同名资产已存在</p>
            </div>
            )}
            {/* <FormItem name='system' requiredMark={true} label='所属系统' rules={[{ required: true, message: '请输入硬件名称', type: 'error' }]}>
              <TreeSelect data={props.optList} clearable multiple placeholder="请选择" style={{width:610}}/>
            </FormItem> */}
            <MyCasCader statusIcon={true} optList={props.optList} visible={true} isShowWarning={isShowWarning} value={belongSystemIds}  onChange={(value)=>{cascaderOnChange(value)}} required></MyCasCader>

            <div style={{borderBottom:'1px solid #e7e7e7'}}></div>
            <FormItem name='serviceScene' requiredMark={true} label='场景' style={{marginTop:20 ,marginLeft:10 }}labelWidth={110} >
              <Input placeholder='请输入'></Input>
            </FormItem>
            <FormItem name='servicePath' requiredMark={true} label='应用路径'  style={{marginTop:20}} rules={[{ required: true, message: '请输入应用路径', type: 'error' }]} >
              <Input placeholder='请输入'></Input>
            </FormItem>
            {/* <FormItem name='createTime' requiredMark={true} label='发布时间' labelWidth={110} style={{ paddingLeft: 10 }}>
              <DatePicker mode="date" placeholder={'请选择日期'} style={{width:610}} />
            </FormItem> */}

            <FormItem name='remark' requiredMark={true} label='备注' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Textarea placeholder='请输入备注' maxlength={50} autosize={{ minRows: 6 }}></Textarea>
            </FormItem>
          </FormContentTop>
        </Drawer>
      </Form>
    </Style>
  );
};
