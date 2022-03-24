import React, { useState, useEffect } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { Link } from 'react-router-dom';
import { Layout, Card, Form, Input, notification, Select, Icon, Button, Modal, Status, H3 } from '@tencent/tea-component';
import style from '@emotion/styled/macro';
import { generateLink, Pattern } from 'route';
import { useGetUserCustomSuiteTypeQuery, useDeleteUserCustomCaseSuiteMutation, useCreateUserCustomCaseSuiteMutation, useGetUserCustomCaseSuiteListQuery, useEditUserCustomCaseIntoSuiteMutation } from 'generated/graphql';

const { Content, Body } = Layout;
const CardMain = style.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-top: 10px;
`;
export const Page: React.FC = () => {
    // const renderCard = useMemo(()=>{

    // },[])
    const teamId = 'team_items;1';
    const suiteHook = useGetUserCustomCaseSuiteListQuery({
        variables: {
            teamId: teamId,
            search: {}
        },
        fetchPolicy: 'network-only'
    })
    const [addsuitefn] = useCreateUserCustomCaseSuiteMutation();
    const [editsuitefn] = useEditUserCustomCaseIntoSuiteMutation();
    const [deletesuitefn] = useDeleteUserCustomCaseSuiteMutation();

    const [newSuiteName, setNewSuiteName] = useState<string>('')
    const [newSuiteNameSt, setNewSuiteNameSt] = useState<any>()
    const [newSuiteTypeSt, setNewSuiteTypeSt] = useState<any>()
    const getValue = useGetMessage();


    const [LawList, setLawList] = useState<any[]>([]);
    const [showAddSuiteModel, setShowAddSuiteModel] = useState<boolean>(false);
    const saveBtnClick = async () => {
        if (!newSuiteName) {
            setNewSuiteNameSt('error');
            return
        }
        // if (newSuiteTypeSt === undefined) {
        //     setNewSuiteTypeSt('error');
        //     return
        // }
        await addsuitefn({
            variables: {
                teamId: teamId,
                name: newSuiteName,
                suiteType: selectSuiteType
            }
        }).catch((error) => {
            notification.error({
                description: error.toString()
            })
            return;
        })
        setShowAddSuiteModel(false);
        suiteHook.refetch();
        notification.success({
            description: getValue('compliance-oprationSuccess')
        })
    }

    const deleteFn = async (id: any) => {
        const yes = await Modal.confirm({
            message: getValue('compliance-deleteConfirm'),
            description: getValue("compliance-deleteCaseDesc"),
            okText: getValue("operation-delete"),
            cancelText: getValue("modal-cancel"),
        });
        if (yes) {
            console.log('delete');

            await deletesuitefn({
                variables: {
                    teamId: teamId,
                    suiteId: id
                }
            }).catch((error) => {
                notification.error({
                    description: error.toString()
                })
            })
            suiteHook.refetch();
        }

    }

    const suiteTypeHook = useGetUserCustomSuiteTypeQuery({
        variables: {
            teamId: teamId
        }
    })
    const [suiteTypeOption, setSuiteTypeOption] = useState<any[]>([]);
    const [selectSuiteType, setSelectSuiteType] = useState<any>();
    const [editingNum, setEditingNum] = useState<Number>();

    const [editingName, setEditingName] = useState<string>();

    const clickEditInput = (key: any) => {
        setEditingNum(key);
        setEditingName(LawList[key].name);
    }

    const renderCard = (value: any, key: any) => {
        const pathparams = {
            suiteId: value?.id
        }
        return <div key={key} style={{ marginBottom: 20, marginRight: 20 }}>
            <Card style={{ boxShadow: 'none', borderRadius: '4px', border: '1px solid #ddd', width: 320, borderLeft: value.layType === -1 ? '4px solid #0ABF5B' : value.layType === 1 ? '4px solid #888888' : value.layType === 2 ? '4px solid #006EFF' : '' }}>

                <Link style={{ fontSize: 12, textDecoration: 'none' }} to={value.layType === -1 ? generateLink(Pattern.ComplianceTestingLawDetail, pathparams) :
                    generateLink(Pattern.ComplianceTestingSuiteDetail, pathparams)}>
                    <Card.Body operation={
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                            {/* <Link style={{ fontSize: 12 }} to={value.layType === -1 ? generateLink(Pattern.ComplianceTestingLawDetail, pathparams) :
                                generateLink(Pattern.ComplianceTestingSuiteDetail, pathparams)}>
                                <Localized id='column-detail'></Localized>
                            </Link> */}
                            {
                                value.layType !== -1 ? <Button type='link' onClick={(e) => {
                                    deleteFn(value.id)
                                    e?.preventDefault();
                                }}>
                                    <Localized id='operation-delete'></Localized>
                                </Button> : null
                            }
                        </div>}
                        title={editingNum !== key ? <div style={{ maxWidth: 210, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <span>{value.name}</span>
                            {value.layType !== -1 ? <Icon onClick={(e) => { clickEditInput(key);e?.preventDefault(); }} type="pencil" style={{ cursor: 'pointer' }} /> : null}
                        </div> : <Input onBlur={async () => {
                            await editsuitefn({
                                variables: {
                                    teamId: teamId,
                                    id: value.id,
                                    suiteName: editingName
                                }
                            })
                            setEditingNum(undefined);
                            suiteHook.refetch();
                        }}
                            onChange={(value) => { setEditingName(value) }}
                            autoFocus
                            value={editingName}></Input>}>
                        <div style={{ textAlign: 'left', marginTop: 20,color:'black' }}>
                            <Localized id="compliance-caseCount"></Localized>
                            <span style={{ marginLeft: 5 }}>{value.caseCount}</span>
                        </div>
                    </Card.Body>
                </Link>
            </Card>
        </div>
    };

    useEffect(() => {
        const _lawlist = suiteHook.data?.getUserCustomCaseSuiteList?.resultList || [];
        setLawList(_lawlist);
    }, [suiteHook.data]);
    useEffect(() => {
        let options: any[] = [];
        suiteTypeHook.data?.getUserCustomSuiteType?.map((value: any, key: any) => {
            options.push({ value: value.id, text: value.name })
        })
        setSuiteTypeOption(options || [])
    }, [suiteTypeHook.data?.getUserCustomSuiteType]);
    useEffect(() => {
        suiteTypeHook.refetch();
    }, [])
    return <>
        <Body>
            <Content>
                <Content.Header
                    title={<Localized id='compliance-suiteManage'></Localized>}
                ></Content.Header>
                <Content.Body full>
                    <Button type="primary" onClick={() => {
                        setShowAddSuiteModel(true);
                        setNewSuiteName('');
                        setSelectSuiteType(undefined);
                        setNewSuiteNameSt(undefined);
                        setNewSuiteTypeSt(undefined);
                    }}><Localized id="compliance-addsuite"></Localized>
                    </Button>
                    <Card style={{ marginTop: 20 }}>
                        <Card.Body>

                            <div>
                                <H3>合规测试用例集</H3>
                                <CardMain>
                                    {
                                        LawList.map((value, key) => {
                                            if (value.layType === -1) {
                                                return renderCard(value, key);
                                            }
                                        })
                                    }
                                    {
                                        LawList.filter((value: any, index: number) => {
                                            if (value.layType === -1) return value;
                                        }).length === 0 ?<div style={{width:85}}> <Status icon={'blank'} size={'s'} title={"暂无数据"} /></div> : null
                                    }
                                </CardMain>
                            </div>
                            <div style={{ marginTop: 10 }}>
                                <H3>专项测试用例集</H3>
                                <CardMain>
                                    {
                                        LawList.map((value, key) => {
                                            if (value.layType === 2) {
                                                return renderCard(value, key);
                                            }
                                        })
                                    }
                                    {
                                        LawList.filter((value: any, index: number) => {
                                            if (value.layType === 2) return value;
                                        }).length === 0 ?<div style={{width:85}}> <Status icon={'blank'} size={'s'} title={"暂无数据"} /></div> : null
                                    }
                                </CardMain>

                            </div>
                            <div style={{ marginTop: 10 }}>
                                <H3>自由测试用例集</H3>
                                <CardMain>
                                    {
                                        LawList.map((value, key) => {
                                            if (value.layType === 1) {
                                                return renderCard(value, key);
                                            }
                                        })
                                    }
                                    {
                                        LawList.filter((value: any, index: number) => {
                                            if (value.layType === 1) return value;
                                        }).length === 0 ?<div style={{width:85}}><Status icon={'blank'} size={'s'} title={"暂无数据"} /> </div>: null
                                    }
                                </CardMain>
                            </div>
                        </Card.Body>
                    </Card>
                </Content.Body>
            </Content>
        </Body>
        <Modal visible={showAddSuiteModel} caption={'创建用例集'} onClose={() => { setShowAddSuiteModel(false) }}>
            <Modal.Body>
                <Form>
                    <Form.Item label={'用例集名称'} status={newSuiteNameSt}>
                        <Input value={newSuiteName} onChange={(value) => {
                            setNewSuiteName(value);
                            if (value) {
                                setNewSuiteNameSt('success');
                            }
                            else {
                                setNewSuiteNameSt('error');
                            }
                        }} placeholder={getValue('license-upload-placeholder')} size='full' />
                    </Form.Item>
                    <Form.Item label={'用例集类型'} status={newSuiteTypeSt}>
                        <Select appearance={'button'}
                            type='simulate'
                            options={suiteTypeOption}
                            size={'full'}
                            value={selectSuiteType}
                            onChange={(value) => {
                                setSelectSuiteType(value);
                                setNewSuiteTypeSt('success');
                            }}
                        />
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