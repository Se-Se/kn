import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Table } from "@tencent/tea-component";
import { Annotation } from "@tencent/tea-chart/lib/annotation";
import style from '@emotion/styled/macro';
import { Localized, useGetMessage } from 'i18n';
import { Link, useRouteMatch } from 'react-router-dom';
import { generateLink, Pattern } from 'route';
import { BasicBar } from "@tencent/tea-chart/lib/basicbar";
import { BasicPie } from "@tencent/tea-chart/lib/basicpie";
import { useLawCatalogueCheckDetailQuery } from 'generated/graphql'
const { expandable, pageable } = Table.addons;


const DetailListDom = style.div`
    display: flex;
    margin-top: 10px;
`;
const DetailListDomTitle = style.div`
    width:80px;
    color:#ccc;
`;


type ProjectDetailType = {
    projectDetail: any
}
interface ProjectMatch {
    projectId: string
}

export const Report: React.FC<ProjectDetailType> = ({ projectDetail }) => {
    const teamId = 'team_items;1';
    const pageParam = useRouteMatch<ProjectMatch>().params;
    const projectId = pageParam.projectId;

    const getValue = useGetMessage();

    const LawCataLogeData = useLawCatalogueCheckDetailQuery({ variables: { teamId: teamId, projectId: projectId } }).data?.lawCatalogueCheckDetail || [];

    const [expandedKeys, setExpandedKeys] = useState<string[]>(['lawCatalogueId'])

    const toolListColumns = [
        {
            key: "dutyLawClassify1",
            header: getValue('column-categray')
        }, {
            key: "dutyLawClassify2",
            header: getValue('column-subCategray')
        }, {
            key: "dutyLawCatalogueName",
            header: getValue('column-require')
        }, {
            key: "checkResult",
            header: getValue('column-checkResult'),
            render: (value: any) => {
                const word = '('+value.checkPassResultCount + '/' + value.checkResultCount+')';
                switch (value.passOrNot) {
                    case true: return <span style={{ color: '#29cc85' }}>{word}<Localized id="compliance-checkPass"></Localized></span>;
                    case false: return <span style={{ color: '#ff584c' }}>{word}<Localized id="compliance-checkUnPass"></Localized></span>;
                }
            }
        }
    ];
    const subTableColumns = [
        {
            key: "caseName",
            header: getValue('column-case')
        }, {
            key: "taskStatus",
            header: getValue('column-taskStatus'),
            render: (value: any) => {
                switch (value.taskStatus) {
                    case 1: return <span style={{ color: '#29cc85' }}><Localized id="compliance-checkPass"></Localized></span>;
                    case 0: return <span style={{ color: '#ff584c' }}><Localized id="compliance-checkUnPass"></Localized></span>;
                }
            }
        }, {
            key: "checkTool",
            header: getValue('column-tool')
        }, {
            key: "operation",
            header: getValue('column-operation'),
            render: (value: any) => {
                const pathparams = {
                    caseId: value?.caseId,
                    projectId: projectId
                }
                return <Link to={generateLink(Pattern.ComplianceTestingCaseDetail, pathparams)}><Localized id='see-detail'></Localized></Link>
            }
        }
    ];

    const renderSubTable = (record: any) => {
        return <div>
            <Table columns={subTableColumns} records={record.caseClassifyResultRep}></Table>
        </div>;
    }
    const [progressData, setProgressData] = useState<{ type: string; value: number; }[]>([]);

    useEffect(() => {
        const _toolResult = projectDetail.projectResult.testResult;
        const _progressData = [
            { type: getValue('compliance-unCheck'), value: _toolResult.unTestNumber },
            { type: getValue('compliance-checkPass'), value: _toolResult.unPassNumber },
            { type: getValue('compliance-checkUnPass'), value: _toolResult.passNumber },
            { type: getValue('compliance-igore'), value: _toolResult.ignoreNumber },
        ]
        setProgressData(_progressData);
    }, [getValue, projectDetail.projectResult.testResult])

    return <div>
        <Button type="primary">
            <Localized id="compliance-downLoadReport"></Localized>
        </Button>
        <Card style={{ marginTop: 20 }}>
            <Card.Body>
                <Row showSplitLine>
                    <Col span={8}>
                        <div>
                            <h3><Localized id='compliance-basicInfo'></Localized></h3>
                        </div>
                        <DetailListDom>
                            <DetailListDomTitle><Localized id={'column-projectName'}></Localized></DetailListDomTitle>
                            <div>{projectDetail?.projectResult?.name || '--'}</div>
                        </DetailListDom>
                        <DetailListDom>
                            <DetailListDomTitle><Localized id={'column-submitTime'}></Localized></DetailListDomTitle>
                            <div>{projectDetail?.projectResult?.submitTime || '--'}</div>
                        </DetailListDom>
                        <DetailListDom>
                            <DetailListDomTitle><Localized id={'column-carModel'}></Localized></DetailListDomTitle>
                            <div>{projectDetail?.projectResult?.carModel || '--'}</div>
                        </DetailListDom>
                        <DetailListDom>
                            <DetailListDomTitle>
                                <Localized id={'column-lawStandard'}></Localized>
                            </DetailListDomTitle>
                            <Link to={generateLink(Pattern.ComplianceTestingProject)}>
                                <div>{projectDetail?.projectResult?.lawStandard || '--'}</div>
                            </Link>
                        </DetailListDom>
                        <DetailListDom>
                            <DetailListDomTitle><Localized id={'column-module'}></Localized></DetailListDomTitle>
                            <div>{projectDetail?.projectResult?.module || '--'}</div>
                        </DetailListDom>
                        <DetailListDom>
                            <DetailListDomTitle><Localized id={'column-version'}></Localized></DetailListDomTitle>
                            <div>{projectDetail?.projectResult?.version || '--'}</div>
                        </DetailListDom>
                    </Col>
                    <Col span={8}>
                        <div>
                            <h3><Localized id='compliance-process'></Localized></h3>
                        </div>
                        <div>
                            <BasicBar
                                height={250}
                                position={"value*type"}
                                dataSource={progressData}
                            />
                        </div>
                    </Col>
                    <Col span={8}>
                        <div>
                            <h3><Localized id='column-passRate'></Localized></h3>
                        </div>
                        <div>
                            <BasicPie
                                circle
                                height={250}
                                dataSource={progressData}
                                position="value"
                                color="type"
                            >
                                <Annotation>
                                    <Annotation.Label
                                        content={projectDetail?.projectResult.testResult.passRate}
                                        position={["50%", "50%"]}
                                        offsetX={-10}
                                        offsetY={-10}
                                        textStyle="font-size:20px;font-weight:600;"
                                    />
                                    <Annotation.Label
                                        content="%"
                                        position={["50%", "50%"]}
                                        offsetX={30}
                                        offsetY={-10}
                                        textStyle="font-size:16px;"
                                    />
                                    <Annotation.Label
                                        content={getValue('compliance-check-passRate')}
                                        position={["50%", "50%"]}
                                        offsetX={0}
                                        offsetY={25}
                                        textStyle="font-size:16px;color:#ccc;"
                                    />
                                </Annotation>
                            </BasicPie>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
        <Card>
            <Card.Body title={<Localized id={"compliance-lowDetail"}></Localized>}>
                <Table columns={toolListColumns}
                    records={LawCataLogeData}
                    recordKey="lawCatalogueId"
                    addons={[
                        pageable(),
                        expandable({
                            expandedKeys: expandedKeys,
                            render(record) {
                                const subtable = renderSubTable(record);
                                return subtable
                            },
                            onExpandedKeysChange: (keys, { event }) => {
                                setExpandedKeys(keys)
                            },

                        }),
                    ]}></Table>
            </Card.Body>
        </Card>
    </div>

}