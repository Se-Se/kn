import React, { useState, useEffect, useRef } from 'react';
import style from '@emotion/styled/macro';
import { Button, message, Drawer, Form, Input, Textarea } from 'tdesign-react';
import styled from '@emotion/styled/macro';
import { MyCasCader } from '../components/cascader';
import { systemCreateApp, systemAppEdit } from '../../../util/api';
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
  .t-date-picker{
      width:100%;
  }
  .file_upload_item{
      width:100%;
  }
  .t-form__item{
    width:100%; 
  }
  .delete_text{
    color:#006eff;
    margin-left:20px;
    width:50px;
    line-height:32px;
    cursor:pointer;
  }
  .error_text{
    margin-left: 120px;
    margin-top: -22px;
    margin-bottom: 10px;
    color: #e34d59;
  }
  .t-upload__tips.t-upload__tips-error{
      display:none;
  }
  .kn-error{
      .t-input{
          border-color:#e34d59;
      }
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
    editData?: any,
    optList: any

};


export const MyDrawer: React.FC<DrawerProps> = (props: DrawerProps) => {
    const formRef = useRef<any>();
    const [relationAutoParts, setRelationAutoParts] = useState<any>([]);
    const [isSaved, setIsSaved] = useState<any>(false);
    const [errcode, setErrcode] = useState<number>(0);

    useEffect(() => {
        if (props.id) {
            fetchData();
            console.log('drawer--props11', props)
        }
    }, [props.editData, props.visible]);

    //@ts-ignore
    const onSubmit = (e) => {
        console.log('e', e, formRef)
        setIsSaved(true);
        if (e.validateResult === true) {
            //@ts-ignore
            const data = formRef.current.getFieldsValue(true);
            console.log('data123', data, relationAutoParts);
            console.log(formRef)
            data.belongAutoParts = relationAutoParts;
            if (props.id) {
                let editRequest: any = { ...data };
                editRequest.id = Number(props.id);
                systemAppEdit(editRequest).then((res: any) => {
                    if (res?.code === 0) {
                        message.success('编辑成功');
                        props.onClose();
                        props.save();
                        initData();
                    } else {
                        message.error('编辑失败');
                    }
                })
            }
            else {
                systemCreateApp(data).then((res: any) => {
                    if (res?.code === 0) {
                        message.success('新建成功');
                        props.onClose();
                        props.save();
                        initData();
                    } else if (res?.code === 10006) {
                        setErrcode(10006);
                    } else {
                        message.error('新建失败');
                    }
                });
            }
        }
    };

    // 初始化数据
    const initData = () => {
        setIsSaved(false);
        setRelationAutoParts([]);
        setErrcode(0);
    }


    const fetchData = () => {
        let formData: any = {
            name: props.editData.name,
            appPath: props.editData.appPath,
            appFileName: props.editData.appFileName,
            function: props.editData.function,
            remark: props.editData.remark
        }
        formRef.current.setFieldsValue(formData);
        const parts = checkRelationsV(props.editData?.belongAutoPartIds || [], props.optList || []);
        setRelationAutoParts(parts || []);
    };

    // 删除错误数据
    const checkRelationsV = (data: any, opL: any) => {
        console.log('plo', opL)
        let vArr: any = [];
        (opL || []).forEach((item: any) => {
            if (item.children?.length) {
                item.children.forEach((c: any) => {
                    vArr.push(c.value);
                })
            }
        });
        const arr: any = data.filter((item: any) => vArr.includes(item));
        console.log('data', arr, vArr)
        return arr;
    }
    const handleCasCaderChange = (value: any) => {
        setIsSaved(true);
        setRelationAutoParts(value)
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
                    onClose={() => { props.onClose(); initData() }}
                    destroyOnClose={true}
                    size='large'
                    header={
                        <span style={{ fontWeight: 'bold' }}>
                            {props.id ? '编辑APP' : '新建APP'}
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
                                onClick={() => { props.onClose(); initData() }}
                            >
                                取消
                            </Button>
                        </FootButtonGroup>
                    }
                >
                    <FormContentTop>
                        <FormItem name='name' statusIcon={statusIconFn()} requiredMark={true} label='名称' rules={[{ required: true, message: '请输入系统名称', type: 'error' }]}>
                            <Input placeholder='请输入系统名称' onChange={() => { setErrcode(0) }} style={errcode === 10006 ? { borderColor: '#e34d59' } : {}}></Input>
                        </FormItem>
                        {errcode === 10006 && (
                            <div className='t-is-error' style={{ marginLeft: 120, marginTop: -26 }}>
                                <p className='t-input__extra'>同名资产已存在</p>
                            </div>
                        )}
                        <FormItem name='appPath' requiredMark={true} label='路径' rules={[{ required: true, message: '请输入路径', type: 'error' }]}>
                            <Input placeholder='请输入路径'></Input>
                        </FormItem>
                        <FormItem name='function' requiredMark={true} label='功能' labelWidth={110} style={{ paddingLeft: 10 }} >
                            <Input placeholder='请输入功能'></Input>
                        </FormItem>
                        <MyCasCader statusIcon={false} isSaved={isSaved} required={false} visible={props.visible} onChange={(value: any) => handleCasCaderChange(value)} optList={props.optList} value={relationAutoParts}></MyCasCader>
                        <FormItem name='remark' requiredMark={true} label='备注' labelWidth={110} style={{ paddingLeft: 10 }}>
                            <Textarea placeholder='请输入备注' autosize={{ minRows: 6 }}></Textarea>
                        </FormItem>
                    </FormContentTop>
                </Drawer>
            </Form>
        </Style>
    );
};
