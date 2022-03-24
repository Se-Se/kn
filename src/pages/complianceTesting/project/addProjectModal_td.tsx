import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react';
import { Button, Drawer, Form, Input, MessagePlugin, Select, Dialog, Upload, Radio, Cascader } from 'tdesign-react';
import { useProjectSelectorListLazyQuery, useCheckDeviceOnlineLazyQuery, useProjectTaskItemListLazyQuery, useCreateTestProjectMutation } from 'generated/graphql';
import styled from '@emotion/styled/macro';
import { LoadingIcon, IconFont, ErrorCircleFilledIcon } from 'tdesign-icons-react';
const { FormItem } = Form;
const { Option } = Select;

const FootButtonGroup = styled.div`
  display: flex;
  height: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
`;
const Style = styled.div`
  .addProjectModal {
  }
 .t-drawer__body{
     padding-left:26px;
     padding-right:22px;
 }
 .kn-add-success{
  .t-dialog__body{
      height:252px !important;
  }
 }
 .t-dialog__body{
    height:252px !important;
}
`
const CardConnect = styled.div`
    width: 352px;
    min-height: 375px;
    background:#F3F3F3 !important;
    padding:16px;
    padding-right:25px;
    float: right;
    .t-form__item{
        margin-bottom:16px;
    }
    .kn-radio{
        font-weight: 400 !important;
    }
    .t-radio__label{
        font-size: 12px !important; 
    }
`
const CardItem = styled.div`
    margin-bottom:16px;
    height:32px;
   .t-select__wrap{
    float: right; 
    width: unset;
   }
   .t-radio-group{
    margin-left: 50px;  
   }

  .kn-w-232{
      width:232px;
      height:32px;
      float: right;
    //   position:absolute;
    //   right:25px;
  }

`
const CardItemTitle = styled.div`
  display:inline-block;
  float:left;
  height:32px;
  line-height:32px;
  margin-bottom:16px;
`
const CardConnectFooter = styled.div`
  height:64px;
  border-top:1px solid #E7E7E7;
  margin-top:9px;
  padding-top:16px;
  .kn-connect-btn{
    margin-right:22px;
  }
`
const TextContent = styled.div`
  display:inline-block;
  font-size: 14px;
  font-weight: 400;
  .kn-text-icon{
    margin-right:4px;
  }
  .text-loading{
    color:#0052D9;
  }
  .text-error{
    color:#E34D59;
  }
  .text-success{
    color:#00A870;
  }
`
const AndroidCard = styled.div`
    width: 352px;
    min-height: 50px;
    background:#F3F3F3 !important;
    padding:16px;
    padding-right:25px;
    float: right;
    .t-form__controls{
        margin-left:80px;
    }
`
const SuccessDialogContent = styled.div`
     height:74px;
     padding:0 40px;
     color: rgba(0,0,0,0.6);
     font-size: 14px;
     font-weight: 400;
     .kn-color-y{
         color:#ED7B2F;
     }

`
const DialogItem = styled.div`
    height:32px;
    margin-top:20px;
`

type AddProjectType = {
    isShow: boolean
    setIsShowAddDialog: Dispatch<SetStateAction<boolean>>
    refreshFn: () => void
}
export const AddNewProjectModal: React.FC<AddProjectType> = ({ isShow, setIsShowAddDialog, refreshFn }) => {
    const formRef: any = useRef();
    const teamId = 'team_items;1';
    // const suitHook = useProjectTaskItemListQuery({ variables: { teamId: teamId },fetchPolicy:'network-only' })
    const [getSweeties, suitHook] = useProjectTaskItemListLazyQuery();
    const [suitOptions, setSuitOptions] = useState([]);
    const [personOptions, setPersonOptions] = useState([]);
    const [testObjV, setTestObjV] = useState('');
    const [errorText, setErrorText] = useState<any>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [radioV, setRadioV] = useState<any>('pwd');
    const connectFormRef: any = useRef();
    const [onlineCheck, onlineCheckHook] = useCheckDeviceOnlineLazyQuery();
    const [getSelectList, selectListHook] = useProjectSelectorListLazyQuery();
    const [testObjOption, setTestObjOption] = useState<any>([]);
    const [showCascader, setShowCascader] = useState<boolean>(false);
    const [fileUrl, setFileUrl] = useState<any>('');
    const [androidList, setAndroidList] = useState<any>([]);
    const [linuxList, setLinuxList] = useState<any>([]);
    const [systemT, setSystemT] = useState<any>('');//系统类型。测试对象下拉菜单象中，二级systemType
    const [testCreate, testCreateHook] = useCreateTestProjectMutation();
    const [theAutoPartsId, setTheAutoPartsId] = useState<any>(null);// 零部件id。测试对象下拉菜单中，一级id
    const [theLinuxDeviceId, setTheLinuxDeviceId] = useState<any>(null);//linux类型，连接设备的id，需要充接口checkDeviceOnline接口返回的  deviceId获取。
    const [certificateUrl, setCertificateUrl] = useState<any>('');
    const [androidClintId, setAndroidClintId] = useState<any>(''); // android类型，client下拉框的一级菜单id
    const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false);
    const [ignoreCaseCount, setIgnoreCaseCount] = useState<any>(0);
    const [stepWords, setStepWords] = useState<any>([]);


    const cascaderChange = (value: any) => {
        console.log('111333', value)
        setTestObjV(value);
        getSystemType(value)
    };

    const onSubmit = (e: any) => {
        console.log('onSubmit', e)
        // setVisibleConfirm(true);
        // return;
        if (e.validateResult === true) {
            let request: any = {};
            const formData: any = formRef.current.getFieldsValue?.(true);
            request = { ...formData, autoPartsId: theAutoPartsId, systemType: systemT, id: teamId };
            if (systemT === 'Android') {
                request.clientId = androidClintId;
            }
            if (systemT === 'Linux') {
                connectFormRef.current.validate().then((vRes: any) => {
                    console.log('vRes', vRes)
                    console.log('value1111: ', connectFormRef.current.getFieldsValue?.(true));
                    if (!theLinuxDeviceId) {
                        MessagePlugin.warning('请链接设备');
                        return;
                    }
                    if (vRes === true) {
                        const linuxData: any = connectFormRef.current.getFieldsValue?.(true);
                        request.clientId = linuxData.clientId;
                        request.deviceId = theLinuxDeviceId;
                        request.linuxConnectType = linuxData.connectType;
                        request.linuxConnectIP = linuxData.connectIP;
                        request.linuxConnectPort = linuxData.connectPort;
                        request.linuxConnectUser = linuxData.connectUser;
                        if (linuxData.connectType === 'pwd') {
                            request.linuxConnectPassword = linuxData.connectPassword;
                        } else {
                            request.linuxConnectCertificateUrl = linuxData.connectCertificateUrl;
                        }
                        console.log('request', request);
                        testCreate({ variables: request }).then((res: any) => {
                            MessagePlugin.info('提交成功');
                            setIsShowAddDialog(false);
                            setVisibleConfirm(true);
                            setIgnoreCaseCount(res?.data?.teamProject?.createProject?.caseResultIgnoreCount?.ignoreCaseCount || 0);
                            setStepWords(res?.data?.teamProject?.createProject?.caseResultIgnoreCount?.stepWords || []);
                            init();
                        }).catch((err: any) => {
                            if (err === 'error-exists--object') {
                                MessagePlugin.warning('项目名称已存在');
                            } else {
                                MessagePlugin.warning('创建失败');
                            }
                        });

                    }

                })
            } else {
                console.log('request', request)
                testCreate({ variables: request }).then((res: any) => {
                    MessagePlugin.info('提交成功');
                    setIsShowAddDialog(false);
                    setVisibleConfirm(true);
                    setIgnoreCaseCount(res?.data?.teamProject?.createProject?.caseResultIgnoreCount?.ignoreCaseCount || 0);
                    setStepWords(res?.data?.teamProject?.createProject?.caseResultIgnoreCount?.stepWords || []);
                    init();
                }).catch((err: any) => {
                    if (err === 'error-exists--object') {
                        MessagePlugin.warning('项目名称已存在');
                    } else {
                        MessagePlugin.warning('创建失败');
                    }
                });

            }
        }
        // console.log('getAllFieldsValue: ', formRef.current.getAllFieldsValue?.());
        // console.log('getFieldsValue all: ', formRef.current.getFieldsValue?.(true));
        // console.log('getFieldsValue: ', formRef.current.getFieldsValue?.(['name']));
        // console.log('getFieldValue: ', formRef.current.getFieldValue?.('name'));
        // console.log('setFieldsValue: ', formRef.current.setFieldsValue?.({gender: 'male'}));
        // console.log('setFields: ', formRef.current.setFields?.([{name: 'course', value: ['la']}]));
    };

    const onReset = (e: any) => {
        MessagePlugin.info('重置成功');
        init();
    };

    useEffect(() => {
        console.log('suitHook', suitHook)
        if (suitHook.data) {
            const suitList: any = suitHook.data.projectTaskItemList?.lawList;
            const personList: any = suitHook.data.projectTaskItemList?.principalList;
            setSuitOptions(suitList);
            setPersonOptions(personList);
        }
    }, [suitHook.data])

    useEffect(() => {
        if (isShow) {
            getSweeties({ variables: { teamId: teamId } }).catch((err: any) => { console.log(err) });
            getSelectList({ variables: { teamId: teamId } }).catch((err: any) => { console.log(err) });
        }
    }, [isShow]);

    // 初始化数据
    const init = () => {
        setTheLinuxDeviceId(null);
        setSystemT('');
        setTheAutoPartsId(null);
        setErrorText('');
        setLoading(false);
        setAndroidClintId('');
        setCertificateUrl('');
        setRadioV('pwd');
        setIgnoreCaseCount(0);
        setStepWords([]);
    }

    // 连接的提交submit
    const connectSub = () => {
        const result: any = connectFormRef.current.validate().then((res: any) => {
            console.log(res, 1111);
            if (res === true) {
                //   执行提交
                setLoading(true);
                const formData: any = connectFormRef.current.getFieldsValue?.(true);
                let request: any = { ...formData }
                request.teamId = teamId;
                request.connectCertificateUrl = certificateUrl;

                onlineCheck({ variables: request }).then((res: any) => {
                    console.log('onlineCheck--res', res)
                    setTheLinuxDeviceId(res?.data?.checkDeviceOnline?.deviceId || '');
                    if (res?.data?.checkDeviceOnline?.isOnline) {
                        setErrorText('');
                    } else {
                        setErrorText('连接失败');
                    }
                }).catch((err: any) => {
                    console.log(err);
                    setErrorText('连接失败');
                }).finally(() => {
                    setLoading(false);
                });
            }
        })

        console.log('connectSub', connectFormRef.current, result);
        console.log('getAllFieldsValue: ', connectFormRef.current.getFieldsValue?.(true));
    }

    // 输入密码 与 上传证书 切换
    const handleRadioChange = (v: any) => {
        console.log('handleRadioChange', v);
        setRadioV(v)
    }

    useEffect(() => {

    }, [onlineCheckHook.data])

    // 测试对象 hook
    useEffect(() => {
        console.log('selectListHook', selectListHook)
        if (selectListHook.data) {
            const { testObject, uploadFileUrl, clientAndroid, clientLinux }: any = selectListHook.data.projectSelectorList;
            setTestObjOption(formatterOptions(testObject) || []);
            setFileUrl(uploadFileUrl);
            setAndroidList(formatterAndroidList(clientAndroid) || []);
            setLinuxList(clientLinux || []);
        }
    }, [selectListHook.data]);

    // 测试终端 option
    const clintOptions = () => {
        if (systemT === 'Android') {
            return androidList;
        } else if (systemT === 'Linux') {
            return linuxList
        }
        return [];
    }

    // 获取Cascader options 数据后加载Cascader
    useEffect(() => {
        console.log('testObjOption', testObjOption)
        if (testObjOption?.length) {
            setShowCascader(true)
        }
    }, [testObjOption]);

    // 格式化 级联 测试对象 options
    const formatterOptions = (data: any) => {
        const arr: any = (data || []).map((item: any) => {
            let obj: any = {};
            obj.value = item.autoPartsId;
            obj.label = item.autoPartsName;
            obj.children = item.systemChild?.map((c: any) => {
                let objC: any = {};
                objC = { ...c };
                objC.value = c.systemId;
                objC.label = c.systemName + `(${c.systemType}-${c.systemVersion})`;
                return objC;
            });
            return obj;
        });
        return arr;
    }

    // Android Cascader 列表
    const formatterAndroidList = (data: any) => {
        const arr: any = (data || []).map((item: any) => {
            let obj: any = {};
            obj.value = item.clientId;
            obj.label = item.clientName;
            obj.children = item.clientChild?.map((c: any) => {
                let objC: any = {};
                objC = { ...c };
                objC.value = c.deviceId;
                objC.label = c.deviceName + `(${c.isUsable ? '可用' : '已占用'})`;
                objC.disabled = !c.isUsable;
                return objC;
            });
            return obj;
        });
        return arr;
    }

    // 获取systemType
    const getSystemType = (id: number) => {
        console.log(666, testObjOption)
        if (id) {
            (testObjOption || []).forEach((item: any) => {
                (item.children || []).forEach((c: any) => {
                    if (c.systemId === id) {
                        setSystemT(c.systemType);
                        setTheAutoPartsId(item.value);
                    }
                })
            })
        }
    }

    // 上传失败
    const handleFail = ({ file }: any) => {
        console.error(`文件 ${file.name} 上传失败`);
    };

    // 上传成功
    const handleUploadSuccess = (res: any) => {
        console.log('handleUploadSuccess', res);
        setCertificateUrl(res?.response);
    }

    // android 测试终端
    const androidSelectChange = (v: any) => {
        console.log('androidSelectChange', v, androidList);
        (androidList || []).forEach((item: any) => {
            item.children?.forEach((c: any) => {
                if (c.deviceId === v) {
                    setAndroidClintId(item.value);
                }
            })
        })
    }

    // Linux 系统时 初始化设备为 'pwd'
    useEffect(() => {
        if (systemT === 'Linux') {
            connectFormRef?.current?.setFieldsValue({ connectType: 'pwd' });
        }
    }, [systemT])

    const onCloseConfirm = () => {
        setVisibleConfirm(false);
    }
    return <Style>
        <Form resetType='empty' ref={formRef} onSubmit={onSubmit} onReset={onReset} labelWidth={100}>
            <Drawer size='medium'
                destroyOnClose={true}
                visible={isShow}
                onClose={() => { setIsShowAddDialog(false) }}
                header={<span style={{ fontWeight: 'bold' }}>新建项目</span>}
                body={<div>
                    <FormItem label="项目名称" name="name" labelAlign="left" rules={[{ required: true, message: '请填写项目名称', type: 'error' }]}>
                        <Input />
                    </FormItem>
                    <FormItem label="用例集" name="lawId" labelAlign="left" rules={[{ required: true, message: '请选择用例集', type: 'error' }]}>
                        <Select clearable>
                            {
                                suitOptions.map((value, key) => {
                                    return <Option key={value['id']} label={value['name']} value={value['id']} />
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem label="责任人" name="principalUserId" labelAlign="left" rules={[{ required: true, message: '请选择责任人', type: 'error' }]}>
                        <Select clearable>
                            {
                                personOptions.map((value, key) => {
                                    return <Option key={value['id']} label={value['name']} value={value['id']} />
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem label="测试对象" name="systemId" labelAlign="left" rules={[{ required: true, message: '请选择测试对象', type: 'error' }]}>
                        {showCascader ? <Cascader
                            options={testObjOption}
                            onChange={(v) => cascaderChange(v)}
                            value={testObjV}
                            size="medium"
                            clearable
                        >  </Cascader> : null}
                    </FormItem>
                    {systemT === 'Android' ? <AndroidCard><FormItem label="测试终端" labelWidth={79} name='deviceId' labelAlign="left" rules={[{ required: true, message: '请选择测试终端', type: 'error' }]}>
                        <Cascader className='kn-w-232' placeholder='请选择测试终端' options={clintOptions()} onChange={androidSelectChange} style={{ width: 232 }} />
                    </FormItem></AndroidCard> : null}
                    {systemT === 'Linux' ? <CardConnect>
                        <Form ref={connectFormRef} labelWidth={79}>
                            <FormItem label="测试终端" name='clientId' labelAlign="left" rules={[{ required: true, message: '请选测试终端', type: 'error' }]}>
                                <Select className='kn-w-232' keys={{ value: "clientId", label: 'clientName' }} placeholder='请选择测试终端' options={clintOptions()} style={{ width: 232 }} />
                            </FormItem>
                            <FormItem label="设备" name='connectType' labelAlign="left" >
                                <Radio.Group value={radioV} onChange={handleRadioChange} >
                                    <Radio value="pwd" className='kn-radio'>输入密码</Radio>
                                    <Radio value="cert" className='kn-radio'>上传证书</Radio>
                                </Radio.Group>
                            </FormItem>
                            <FormItem labelAlign="left" name='connectIP' rules={[{ required: true, message: '请输入IP地址', type: 'error' }]}>
                                <Input placeholder='请输入IP地址' className='kn-w-232' />
                            </FormItem>
                            <FormItem labelAlign="left" name='connectPort' rules={[{ required: true, message: '请输入端口号', type: 'error' }]}>
                                <Input placeholder='请输入端口号' className='kn-w-232' />
                            </FormItem>
                            <FormItem labelAlign="left" name='connectUser' rules={[{ required: true, message: '请输入用户名', type: 'error' }]}>
                                <Input placeholder='请输入用户名' className='kn-w-232' />
                            </FormItem>
                            {radioV === 'pwd' ? <FormItem labelAlign="left" name='connectPassword' rules={[{ required: true, message: '请输入密码', type: 'error' }]}>
                                <Input placeholder='请输入密码' className='kn-w-232' />
                            </FormItem> : null}
                            {radioV === 'cert' ? <FormItem className='kn-file-item' labelAlign="left" name='connectCertificateUrl' rules={[{ required: true, message: '请上传证书', type: 'error' }]}>
                                <Upload
                                    placeholder='上传证书'
                                    onFail={handleFail}
                                    onSuccess={handleUploadSuccess}
                                    action={fileUrl}
                                />
                            </FormItem> : null}
                            <CardConnectFooter>
                                <Button theme="primary" onClick={() => connectSub()} className='kn-connect-btn'>
                                    连接设备
                                </Button>
                                <TextContent>
                                    {loading ? <span><LoadingIcon className='kn-text-icon' size="1.5em" color='#0052D9' /><span className='text-loading'>设备连接中，请稍候...</span></span> : null}
                                    {errorText && !loading ? <span><IconFont name="error-circle-filled" className='kn-text-icon' size="1.5em" style={{ color: '#E34D59' }} /><span className='text-error'>{errorText}</span></span> : null}
                                    {!loading && theLinuxDeviceId ? <span><IconFont name="check-circle-filled" className='kn-text-icon' size="1.5em" style={{ color: '#00A870' }} /><span className='text-success'>设备连接成功</span></span> : null}
                                </TextContent>
                            </CardConnectFooter>
                        </Form>

                    </CardConnect> : null}

                </div>}
                footer={
                    <FootButtonGroup>
                        <Button type="submit" theme="primary">
                            提交
                        </Button>
                        <Button theme="default" type="reset" style={{ marginLeft: 12 }}>
                            重置
                        </Button>
                    </FootButtonGroup>
                }
            >
            </Drawer>
        </Form>
        <Dialog
            className='kn-add-success'
            cancelBtn={false}
            width="960px"
            confirmBtn="我知道了"
            header={
                <>
                    <ErrorCircleFilledIcon style={{ color: '#0052D9' }} />
                    <span>新建项目成功</span>
                </>
            }
            visible={visibleConfirm}
            onClose={onCloseConfirm}
            onConfirm={onCloseConfirm}
        >
            <SuccessDialogContent>
                <DialogItem>选择用例集中有<span className='kn-color-y'>{ignoreCaseCount}</span>条用例因不支持该操作而被自动踢出</DialogItem>
                <DialogItem>用例集中有存在自动化用例，故本次检测项目的环境准备将遵循系统自动化流程
                    <span className='kn-color-y'>
                        {stepWords.map((item: any, index: number) => {
                            if (index === stepWords.length - 1) {
                                return (
                                    <span>{item}</span>
                                )
                            } else {
                                return (
                                    <span>{item}-{'>'}</span>
                                )
                            }

                        })}。
                    </span>
                </DialogItem>
            </SuccessDialogContent>
        </Dialog>
    </Style>
}