import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { Modal, Input, Button, Form, Select, notification, Upload, H3, Radio } from '@tencent/tea-component';
import { useCreateUserCustomCaseItemMutation, useGetCaseStaticCheckedItemsQuery } from 'generated/graphql';
import style from '@emotion/styled/macro';

const FromRow = style.div`
    display: flex;
    margin-top: 16px;
`
const FullItem = style.div`
    display: flex;
    width: 100%;
    align-items: center;
`
const HalfItem = style.div`
    display: flex;
    width: 50%;
    align-items: center;
`
const LabelBox = style.div`
    color: rgba(0,0,0,.4);
    width: 72px;
`
const ContentBox = style.div`
    width: calc(100% - 25px);
`

type AddProjectType = {
    isShow: boolean
    setIsShowAddDialog: Dispatch<SetStateAction<boolean>>
    uploadFileUrl: string
    suiteId: string
    refreshFn: () => void
}


export const AddNewCaseModal: React.FC<AddProjectType> = (props) => {

    const [add] = useCreateUserCustomCaseItemMutation();

    const teamId = 'team_items;1';

    const optionHook = useGetCaseStaticCheckedItemsQuery({
        variables: {
            teamId: teamId
        }
    });

    const getValue = useGetMessage();
    const [isEtablish, setIsEtablish] = useState(false);

    const [caseType, setCaseType] = useState<string>('0');

    const [caseName, setCaseName] = useState<string>('');
    const [caseNameSt, setCaseNameSt] = useState<any>();

    const [caseDesc, setCaseDesc] = useState<any>('');
    const [caseDescSt, setCaseDescSt] = useState<any>('');

    const [remediation, setRemediation] = useState<any>('');
    const [remediationSt, setRemediationSt] = useState<any>('');

    const [resultDesc, setResultDesc] = useState<string>('');
    const [resultDescSt, setResultDescSt] = useState<any>();
    const [scriptDesc, setScriptDesc] = useState<string>('');
    const [scriptDescSt, setScriptDescSt] = useState<any>('');

    const [isUploading, setIsUploading] = useState<boolean>(false);

    const [preFileName, setPreFileName] = useState<string>('');

    const [areaOptions, setAreaOptions] = useState<any[]>([]);
    const [cataGreyOptions, setCataGreyOptions] = useState<any[]>([]);
    const [systemOptions, setSystemOptions] = useState<any[]>([]);
    const [riskOptions, setRiskOptions] = useState<any[]>([]);

    const [selectArea, setSelectArea] = useState<any>('');
    const [selectAreaSt, setSelectAreaSt] = useState<any>();
    const [selectCataGrey, setSelectCataGrey] = useState<any>('');
    const [selectCataGreySt, setSelectCataGreySt] = useState<any>();

    const [selectSystem, setSelectSystem] = useState<any>('');
    const [selectSystemSt, setSelectSystemSt] = useState<any>('');
    const [selectRisk, setSelectRisk] = useState<any>('');
    const [selectRiskSt, setSelectRiskSt] = useState<any>('');

    const [rspUrl, setRspUrl] = useState<string>('');
    const [rspUrlSt, setRspUrlSt] = useState<any>();

    const [testMethod,setTestMethod] = useState('');
    const [testMethodSt, setTestMethodSt] = useState<any>();

    const [requriedMark] = useState(<div style={{ color: 'red', float: 'right', marginTop: 2, marginRight: 5 }}>*</div>);

    const validateFrom = () => {
        let result = true;
        if (caseName) {
            setCaseNameSt('success')
        }
        else {
            setCaseNameSt('error')
            result = false;
        }
        if (selectArea) {
            setSelectAreaSt('success')
        }
        else {
            setSelectAreaSt('error')
            result = false;
        }
        if (selectCataGrey) {
            setSelectCataGreySt('success')
        }
        else {
            setSelectCataGreySt('error')
            result = false;
        }
        if (selectSystem) {
            setSelectSystemSt('success')
        }
        else {
            setSelectSystemSt('error')
            result = false;
        }
        if (selectRisk) {
            setSelectRiskSt('success')
        }
        else {
            setSelectRiskSt('error')
            result = false;
        }
        if (testMethod) {
            setTestMethodSt('success')
        }
        else {
            setTestMethodSt('error')
            result = false;
        }
        if (caseType === '1') {
            if (rspUrl) {
                setRspUrlSt('success')
            }
            else {
                setRspUrlSt('error')
                result = false;
            }
        }
        return result;
    }
    const saveBtnClick = async () => {

        if (validateFrom()) {
            setIsEtablish(true);
            let _descriptionInfo = '';
            let _scriptUrl = '';

            if (caseType === '1') {
                _scriptUrl = rspUrl;
                _descriptionInfo = scriptDesc;
            }
            else if (caseType === '0') {
                _scriptUrl = '';
                _descriptionInfo = resultDesc;
            }
            await add({
                variables: {
                    teamId: teamId,
                    name: caseName,
                    caseDesc: caseDesc,
                    remediation: remediation,
                    descriptionInfo: _descriptionInfo,
                    caseType: parseInt(caseType),
                    scriptUrl: _scriptUrl,
                    stepName: '',
                    classifyId: selectCataGrey,
                    operatingSystemId: selectSystem,
                    riskLevelId: selectRisk,
                    testMethod: parseInt(testMethod)
                }
            }).then(() => {
                props.setIsShowAddDialog(false);
                props.refreshFn();
                notification.success({
                    description: getValue('compliance-oprationSuccess')
                })
            }).catch((error) => {
                notification.error({
                    description: error.toString()
                })
            })
            setIsEtablish(false);
        }
    }

    useEffect(() => {
        // console.log(caseType);
        if (caseType === '1') {
            setResultDesc('');
            setResultDescSt(null);
        }
        else if (caseType === '0') {
            setScriptDesc('');
            setScriptDescSt(null);
            setRspUrlSt(null);
            setRspUrl('');
            setPreFileName('');
        }
    }, [caseType]);
    useEffect(() => {
        if (props.isShow) {
            optionHook.refetch();

            setCaseName('');
            setPreFileName('');
            setRspUrl('');
            setCaseType('0');
            setScriptDesc('');
            setResultDesc('');
            setCaseDesc('');
            setRemediation('');
            setSelectSystem('');
            setSelectRisk('');

            setCaseNameSt(undefined);
            setSelectArea(undefined);
            setSelectAreaSt(undefined);
            setSelectCataGrey(undefined);
            setSelectCataGreySt(undefined);
            setScriptDescSt(undefined);
            setResultDescSt(undefined);
            setCaseDescSt(undefined);
            setRemediationSt(undefined);
            setSelectRiskSt(undefined);
            setSelectSystemSt(undefined);

        }
    }, [props.isShow]);

    useEffect(() => {

        let _areaOption: any[] = [];
        let _cataGreyOptions: any[] = [];
        let _systemOptions: any[] = [];
        let _riskOptions: any[] = [];

        optionHook.data?.getCaseStaticCheckedItems?.territoryList?.map((value: any, key: any) => {
            _areaOption.push({
                value: value.id,
                text: value.name
            })
        })
        optionHook.data?.getCaseStaticCheckedItems?.classifyList?.map((value: any, key: any) => {
            _cataGreyOptions.push({
                value: value.id,
                text: value.name
            })
        })
        optionHook.data?.getCaseStaticCheckedItems?.operatingSystem?.map((value: any, key: any) => {
            _systemOptions.push({
                value: value.id,
                text: value.name
            })
        })
        optionHook.data?.getCaseStaticCheckedItems?.riskLevel?.map((value: any, key: any) => {
            _riskOptions.push({
                value: value.id,
                text: value.name
            })
        })
        setAreaOptions(_areaOption);
        setCataGreyOptions(_cataGreyOptions);
        setSystemOptions(_systemOptions);
        setRiskOptions(_riskOptions);
    }, [optionHook.data?.getCaseStaticCheckedItems]);

    return <> <Modal size={'l'} visible={props.isShow} caption={<Localized id='compliance-addcase'></Localized>} onClose={() => { props.setIsShowAddDialog(false) }}>
        <Modal.Body>
            <FromRow style={{ marginTop: 0 }}>
                <FullItem>
                    <LabelBox>用例名{requriedMark}</LabelBox>
                    <ContentBox>
                        <Form.Control status={caseNameSt} required={true}>
                            <Input style={{ width: 645 }} value={caseName} onChange={(value) => {
                                setCaseName(value)
                                if (value) {
                                    setCaseNameSt('success')
                                }
                                else {
                                    setCaseNameSt('error')
                                }
                            }} placeholder={getValue('license-upload-placeholder')} />
                        </Form.Control>
                    </ContentBox>
                </FullItem>
            </FromRow>
            <FromRow>
                <FullItem>
                    <LabelBox>测试类型{requriedMark}</LabelBox>
                    <ContentBox>
                        <Form.Control status={testMethodSt} required={true}>
                            <Radio.Group value={testMethod} onChange={(e)=>{
                                setTestMethod(e);
                                setTestMethodSt('success');
                            }}>
                                <Radio name="24">手动</Radio>
                                <Radio name="25">半自动</Radio>
                                <Radio name="26">自动</Radio>
                            </Radio.Group>
                        </Form.Control>
                    </ContentBox>
                </FullItem>
            </FromRow>
            <FromRow>
                <HalfItem>
                    <LabelBox>领域{requriedMark}</LabelBox>
                    <ContentBox>
                        <Form.Control status={selectAreaSt}>
                            <Select value={selectArea}
                                matchButtonWidth
                                type="simulate"
                                appearance="button"
                                options={areaOptions}
                                style={{ marginLeft: 4, width: 'calc(100% - 40px)' }}
                                onChange={(value) => {
                                    setSelectArea(value)
                                    if (value) {
                                        setSelectAreaSt('success')
                                    }
                                    else {
                                        setSelectAreaSt('error')
                                    }
                                }} placeholder={getValue('license-upload-placeholder')} size='full' />
                        </Form.Control>
                    </ContentBox>
                </HalfItem>
                <HalfItem>
                    <LabelBox>分类{requriedMark}</LabelBox>
                    <ContentBox>
                        <Form.Control status={selectCataGreySt}>
                            <Select value={selectCataGrey}
                                matchButtonWidth
                                type="simulate"
                                appearance="button"
                                options={cataGreyOptions}
                                style={{ marginLeft: 4, width: 'calc(100% - 40px)' }}
                                onChange={(value) => {
                                    setSelectCataGrey(value)
                                    if (value) {
                                        setSelectCataGreySt('success')
                                    }
                                    else {
                                        setSelectCataGreySt('error')
                                    }
                                }} placeholder={getValue('license-upload-placeholder')} size='full' />
                        </Form.Control>
                    </ContentBox>
                </HalfItem>
            </FromRow>
            <FromRow>
                <HalfItem>
                    <LabelBox>操作系统{requriedMark}</LabelBox>
                    <ContentBox>
                        <Form.Control status={selectSystemSt}>
                            <Select value={selectSystem}
                                matchButtonWidth
                                type="simulate"
                                appearance="button"
                                options={systemOptions}
                                style={{ marginLeft: 4, width: 'calc(100% - 40px)' }}
                                onChange={(value) => {
                                    setSelectSystem(value)
                                    if (value) {
                                        setSelectSystemSt('success')
                                    }
                                    else {
                                        setSelectSystemSt('error')
                                    }
                                }} placeholder={getValue('license-upload-placeholder')} size='full' />
                        </Form.Control>
                    </ContentBox>
                </HalfItem>
                <HalfItem>
                    <LabelBox>风险程度{requriedMark}</LabelBox>
                    <ContentBox>
                        <Form.Control status={selectRiskSt}>
                            <Select value={selectRisk}
                                matchButtonWidth
                                type="simulate"
                                appearance="button"
                                options={riskOptions}
                                style={{ marginLeft: 4, width: 'calc(100% - 40px)' }}
                                onChange={(value) => {
                                    setSelectRisk(value)
                                    if (value) {
                                        setSelectRiskSt('success')
                                    }
                                    else {
                                        setSelectRiskSt('error')
                                    }
                                }} placeholder={getValue('license-upload-placeholder')} size='full' />
                        </Form.Control>
                    </ContentBox>
                </HalfItem>
            </FromRow>
            <FromRow>
                <FullItem>
                    <LabelBox>描述</LabelBox>
                    <ContentBox>
                        <Form.Control status={caseDescSt} required={true}>
                            <Input style={{ width: 645 }} value={caseDesc} onChange={(value) => {
                                setCaseDesc(value)
                            }} placeholder={getValue('license-upload-placeholder')} />
                        </Form.Control>
                    </ContentBox>
                </FullItem>
            </FromRow>
            <FromRow>
                <FullItem>
                    <LabelBox>修复建议</LabelBox>
                    <ContentBox>
                        <Form.Control status={remediationSt} required={true}>
                            <Input style={{ width: 645 }} value={remediation} onChange={(value) => {
                                setRemediation(value)
                            }} placeholder={getValue('license-upload-placeholder')} />
                        </Form.Control>
                    </ContentBox>
                </FullItem>
            </FromRow>
            <H3 style={{ height: 40, marginTop: 20 }}><Localized id='compliance-stepConfig'></Localized></H3>
            <div style={{ width: '100%' }}>
                <Radio.Group
                    value={caseType}
                    onChange={value => setCaseType(value)}
                    layout="column"
                >
                    <Radio name="0"><Localized id="compliance-checkingStep"></Localized></Radio>
                    <div style={{ padding: '20px 0px' }}>
                        <Form>
                            <Form.Item label={<Localized id="compliance-stepDesc"></Localized>} status={resultDescSt}>
                                <Input style={{ width: 645 }} disabled={caseType === '1'} value={resultDesc} size='full' onChange={(value) => {
                                    setResultDesc(value);
                                }} placeholder={getValue('license-upload-placeholder')} />
                            </Form.Item>
                        </Form>
                    </div>
                    <Radio name="1"><Localized id="compliance-runningStep"></Localized></Radio>
                    <div style={{ padding: '20px 0px' }}>
                        <Form>
                            <Form.Item label={<Localized id="compliance-stepDesc"></Localized>} status={scriptDescSt}>
                                <Input style={{ width: 645 }} disabled={caseType === '0'} value={scriptDesc} size='full' onChange={(value) => {
                                    setScriptDesc(value);
                                }} placeholder={getValue('license-upload-placeholder')} />
                            </Form.Item>
                            <Form.Item label={<Localized id="compliance-uploadScript"></Localized>} status={rspUrlSt}>
                                <Upload
                                    method={'POST'}
                                    action={props.uploadFileUrl}
                                    onStart={(file) => {
                                        setPreFileName(file.name);
                                        setIsUploading(true)
                                    }}
                                    onSuccess={(result) => {
                                        setRspUrl(result.toString() || '');
                                        setIsUploading(false)
                                        setRspUrlSt('success');
                                    }}
                                    accept={['.py', '.sh']}
                                >
                                    <Input style={{ marginRight: 20, width: 534 }} disabled={caseType === '0'} value={preFileName} />
                                    <Button disabled={caseType === '0'} loading={isUploading} >{rspUrl.length === 0 ? <Localized id={'file-upload'}></Localized> : <Localized id={'compliance-reUpload'}></Localized>}</Button>
                                </Upload>
                            </Form.Item>
                        </Form>
                    </div>
                </Radio.Group>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button type="primary" onClick={saveBtnClick} loading={isEtablish}>
                <Localized id={'modal-ok'}></Localized>
            </Button>
            <Button type="weak" onClick={() => { props.setIsShowAddDialog(false) }}>
                <Localized id={'modal-cancel'}></Localized>
            </Button>
        </Modal.Footer>
    </Modal></>
}