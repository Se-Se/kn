import React, { useState, useEffect } from 'react';
import { Localized } from 'i18n';
import { useGetCommonalityAutoTaskReportQuery } from 'generated/graphql';
import { Modal, Card, H3, List } from '@tencent/tea-component';
import style from '@emotion/styled/macro';
import HighRisk from 'icons/Risk/high.svg';
import PassRisk from 'icons/Risk/pass.svg';


interface RpAppConfigType {
    reportData: any
    projectId: string
    caseId: string
    caseStepId: string
}

const MdArea = style.div`
    max-height: 500px;
    overflow: auto;
    margin-top: 10px;
`
const MdRow = style.div`
    display: flex
`
const MdATitle = style.div`
    width: 150px;
`
const MdAContent = style.div`
    width: 100%;
    min-width: 50px;
`
const MdADesc = style.div`
    width: 100%;
    min-width: 50px;
    margin-top: 10px;
    margin-bottom: 10px;
`
export const RpAppConfig: React.FC<RpAppConfigType> = (props) => {
    const [listData, setListData] = useState<any[]>([]);

    const teamId = 'team_items;1';

    const dataHook = useGetCommonalityAutoTaskReportQuery({
        variables: {
            teamId: teamId,
            component: '',
            version: '',
            path: '',
            projectId: props.projectId,
            caseId: props.caseId,
            caseStepId: props.caseStepId,
            search: {}
        }
    })

    const renderCards = () => {
        return listData.map((value: any, key: any) => {
            console.log(value);
            return <Card bordered={true} key={key}>
                <Card.Body title={value.appName}>
                    <List split="stripe">
                        <List.Item>
                            <MdRow>
                                <MdATitle>Debuggable</MdATitle>
                                <MdAContent>
                                    {
                                        value.debuggable ? <div style={{ display: 'flex', width: 50, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                            <img alt="" width={16} src={HighRisk}></img>{value.debuggable.toString()}
                                        </div> : <div style={{ display: 'flex', width: 50, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                            <img alt="" width={16} src={PassRisk}></img>{value.debuggable.toString()}
                                        </div>
                                    }
                                </MdAContent>
                            </MdRow>
                        </List.Item>
                        <List.Item>
                            <MdRow>
                                <MdATitle>AllowBackup</MdATitle>
                                <MdAContent>
                                    {
                                        value.allowBackup ? <div style={{ display: 'flex', width: 50, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                            <img alt="" width={16} src={HighRisk}></img>{value.allowBackup.toString()}
                                        </div> : <div style={{ display: 'flex', width: 50, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                            <img alt="" width={16} src={PassRisk}></img>{value.allowBackup.toString()}
                                        </div>
                                    }
                                </MdAContent>
                            </MdRow>
                        </List.Item>
                    </List>

                </Card.Body>
            </Card>
        })
    }

    useEffect(() => {
        setListData(dataHook.data?.getCommonalityAutoTaskReport?.reportApkManifest || [])
    }, [dataHook.data])

    return <MdArea>
        <H3>配置描述</H3>
        <MdADesc>
            <H3>Debuggable</H3>
            <p style={{ lineHeight: '25px' }}>
                AndroidManifest.xml文件中debuggable属性值被设置为true时（默认为false），该程序可被任意调试。处于Debuggable状态的应用，三方应用可以通过run-as命令切换到Debuggable应用的权限，导致应用被控制。

            </p>
            <p style={{ lineHeight: '25px' }}>
                建议对外发布的Release版本Apk，在配置文件中将Debuggable设置为fasle。
            </p>
            <H3 style={{ marginTop: 10 }}>AllowBackup</H3>
            <p style={{ lineHeight: '25px' }}>
                Android API Level 8及其以上Android系统提供了为应用程序数据的备份和恢复功能，此功能的开关决定于该应用程序中AndroidManifest.xml文件中的allowBackup属性值，其属性值默认是True。当allowBackup标志为true时，用户即可通过adb backup和adb restore来进行对应用数据的备份和恢复，这可能会带来一定的安全风险。
            </p>
            <p style={{ lineHeight: '25px' }}>
                Android属性allowBackup安全风险源于adb backup容许任何一个能够打开USB 调试开关的人从Android手机中复制应用数据到外设，一旦应用数据被备份之后，所有应用数据都可被用户读取；adb restore容许用户指定一个恢复的数据来源（即备份的应用数据）来恢复应用程序数据的创建。因此，当一个应用数据被备份之后，用户即可在其他Android手机或模拟器上安装同一个应用，以及通过恢复该备份的应用数据到该设备上，在该设备上打开该应用即可恢复到被备份的应用程序的状态。
            </p>
        </MdADesc>
        {
            renderCards()
        }
    </MdArea>
}