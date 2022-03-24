import React, { useEffect, useState } from 'react';
import style from '@emotion/styled/macro';
import { Button, Card } from '@tencent/tea-component';
import { useGetCaseStepDetailQuery } from 'generated/graphql';
import { Loading } from './loading';
import { CommonErrorBoundary } from '../../../components/commonErrorBoundary';
import {useApolloClient,gql}  from '@apollo/client'
// import { Editor } from './editor';
// import { MarkdownRender } from './markDownRender';
// import { Localized } from 'i18n';

const MarkdownRender = React.lazy(() => import('./markDownRender'));
const Editor = React.lazy(() => import('./editor'));

const OuterContainer = style.div`
    display:flex;
`;
const InnerContainer = style.div`
    width:50%;
`;


export const Page: React.FC = () => {

    const teamId = 'team_items;1';

    const client =  useApolloClient();


    const dataHook = useGetCaseStepDetailQuery({ variables: { teamId: teamId, projectId:'project_items;1', caseId: "case_items;1", stepId: "case_step_item;1" }});

    const [editorValue, setEditorValue] = useState<string>('');

    const readCache = ()=>{
        const catche_query = gql`query SysMessage($teamId:ID!,$search:SearchPrecise){
            sysMessage(teamId:$teamId, search:$search){
              occTime
              message
            }
          }`;
        dataHook.refetch();
        console.log(client.readQuery({query:catche_query,variables:{ teamId: teamId, search: { offset: { offset: 1, limit:3 }, search: "0", searchField: "occTime" } }}));
    }

    useEffect(() => {
        if (dataHook.data?.getCaseStepDetail) {
            const word = dataHook.data.getCaseStepDetail.markdown;
            // const _word = word.replace(/\\/g, '');
            // console.log(_word);
            // const obj = JSON.parse(word);
            // console.log(obj.data.getCaseStepDetail.markdown);

            setEditorValue(word|| 'no result');
            // console.log(JSON.parse(dataHook.data.sysMessage[2].message));
        }
        // console.log(dataHook?.data?.sysMessage[2].message||'no result');
    }, [dataHook.data?.getCaseStepDetail])
    return (
        <OuterContainer>
            <InnerContainer>
                <Card>
                    <CommonErrorBoundary>
                        <React.Suspense fallback={<Loading></Loading>}>
                            <Editor height={320} value={editorValue} setEditorValue={setEditorValue} language={'markdown'}></Editor>
                        </React.Suspense>
                    </CommonErrorBoundary>
                    <Button onClick={()=>{readCache()}}>click</Button>
                </Card>
            </InnerContainer>
            <InnerContainer>
                <Card>
                    <CommonErrorBoundary>
                        <React.Suspense fallback={<Loading></Loading>}>
                            <MarkdownRender value={editorValue}></MarkdownRender>
                        </React.Suspense>
                    </CommonErrorBoundary>
                </Card>
            </InnerContainer>
        </OuterContainer>
    );
}