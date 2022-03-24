import React, { useState, useEffect, useRef } from 'react';
import style from '@emotion/styled/macro';
import { Button, Drawer, Form, Input, message, Textarea, Select } from 'tdesign-react';
import styled from '@emotion/styled/macro';
import { postHardwareCreate, hardwaregetDetail, hardwaregetEdit } from '../../../util/api';
import { CloseCircleFilledIcon } from 'tdesign-icons-react';

const { FormItem } = Form;

const FootButtonGroup = style.div`
  display: flex;
  height: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
`;
const FormContentTop = style.div`
  border-bottom: 1px solid #e7e7e7;
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
const CasCaderContent = style.div`
 padding:16px;
 padding-bottom: 20px;
`
type DrawerProps = {
  visible: boolean;
  id: string;
  onClose: () => void;
  save: () => void;
  editData?: any;
  optList: any;
  categoryOption: any;

};

export const MyDrawer: React.FC<DrawerProps> = (props: DrawerProps) => {
  const formRef = useRef<any>();
  const [isSaved, setIsSaved] = useState<any>(false);
  const [errcode, setErrcode] = useState<number>(0)

  useEffect(() => {
    if (props.id) {
      fetchData();
    }
    console.log('drawer--props', props)
  }, [props.id, props.editData]);

  //@ts-ignore
  const onSubmit = (e) => {
    console.log('e', e)
    setIsSaved(true);
    if (e.validateResult === true) {
      //@ts-ignore
      const data = formRef.current.getFieldsValue(true);
      console.log('data', data)
      if (props.id) {
        let editRequest: any = { ...data };
        editRequest.id = props.id
        hardwaregetEdit(editRequest).then((res: any) => {
          if (res?.code === 0) {
            message.success('保存成功');
            props.onClose();
            props.save();
            setIsSaved(false);
          } else {
            message.error('保存失败');
          }
        })
      }
      else {
        postHardwareCreate(data).then((res: any) => {
          if (res?.code === 0) {
            message.success('新建成功');
          } else if (res?.code === 10006) {
            setErrcode(10006);
            return;
          } else {
            message.error('新建失败');
          }
          props.onClose();
          props.save();
          setIsSaved(false);
        });
      }
    }
  };
  const fetchData = () => {
    hardwaregetDetail({ id: Number(props.id) }).then((res: any) => {
      if (res?.code === 0) {
        console.log('detail----res', res)
        const parts = (props.editData?.belongAutoParts || []).map((item: any) => item.autoPartId);
        let formData: any = {
          name: res.name,
          category: res.category,
          manufacturer: res.manufacturer,
          sdkName: res.sdkName,
          sdkVersion: res.sdkVersion,
          datasheetLink: res.datasheetLink,
          remark: res.remark,
          relationAutoParts: parts
        }
        formRef.current.setFieldsValue(formData);
      }
    })
  };

  // 关闭drawer
  const handleClose = () => {
    setIsSaved(false);
    props.onClose();
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
          onClose={() => handleClose()}
          destroyOnClose={true}
          className="kn-create-drawer"
          header={
            <span style={{ fontWeight: 'bold' }}>
              {props.id ? '编辑硬件' : '新建硬件'}
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
                onClick={() => handleClose()}
              >
                取消
              </Button>

            </FootButtonGroup>
          }
        >
          <FormContentTop>
            <FormItem name='name' statusIcon={statusIconFn()} requiredMark={true} label='硬件名称' rules={[{ required: true, message: '请输入硬件名称', type: 'error' }]}>
              <Input placeholder='请输入硬件名称' maxlength={15} onChange={() => { setErrcode(0) }} style={errcode === 10006 ? { borderColor: '#e34d59' } : {}}></Input>
            </FormItem>
            {errcode === 10006 && (
              <div className='t-is-error' style={{ marginLeft: 120, marginTop: -26 }}>
                <p className='t-input__extra'>同名资产已存在</p>
              </div>
            )}
            <FormItem name='category' requiredMark={true} label='硬件类别' rules={[{ required: true, message: '请选择硬件类别', type: 'error' }]}>
              <Select placeholder='请选择' options={props.categoryOption || []}></Select>
            </FormItem>
            <FormItem name='manufacturer' requiredMark={true} label='厂家' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Input placeholder='请输入厂家' maxlength={15}></Input>
            </FormItem>
            <FormItem name='sdkName' requiredMark={true} label='SDK名称' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Input placeholder='请输入SDK名称' maxlength={15}></Input>
            </FormItem>
            <FormItem name='sdkVersion' requiredMark={true} label='SDK版本' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Input placeholder='请输入SDK名称' maxlength={15}></Input>
            </FormItem>
            <FormItem name='datasheetLink' requiredMark={true} label='dataSheet链接' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Input placeholder='请输入dataSheet链接' maxlength={40}></Input>
            </FormItem>
            <FormItem name='remark' requiredMark={true} label='备注' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Textarea placeholder='请输入备注' autosize={{ minRows: 6 }} maxlength={50}></Textarea>
            </FormItem>
          </FormContentTop>
          <CasCaderContent>
            <FormItem name='relationAutoParts' requiredMark={false} label='所属零部件' labelWidth={110} style={{ paddingLeft: 10 }} >
              <Select placeholder='请选择' multiple options={props.optList || []}></Select>
            </FormItem>
          </CasCaderContent>
        </Drawer>
      </Form>
    </Style>
  );
};
