import React, { useState, useEffect, useRef, useCallback } from 'react';
import style from '@emotion/styled/macro';
import { Button, DatePicker, Divider, Drawer, Form, Input, Textarea, Select, Upload, Loading } from 'tdesign-react';
import styled from '@emotion/styled/macro';
import { MyCasCader } from './cascader';
import { CheckCircleFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-react';
import {  staticResourceUploadExcelFile } from '../../../util/api';
import axios from 'axios';
import { upload } from '@tencent/tea-component/lib/upload/uploadFile';
import { UploadFileType } from 'generated/graphql';

const { FormItem } = Form;

const FootButtonGroup = style.div`
  display: flex;
  height: 100%;
  justify-content: flex-end;
  flex-wrap: wrap;
`;
const FormContentTop = style.div`
  padding:16px;
  padding-bottom: 20px;
`;
const Style = styled.div`
  .button-footer {
    width: 100px;
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
    margin-top: -10px;
    margin-bottom: 10px;
    color: #e34d59;
  }
  .t-upload__tips.t-upload__tips-error{
      display:none;
  }
`;
type DrawerProps = {
    fileUpEnd: any
    handleDelete:()=>any
};


export const FileUpload: React.FC<DrawerProps> = (props: DrawerProps) => {
    const formRef = useRef<any>();
    const [uploadStep, setUploadStep] = useState<number>(0) // 0 未上传  1百分比  2成功 -1失败
    const [progress, setProgress] = useState<any>(0); //上传进度
    const [errText, setErrText] = useState<any>(''); //上传返回的错误信息
    const [successId, setSuccessId] = useState<any>('');
    const [fileValue, setFileValue] = useState<any>('')

    // 成功 失败 状态icon
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
                            {progress}%
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


    // 上传进度
    const onProgress = useCallback((val) => {
        console.log('progress--res', val)
        setProgress(((val.loaded / val.total) * 100).toFixed(2));
    }, []);


    // 删除btn
    const handleDelete = () => {
        setUploadStep(0);
        props.handleDelete()
    }
    const handleFileUp = async (data: any) => {
        console.log('data', data);
        const { files } = data.target
        let params = new FormData()
        params.append('file', files[0]);
        // params.append('systemId', '1')
        await staticResourceUploadExcelFile(params, onProgress).then((res: any) => {
            console.log('file--res', res);
            if (res.code === 0) {
                setErrText('');
                setUploadStep(2);
                setSuccessId(res.result);
            } else {
                setErrText(res.msg);
                setUploadStep(-1);
                setSuccessId('');
                console.log(1111)
            }

        }).catch(() => {
            setUploadStep(-1);
            setErrText('上传失败')
        }).finally(() => {
            props.fileUpEnd(files[0].name);
            setFileValue(files[0].name)
            console.log('finally', fileValue)
        })

    }
    const uploadFile = () => {
        setUploadStep(1);
        setProgress(0)
        let fileInput: any = document.getElementsByClassName('file-input')[0];
        fileInput.click();

    }
    return (
        <Style>

            <div style={{ display: 'flex', marginBottom: 24 }}>
                <FormItem className='file_upload_item' name='fileName' requiredMark={true} label='文件' labelWidth={110} style={{ paddingLeft: 10 }}>
                    <Input  value={fileValue} readonly placeholder='还未上传文件' suffixIcon={suffIcon()}></Input>
                </FormItem>
                <input type="file" className='file-input' style={{ display: 'none' }} onChange={(v) => handleFileUp(v)} />
                <Button theme='default' variant="outline" style={{ width: 100, marginLeft: 20 }}  onClick={() => uploadFile()}>{uploadStep === 0 ? '选择文件' : '重新上传'}</Button>
                {uploadStep !== 0 ? <div className='delete_text' onClick={() => handleDelete()}>删除</div> : null}
            </div>
            {uploadStep == -1 && <div className='error_text'>{errText}</div>}
        </Style>
    );
};
