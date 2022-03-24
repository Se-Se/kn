import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    useGetCaseStepDetailQuery,
    useSubmitResultMutation,
    useNextStepSubmitResultMutation,
    useResetStepCheckedResultMutation,
    useReportViewActionLazyQuery,
    useScriptExeMutation,
    useDeleteStepUploadDataMutation,
    useScreenshotMutation
} from 'generated/graphql';
import { Button, ImagePreview, Modal } from '@tencent/tea-component';
import { Loading } from './loading';
import style from '@emotion/styled/macro';
import { useRouteMatch } from 'react-router-dom';
import { Layout, Textarea, Upload, Table, Input, Divider, Button as TButton, DialogPlugin, NotificationPlugin } from 'tdesign-react';
import icon_car from './../../../image/car16×16.svg';
import icon_testInfo from './../../../image/testInfo.svg';
import icon_fullSreen from './../../../image/fullsreen.svg';

import { CaseMdDrawer } from '../project/caseMdDrawer';
import { SelectAppModal } from './caseSelectAppModal';

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

import printCutIcon from './../../../image/printCut.svg';
import iconCheck from '../../../image/check-circle-filled.svg';
import { IdCtx } from 'pages/dashboard/project/Operation';
import Editor from './editor_td';

const MarkdownRender = React.lazy(() => import('./markDownRender'));


type caseRenderType = {
    step: any
    heartBeatResult: any
    isCollapse: any
    currentStepId: string,
    // refreshStep: any
    // isControlUseable: boolean
}
interface ProjectMatch {
    caseId: string
    lawCatalogueId: string
    projectId: string
};
const { Header, Content } = Layout;

const ContentGroup = style.div`
    background: white;
    min-height: 100%;
    min-width: 100%;
`;

const MdArea = style.div`
    background: white;
    width:100%;
`
const CmpArea = style.div`
    background: white;
    padding-left:25px;
    padding-right:25px;
    margin-top:25px;
    width:100%;
`
const FileArea = style.div`
    background: white;
    width:100%;
    padding:25px;
    padding-top: 0;
`
const FullSreenIcon = style.div`
    width: 16px;
    height: 16px;
    position: absolute;
    z-index: 1;
    top: 10px;
    left: calc( 100% - 35px);
    cursor: pointer;
`
const ShowMoreParam = style.div`
    width: 16px;
    height: 16px;
    position: absolute;
    z-index: 1;
    top: 30px;
    right: 5px;
    cursor: pointer;
`

export const CaseRender: React.FC<caseRenderType> = ({ step, isCollapse, currentStepId, heartBeatResult }) => {

    const teamId = 'team_items;1';
    const pageParam = useRouteMatch<ProjectMatch>().params;
    const caseId = pageParam.caseId;
    const projectId = pageParam.projectId;

    const [showMdDrawer, setShowMdDrawer] = useState(false);
    const [stepMd, setStepMd] = useState<string>('');
    const [terminalMessage, setTerminalMessage] = useState<string>('');

    const [isShowMoreParam, setIsShowMoreParam] = useState(false);
    const [isShowSelectAppModal, setIsShowSelectAppModal] = useState(false);
    const [isShowTerminalDialog, setIsShowTerminalDialog] = useState(false);
    const [isScreenCutting, setIsScreenCutting] = useState(false);

    const [currentFileId, setCurrentFileId] = useState<string>();
    const [filedList, setFiledList] = useState<any[]>([]);
    const [upLoadParam, setUpLoadParam]: any = useState<any>({});
    const [caseResult, setCaseResult] = useState<any>({});

    const [config, setConfig] = useState<any>();

    const [exeParam, setExeParam] = useState<any>({});
    const [selectApp, setSelectApp] = useState<any[]>([]);

    const [reportData, setReportData] = useState<any>();
    const [exeScript] = useScriptExeMutation();
    const [getReport, reportHook] = useReportViewActionLazyQuery();

    const [deleteStepUplaodData] = useDeleteStepUploadDataMutation();
    const [screenShot] = useScreenshotMutation();

    useEffect(()=>{
        if(reportHook.data?.reportViewAction){
            setReportData(reportHook.data.reportViewAction);
        }
    },[reportHook.data])

    useEffect(() => {
        if (caseResult) {
            if (caseResult.uploadData) {
                setFiledList(caseResult.uploadData || []);
            }
            // if (caseResult.userFillInParam) {
            //     console.log(caseResult.userFillInParam);
            // }
        }
    }, [caseResult])

    useEffect(() => {
        // console.log(config.keyword);

    }, [config])


    useEffect(() => {
        if (heartBeatResult && heartBeatResult.result) {

            let resultObj = JSON.parse(heartBeatResult.result);

            if (resultObj.errorMessage) {
                setTerminalMessage(resultObj.errorMessage);
            }
        }
    }, [heartBeatResult])


    const renderReport = () => {
        let commponet: any = <></>

        if (reportData) {
            switch (reportData.type) {
                case 'SAFE': commponet = <ReportModal toolType={reportData?.toolType || ''} reportData={reportData?.caseReportList || {}}></ReportModal>; break;
                case 'CVE': commponet = <RpCve projectId={projectId} caseId={caseId} caseStepId={currentFileId || ''} reportData={reportData?.caseReportList || {}} ></RpCve>; break;
                case 'DETAIL_PERMISSION': commponet = <RpDetailPermission projectId={projectId} caseId={caseId}
                    caseStepId={currentFileId || ''} reportData={reportData?.caseReportList || {}}></RpDetailPermission>; break;
                case 'DETAIL_FILE': commponet = <RpDetailFile projectId={projectId} caseId={caseId}
                    caseStepId={currentFileId || ''} reportData={reportData?.caseReportList || {}}
                ></RpDetailFile>; break;
                case 'DETAIL_LICENSE': commponet = <RpDetailLicense projectId={projectId} caseId={caseId}
                    caseStepId={currentFileId || ''} reportData={reportData?.caseReportList || {}}
                ></RpDetailLicense>; break;
                case 'DETAIL_APP_CONFIG': commponet = <RpAppConfig projectId={projectId} caseId={caseId}
                    caseStepId={currentFileId || ''} reportData={reportData?.caseReportList || {}}
                ></RpAppConfig>; break;
                case 'CHECK_SEC': commponet = <RpCheckSec projectId={projectId} caseId={caseId}
                    caseStepId={currentFileId || ''} reportData={reportData?.caseReportList || {}}
                ></RpCheckSec>; break;
                case 'OPEN_ASSEMBLY': commponet = <RpOpenAssembly projectId={projectId} caseId={caseId}
                    caseStepId={currentFileId || ''} reportData={reportData?.caseReportList || {}}
                ></RpOpenAssembly>; break;
            }
        }
        return <div style={{  marginTop: 20 }}>{commponet}</div>;
    }

    const renderSrcrpitExe = () => {
        return <>
            <div style={{ display: 'flex' }}>
                <span>选择被测应用</span>
                <Button onClick={() => { setIsShowSelectAppModal(!isShowSelectAppModal) }} style={{ fontSize: 14, marginLeft: 25 }} type='link'>点此选择</Button>
                <span style={{ marginLeft: 16, color: '#ddd' }}>已选择0个应用，如无需选择被测应用，请忽略</span>
            </div>
            <div style={{ position: 'relative' }}>
                {
                    config && config.keyword && config.keyword.length > 2 ? <ShowMoreParam>
                        <Button type='link' onClick={() => { setIsShowMoreParam(!isShowMoreParam) }}> {isShowMoreParam ? '收起' : '更多'}</Button>
                    </ShowMoreParam> : null
                }
                <div style={{ display: 'flex', flexWrap: 'wrap', height: isShowMoreParam ? 'auto' : 60, overflow: isShowMoreParam ? 'visible' : 'hidden' }}>
                    {
                        config?.keyword?.map((value: any, key: any) => {
                            if (value.type !== 'hidden') {

                                return <div key={key} style={{ display: 'flex', marginTop: 25, alignItems: 'center', marginRight: 25 }}>
                                    <div title={value.word} style={{ width: 100, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        <span>{value.word}</span>
                                    </div>
                                    {
                                        value.type === 'input' ?
                                            <Input onChange={(input) => {
                                                console.log(input);
                                                let param = exeParam;
                                                param[value.name] = input;
                                                setExeParam(JSON.parse(JSON.stringify(param)));

                                            }} value={exeParam[value.name] ? exeParam[value.name] : ''} placeholder={value.word} style={{ width: 200 }}></Input> : null
                                    }

                                </div>

                            }

                        })
                    }
                </div>
            </div>
            <div style={{ marginTop: 20 }}>
                <TButton
                    theme="primary"
                    variant="outline"
                    onClick={() => {
                        console.log(exeParam);
                        exeScript({ variables: { projectId: projectId, caseId: caseId, teamId: teamId, stepId: currentStepId, appList: [], argParams: exeParam } });
                    }}>执行</TButton>
            </div>
            <div style={{ marginTop: 25, position: 'relative' }}>
                <FullSreenIcon>
                    <img src={icon_fullSreen} onClick={() => { setIsShowTerminalDialog(!isShowTerminalDialog) }}></img>
                </FullSreenIcon>
                <Editor height={200} language={'shell'} value={terminalMessage}></Editor>
            </div>
        </>
    }

    const renderFileArea = () => {
        return <>
            <div style={{ display: 'flex' }}>

                {isScreenCutting ? null : <><span>如需上传检测过程的证明材料，可通过</span><img src={printCutIcon}></img></>}


                <Button disabled={isScreenCutting} type='link' style={{ fontSize: 14 }} onClick={async () => {
                    setIsScreenCutting(true);
                    let result = await screenShot({ variables: { teamId: teamId, projectId: projectId, caseId: caseId, stepId: currentStepId } });

                    if (result) {
                        console.log(result.data?.screenshot);
                        let item = {
                            fileName: result.data?.screenshot.fileName,
                            size: result.data?.screenshot.size,
                            status: 'success',
                            fileUUID: result.data?.screenshot.fileUUID,
                            fileUrl: result.data?.screenshot.fileUrl,
                        }
                        let list = filedList;
                        list.push(item);
                        setFiledList(list);
                        setIsScreenCutting(false);
                    }
                }} >{isScreenCutting ? '截图中...' : '截图'}</Button>
                {isScreenCutting ? null : <span>上传车机截图或在下方上传资料</span>}

            </div>
            <div style={{ display: 'flex', marginTop: 25 }}>
                <div style={{ width: 52 }}>
                    <span>备注</span>
                </div>
                <Textarea></Textarea>
            </div>
            <div style={{ display: 'flex', marginTop: 25 }}>
                <div style={{ width: 52 }}>
                    <span>资料</span>
                </div>
                <div style={{ width: '100%' }}>
                    <Upload
                        data={upLoadParam}
                        action={"http://" + window.location.host + '/upload/case_step_data'}
                        onChange={(ctx) => {
                            console.log(ctx)
                            setUpLoadParam({
                                uuid: Date.now().toString() + Math.floor(Math.random() * 10000).toString(),
                                projectId: projectId,
                                caseId: caseId,
                                caseStepId: currentStepId
                            });

                        }}
                        onSuccess={(ctx: any) => {
                            console.log('=====success======', ctx);
                            let fileItem = {
                                fileName: ctx.response.fileName,
                                size: ctx.response.size,
                                status: ctx.file.status,
                                fileUUID: ctx.response.fileUUID,
                                fileUrl: ctx.response.fileUrl
                            }
                            let list = filedList;
                            list.push(fileItem);

                            console.log(list);

                            setFiledList(JSON.parse(JSON.stringify(list)));
                            NotificationPlugin.info({
                                title: '提示',
                                content: '上传成功',
                                placement: 'top-right',
                                duration: 3000
                            });

                            // setFiledList([{name: "云真机2.jpg", size: "225.10", status: "success", id: 1647414088836667}]);
                        }}
                        onFail={(ctx) => {
                            console.log('=====fail======', ctx);
                        }}
                    />
                    <div style={{ marginTop: 25, width: 570 }}>
                        <Table
                            bordered
                            data={filedList}
                            columns={[
                                {
                                    align: 'left',
                                    colKey: 'fileName',
                                    title: '文件名',
                                    ellipsis: true,
                                },
                                {
                                    align: 'left',
                                    width: 120,
                                    colKey: 'size',
                                    title: '大小',
                                    render: (value: any) => {
                                        return (value.row.size / 1000).toFixed(2) + 'kb'
                                    }
                                },
                                {
                                    align: 'left',
                                    width: 120,
                                    colKey: 'status',
                                    title: '状态',
                                    render: (value) => {
                                        return <div style={{ display: 'flex' }}>
                                            <img style={{ width: 20, height: 20 }} src={iconCheck}></img>
                                            <span style={{ marginLeft: 10, alignItems: 'center' }}>上传成功</span>
                                        </div>
                                        // if (value.row.status === 'success') {

                                        // }
                                    }
                                },
                                {
                                    align: 'left',
                                    width: 90,
                                    colKey: 'operation',
                                    title: '操作',
                                    render: (value) => {
                                        return <>
                                            <ImagePreview
                                                previewSrc={value.row.fileUrl}
                                                previewTitle={value.row.name}
                                            >
                                                {open => <a style={{ fontSize: 12, marginRight: 24 }} onClick={open}>预览</a>}
                                            </ImagePreview>
                                            <Button type='link' onClick={() => {
                                                const confirmDialog = DialogPlugin({
                                                    header: '提示',
                                                    body: '确定要删除该文件吗？',
                                                    onConfirm: async ({ e }) => {
                                                        console.log(value.row);
                                                        if (confirmDialog && confirmDialog.hide) {
                                                            confirmDialog.hide();
                                                        }
                                                        let result = await deleteStepUplaodData({
                                                            variables: {
                                                                teamId: teamId,
                                                                caseId: caseId,
                                                                projectId: projectId,
                                                                stepId: currentStepId,
                                                                uuid: value.row.fileUUID
                                                            }
                                                        })
                                                        if (result) {

                                                            let _list = []
                                                            for (let item of filedList) {
                                                                console.log(item);
                                                                if (item.fileUUID !== value.row.fileUUID) {
                                                                    _list.push(item);
                                                                }
                                                            }
                                                            setFiledList(_list);

                                                            NotificationPlugin.info({
                                                                title: '提示',
                                                                content: '删除成功',
                                                                placement: 'top-right',
                                                                duration: 3000
                                                            });
                                                        }
                                                    },
                                                    onClose: ({ e, trigger }) => {
                                                        if (confirmDialog && confirmDialog.hide) {
                                                            confirmDialog.hide();
                                                        }
                                                    },
                                                });
                                            }}>删除</Button>
                                        </>
                                    }
                                }
                            ]}
                            rowKey="index"
                            size="small"
                        />
                    </div>
                </div>
            </div>
        </>
    }


    useEffect(() => {
        if (step) {
            setTerminalMessage('');
            setStepMd(step?.markdown || '');
            if (step.config) {
                setConfig(JSON.parse(step.config));
            }
            if (step.result) {
                setCaseResult(JSON.parse(step.result));
            }
            if (step?.stepType === 'scriptExe') {

                if (step.config && step.result) {
                    let param: any = {};
                    let _config = JSON.parse(step.config);
                    let _result = JSON.parse(step.result);
                    if (_config.keyword && _config.keyword.length > 0) {
                        for (let item of _config.keyword) {
                            param[item.name] = item.defaultValue;
                        }
                        console.log(_result)

                        if (_result.userFillInParam) {
                            param = { ..._result.userFillInParam };
                            console.log(param);
                        }

                        setExeParam(param);

                    }
                }

            }

            else if (step?.stepType === 'viewReport') {
                getReport({variables:{teamId:teamId,projectId:projectId,caseId:caseId,caseStepId:currentStepId}});
            }
        }
    }, [step])

    return <>
        <Content style={{ padding: 25, position: 'relative', marginBottom: 50 }}>
            <ContentGroup>
                <Layout style={{ width: isCollapse ? 'calc( 100% - 80px)' : 'calc( 100% - 260px)', minHeight: 'calc( 100vh - 195px)', background: 'white' }}>
                    <Header style={{
                        height: 48,
                        paddingLeft: 25,
                        paddingRight: 25,
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: '1px solid #E7E7E7'
                    }}>
                        <img style={{ width: 16, height: 16 }} src={icon_car}></img>
                        <span style={{ fontWeight: 700, fontSize: 15, marginLeft: 8 }}>{step?.stepName || '--'}</span>
                        <img style={{ marginLeft: 27 }} src={icon_testInfo}></img>
                        <Button type='link' onClick={() => { setShowMdDrawer(true) }}>测试参考</Button>
                    </Header>
                    <Content style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ height: 'calc( 70vh - 135px)', overflow: 'auto' }}>
                            <MdArea>
                                <MarkdownRender value={step?.stepDesc || ''} style={{ height: 'auto', paddingBottom: 0 }}></MarkdownRender>
                            </MdArea>
                            <CmpArea>
                                {
                                    step?.stepType === 'scriptExe' ? <>
                                        {
                                            renderSrcrpitExe()
                                        }
                                    </> : null
                                }
                                {
                                    step?.stepType === 'viewReport' ? <>
                                    {
                                        renderReport()
                                    }
                                    </> : null
                                }

                            </CmpArea>
                        </div>
                        <div>
                            <Divider></Divider>
                            <FileArea>
                                {renderFileArea()}
                            </FileArea>
                        </div>
                    </Content>
                </Layout>
            </ContentGroup>
        </Content>
        <CaseMdDrawer stepMd={stepMd} visible={showMdDrawer} handleClose={setShowMdDrawer} ></CaseMdDrawer>
        <SelectAppModal selectApp={setSelectApp} isShow={isShowSelectAppModal} setIsShowAddDialog={setIsShowSelectAppModal}></SelectAppModal>
        <Modal size='xl' visible={isShowTerminalDialog} onClose={() => { setIsShowTerminalDialog(false) }}>
            <Modal.Body>
                <Editor height={500} language={'shell'} value={terminalMessage}></Editor>
            </Modal.Body>
        </Modal>

    </>
}