import React, { useState, useEffect, useRef } from 'react';
import style from '@emotion/styled/macro';
import { Button, Cascader, message, Drawer, Form, Input, Textarea } from 'tdesign-react';
import styled from '@emotion/styled/macro';
import { MyCasCader } from './cascader';
import { autoPartsCreate, autoPartsEdit } from '../../../util/componentApi';
import {  CloseCircleFilledIcon } from 'tdesign-icons-react';



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
  .t-drawer__content-wrapper{
    width:480px !important;
  }
  .t-form__controls{
    margin-left:104px !important;
  }
  .same-name-error{
    .t-form__status{
        display:none;
    }
    .icon-content{
       display: flex;
       margin-left: 8px;
    }
}
`;
type DrawerProps = {
  visible: boolean;
  id: string;
  onClose: () => void;
  save: () => void
  optList?: any;
  title?: any;
  tabV?: any;
  editData?: any;
};
export const MyDrawer: React.FC<DrawerProps> = (props: DrawerProps) => {
  const formRef = useRef<any>();
  const [isSaved, setIsSaved] = useState<any>(false);
  const [relationAutoParts, setRelationAutoParts] = useState<any>(null);
  const [errcode, setErrcode] = useState<number>(0)

  useEffect(() => {
    if (props.id && props.visible) {
      fetchData();
    }
  }, [props.id, props.visible]);





  const onSubmit = (e: any) => {
    console.log('e', e)
    setIsSaved(true);
    if (e.validateResult === true) {
      const data = formRef.current.getFieldsValue(true);
      console.log('data123', data, relationAutoParts);
      console.log(formRef)
      data.belongCarModelId = Number(relationAutoParts);
      data.autoPartsType = props.tabV;
      if (props.id) {
        let editRequest: any = { ...data };
        editRequest.id = Number(props.id);
        autoPartsEdit(editRequest).then((res: any) => {
          if (res?.code === 0) {
            message.success('????????????');
            props.onClose();
            props.save();
            initData();
          } else {
            message.error('????????????');
          }
        })
      }
      else {
        autoPartsCreate(data).then((res: any) => {
          if (res?.code === 10006) {
            setErrcode(10006);
            return;
          } else if (res?.code === 0) {
            message.success('????????????');
            props.onClose();
            props.save();
            initData();
          } else {
            message.error('????????????');
          }
        });
      }
    }
  };

  // ???????????????
  const initData = () => {
    setIsSaved(false);
    setRelationAutoParts(null);
    setErrcode(0);
  }

  // ??????????????????
  const fetchData = () => {
    console.log('11114', props)
    let formData: any = {
      name: props.editData?.name,
      version: props.editData?.version,
      remark: props.editData?.remark,
    }
    formRef.current.setFieldsValue(formData);
    setRelationAutoParts(props.editData?.belongCarModel?.carModelId.toString())
  };

  const handleCasCaderChange = (value: any) => {
    console.log(value)
    setIsSaved(true);
    setRelationAutoParts(value)
  }
  return (
    <Style>
      <Form labelAlign='left' ref={formRef} labelWidth={120} onSubmit={onSubmit} statusIcon={true}>
        <Drawer
          visible={props.visible}
          onClose={() => { props.onClose(); initData(); }}
          destroyOnClose={true}
          size='large'
          header={
            <span style={{ fontWeight: 'bold' }}>
              {props.id ? `??????${props.title || '?????????'}` : `??????${props.title || '?????????'}`}
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
                onClick={() => { props.onClose(); initData(); }}
              >
                ??????
              </Button>

            </FootButtonGroup>
          }
        >
          <FormContentTop>
            <FormItem name='name' className={`${errcode === 10006 ? 'same-name-error' : ''}`} requiredMark={true} labelWidth={110} style={{ width: 450 }} label={`${props.title}??????`} rules={[{ required: true, message: '????????????????????????', type: 'error', trigger: 'blur' }]}>
              <Input placeholder='????????????????????????' maxlength={10} onChange={() => { setErrcode(0) }} style={errcode === 10006 ? { borderColor: '#e34d59' } : {}}></Input>
              {errcode === 10006 &&<span className='icon-content'><CloseCircleFilledIcon style={{ color: '#e34d59', fontSize: 25, marginLeft: 8 }} /></span> }
            </FormItem>
            {errcode === 10006 && (
              <div className='t-is-error' style={{ marginLeft: 110, marginTop: -26 }}>
                <p className='t-input__extra'>?????????????????????</p>
              </div>
            )}
            <FormItem name='version' requiredMark={true} labelWidth={110} style={{ width: 450 }} label='?????????' rules={[{ required: true, message: '??????????????????', type: 'error', trigger: 'blur' }]}>
              <Input placeholder='??????????????????' maxlength={10}></Input>
            </FormItem>
            <MyCasCader placeholder='?????????????????????' label="????????????" statusIcon={false} style={{ width: 340 }} multiple={false} isSaved={isSaved} required={false} visible={props.visible} onChange={(value: any) => handleCasCaderChange(value)} optList={props.optList} value={relationAutoParts}></MyCasCader>
            <FormItem name='remark' requiredMark={true} style={{ width: 450, paddingLeft: 10 }} label='??????' labelWidth={100} >
              <Textarea placeholder='???????????????' autosize={{ minRows: 6 }} maxlength={50} ></Textarea>
            </FormItem>
          </FormContentTop>
        </Drawer>
      </Form>
    </Style>
  );
};
