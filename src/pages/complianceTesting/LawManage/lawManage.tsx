import React, { useState, useEffect } from 'react';
import { Localized } from 'i18n';
import { Link } from 'react-router-dom';
import { Layout, Card,  Button } from '@tencent/tea-component';
import style from '@emotion/styled/macro';
import { generateLink, Pattern } from 'route';
import { useGetLawListQuery } from 'generated/graphql';

const { Content, Body } = Layout;
const CardMain = style.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-top: 20px;
`;
const DetailParam = style.div`
    width: 100%;
    max-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
export const Page: React.FC = () => {
    // const renderCard = useMemo(()=>{

    // },[])
    const lawListHook = useGetLawListQuery({});

    const [LawList, setLawList] = useState<any[]>([]);

    const renderCard = (value: any, key: any) => {
        const pathparams = {
            suiteId: value?.lawId
        }
        return <div key={key} style={{ marginBottom: 20, marginRight: 20 }}>
            <Card style={{ width: 320 }}>
                <Card.Body operation={<Link style={{ fontSize: 12 }} to={generateLink(Pattern.ComplianceTestingSuiteDetail, pathparams)}>
                    <Localized id='column-detail'></Localized>
                </Link>} title={value.title}>
                    <DetailParam>
                        {value.catalogueList ? value.catalogueList[0].dutyLawClassify1 : ''}
                    </DetailParam>
                    {/* <DetailParam>
                        {value.catalogueList.dutyLawClassify1}
                    </DetailParam> */}
                    <div style={{ textAlign: 'right', marginTop: 20 }}>
                        <Localized id="compliance-LawCount"></Localized>
                        <span style={{ marginLeft: 5 }}>{value.count}</span>
                    </div>
                </Card.Body>
            </Card>
        </div>
    };
    useEffect(() => {
        const _lawlist = lawListHook.data?.getLawList || [];
        setLawList(_lawlist);
    }, [lawListHook.data])
    useEffect(() => {
    }, [])
    return <>
        <Body>
            <Content>
                <Content.Header
                    title={<Localized id='compliance-suiteManage'></Localized>}
                ></Content.Header>
                <Content.Body style={{ width: '100%', height: 'auto' }} full>
                    <Button type="primary" onClick={() => {
                        // setIsShowAdd(true);
                        // setShowAddSuiteModel(true);
                    }}><Localized id="compliance-addsuite"></Localized>
                    </Button>
                    <CardMain>
                        {
                            LawList.map((value, key) => {
                                return renderCard(value, key);
                            })
                        }
                    </CardMain>
                </Content.Body>
            </Content>
        </Body>
    </>
}