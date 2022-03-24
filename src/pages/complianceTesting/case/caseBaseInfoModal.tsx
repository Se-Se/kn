import { useEffect, useState } from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import { Dialog } from 'tdesign-react';
import styled from '@emotion/styled/macro';
import { useRouteMatch } from 'react-router-dom';

import iconPass from '../../../image/report-pass.svg';
import iconManul from '../../../image/report-manul-manul.svg';
import iconRiskLow from '../../../image/risk-low.svg';
import iconRiskHigh from '../../../image/risk-high.svg';
import iconRiskMid from '../../../image/risk-mid.svg';
import iconCheck from '../../../image/check-circle-filled.svg';

import { useCaseAllInfoLazyQuery } from 'generated/graphql';

type CaseBaseParm = {
    visible: boolean
    handleClose: React.Dispatch<React.SetStateAction<boolean>>
}
interface ProjectMatch {
    caseId: string
    lawCatalogueId: string
    projectId: string
};

const Spliter = styled.div`
    background:#E7E7E7;
    height: 1px;
    width: 100%;
`;
const ContentGroup = styled.div`
    background: white;
    min-height: 100%;
    padding:25px;
    min-width: 100%;
    max-height:70vh;
    overflow:auto;
`;
const ContentGroupTitle = styled.div`
    font-weight: 700;
`;
const BaseInfoGroup = styled.div`
    margin-top: 25px;
    display: flex;
`;
const BaseInfoItem = styled.div`
    width:33.3%;
`;
const BaseInfoItemGroup = styled.div`
    display: flex;
    margin-bottom: 24px;
`;
const BaseInfoItemTitle = styled.div`
    width:100px;
`;
const BaseInfoItemContent = styled.div`
    width: calc( 100% - 80px);
    color: #737373;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;
const BaseInfoGroupDesc = styled.div`
    margin-bottom: 25px;
    display: flex;
`;
const BaseInfoGroupDescContent = styled.div`
    width:calc( 100% - 100px);
    color: #737373;
`;

const ReportStatusIcon = styled.div`
    width:100px;
    height:100px;
    position:absolute;
    top:55px;
    right:40px;
`;
export const CaseBaseInfoModal: React.FC<CaseBaseParm> = ({ visible, handleClose }) => {
    const history = useHistory();
    const pageParam = useRouteMatch<ProjectMatch>().params;
    const caseId = pageParam.caseId;

    const [lawGroup, setLawGroup] = useState<any[]>([]);
    const [stepGroup, setStepGroup] = useState<any[]>([]);

    const [caseInfoData, setCaseInfoData] = useState<any>();

    const [getCaseAllInfo, caseAllInfoHook] = useCaseAllInfoLazyQuery();

    useEffect(() => {
        // console.log(caseInfoData);

    }, [caseInfoData])

    useEffect(() => {
        // getCaseAllInfo({variables:{caseId:caseId}})

        setCaseInfoData(caseAllInfoHook.data?.caseAllInfo);
        setLawGroup(caseAllInfoHook.data?.caseAllInfo?.complianceRequire || []);

    }, [caseAllInfoHook.data])

    useEffect(() => {
        if (visible) {
            getCaseAllInfo({ variables: { caseId: caseId } })
        }
    }, [visible])
    return <Dialog header="用例基本信息" width={'80%'} visible={visible} onClose={() => { handleClose(false) }} footer={false}>
        <ContentGroup>
            <ContentGroupTitle>
                <span>
                    基本信息
                </span>
            </ContentGroupTitle>
            <BaseInfoGroup>
                <BaseInfoItem>
                    <BaseInfoItemGroup>
                        <BaseInfoItemTitle>
                            <span>
                                用例编号
                            </span>
                        </BaseInfoItemTitle>
                        <BaseInfoItemContent>
                            <span>
                                {caseInfoData?.caseBaseInfo?.id || '--'}
                            </span>
                        </BaseInfoItemContent>
                    </BaseInfoItemGroup>
                    <BaseInfoItemGroup>
                        <BaseInfoItemTitle>
                            <span>
                                操作系统
                            </span>
                        </BaseInfoItemTitle>
                        <BaseInfoItemContent>
                            <span>
                                {caseInfoData?.caseBaseInfo?.operatingSystemName || '--'}
                            </span>
                        </BaseInfoItemContent>
                    </BaseInfoItemGroup>
                    <BaseInfoItemGroup>
                        <BaseInfoItemTitle>
                            <span>
                                风险程度
                            </span>
                        </BaseInfoItemTitle>
                        <BaseInfoItemContent>
                            {
                                <img src={iconRiskLow}></img>
                            }
                        </BaseInfoItemContent>
                    </BaseInfoItemGroup>
                </BaseInfoItem>
                <BaseInfoItem>
                    <BaseInfoItemGroup>
                        <BaseInfoItemTitle>
                            <span>
                                用例名称
                            </span>
                        </BaseInfoItemTitle>
                        <BaseInfoItemContent>
                            <span>
                                {caseInfoData?.caseBaseInfo?.name || '--'}
                            </span>
                        </BaseInfoItemContent>
                    </BaseInfoItemGroup>
                    <BaseInfoItemGroup>
                        <BaseInfoItemTitle>
                            <span>
                                绑定设备
                            </span>
                        </BaseInfoItemTitle>
                        <BaseInfoItemContent>
                            <span>
                                {caseInfoData?.caseBaseInfo?.bindName || '--'}
                            </span>
                        </BaseInfoItemContent>
                    </BaseInfoItemGroup>
                    <BaseInfoItemGroup>
                        <BaseInfoItemTitle>
                            <span>
                                创建人
                            </span>
                        </BaseInfoItemTitle>
                        <BaseInfoItemContent>
                            <span>
                                {caseInfoData?.caseBaseInfo?.submitUserName || '--'}
                            </span>
                        </BaseInfoItemContent>
                    </BaseInfoItemGroup>
                </BaseInfoItem>
                <BaseInfoItem>
                    <BaseInfoItemGroup>
                        <BaseInfoItemTitle>
                            <span>
                                测试类型
                            </span>
                        </BaseInfoItemTitle>
                        <BaseInfoItemContent style={{ display: 'flex' }}>
                            {
                                <>
                                    <img src={iconManul}></img>
                                    <span style={{ marginLeft: 5, color: '#0052D9' }}>
                                        {caseInfoData?.caseBaseInfo?.testMethodName || '--'}
                                    </span>
                                </>
                            }
                        </BaseInfoItemContent>
                    </BaseInfoItemGroup>
                    <BaseInfoItemGroup>
                        <BaseInfoItemTitle>
                            <span>
                                分类
                            </span>
                        </BaseInfoItemTitle>
                        <BaseInfoItemContent>
                            <span>
                                {caseInfoData?.caseBaseInfo?.classifyName || '--'}
                            </span>
                        </BaseInfoItemContent>
                    </BaseInfoItemGroup>
                    <BaseInfoItemGroup>
                        <BaseInfoItemTitle>
                            <span>
                                创建时间
                            </span>
                        </BaseInfoItemTitle>
                        <BaseInfoItemContent>
                            <span>
                                {caseInfoData?.caseBaseInfo?.submitTime || '--'}
                            </span>
                        </BaseInfoItemContent>
                    </BaseInfoItemGroup>
                </BaseInfoItem>
            </BaseInfoGroup>
            <BaseInfoGroupDesc>
                <BaseInfoItemTitle>
                    <span>
                        描述
                    </span>
                </BaseInfoItemTitle>
                <BaseInfoGroupDescContent>
                    <span>
                        {caseInfoData?.caseBaseInfo?.caseDesc || '--'}
                    </span>
                </BaseInfoGroupDescContent>
            </BaseInfoGroupDesc>
            <BaseInfoGroupDesc>
                <BaseInfoItemTitle>
                    <span>
                        修复建议
                    </span>
                </BaseInfoItemTitle>
                <BaseInfoGroupDescContent>
                    <span>
                        {caseInfoData?.caseBaseInfo?.remediation || '--'}
                    </span>
                </BaseInfoGroupDescContent>
            </BaseInfoGroupDesc>
            <Spliter></Spliter>
            <ContentGroupTitle style={{ marginTop: 25 }}>
                <span>
                    关联法规
                </span>
            </ContentGroupTitle>
            {
                lawGroup.map((value, key) => {
                    return <div key={key}>
                        <BaseInfoGroupDesc style={{ marginTop: 25 }}>
                            <BaseInfoItemTitle>
                                <span>
                                    法规名称
                                </span>
                            </BaseInfoItemTitle>
                            <BaseInfoGroupDescContent>
                                <span>
                                    {value.lawName || '--'}
                                </span>
                            </BaseInfoGroupDescContent>
                        </BaseInfoGroupDesc>
                        <BaseInfoGroupDesc>
                            <BaseInfoItemTitle>
                                <span>
                                    分类
                                </span>
                            </BaseInfoItemTitle>
                            <BaseInfoGroupDescContent>
                                <span>
                                    {value.dutyLawClassify1 || '--'}
                                </span>
                            </BaseInfoGroupDescContent>
                        </BaseInfoGroupDesc>
                        <BaseInfoGroupDesc>
                            <BaseInfoItemTitle>
                                <span>
                                    要求
                                </span>
                            </BaseInfoItemTitle>
                            <BaseInfoGroupDescContent>
                                <span>
                                    {value.dutyLawCatalogueName || '--'}
                                </span>
                            </BaseInfoGroupDescContent>
                        </BaseInfoGroupDesc>
                        <BaseInfoGroupDesc>
                            <BaseInfoItemTitle>
                                <span>
                                    测试方法
                                </span>
                            </BaseInfoItemTitle>
                            <BaseInfoGroupDescContent>
                                <span>
                                    {value.description || '--'}
                                </span>
                            </BaseInfoGroupDescContent>
                        </BaseInfoGroupDesc>
                    </div>
                })
            }
        </ContentGroup>
    </Dialog>
}