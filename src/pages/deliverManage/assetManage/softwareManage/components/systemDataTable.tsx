import React, { useState, useEffect } from "react";
import { Table, TableSort,  message,Tooltip } from "tdesign-react";
import { useHistory, useParams } from "react-router-dom";
import "tdesign-react/es/style/index.css";
import { getSoftwareDetail, getsystemDetailList, relieveRelationSystem } from "pages/deliverManage/util/softwareApi/api";
import { ProgressTag } from 'pages/deliverManage/component/progressTag';
import styled from "@emotion/styled/macro";

const Ellipsis = styled.div`
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
width:110px;
`
type MyProps = {
  softWareId: any
}
export const SystemDataTable: React.FC<MyProps> = (props: MyProps) => {
  const history = useHistory();
  const params: any = useParams();

  const [pageSize, setPageSize] = useState<number>(10);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState(50);
  const [sort, setSort] = useState<TableSort>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [query, setQuery] = useState({});
  const [detailData, setDetailData] = useState<any>({});
  const [list, setList] = useState<any>([]);

  // pageSize current sort 变化查询列表
  useEffect(() => {
    fetch();
  }, [pageSize, current, sort]);

  // page信息变化
  const rehandleChange = (pageInfo: { current: number; pageSize: number }) => {
    const { current, pageSize } = pageInfo;
    setCurrent(current);
    setPageSize(pageSize);
  };

  const fetch = async () => {
    const request: any = {
      offset: {
        currentPage: current,
        pageSize: pageSize,
      },
      sortData: sort,
    };
    setTableLoading(true)
    const result: any = await getsystemDetailList(request)
    if (result.code === 0) {
      result.result.map((item: any, index: number) => {
        item.index = index + 1
      })
      setList(result.result)
      setTotal(result.count)
      setTableLoading(false)
    }
  }


  // 排序
  const handleSort = (data: any) => {
    setSort(data);
  };

  // 跳转到零部件详情页
  const jumpToDetail = (id: string) => {
    history.push(`/lingshu/assetsManage/systemManage/systemDetail/${id}`);
  };

  // 硬件解除零部件关联
  const relationParts = (id: any) => {
    let request: any = {
      systemId: Number(id),
      softwareId: props.softWareId,
    };
    relieveRelationSystem(request).then((res: any) => {
      if (res.code === 0) {
        message.success('解除成功')
        fetch()
      } else {
        message.error('解除失败')
      }
    })
  };



  const columns = [
    {
      align: "left",
      width: 80,
      minWidth: 80,
      colKey: "index",
      title: "序号",
      // sorter: true,
    },
    {
      align: "left",
      width: 100,
      minWidth: 100,
      colKey: "number",
      title: "编号",
      // sorter: true,
    },
    {
      align: "left",
      width: 150,
      minWidth: 150,
      colKey: "name",
      title: "系统名称",
      sorter: true,
      render(cell: any) {
        console.log(cell)
        return (
          <span>
            <a onClick={() => jumpToDetail(cell.row.id)}>{cell.row.name}</a>
          </span>
        );
      },
    },
    {
      align: "left",
      width: 150,
      minWidth: 150,
      colKey: "systemType",
      title: "操作系统",
      sorter: true,
    },
    {
      align: "left",
      width: 200,
      minWidth: 200,
      colKey: "systemCoreVersion",
      title: "内核版本",
      sorter: true,
    },
    {
      align: "left",
      width: 150,
      minWidth: 150,
      colKey: "systemUploadProgress",
      title: "文件状态",
      sorter: true,
      render(cell: any) {
        return (
            <ProgressTag progress={cell.row.systemUploadProgress} />
        )
    }
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'belongAutoParts',
      title: '所属零部件',
      sorter: true,
      render(cell: any) {
        if (cell.row?.belongAutoParts?.length) {
          return <Tooltip
            content={cell.row?.belongAutoParts.map((item: any) => item.autoPartName + '-' + item.autoPartVersion).join('/')}
            theme="light"
            showArrow={false}>
            <Ellipsis>
              {cell.row?.belongAutoParts.map((item: any) => item.autoPartName + '-' + item.autoPartVersion).join('/')}
            </Ellipsis>
          </Tooltip>

        };
        return '-';
      }
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'belongCarModels',
      title: '所属车型',
      sorter: true,
      // ellipsis: true,
      render(cell: any) {
        if (cell.row?.belongCarModels?.length) {
          return <Tooltip
            content={cell.row?.belongCarModels.map((item: any) => item.carModelName + '-' + item.carModelVersion).join('/')}
            theme="light"
            showArrow={false}>
            <Ellipsis>
              {cell.row?.belongCarModels.map((item: any) => item.carModelName + '-' + item.carModelVersion).join('/')}
            </Ellipsis>
          </Tooltip>
        };
        return '-';
      }
    },
    {
      align: "left",
      width: 104,
      minWidth: 104,
      className: "row",
      colKey: "edit",
      title: "操作",
      fixed: "right",
      render(cell: any) {
        return (
          <span>
            <a
              onClick={() => relationParts(cell.row.id)}
            >
              解除关联
            </a>
          </span>
        );
      },
    },
  ];
  return (
    <div style={{ padding: 20 }}>
      <Table
        rowKey="id"
        data={list}
        loading={tableLoading}
        style={{ border: "1px solid #eaeaea" }}
        //@ts-ignore
        columns={columns}
        multipleSort={true}
        onSortChange={(sort) => handleSort(sort)}
        disableDataSort={true}
        pagination={{
          current,
          total,
          pageSize,
          showJumper: true,
          onChange(pageInfo) {
            rehandleChange(pageInfo);
          },
        }}
      />
    </div>
  );
};
