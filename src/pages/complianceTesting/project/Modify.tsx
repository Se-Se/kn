import React from 'react';
import { Table, Card } from "@tencent/tea-component";
import { useGetMessage } from 'i18n';
import { useChangeProjectHistoryQuery, Order } from 'generated/graphql'

export const Modify: React.FC = () => {
    const { pageable } = Table.addons;
    const getValue = useGetMessage();
    const teamId = "team_items;1";
    const projectId = "project_items;1"
    const modifyListData = useChangeProjectHistoryQuery({
        variables: {
            teamId: teamId, projectId: projectId, search: {
                offset: {
                    offset: 0,
                    limit: 1
                },
                search: "",
                searchField: "",
                orderBy: {
                    field: "id",
                    order: Order.Desc
                }
            }
        }
    }).data?.changeProjectHistory?.history||[] as [];
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
    return <div>
        <Card>
            <Table columns={toolListColumns} records={modifyListData} addons={[pageable()]}></Table>
        </Card>
    </div>

}