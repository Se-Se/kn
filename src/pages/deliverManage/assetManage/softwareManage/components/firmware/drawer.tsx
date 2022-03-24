import React, { useState, useEffect, useRef, useCallback } from 'react';
import style from '@emotion/styled/macro';
import { Button, Cascader, Divider, Drawer, Form, Input, Textarea, Select, DatePicker,Loading, Upload, TreeSelect, message } from 'tdesign-react';
import styled from '@emotion/styled/macro';
import { MyCasCader } from '../cascader';
// import { postHardwareCreate, hardwaregetDetail, hardwaregetEdit } from '../../../util/api';
import { CheckCircleFilledIcon,ErrorCircleFilledIcon } from 'tdesign-icons-react';
import axios from 'axios';
import { createSoftware, editSoftWatre, getSoftWareEcho } from 'pages/deliverManage/util/softwareApi/api';
import {  CloseCircleFilledIcon } from 'tdesign-icons-react';

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
  .t-upload__tips-error{
    display:none !important
  }
  .t-drawer__content-wrapper{
    width:480px !important;
  }
`;
type DrawerProps = {
  visible: boolean;
  id: string;
  onClose: (isFetchData:boolean) => void;
  editData?: any,
  optList:any
};
export const MyDrawer: React.FC<DrawerProps> = (props: DrawerProps) => {
  const formRef = useRef<any>();
  const [relationAutoParts, setRelationAutoParts] = useState<any>([]);
  const [uploadStep, setUploadStep] = useState<number>(0) // 0 未上传  1百分比  2成功 -1失败
  const [progress, setProgress] = useState<number>(0); //上传进度
  const [errText, setErrText] = useState<any>(''); //上传返回的错误信息
  const [successId, setSuccessId] = useState<any>('');
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
    if (!belongSystemIds.length) {
      setIsShowWarning(true)
      return;
    }
    if (e.validateResult === true) {
      setLoading(true)
      //@ts-ignore
      try{
        const data = formRef.current.getFieldsValue(true);
        data.belongSystemIds = belongSystemIds
        data.module = 'firmware'
        data.firmwarePackageFileId=successId
        if (props.id) {
          let editRequest: any = { ...data };
          editRequest.id = props.id
          const res:any=await editSoftWatre(editRequest)
            if(res.code === 0 ){
              message.success('编辑成功')
              drawerClose(true)
            } 
            else if(res.code === 10006){
              setErrcode(10006)
            }
            else {
              message.error(res.msg)
            }
        }
        else {
          const res:any=await createSoftware(data)
            if(res.code === 0 ){
              message.success('新建成功')
              drawerClose(true)
            }
            else if(res.code === 10006){
              setErrcode(10006)
            }
            else {
              message.error(res.msg)
            }
          
        }
      }
      finally{
        setLoading(false)
      }
    }
  };
  const fetchData = () => {
    getSoftWareEcho({Module:'firmware',softwareId:props.id}).then((res:any)=>{
      if(res.code === 0){
        console.log(res)
        const data = res.result
        let formData :any = {
          name:data.name,
          firmwareReleaseTime:data.firmwareReleaseTimeFormat,
          firmwareVersion:data.firmwareVersion,
          remark:data.remark,
          fileName:data.firmwarePackageFileName
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

  const suffIcon = () => {
    switch (uploadStep) {
      case 0:
        return;
        break;

      case 1:
        return (
          <div>
            <Loading style={{ width: 20, height: 20 }}></Loading>
            <span style={{ marginLeft: 3, color: "rgb(16, 93, 219)" }}>
              {progress + " "}%
            </span>
          </div>
        );
        break;

      case 2:
        return <CheckCircleFilledIcon style={{ color: 'rgb(0, 168, 112)' }} />
        break;

      case -1:
        return <ErrorCircleFilledIcon style={{ color: 'rgb(227, 77, 89)' }} />
        break
      default:
        break;
    }
  }
  const beforeUpload = useCallback(async (file) => {
    setUploadStep(1);

    // api 接口方式上传
    // let params = new FormData()
    // params.append('file', file.raw)
    // await staticResourceUploadExcelFile(params).then((res: any) => {
    //   console.log('file--res', res)
    // })
    return true;
  }, []);
   //@ts-ignore
  // 上传失败
  const handleFail = ({ file }) => {
    setUploadStep(-1);
    formRef.current.setFieldsValue({ fileName: file.name });
    console.log('fail---res', file);
  };

  // 上传成功
  const handleSuccess = useCallback((res) => {
    console.log('success--res', res);
    if (res.response.code === 0) {
      setErrText('');
      setUploadStep(2);
      setSuccessId(res.response.result);
    } else {
      setErrText(res.response?.msg);
      setUploadStep(-1);
      setSuccessId('');
    }
    formRef.current.setFieldsValue({ fileName: res.file.name });
  }, []);

  const handleDelete = () => {
    formRef.current.setFieldsValue({ fileName: '' });
    setUploadStep(0);
    setSuccessId('');
  }

  // 上传进度
  const onProgress = useCallback((val) => {
    console.log('progress--res', val)
    setProgress(val.percent);
  }, []);

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
    props.onClose(isFetch);
    setBelongSystemIds([]);
    setUploadStep(0);
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
          onClose={() => drawerClose(false) }
          destroyOnClose={true}
          size='large'
          header={
            <span style={{ fontWeight: 'bold' }}>
              {props.id ? '编辑固件' : '新建固件'}
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
                onClick={() => { drawerClose(false)}}
              >
                取消
              </Button>
              
            </FootButtonGroup>
          }
        >
          <FormContentTop>
            <FormItem name='name' statusIcon={statusIconFn()} requiredMark={true}  label='软件名称' rules={[{ required: true, message: '请输入软件名称', type: 'error' }]}>
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
            <FormItem name='firmwareVersion' requiredMark={true} label='版本'  style={{marginTop:20 }} rules={[{ required: true, message: '请输入版本', type: 'error' }]}>
              <Input placeholder='请输入' maxlength={15}></Input>
            </FormItem>
            <FormItem name='firmwareReleaseTime' requiredMark={true} label='发布时间' labelWidth={110} style={{ paddingLeft: 10 }} >
              <DatePicker mode="date" placeholder={'请选择日期'} style={{width:610}}   format="YYYY-MM-DD HH:mm:ss" enableTimePicker/>
            </FormItem>
            <div style={{display:'flex',alignItems:'baseline'}}>
              <FormItem name='fileName' requiredMark={true} label='固件包' labelWidth={110} style={{ paddingLeft: 10 }}>
                <Input readonly suffixIcon={suffIcon()} style={{width:232}}></Input>
              </FormItem>
              <Upload
              action={`${axios.defaults.baseURL}` + '/staticResource/uploadExcelFile'}
              showUploadProgress
              theme='custom'
              beforeUpload={beforeUpload}
              onProgress={onProgress}
              onFail={handleFail}
              onSuccess={handleSuccess}
              headers={{['authorization']:'Bearer '+window.localStorage.getItem('sysauditor-token')}}
              
              >
              <Button theme='default' variant="outline" style={{ width: 88, marginLeft: 8 }}>{uploadStep === 0 ? '选择文件' : '重新上传'}</Button>
            </Upload>
            {/* {uploadStep !== 0 ? <a className='delete_text' style={{marginLeft:10}} onClick={() => handleDelete()}>删除</a> : null} */}
            </div>
            {uploadStep===-1&&(
            <div className='t-is-error' style={{marginLeft:120,marginTop:-26}}>
              <p className='t-input__extra'>文件上传失败</p>
            </div>
            )}
            <FormItem name='remark' requiredMark={true} label='备注' labelWidth={110} style={{ paddingLeft: 10 }}>
              <Textarea placeholder='请输入备注' maxlength={50} autosize={{ minRows: 6 }}></Textarea>
            </FormItem>
          </FormContentTop>
        </Drawer>
      </Form>
    </Style>
  );
};
