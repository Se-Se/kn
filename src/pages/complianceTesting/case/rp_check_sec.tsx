import React, { useState, useEffect } from 'react';
import { Localized } from 'i18n';
import { useGetCommonalityAutoTaskReportQuery, Order } from 'generated/graphql';
import { Modal, Table, Status } from '@tencent/tea-component';


interface RpCheckSecType {
  reportData: any
  projectId: string
  caseId: string
  caseStepId: string
}
const { pageable, autotip } = Table.addons;

export const RpCheckSec: React.FC<RpCheckSecType> = (props) => {

  const dataColumns: any = [{
    key: "name",
    header: "文件名称",
  },
  {
    key: "canary",
    header: "canary",
  },
  {
    key: "nx",
    header: "nx",
  },
  {
    key: "pie",
    header: "pie",
  },
  {
    key: "reiro",
    header: "reiro",
  },
  {
    key: "rpath",
    header: "rpath",
  },
  {
    key: "runpath",
    header: "runpath",
  },
  {
    key: "symbols",
    header: "symbols",
  }
  ];
  const [listData, setListData] = useState<any[]>([]);
  const [listCount, setListCount] = useState<number>(0);
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
  }
  );

  const teamId = 'team_items;1';

  const dataHook = useGetCommonalityAutoTaskReportQuery({
    variables: {
      teamId: teamId,
      component: '',
      version: '',
      path: '',
      projectId: props.projectId,
      caseId: props.caseId,
      caseStepId: props.caseStepId,
      search: {}
    }
  })

  useEffect(() => {
    setListData(dataHook.data?.getCommonalityAutoTaskReport?.reportCheckSec || [])
    setListCount(dataHook.data?.getCommonalityAutoTaskReport?.count || 0)
  }, [dataHook.data])

  return <Table columns={dataColumns}
    recordKey='name'
    records={listData}
    addons={[
      pageable({
        recordCount: listCount,
        onPagingChange: (value) => {
          let query = pageQueryInfo;
          query.offset.offset = (value.pageIndex as number - 1) * (value.pageSize as number);
          query.offset.limit = value.pageSize;
          setPageQueryInfo(JSON.parse(JSON.stringify(query)))
        }
      }),
      // scrollable({
      //     minWidth: 1200,
      // }),
      autotip({
        emptyText: <div>
          <Status icon={'blank'} title={<Localized id="compliance-nodata"></Localized>}></Status>
        </div>,
      })
    ]}></Table>
}