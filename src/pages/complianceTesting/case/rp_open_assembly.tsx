import React, { useState, useEffect } from 'react';
import { Localized } from 'i18n';
import { useGetCommonalityAutoTaskReportQuery } from 'generated/graphql';
import style from '@emotion/styled/macro';
import { Modal, Tabs, TabPanel, List, Card } from '@tencent/tea-component';
interface RpOpenAssemblyType {
    reportData: any
    projectId: string
    caseId: string
    caseStepId: string
}
// const { pageable, scrollable, autotip, columnsResizable } = Table.addons;

const MdRow = style.div`
    display: flex
`
const MdATitle = style.div`
    width: 50px;
`
const MdAContent = style.div`
    width: 100%;
    min-width: 50px;
`
export const RpOpenAssembly: React.FC<RpOpenAssemblyType> = (props) => {
    const tabs = [
        { id: "tabs-activity", label: "tabs-activity" },
        { id: "tabs-service", label: "tabs-service" },
        { id: "tabs-receiver", label: "tabs-receiver" },
        { id: "tabs-provider", label: "tabs-provider" }
    ];
    // const [activityData, setActivityData] = useState<any[]>([]);
    // const [serviceData, setServiceData] = useState<any[]>([]);
    // const [receiverData, setReceiverData] = useState<any[]>([]);
    // const [providerData, setProviderData] = useState<any[]>([]);

    // const [listCount, setListCount] = useState<number>(0);
    // const [pageQueryInfo, setPageQueryInfo] = useState<any>({});

    const [pageData, setPageData] = useState<any[]>([]);

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
    });

    const renderList = (list: any) => {
        return <List split="stripe">{list.map((value: any, key: any) => {
            return <List.Item key={key}>
                <MdRow>
                    <MdATitle>{key + 1}</MdATitle>
                    <MdAContent>{value}</MdAContent>
                </MdRow>
            </List.Item>
        })}
        </List>
    }
    const renderAppCard = () => {
        return pageData.map((value: any,key:any) => {
            return <Card bordered={true} key={key}>
                <Card.Body title={value.appName}>
                    <Tabs tabs={tabs}>
                        <TabPanel id="tabs-activity">
                            {
                                renderList(value.activities)
                            }
                        </TabPanel>
                        <TabPanel id="tabs-service">
                            {
                                renderList(value.services)
                            }
                        </TabPanel>
                        <TabPanel id="tabs-receiver">
                            {
                                renderList(value.receivers)
                            }
                        </TabPanel>
                        <TabPanel id="tabs-provider">
                            {
                                renderList(value.providers)
                            }
                        </TabPanel>
                    </Tabs>
                </Card.Body>
            </Card>
        })
    }


    useEffect(() => {
        // setActivityData(dataHook.data?.getCommonalityAutoTaskReport?.reportSystemUser || []);
        // setServiceData(dataHook.data?.getCommonalityAutoTaskReport?.reportSystemUser || []);
        // setReceiverData(dataHook.data?.getCommonalityAutoTaskReport?.reportSystemUser || []);
        // setProviderData(dataHook.data?.getCommonalityAutoTaskReport?.reportSystemUser || []);

        // console.log(dataHook.data);

        setPageData(dataHook.data?.getCommonalityAutoTaskReport?.apkComponents || []);

    }, [dataHook.data])

    return <>
        {renderAppCard()}
    </>
}