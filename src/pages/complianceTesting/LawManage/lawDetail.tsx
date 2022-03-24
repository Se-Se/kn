import React, { useRef, useState, useEffect } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { useHistory, Link, useRouteMatch } from 'react-router-dom';
import { Layout, Card, Row, Col, Table, TableColumn, Icon, Justify, Button, SearchBox, Modal, Status, H3 } from '@tencent/tea-component';
import style from '@emotion/styled/macro';
import { Loading } from '../case/loading';
import MarkdownNavbar from 'markdown-navbar';
import "markdown-navbar/dist/navbar.css";
import { useLawDetailQuery } from 'generated/graphql';
const MarkdownRender = React.lazy(() => import('../case/markDownRender'));

const { Content, Body } = Layout;
const MianContent = style.div`
    width: calc( 100% - 240px);
    height: calc( 100% - 140px);
    position: absolute;
    top: 120px;
    left: 220px;
`
const CardMain = style.div`
    display: flex;
    width: 100%;
    height: 100%;
`;
const CardLeft = style.div`
    width: 290px;
    height: 100%;
    border-right: 1px solid #ddd;
    overflow: auto;
`;
const CardRight = style.div`
    width: 100%;
    height: 100%;
`;
interface ProjectMatch {
    lawId: string
}
export const Page: React.FC = () => {
    const history = useHistory();
    const pageParam = useRouteMatch<ProjectMatch>().params;
    const lawId = pageParam.lawId;
    const lawDetailHook = useLawDetailQuery({ variables: { lawId: lawId } });
    const [lawDetailData, setLawDetailData] = useState<any>({});
    const mdDom = useRef(null);
    useEffect(() => {
        setLawDetailData(lawDetailHook.data?.lawDetail);
    }, [lawDetailHook.data])
    useEffect(() => {
    }, [])
    return <>
        <Body>
            <Content>
                <Content.Header
                    showBackButton onBackButtonClick={history.goBack}
                    title={lawDetailData ? lawDetailData.title : ''}
                ></Content.Header>
                <MianContent>
                    <Card style={{ width: '100%', height: '100%' }}>
                        <CardMain>
                            <CardLeft>
                                <React.Suspense fallback={<Loading></Loading>}>
                                    <MarkdownNavbar
                                        declarative={false} onNavItemClick={(event, element, hashValue) => {
                                            const query = '[data-id="' + hashValue + '"]';
                                            const _dom = document.querySelector(query);
                                            if (_dom) {
                                                _dom.scrollIntoView(true);

                                            }
                                        }} ordered={false} source={lawDetailData ? lawDetailData.markDown : ''}></MarkdownNavbar>
                                </React.Suspense>
                            </CardLeft>
                            <CardRight ref={mdDom}>
                                <React.Suspense fallback={<Loading></Loading>}>
                                    <MarkdownRender value={lawDetailData ? lawDetailData.markDown : ''}></MarkdownRender>
                                </React.Suspense>
                            </CardRight>
                        </CardMain>
                    </Card>
                </MianContent>
            </Content>
        </Body>
    </>
}