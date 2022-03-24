import React, { useState, useRef, useCallback } from 'react';
import style from '@emotion/styled/macro';
import { Button, Drawer, Form, Input, Loading, Upload, message, Select } from 'tdesign-react';
import styled from '@emotion/styled/macro';
import { CheckCircleFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-react';
import { hardwaregetrImportData, staticResourceDownloadTemplate } from '../../../util/api';
import axios from 'axios';
const { FormItem } = Form;

const FootButtonGroup = style.div`
  display: flex;
  height: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const Style = styled.div`
  .button-footer {
    width: 60px;
    height:32px;
    margin:0px;
  }
  .t-textarea__inner{
    height:100px;
  }
.download_text{
  color:#006eff;
  margin-left: 132px;
  cursor:pointer;
  margin-bottom:24px;
  margin-top:16px;
}
.t-upload__tips-error{
  display:none !important;
}
.error_text{
  margin-left: 120px;
  margin-top: 4px;
  margin-bottom:2px;
  color:#e34d59;
}
.delete_text{
  color:#006eff;
  margin-left:20px;
  width:50px;
  line-height:32px;
  cursor:pointer;
}
.t-form__item{
  width:100%;
  margin-bottom:0px;
}
.t-drawer__content-wrapper{
  width:480px !important;
}
.t-drawer__body{
    padding:24px;
}
`;
const CasCaderContent = style.div`
 padding-bottom: 20px;
`
type DrawerProps = {
    visible: boolean;
    onClose: () => void;
    optList: any;
    save: () => void;
};
export const UploadDrawer: React.FC<DrawerProps> = (props: DrawerProps) => {
    const formRef = useRef<any>();

    const [parts, setParts] = useState<any>([]);//所需零部件list
    const [progress, setProgress] = useState<number>(0); //上传进度
    const [uploadStep, setUploadStep] = useState<number>(0) // 0 未上传  1百分比  2成功 -1失败
    const [successId, setSuccessId] = useState<any>('');
    const [errText, setErrText] = useState<any>(''); //上传返回的错误信息
    const [isSaved, setIsSaved] = useState<any>(false);


    // 导入提交
    const onSubmit = (e: any) => {
        setIsSaved(true);
        if (uploadStep === -1) {
            return;
        }
        if (e.validateResult === true) {
            const data = formRef.current.getFieldsValue(true);
            console.log(data)
            let request: any = {
                belongIds: data.relationAutoParts,
                uploadFileId: successId
            };
            hardwaregetrImportData(request).then((res: any) => {
                if (res?.code === 0) {
                    if (res.hasError) {
                        message.warning(`由于数据缺少必要字段，共有${res.errorCount}条导入失败`)
                    } else {
                        message.success('导入成功');
                    }
                    handleClose();
                    props.save();
                } else {
                    message.error('导入失败');
                }

            });
        }

    };

    // 上传前回调
    const beforeUpload = useCallback(async (file) => {
        setUploadStep(1);
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
        } else if (res.response.code === 10001) {
            setErrText("文件后缀名必须以'.xls' or '.xlsx' or '.csv'");
            setUploadStep(-1);
            setSuccessId('');
        } else {
            setErrText(res.response?.msg);
            setUploadStep(-1);
            setSuccessId('');
        }
        formRef.current.setFieldsValue({ fileName: res.file.name });
    }, []);



    // 上传进度
    const onProgress = useCallback((val) => {
        console.log('progress--res', val)
        setProgress(val.percent);
    }, []);

    // 下载模板
    const handleDown = () => {
        let request: any = {
            module: "hardware"
        };
        staticResourceDownloadTemplate(request).then((res: any) => {
            let url = window.URL.createObjectURL(res);
            let link = document.createElement('a');
            link.download = "hardware_template.xls";
            link.href = url;
            link.click();
        })
    }



    // 关闭drawer
    const handleClose = () => {
        props.onClose();
        setIsSaved(false);
        setUploadStep(0);
        setErrText('');
        setSuccessId('');
        setParts([]);
        formRef.current.setFieldsValue({ fileName: '' });
    }

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

    return (
        <Style>
            <Form labelAlign='left' ref={formRef} labelWidth={120} onSubmit={onSubmit} statusIcon={false}>
                <Drawer
                    visible={props.visible}
                    onClose={() => handleClose()}
                    destroyOnClose={true}
                    header={
                        <span style={{ fontWeight: 'bold' }}>
                            导入硬件
                        </span>
                    }
                    footer={
                        <FootButtonGroup>
                            <Button
                                theme='primary'
                                style={{ marginLeft: 10 }}
                                className='button-footer'
                                type='submit'
                            >
                                导入
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
                    <div style={{ display: 'flex' }}>
                        <FormItem name='fileName' requiredMark={true} style={{ width: 336 }} label='导入文件' rules={[{ required: true, type: 'error' }]}>
                            <Input readonly style={{ width: 242 }} placeholder='请选择Excel格式上传' suffixIcon={suffIcon()}></Input>
                        </FormItem>
                        <Upload
                            action={`${axios.defaults.baseURL}` + '/staticResource/uploadExcelFile'}
                            headers={{ 'authorization': `Bearer ${window.localStorage.getItem('sysauditor-token')}` }}
                            showUploadProgress
                            theme='custom'
                            beforeUpload={beforeUpload}
                            onProgress={onProgress}
                            onFail={handleFail}
                            onSuccess={handleSuccess}>
                            <Button theme='default' variant="outline" style={{ width: 88, height: 32, marginLeft: 8 }}>{uploadStep === 0 ? '选择文件' : '重新上传'}</Button>
                        </Upload>
                    </div>
                    {uploadStep == -1 && <div className='error_text'>{errText}</div>}
                    <div className='download_text' onClick={() => handleDown()}>下载模板</div>
                    <CasCaderContent>
                        <FormItem name='relationAutoParts' requiredMark={false} labelWidth={110} label='所属零部件'  >
                            <Select placeholder='请选择' multiple options={props.optList || []}></Select>
                        </FormItem>
                    </CasCaderContent>

                </Drawer>
            </Form>
        </Style>
    );
};
