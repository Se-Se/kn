import React, { useMemo, useState, useEffect } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { useHistory, Link, useRouteMatch } from 'react-router-dom';
import { Layout, Card, Button, Modal, Form, Input,notification } from '@tencent/tea-component';
import style from '@emotion/styled/macro';
import { generateLink, Pattern, ParamType } from 'route';
import { useGetUserCustomCaseSuiteListQuery, useCreateUserCustomCaseSuiteMutation } from 'generated/graphql';

const { Content, Body } = Layout;
const CardMain = style.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
`;
const caseLink = (params: ParamType[Pattern.ComplianceTestingSuiteDetail]) => generateLink(Pattern.ComplianceTestingSuiteDetail, params);

export const Page: React.FC = () => {
    const [addsuitefn] = useCreateUserCustomCaseSuiteMutation();
    const teamId = 'team_items;1';
    const history = useHistory();
    const getValue = useGetMessage();

    const lawListHook = useGetUserCustomCaseSuiteListQuery({ variables: { teamId: teamId, search: {} },fetchPolicy:'network-only' });

    const [LawList, setLawList] = useState<any[]>([]);


    const [newSuiteName, setNewSuiteName] = useState<string>('')
    const [newSuiteNameSt, setNewSuiteNameSt] = useState<any>()
    const [showAddSuiteModel, setShowAddSuiteModel] = useState<boolean>(false);

    const saveBtnClick = async ()=>{
        if(!newSuiteName){
            setNewSuiteNameSt('error');
            return
        }
        await addsuitefn({
            variables: {
                teamId: teamId,
                name: newSuiteName,
                suiteType:1
            }
        }).catch((error) => {
            notification.error({
                description: error.toString()
            })
        })
        setShowAddSuiteModel(false);
        lawListHook.refetch();
        notification.success({
            description: getValue('compliance-oprationSuccess')
        })
    }

    const renderCard = (value: any, key: any) => {

        return <div key={key} style={{ marginBottom: 20, marginRight: 20 }} onClick={() => {
            history.push(caseLink({ suiteId: value.id }));
        }}>
            <Card style={{ width: 320, cursor: 'pointer' }}>
                <Card.Body title={value.name}>
                    <div style={{ textAlign: 'right', marginTop: 20 }}>
                        <Localized id="compliance-caseCount"></Localized>
                        <span style={{ marginLeft: 5 }}>{value.caseCount}</span>
                    </div>
                </Card.Body>
            </Card>
        </div>
    };
    useEffect(() => {
        const _lawlist = lawListHook.data?.getUserCustomCaseSuiteList?.resultList || [];
        setLawList(_lawlist);
    }, [lawListHook.data])
    useEffect(() => {
    }, [])
    return <>
        <Body>
            <Content>
                <Content.Header
                    title={<Localized id='compliance-suite'></Localized>}
                ></Content.Header>
                <Content.Body style={{ width: '100%', height: 'auto' }} full>

                    <Button type="primary" onClick={() => {
                        // setIsShowAdd(true);
                        setShowAddSuiteModel(true);
                    }}><Localized id="compliance-addsuite"></Localized>
                    </Button>
                    <CardMain style={{ marginTop: 20 }}>
                        {
                            LawList.map((value, key) => {
                                return renderCard(value, key);
                            })
                        }
                    </CardMain>
                </Content.Body>
            </Content>
        </Body>
        <Modal size={'l'} visible={showAddSuiteModel} caption={'创建用例集'} onClose={() => { setShowAddSuiteModel(false) }}>
            <Modal.Body>
                <Form>
                    <Form.Item label={'用例集名称'} status={newSuiteNameSt}> 
                        <Input value={newSuiteName} onChange={(value) => {
                            setNewSuiteName(value);
                            if(value){
                                setNewSuiteNameSt('success');
                            }
                            else{
                                setNewSuiteNameSt('error');
                            }
                        }} placeholder={getValue('license-upload-placeholder')} size='full' />
                    </Form.Item>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button type="primary" onClick={saveBtnClick}>
                <Localized id={'modal-ok'}></Localized>
            </Button>
            <Button type="weak" onClick={() => { setShowAddSuiteModel(false) }}>
                <Localized id={'modal-cancel'}></Localized>
            </Button>
            </Modal.Footer>
        </Modal>
    </>
}