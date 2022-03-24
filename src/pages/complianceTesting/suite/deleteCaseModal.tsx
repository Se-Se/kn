import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Localized } from 'i18n';
import { Modal, Collapse, Button, List, notification} from '@tencent/tea-component';
import { useGetSuiteWithCaseIdsQuery, useDeleteUserCustomCaseMutation } from 'generated/graphql';
import style from '@emotion/styled/macro';

type DeleteCaseType = {
    isShow: boolean
    setIsShowAddDialog: Dispatch<SetStateAction<boolean>>
    suiteId: string
    refreshFn: () => void
    deleteCaseId: string
    deleteId: string
}
const CardMain = style.div`
    display: flex;
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
`;
const CardTitle = style.div`
    width: 50px;
    text-align: center;
`;
const CardContent = style.div`
`;
export const DeleteCaseModal: React.FC<DeleteCaseType> = (props) => {
    const teamId = 'team_items;1';
    const bindingHook = useGetSuiteWithCaseIdsQuery({
        variables: {
            teamId: teamId,
            caseIds: props.deleteCaseId?[props.deleteCaseId]:null
        },
        fetchPolicy:'network-only'
    })
    const [pageData, setPageData] = useState<any>();

    const [deleteCase] = useDeleteUserCustomCaseMutation();

    const deleteFn = async () => {
        await deleteCase({
            variables: {
                teamId: teamId,
                caseId: props.deleteCaseId
            }
        }).catch((error) => {
            notification.error({
                description: error.toString()
            })
        })
        props.refreshFn();
    };

    useEffect(() => {
        setPageData(bindingHook.data?.GetSuiteWithCaseIds);
    }, [bindingHook.data])

    useEffect(() => {
        bindingHook.refetch();
    }, [props.isShow])

    return <Modal visible={props.isShow} caption={<Localized id='compliance-deleteConfirm'></Localized>}
        onClose={() => { props.setIsShowAddDialog(false) }}>
        <Modal.Body>
            <div style={{ display: 'flex', alignItems: 'flex-start',width:'100%'}}>
                <span>该用例属于{pageData?.count || 0}个用例集</span>
                <Collapse iconPosition={'right'} style={{ marginTop: -1,marginLeft:5 }}>
                    {
                        pageData?.resultList ? <Collapse.Panel id="1" title={<Button type="link">查看详情</Button>}>
                            <div>
                                <div style={{ width: 498, marginLeft: -127, marginTop: 10, border: '1px solid #ccc' }}>
                                    <List split="divide">
                                        {
                                            pageData?.resultList?.map((value: any, key: any) => {
                                                return <List.Item key={key}>
                                                    <CardMain>
                                                        <CardTitle>
                                                            {key+1}
                                                        </CardTitle>
                                                        <CardContent>
                                                            {value.name}
                                                        </CardContent>
                                                    </CardMain></List.Item>
                                            }) || null
                                        }
                                    </List>
                                </div>
                            </div>
                            {/* </div> */}
                        </Collapse.Panel> : null
                    }
                </Collapse>
            </div>
            <div style={{marginTop:10}}>
                <span>删除后，该用例再所属用例集的信息也会同步清除</span>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button type="primary" onClick={() => { props.setIsShowAddDialog(false); deleteFn() }}>
                <Localized id='operation-delete'></Localized>
            </Button>
            <Button type="weak" onClick={() => { props.setIsShowAddDialog(false) }}>
                <Localized id='modal-cancel'></Localized>
            </Button>
        </Modal.Footer>
    </Modal>
}