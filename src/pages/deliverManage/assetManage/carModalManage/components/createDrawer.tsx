import React, { useState, useEffect, useRef } from 'react';
import style from '@emotion/styled/macro';
import { Button, Drawer, Form, Input, Select, Textarea, message } from 'tdesign-react';
import styled from '@emotion/styled/macro';
import { OptionType } from '../index';
import { createCarMode, editcaMode } from 'pages/deliverManage/util/carModalApi/api';
import { CloseCircleFilledIcon } from 'tdesign-icons-react';

const {Option}=Select

const { FormItem } = Form;

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
  .t-date-picker{
      width:100%;
  }
  .t-drawer__content-wrapper{
    width:480px !important;
  }
`;
type DrawerProps = {
    visible: boolean;
    id: string;
    onClose: () => void;
    save: () => void;
    editData: any,
    carModelList:OptionType[]

};

export const MyDrawer: React.FC<DrawerProps> = (props: DrawerProps) => {
    const formRef = useRef<any>();
    const [errcode,setErrcode]=useState<number>(0)

    useEffect(() => {
        if (props.id) {
          const data = props.editData
          let formData = {
            name:data.name,
            carGroupId:data.CarModelGroupId,
            remark:data.remark,
            version:data.version,
          }
          formRef.current.setFieldsValue(formData)
        }
    }, [props.id, props.editData]);

    //@ts-ignore
    const onSubmit = async (e) => {
        console.log('e', e)
        if (e.validateResult === true) {
            const data = formRef.current.getFieldsValue(true);
            if (props.id) {
                let editRequest: any = { ...data };
                editRequest.id = props.id
                const resp:any = await editcaMode(editRequest)
                if(resp.code === 0){
                  message.success('编辑成功')
                  setErrcode(0)
                  props.onClose()
                  props.save()
                }
                else if(resp.code === 10006){
                  setErrcode(10006)
                }
                else{
                  message.error('编辑失败')
                }
            }
            else {
              const resp:any = await createCarMode(data)
              if(resp.code === 0){
                message.success('新建成功')
                setErrcode(0)
                props.onClose()
                props.save()
              }
              else if(resp.code === 10006){
                setErrcode(10006)
              }
              else{
                message.error('新建失败')
              }
            }
        }
    };
    const nameStatus = ()=>{
      if(errcode === 10006){
        return <CloseCircleFilledIcon style={{fontSize:25,color:'#e34d59'}}/>
      }
    }
    return (
        <Style>
            <Form labelAlign='left' ref={formRef} labelWidth={120} onSubmit={onSubmit} statusIcon={true}>
                <Drawer
                    visible={props.visible}
                    onClose={() => { props.onClose();setErrcode(0)}}
                    destroyOnClose={true}
                    size='large'
                    header={
                        <span style={{ fontWeight: 'bold' }}>
                            {props.id ? '编辑车型' : '新建车型'}
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
                                onClick={() => { props.onClose();setErrcode(0) }}
                            >
                                取消
                            </Button>
                        </FootButtonGroup>
                    }
                >
                    <FormContentTop>
                    <FormItem name='name' requiredMark={true} label='车型名称' rules={[{ required: true, message: '请输入车型名称', type: 'error' }]} statusIcon={nameStatus()} >
                      <Input placeholder='请输入车型名称' maxlength={10} onChange={()=>{setErrcode(0)}} style={errcode===10006?{borderColor:'#e34d59'}:{}}></Input>
                    </FormItem>
                    {errcode===10006&&(
                    <div className='t-is-error' style={{marginLeft:120,marginTop:-26}}>
                      <p className='t-input__extra'>同名资产已存在</p>
                    </div>
                    )}
                        <FormItem name='version' requiredMark={true} label='车型版本' rules={[{ required: true, message: '请输入车型版本', type: 'error' }]} >
                          <Input placeholder='请输入车型版本' maxlength={10}></Input>
                        </FormItem>
                        <FormItem name='carGroupId' requiredMark={true} label='所属车型组'  >
                          <Select placeholder='请选择所属车型' clearable >
                            {props.carModelList.map((item)=>
                            <Option value={item.value} key= {item.value}>{item.label}</Option>
                            )}
                          </Select>
                        </FormItem>
                        <FormItem name='remark' requiredMark={true} label='备注' labelWidth={110} style={{ paddingLeft: 10 }}>
                            <Textarea placeholder='请输入备注' maxlength={50} autosize={{ minRows: 6 }}></Textarea>
                        </FormItem>
                    </FormContentTop>
                </Drawer>
            </Form>
        </Style>
    );
};
