import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { Modal, Input, Button, Form, Select, notification, Upload, H3, Radio } from '@tencent/tea-component';
import { useEditUserCustomCaseMutation, useGetCaseStaticCheckedItemsQuery } from 'generated/graphql';
import style from '@emotion/styled/macro';

type ModifyCaseType = {
    isShow: boolean
    setIsShowAddDialog: Dispatch<SetStateAction<boolean>>
    caseItem: any
    uploadFileUrl: string
    suiteId: string
    refreshFn: () => void
}

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

export const ModifyCaseModal: React.FC<ModifyCaseType> = (props) => {

    const [add] = useEditUserCustomCaseMutation();

    const teamId = 'team_items;1';

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

    const optionHook = useGetCaseStaticCheckedItemsQuery({
        variables: {
            teamId: teamId
        }
    });


    const validateFrom = () => {
        console.log('validating');
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
        if (testMethod) {
            setTestMethodSt('success')
        }
        else {
            setTestMethodSt('error')
            result = false;
        }
        if (selectRisk) {
            setSelectRiskSt('success')
        }
        else {
            setSelectRiskSt('error')
            result = false;
        }
        return result;
    }
    const saveBtnClick = async () => {
        if (validateFrom()) {
            setIsEtablish(true);
            // teamId
            // suiteId
            // name
            let _descriptionInfo = '';
            let _scriptUrl = '';

            console.log(typeof rspUrl);


            if (caseType === '1') {
                _scriptUrl = rspUrl;
                _descriptionInfo = scriptDesc;
            }
            else if (caseType === '0') {
                _scriptUrl = '';
                _descriptionInfo = resultDesc;
            }
            // console.log(rspUrl);
            await add({
                variables: {
                    teamId: teamId,
                    caseId: props.caseItem.id,
                    name: caseName,
                    caseDesc: caseDesc,
                    remediation: remediation,
                    descriptionInfo: _descriptionInfo,
                    caseType: parseInt(caseType),
                    scriptUrl: _scriptUrl,
                    stepName:'',
                    classifyId: parseInt(selectCataGrey),
                    operatingSystemId: selectSystem,
                    riskLevelId: selectRisk,
                    testMethod:parseInt(testMethod)
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
            console.log(props.caseItem);

            setCaseName(props.caseItem.name);
            setPreFileName(props.caseItem.scriptFileName);
            setRspUrl(props.caseItem.scriptUrl || '');
            setCaseType(props.caseItem.caseType.toString());
            setSelectArea(props.caseItem.territoryId);
            setSelectCataGrey(props.caseItem.classifyId);
            setSelectSystem(props.caseItem.operatingSystemID);
            setSelectRisk(props.caseItem.riskLevelId);
            setCaseDesc(props.caseItem.caseDesc);
            setRemediation(props.caseItem.remediation);
            setTestMethod(props.caseItem.testMethodId.toString());

            setCaseNameSt('');
            setSelectAreaSt('');
            setCaseDescSt('');
            setSelectCataGreySt('');
            setRemediationSt('');
            setResultDescSt('');
            setScriptDescSt('');
            setSelectSystemSt('');
            setSelectRiskSt('');
            setRspUrlSt('');
            setTestMethodSt('');

            if (props.caseItem.caseType.toString() === '1') {
                setScriptDesc(props.caseItem.descriptionInfo);
                setScriptDescSt(true);
                setRspUrlSt(true);
            }
            else if (props.caseItem.caseType.toString() === '0') {
                setResultDesc(props.caseItem.descriptionInfo);
                setResultDescSt(true);
            }
        }
    }, [props.isShow])
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

    return <> <Modal size={'l'} visible={props.isShow} caption={<Localized id='compliance-editCase'></Localized>} onClose={() => { props.setIsShowAddDialog(false) }}>
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
                                // if (value) {
                                //     setCaseDescSt('success')
                                // }
                                // else {
                                //     setCaseDescSt('error')
                                // }
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
                                // if (value) {
                                //     setRemediationSt('success')
                                // }
                                // else {
                                //     setRemediationSt('error')
                                // }
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
                                <Input disabled={caseType === '1'} value={resultDesc} size='full' onChange={(value) => {
                                    setResultDesc(value);
                                    // if (value) {
                                    //     setResultDescSt('success')
                                    // }
                                    // else {
                                    //     setResultDescSt('error')
                                    // }
                                }} placeholder={getValue('license-upload-placeholder')} />
                            </Form.Item>
                        </Form>
                    </div>
                    <Radio name="1"><Localized id="compliance-runningStep"></Localized></Radio>
                    <div style={{ padding: '20px 0px' }}>
                        <Form>
                            <Form.Item label={<Localized id="compliance-stepDesc"></Localized>} status={scriptDescSt}>
                                <Input disabled={caseType === '0'} value={scriptDesc} size='full' onChange={(value) => {
                                    setScriptDesc(value);
                                    // if (value) {
                                    //     setScriptDescSt('success')
                                    // }
                                    // else {
                                    //     setScriptDescSt('error')
                                    // }
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
                                    <Input style={{ marginRight: 20, width: 546 }} disabled={caseType === '0'} value={preFileName} />
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