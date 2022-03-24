import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { Modal, Table, Status } from '@tencent/tea-component';
import { useChangeCaseHistoryQuery, Order } from 'generated/graphql'

type ProjectHistoryModalType = {
    isShow: boolean
    projectId: string
    setIsShowAddDialog: Dispatch<SetStateAction<boolean>>
    caseId:string
    // refreshFn:()=>void
}
export const CaseHistoryModal: React.FC<ProjectHistoryModalType> = (props) => {

    const { pageable } = Table.addons;
    const getValue = useGetMessage();
    const teamId = "team_items;1";
    const projectId = props.projectId;
    const caseId = props.caseId
    const { autotip } = Table.addons;
    const [modifyListData, setModifyListDataHook] = useState<any[]>([]);
    const [projectListDataCount, setProjectListDataCount] = useState<number>(0);

    const [pageQueryInfo, setPageQueryInfo] = useState<any>({
        offset: {
            offset: 0,
            limit: 10
        },
        search: "",
        searchField: "",
        orderBy: {
            field: "id",
            order: Order.Desc
        }
    });
    const modifyListDataHook = useChangeCaseHistoryQuery({
        variables: {
            teamId: teamId, projectId: projectId, search:pageQueryInfo,caseId:caseId
        }
    })
    const toolListColumns = [
        {
            key: "changeTime",
            header: getValue('column-modifyTime')
        }, {
            key: "changeUser",
            header: getValue('column-modifyUser')
        }, {
            key: "changeObject",
            header: getValue('column-modifyObject')
        }, {
            key: "changematter",
            header: getValue('column-modifyItem')
        }
    ];
    useEffect(() => {
        setModifyListDataHook(modifyListDataHook.data?.changeCaseHistory?.history || []);
        setProjectListDataCount(modifyListDataHook.data?.changeCaseHistory?.count || 0);
    }, [modifyListDataHook.data])
    useEffect(() => {
        if (props.isShow) {
            modifyListDataHook.refetch();
        }
    }, [props.isShow])
    useEffect(() => {
        modifyListDataHook.refetch({ teamId: teamId, search: pageQueryInfo })
      }, [pageQueryInfo]);
    return <>
        <Modal visible={props.isShow}
            size={'l'}
            caption={<Localized id='compliance-modifyHistory'></Localized>}
            onClose={() => { props.setIsShowAddDialog(false) }}>
            <Modal.Body>
                <Table columns={toolListColumns} records={modifyListData}
                    addons={[autotip({
                        emptyText: <div>
                            <Status icon={'blank'} title={<Localized id="compliance-nodata"></Localized>}></Status>
                        </div>,
                    }), pageable({
                        recordCount: projectListDataCount,
                        onPagingChange: (value) => {
                            let query = pageQueryInfo;
                            query.offset.offset = (value.pageIndex as number - 1) * (value.pageSize as number);
                            query.offset.limit = value.pageSize;
                            setPageQueryInfo(JSON.parse(JSON.stringify(query)))
                        }
                    })]}></Table>
            </Modal.Body>
        </Modal>
    </>
}