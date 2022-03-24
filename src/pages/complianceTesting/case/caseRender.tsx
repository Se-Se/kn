import React, { useEffect, useState, useRef } from 'react';
import { useGetCaseStepDetailQuery, useSubmitResultMutation, useNextStepSubmitResultMutation, useResetStepCheckedResultMutation, useReportViewActionQuery } from 'generated/graphql';
import { Button, Card, Icon, Status, notification, ImagePreview, Radio, Input, Upload, SelectMultiple, Modal, Bubble, Table } from '@tencent/tea-component';
import { Loading } from './loading';
import style from '@emotion/styled/macro';
import { useRouteMatch } from 'react-router-dom';
import { Localized, useGetMessage } from 'i18n';
import { useToken } from 'components/TokenService'
import { ReportModal } from './reportModal';

import { RpCheckSec } from './rp_check_sec';
import { RpCve } from './rp_cve';
import { RpDetailPermission } from './rp_detail_permission';
import { RpDetailFile } from './rp_detail_file';
import { RpDetailLicense } from './rp_detail_license';
import { RpAppConfig } from './rp_app_config';
import { RpOpenAssembly } from './rp_open_assembly';

const MarkdownRender = React.lazy(() => import('./markDownRender'));
const Editor = React.lazy(() => import('./editor'));

const { autotip } = Table.addons;

type caseRenderType = {
    stepId: string
    currentStatus: number
    heartBeatResult: any
    renderNextStep: () => void
    isLast: boolean
    refetchRemark: number
    setHeartBeatResult: any
    tickResult: any
    setCaseStutas:any
    // isControlUseable: boolean
}
const StepContainer = style.div`
    width:50%;
    height:100%;
    position: relative;
`;
const MdContainer = style.div`
    width:50%;
    border-left: 1px solid #e7eaef;
`;
const CaseContainer = style.div`
    display:flex;
    height:100%;
`;
const NextStep = style.div`
    position: absolute;
    bottom: 20px;
    right: 20px
`;
const RenderContent = style.div`
    padding:20px;
    height:calc(100% - 100px);
    width:calc(100% - 40px);
`;
// const Mask = style.div`
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     background: black;
//     opacity: 0.5;
//     top:0;
//     left:0;
//     text-align: center;
//     z-index:2;
// `;
const InputItem = style.div`
    margin-top: 10px;
`;
const LabelDom = style.div`
`;
const InputDom = style.div`
    margin-top: 10px;
`;

interface ProjectMatch {
    caseId: string
    lawCatalogueId: string
    projectId: string
};


export const CaseRender: React.FC<caseRenderType> = ({ stepId, currentStatus, heartBeatResult, renderNextStep, isLast, refetchRemark, setHeartBeatResult, tickResult,setCaseStutas }) => {

    const teamId = 'team_items;1';
    const pageParam = useRouteMatch<ProjectMatch>().params;
    const caseId = pageParam.caseId;
    const projectId = pageParam.projectId;
    const [showFinalConfirm,setShowFinalConfirm] = useState(false);

    const getValue = useGetMessage();

    let token = 'Bearer ' + useToken();

    const [schemaData, setSchemaData] = useState<any>({});

    const dataHook = useGetCaseStepDetailQuery({ variables: { teamId: teamId, projectId: projectId, caseId: caseId, stepId: stepId }, fetchPolicy: 'network-only' });
    const reportHook = useReportViewActionQuery({
        variables: {
            teamId: teamId,
            caseId: caseId,
            caseStepId: stepId,
            projectId: projectId
        },
        fetchPolicy: 'network-only'
    })
    const [reportData, setReportData] = useState<any>();

    const [stepConfig, setStepConfig] = useState<any>();
    const [stepMd, setStepMd] = useState<any>();
    const [, setShowMask] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [terminalCode, setTerminalCode] = useState<any>('');
    const [imgUrl, setimgUrl] = useState<string>('');
    const [openUrl, setOpenUrl] = useState<string>('');
    const [scriptParamList, setScriptParamList] = useState<any[]>([]);
    const [selectOptionLists, setSelectOptionLists] = useState<any[]>([]);
    const [selectValue, setSelectValue] = useState<any[]>([]);
    const [tableRecord, setTableRecord] = useState<any[]>([]);
    const [timeSpanValue, setTimeSpanValue] = useState<any[]>([]);

    const ele = useRef(null);
    // const [EleHeight, setEleHeigth] = useState<number>(window.innerHeight - 600);
    const [exeAction] = useSubmitResultMutation();
    const [exeNextStep] = useNextStepSubmitResultMutation();
    const [resetStep] = useResetStepCheckedResultMutation();
    const [radioValue, setRadioValue] = useState<any>('');
    const [isControlUseable, setIsControlUseable] = useState<boolean>(false);
    const [resetCheckEnable, setResetCheckEnable] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const [scriptParam, setScriptParam] = useState<any>({});

    const [terminalType, setTermainalType] = useState<string>('inner');

    // const [isOpenReport, setIsOpenReport] = useState<boolean>(false);

    const [showUpLoadImg, setShowUpLoadImg] = useState<boolean>(false);
    // const { Content, Body } = Layout;


    useEffect(() => {
        if (dataHook.data?.getCaseStepDetail) {
            try {
                const configString = dataHook.data.getCaseStepDetail.config;
                const _word = configString.replace(/\\/g, '');
                const obj = JSON.parse(_word);

                setStepConfig(obj);
                let _schemaData = schemaData;
                for (let item of obj.schema) {
                    _schemaData[item.name] = null;
                }
                setSchemaData(_schemaData);
                setStepMd(dataHook.data.getCaseStepDetail.markdown);
                // setTerminalCode(heartBeatResult)
            }
            catch (e) {
                console.log(e);
                setSchemaData({});
                setStepMd('load error');
            }
        }
    }, [dataHook.data?.getCaseStepDetail])
    useEffect(() => {
        setCode('');
        if (dataHook.data?.getCaseStepDetail) {
            // if (dataHook.data.getCaseStepDetail.code) {
            //     const newValue = dataHook.data.getCaseStepDetail.code
            //     setCode(newValue);
            // }
        }
    }, [dataHook.data?.getCaseStepDetail])
    useEffect(() => {
        if (dataHook.data?.getCaseStepDetail) {
            setIsControlUseable(dataHook.data.getCaseStepDetail.caseEnable)
            setResetCheckEnable(dataHook.data.getCaseStepDetail.resetCheckEnable)
        }
    }, [dataHook.data?.getCaseStepDetail])

    useEffect(() => {

        setTerminalCode(heartBeatResult);

        setShowMask(false);

        setimgUrl(heartBeatResult);

        setRadioValue(heartBeatResult?.toString() || '');

        setOpenUrl(heartBeatResult);

        if (heartBeatResult) {
            try {

                let list = JSON.parse(heartBeatResult);

                let selectList = [];
                let defaultValue = [];
                for (let item in list) {
                    selectList.push({
                        value: item,
                        text: item
                    })
                    if (list[item] === 'true') {
                        defaultValue.push(item)
                    }
                }
                setSelectOptionLists(selectList);
                setSelectValue(defaultValue);

            }
            catch (e) {
                // console.log(e);
            }
        }

        if (heartBeatResult?.record) {
            setTableRecord(heartBeatResult.record);
        }

        if (heartBeatResult?.timestamp) {
            setTimeSpanValue(heartBeatResult.timestamp);
        }

        if (tickResult) {

            const _word = tickResult.result;

            if(_word){
                
                const newValue = JSON.parse(_word);
                if (newValue.type && newValue.type === 'image') {
                    setShowUpLoadImg(true);
                }
                else{
                    setShowUpLoadImg(false);
                }
            }
            else {
                setShowUpLoadImg(false);
            }

        }

    }, [heartBeatResult])


    const commonBtnClick = (value: any) => {
        // const keyWords = value.result;
        // const _keyWords = keyWords.slice(1,keyWords.length);
        // let _schemaData = schemaData;
        // console.log(_keyWords);


        let _param = '';

        if (value.args) {
            let f_param = analysiArgs(value.args);
            if (typeof f_param === 'string') {
                _param = f_param;
            }
            else if (typeof f_param === 'object') {
                _param = JSON.stringify(f_param);
            }
        }
        exeActionFunction(value.clickAction, _param);
    }

    const analysiArgs: any = (args: any) => {
        let value = {};
        for (let item in args) {
            if (args[item].indexOf('$') === 0) {
                const key = args[item].slice(1, args[item].length);
                return schemaData[key]
            }
            else {
                value = args;
            }
        }
        return value;
        // const resultKey = result.slice(1,result.length)
        // let _schemaData = schemaData;
        // _schemaData[resultKey] = value;
        // setSchemaData(_schemaData);

    }
    const exeActionFunction = async (actionName: string, value: any) => {
        setShowMask(true);
        await exeAction({ variables: { teamId: teamId, caseId: caseId, stepId: stepId, projectId: projectId, actionName: actionName, value: value } }).catch((error) => {
            notification.error({
                description: error.toString()
            })
        })
        setShowMask(false);

        // console.log(heartBeatStatus);
        // if(hear)
    }
    const exeNextStepFunction = async () => {
        setShowMask(true);
        await exeNextStep({ variables: { teamId: teamId, caseId: caseId, stepId: stepId, projectId: projectId, result: heartBeatResult } }).catch((error) => {
            notification.error({
                description: error.toString()
            })
        });
        setShowMask(false);
    }

    const renderBtnArea = () => {
        if (stepConfig && stepConfig?.buttons) {
            const list: any[] = [];
            for (let value of stepConfig.buttons) {
                list.push(<Button disabled={!isControlUseable} onClick={() => { commonBtnClick(value) }} style={{ marginRight: 20 }} type={'primary'} key={value.name}>{value.name}</Button>);
            }
            return <div style={{ marginTop: 20 }}>{list}</div>
        }
    }
    const renderRadioArea = () => {
        if (stepConfig && stepConfig?.radios) {
            return <div style={{ marginTop: 20 }}>
                <Radio.Group value={radioValue}>
                    {
                        stepConfig.radios.map((value: any, key: any) => {

                            return <Radio disabled={!isControlUseable} name={value.args} key={key} onChange={(e) => { commonBtnClick(value) }}>
                                {value.name}
                            </Radio>
                        })
                    }
                </Radio.Group>
            </div>
        }
    }
    const renderImgArea = () => {
        if (stepConfig && stepConfig?.img) {
            return <div style={{ marginTop: 20 }}>

                <div style={{ display: 'flex', background: '#eee', textAlign: 'center', height: window.innerHeight - 545, alignItems: 'center', justifyContent: 'center' }}>
                    {!imgUrl ? <Status
                        // @ts-ignore
                        icon={'loading'}
                        // @ts-ignore
                        size={'s'}
                        title={"image is empty"}
                    /> : null}
                    <ImagePreview style={{ height: 'auto', width: 'auto', maxHeight: '100%', maxWidth: '100%' }} previewSrc={imgUrl} src={imgUrl} ></ImagePreview>
                </div>
                {/* <span>{terminalCode}</span> */}
            </div>
        }
    }
    const renderUploadImgArea = () => {
        if (showUpLoadImg) {

            return <div style={{ marginTop: 20 }}>

                <div style={{ display: 'flex', background: '#eee', textAlign: 'center', height: window.innerHeight - 545, alignItems: 'center', justifyContent: 'center' }}>
                    {!imgUrl ? <Status
                        // @ts-ignore
                        icon={'loading'}
                        // @ts-ignore
                        size={'s'}
                        title={"image is empty"}
                    /> : null}
                    <ImagePreview style={{ height: 'auto', width: 'auto', maxHeight: '100%', maxWidth: '100%' }} previewSrc={imgUrl} src={imgUrl} ></ImagePreview>
                </div>
                {/* <span>{terminalCode}</span> */}
            </div>
        }
    }


    const renderInputListArea = () => {
        if (stepConfig && stepConfig?.script) {
            return <div style={{ height: 'calc(100vh - 650px)', overflow: 'auto' }}> {
                scriptParamList && scriptParamList.length > 0 ? scriptParamList.map((value: any, key: any) => {
                    return value.type !== 'hidden' ? <InputItem key={key}>
                        <LabelDom>
                            <label>{value.word}</label>
                        </LabelDom>
                        <InputDom>
                            <Input style={{ width: '100%' }} placeholder={scriptParam[value.name]} onChange={(_value) => {
                                let _result = scriptParam;
                                _result[value.name] = _value;
                                setScriptParam(JSON.parse(JSON.stringify(_result)));
                            }}></Input>
                        </InputDom>
                    </InputItem> : null
                }) : <></>
            }
            </div>
        }
    }
    const renderUpLoad = () => {
        if (stepConfig && stepConfig?.upload) {
            return <div style={{ marginTop: 20 }}>
                <Upload
                    // data={{
                    //     teamID:teamId,
                    // }}
                    send={(file, formData) => {
                        console.log(formData);
                        formData.append('teamID', teamId)
                        formData.append('projectID', projectId)
                        formData.append('caseID', caseId)
                        formData.append('caseStepID', stepId)
                        return formData
                    }}
                    headers={{ Authorization: token }}
                    method={'POST'}
                    action={stepConfig.upload.url}
                    onStart={() => { setIsUploading(true) }}
                    onSuccess={() => { setIsUploading(false) }}
                // onSuccess={handleSuccess}
                // onError={handleError}
                >
                    <Button disabled={!isControlUseable} loading={isUploading} type='primary' >{stepConfig.upload.name}</Button>
                </Upload>
                {
                    openUrl ?
                        <Button onClick={() => {
                            window.open(openUrl);
                        }} style={{ marginLeft: 10 }}>
                            <Localized id="compliance-checkFile"></Localized>
                        </Button> : null
                }
            </div>
        }
    }
    const renderSelectArea = () => {
        if (stepConfig && stepConfig?.select) {
            return <div style={{ marginTop: 20 }}>
                <SelectMultiple
                    size={'full'}
                    boxSizeSync
                    options={selectOptionLists}
                    appearance="button"
                    allOption={{
                        value: "all",
                        text: "全选"
                    }}
                    value={selectValue}
                    clearable
                    onOpenChange={async (value) => {
                        if (value) {
                            await exeAction({ variables: { teamId: teamId, caseId: caseId, stepId: stepId, projectId: projectId, actionName: stepConfig.select.metadata.action, value: '' } }).catch((error) => {
                                notification.error({
                                    description: error.toString()
                                })
                            })
                        }
                    }}
                    onChange={(value) => {
                        console.log(value);
                        console.log(schemaData);
                        console.log(stepConfig);
                        let target = stepConfig.select.result;
                        let key = target.slice(1, target.length)
                        let _schemaData = schemaData;
                        _schemaData[key] = value;
                        setSchemaData(_schemaData);
                        setSelectValue(value);

                        let _param: any = {};
                        for (let i = 0; i < value.length; i++) {
                            _param[value[i]] = value[i];
                        }

                        exeActionFunction(stepConfig.select.action, JSON.stringify(_param));
                    }}
                />
            </div>
        }
    }
    // const renderReportArea = () => {
    //     if (stepConfig && stepConfig?.report) {
    //         return <div style={{ marginTop: 20 }}>
    //             <Button onClick={() => {
    //                 setIsOpenReport(true);
    //                 reportHook.refetch();
    //             }}
    //                 style={{ marginRight: 20 }} type={'primary'} >{stepConfig?.report.name}</Button>
    //         </div>
    //     }
    // }
    const renderTerminal = () => {
        if (stepConfig && stepConfig?.script) {
            return <div style={{ marginTop: 20, position: 'absolute', bottom: 70, width: 'calc(100% - 40px)' }}>
                <div onClick={() => {
                    setTermainalType('outer')
                }} style={{ position: 'absolute', zIndex: 10, top: -20, right: 0, cursor: 'pointer' }}>
                    <Icon type="fullscreen" />
                </div>
                {
                    terminalType === 'inner' ?
                        <React.Suspense fallback={<Loading></Loading>}>
                            <Editor height={200} language={'shell'} value={terminalCode} ></Editor>
                        </React.Suspense> :
                        <Modal size={'xl'} visible={terminalType === 'outer'} caption="" onClose={() => {
                            setTermainalType('inner')
                        }}>
                            <Modal.Body>
                                <React.Suspense fallback={<Loading></Loading>}>
                                    <Editor height={500} language={'shell'} value={terminalCode} ></Editor>
                                </React.Suspense>
                            </Modal.Body>
                        </Modal>
                }
            </div>
        }
    }
    const renderTimeSpan = () => {
        if (stepConfig && stepConfig?.timeSpan) {
            return <div style={{ marginTop: 20, position: 'absolute', top: 95, left: 100, color: '#888' }}>
                {timeSpanValue}
            </div>
        }
    }
    const renderTable = () => {
        if (stepConfig && stepConfig?.table) {
            let columns: any[] = [];
            stepConfig.table.columns.map((value: any, key: any) => {
                let item: any = { key: value.key, header: value.header };
                if (value.type === 'html') {
                    item.render = (value: any) => {
                        return <div dangerouslySetInnerHTML={{ __html: value[item.key] }}></div>
                    }
                }
                columns.push(item);
            })
            return <div style={{ marginTop: 20 }}>
                <Table columns={columns} records={tableRecord} addons={[
                    autotip({
                        emptyText: <div>
                            <Status size='xs' icon={'blank'} title={<Localized id="compliance-nodata"></Localized>}></Status>
                        </div>,
                    })]}></Table>
            </div>
        }
    }
    const renderReport = () => {
        let commponet: any = <></>

        if (reportData) {
            switch (reportData.type) {
                case 'SAFE': commponet = <ReportModal toolType={reportData?.toolType || ''} reportData={reportData?.caseReportList || {}}></ReportModal>; break;
                case 'CVE': commponet = <RpCve projectId={projectId} caseId={caseId} caseStepId={stepId} reportData={reportData?.caseReportList || {}} ></RpCve>; break;
                case 'DETAIL_PERMISSION': commponet = <RpDetailPermission projectId={projectId} caseId={caseId}
                    caseStepId={stepId} reportData={reportData?.caseReportList || {}}></RpDetailPermission>; break;
                case 'DETAIL_FILE': commponet = <RpDetailFile projectId={projectId} caseId={caseId}
                    caseStepId={stepId} reportData={reportData?.caseReportList || {}}
                ></RpDetailFile>; break;
                case 'DETAIL_LICENSE': commponet = <RpDetailLicense projectId={projectId} caseId={caseId}
                    caseStepId={stepId} reportData={reportData?.caseReportList || {}}
                ></RpDetailLicense>; break;
                case 'DETAIL_APP_CONFIG': commponet = <RpAppConfig projectId={projectId} caseId={caseId}
                    caseStepId={stepId} reportData={reportData?.caseReportList || {}}
                ></RpAppConfig>; break;
                case 'CHECK_SEC': commponet = <RpCheckSec projectId={projectId} caseId={caseId}
                    caseStepId={stepId} reportData={reportData?.caseReportList || {}}
                ></RpCheckSec>; break;
                case 'OPEN_ASSEMBLY': commponet = <RpOpenAssembly projectId={projectId} caseId={caseId}
                    caseStepId={stepId} reportData={reportData?.caseReportList || {}}
                ></RpOpenAssembly>; break;
            }
        }
        if (stepConfig && stepConfig?.report) {
            return <div style={{ height: 'calc(100vh - 500px)', overflow: 'auto', marginTop: 20 }}>{commponet}</div>;
        }
        else {
            return null
        }
    }




    const nextStepClick = async () => {
        // console.log(heartBeatResult);
        await exeNextStepFunction()
        renderNextStep();
        if(isLast){
            setShowFinalConfirm(true);
        }
        // dataHook.refetch();
    }

    const resetStepClick = async () => {
        if (resetCheckEnable) {

            await resetStep({
                variables: {
                    teamId: teamId,
                    caseId: caseId,
                    stepId: stepId,
                    projectId: projectId
                }
            })
            notification.success({
                description: getValue('compliance-oprationSuccess')
            })
            dataHook.refetch();
            setHeartBeatResult(undefined);
            setTerminalCode('');
            setTableRecord([]);

        }
    }
    useEffect(() => {
        dataHook.refetch();
    }, [refetchRemark])

    useEffect(() => {
        dataHook.refetch();
    }, [stepId])

    useEffect(() => {

        if (stepConfig && stepConfig.script && code) {
            try {
                let list = JSON.parse(code).keyword;
                setScriptParamList(list);
                let _scriptParam = scriptParam;
                list.map((value: any, key: any) => {
                    _scriptParam[value.name] = value.defaultValue
                })
                const fileName = stepConfig.script.target;
                const _fileName = fileName.slice(1, fileName.length);
                let _schemaData = schemaData;
                _schemaData[_fileName] = _scriptParam;

                _schemaData[_fileName]['language'] = JSON.parse(code).language;

                setSchemaData(_schemaData);
            }
            catch (e) {
                console.log(stepConfig)
                console.log(code)
            }
        }
    }, [code, stepConfig])

    useEffect(() => {
        // console.log(document);
        // setEleHeigth(  )
        // setTimeout(() => {
        //     setEleHeigth(ele.current ? ele.current['clientHeight'] - 200 : 320)
        // }, 1000);

        // console.log(schemaData);
        if (stepConfig && stepConfig.script && stepConfig.script.target) {
            let _scriptParam = scriptParam;
            const fileName = stepConfig.script.target;
            const _fileName = fileName.slice(1, fileName.length);
            let _schemaData = schemaData;
            _schemaData[_fileName] = _scriptParam;
            console.log(_schemaData);
            setSchemaData(_schemaData);
        }
        // _scriptParam


    }, [scriptParam])


    useEffect(() => {
        setReportData(reportHook.data?.reportViewAction);
    }, [reportHook.data])

    return <div style={{ height: '100%' }}>
        {/* <Body> */}
        <CaseContainer>
            <StepContainer>
                <Card full style={{ top: 0, bottom: 0, left: 0, right: 0, boxShadow: 'none' }}>
                    <Card.Header>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: 50, justifyContent: 'space-between' }}>
                            <h3>{stepConfig ? stepConfig.stepTitle : ''}</h3>
                            <Bubble content={"重置当前及后续步骤"} dark>
                                <div style={{ cursor: 'pointer' }} onClick={() => { resetStepClick() }}>
                                    <Icon style={{ marginRight: 10 }} type="refresh" />
                                    <span style={{ marginRight: 20 }} ><Localized id='compliance-replaccecheck'></Localized></span>
                                </div>
                            </Bubble>
                        </div>
                    </Card.Header>
                    {dataHook.loading ? <RenderContent >
                        <div ref={ele} style={{ width: '100%', height: '100%' }}>
                            <Status icon={'loading'} title={'Loading'} />
                        </div>
                    </RenderContent> :
                        <RenderContent >
                            <div>
                                {stepConfig ? stepConfig.desc : ''}
                            </div>
                            <div ref={ele} style={{ width: '100%' }}>
                                <Bubble content={!isControlUseable ? "修改当前步骤请先完成前置步骤或重置用例" : ''} dark>
                                    {renderInputListArea()}
                                    {renderSelectArea()}
                                    {renderUpLoad()}
                                    {renderBtnArea()}
                                    {renderTimeSpan()}
                                    {renderTable()}
                                    {/* {renderReportArea()} */}
                                    {renderReport()}
                                    {renderRadioArea()}
                                    {renderImgArea()}
                                    {renderUploadImgArea()}
                                    {renderTerminal()}
                                </Bubble>
                            </div>
                            <NextStep>
                                <Button type="primary" onClick={nextStepClick} disabled={currentStatus !== 103}>
                                    {isLast ? <Localized id="enum-status-Completed"></Localized> : <Localized id="compliance-nextStep"></Localized>}
                                </Button>
                            </NextStep>
                        </RenderContent>}
                </Card>
            </StepContainer>
            <MdContainer>
                <Card style={{ height: '100%', boxShadow: 'none' }}>
                    <React.Suspense fallback={<Loading></Loading>}>
                        <MarkdownRender value={stepMd}></MarkdownRender>
                    </React.Suspense>
                </Card>
            </MdContainer>
        </CaseContainer>

        <Modal visible={showFinalConfirm} onClose={()=>{setShowFinalConfirm(false)}}>
            <Modal.Body>
                测试步骤已完成，请判断用例通过状态
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>{
                    setCaseStutas(4)
                }}>忽略</Button>
                <Button onClick={()=>{
                    setCaseStutas(3)
                }}>不通过</Button>
                <Button onClick={()=>{
                    setCaseStutas(2)
                }} type='primary'>通过</Button>
            </Modal.Footer>
        </Modal> 
        {/* {
            reportData && (reportData.type === 'SAFE') ? <ReportModal isShow={isOpenReport} setIsShowAddDialog={setIsOpenReport}
                toolType={reportData?.toolType || ''} reportData={reportData?.caseReportList || {}}
            ></ReportModal> : null
        } */}
        {/* {
            reportData && (reportData.type === 'CVE') ? <RpCve projectId={projectId} caseId={caseId}
                caseStepId={stepId}  
                reportData={reportData?.caseReportList || {}}
            ></RpCve> : null
        } */}
        {/* {
            reportData && (reportData.type === 'DETAIL_PERMISSION') ? <RpDetailPermission projectId={projectId} caseId={caseId}
                caseStepId={stepId} isShow={isOpenReport} setIsShowAddDialog={setIsOpenReport}
                reportData={reportData?.caseReportList || {}}
            ></RpDetailPermission> : null
        } */}
        {/* {
            reportData && (reportData.type === 'DETAIL_FILE') ? <RpDetailFile projectId={projectId} caseId={caseId}
                caseStepId={stepId} isShow={isOpenReport} setIsShowAddDialog={setIsOpenReport}
                reportData={reportData?.caseReportList || {}}
            ></RpDetailFile> : null
        } */}
        {/* {
            reportData && (reportData.type === 'DETAIL_LICENSE') ? <RpDetailLicense projectId={projectId} caseId={caseId}
                caseStepId={stepId} isShow={isOpenReport} setIsShowAddDialog={setIsOpenReport}
                reportData={reportData?.caseReportList || {}}
            ></RpDetailLicense> : null
        } */}
        {/* {
            reportData && (reportData.type === 'DETAIL_APP_CONFIG') ? <RpAppConfig projectId={projectId} caseId={caseId}
                caseStepId={stepId} isShow={isOpenReport} setIsShowAddDialog={setIsOpenReport}
                reportData={reportData?.caseReportList || {}}
            ></RpAppConfig> : null
        } */}
        {/* {
            reportData && (reportData.type === 'CHECK_SEC') ? <RpCheckSec projectId={projectId} caseId={caseId}
                caseStepId={stepId} isShow={isOpenReport} setIsShowAddDialog={setIsOpenReport}
                reportData={reportData?.caseReportList || {}}
            ></RpCheckSec> : null
        } */}
        {/* {
            reportData && (reportData.type === 'OPEN_ASSEMBLY') ? <RpOpenAssembly projectId={projectId} caseId={caseId}
                caseStepId={stepId} isShow={isOpenReport} setIsShowAddDialog={setIsOpenReport}
                reportData={reportData?.caseReportList || {}}
            ></RpOpenAssembly> : null
        } */}
    </div>
}