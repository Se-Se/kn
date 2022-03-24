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
export const Page: React.FC = () => {
    // const renderCard = useMemo(()=>{

    // },[])
    return <>
        <Body>
            <Content>
                <Content.Header
                    title={'用户管理'}>
                </Content.Header>
                <Content.Body style={{ width: '100%', height: 'auto' }} full>
                    
                    <CardMain>
                        
                    </CardMain>
                </Content.Body>
            </Content>
        </Body>
    </>
}