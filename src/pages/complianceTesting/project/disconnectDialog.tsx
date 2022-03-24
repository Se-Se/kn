import React, { Dispatch, SetStateAction, useEffect, useState, useMemo, useRef } from 'react';
// import { Icon, H3 } from '@tencent/tea-component';
import style from '@emotion/styled/macro';
import { Button, Dialog, Form, Input, Radio, MessagePlugin, Select, Upload } from 'tdesign-react';
import { CloseCircleFilledIcon } from 'tdesign-icons-react';
import {
    useExchangeLinuxDeviceConnectMsgLazyQuery,
    useGetSelectedAppListLazyQuery,
    useGetAnalysisAppListLazyQuery
} from 'generated/graphql';


const { FormItem } = Form;
type dialogProp = {
    display: string
    setDisplay: Dispatch<SetStateAction<string>>
    title: string
    content: string
}
interface ProjectMatch {
    projectId: string
}

export const DisconnectDialog: React.FC<dialogProp> = ({ display, setDisplay, title, content }) => {
    const formRef = useRef<any>();

    const [options, setOptions] = useState<any[]>([]);

    const [type, setType] = useState<string>('psw');
    const [submit, submitHook] = useExchangeLinuxDeviceConnectMsgLazyQuery();

    const onSubmit = (e: any) => {
        console.log(e);
        if (e.validateResult === true) {
            MessagePlugin.info('提交成功');
        }
        if (formRef && formRef.current && formRef.current.getFieldsValue) {

            console.log('getFieldsValue all: ', formRef.current.getFieldsValue?.(true));
        }
        // console.log('getFieldsValue: ', formRef.current.getFieldsValue?.(['name']));
        // console.log('getFieldValue: ', formRef.current.getFieldValue?.('name'));
    };
    return <>
        <Dialog
            header={
                <>
                    <CloseCircleFilledIcon style={{ color: 'rgb(227, 77, 89)' }} />
                    <span>{title}</span>
                </>
            }
            body={
                <span>
                    {content}
                </span>
            }
            footer={
                <>
                    <Button variant="outline" theme="danger">我知道了</Button>
                </>
            }
            visible={display === 'android'}
            onClose={() => { setDisplay('hide') }}
        ></Dialog>
        <Dialog
            header={
                <>
                    <CloseCircleFilledIcon style={{ color: 'rgb(227, 77, 89)' }} />
                    <span>{title}</span>
                </>
            }
            body={
                <>
                    <span>
                        {content}
                    </span>
                    <Form onValuesChange={(values) => {
                        console.log(values);
                        if(values['type']){
                            setType(values['type'] as string);
                        }
                    }}
                        style={{ marginTop: 25 }}
                        ref={formRef}
                        onSubmit={onSubmit}
                        colon
                        labelWidth={100}>
                        <FormItem label="测试终端" name="terminal">
                            {
                                <Select clearable>
                                    {options.map((item, index) => (
                                        <Select.Option value={item.value} label={item.label} key={index} />
                                    ))}
                                </Select>
                            }
                        </FormItem>
                        <FormItem label="设备" name="type" initialData={'psw'}>
                            <Radio.Group
                                options={
                                    [
                                        {
                                            value: 'psw',
                                            label: '输入密码'
                                        },
                                        {
                                            value: 'upload',
                                            label: '上传证书'
                                        }
                                    ]
                                }
                            >
                            </Radio.Group>
                        </FormItem>
                        <FormItem label="" name="ip">
                            <Input placeholder='请输入IP地址' />
                        </FormItem>
                        <FormItem label="" name="port">
                            <Input placeholder='请输入端口号' />
                        </FormItem>
                        <FormItem label="" name="username">
                            <Input placeholder='请输入用户名' />
                        </FormItem>
                        {
                            type === 'psw' ?
                                <FormItem label="" name="userpws">
                                    <Input placeholder='请输入密码' />
                                </FormItem> : <FormItem label="" name="upload">
                                    <Upload
                                        action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
                                    />
                                </FormItem>
                        }

                        <FormItem>
                            <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                                <Button onClick={() => [
                                    setDisplay('hide')
                                ]} variant="outline" theme="default">取消</Button>
                                <Button style={{ marginLeft: 10 }} type="submit" variant="outline" theme="danger">重新连接</Button>
                            </div>
                        </FormItem>
                    </Form>
                </>
            }
            visible={display === 'linux'}
            onClose={() => { setDisplay('hide') }}
            footer={false}
        ></Dialog>
    </>
}