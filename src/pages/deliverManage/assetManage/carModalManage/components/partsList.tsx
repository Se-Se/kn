import React, { useState, useEffect } from 'react'
import { Button, Radio, Tooltip, Input, Select, Table, TableRowData, TableSort, message } from 'tdesign-react';
import style from '@emotion/styled/macro';
import { SearchIcon, } from "tdesign-icons-react";

import { useHistory } from 'react-router-dom';
import { ProjectProcess } from 'pages/report/sys/detail/Process';
import { Loophole } from 'pages/deliverManage/component/loopholeTag';
import { getRelationAutoPartsList, relieveRelationAutoPartsApi } from 'pages/deliverManage/util/carModalApi/api';

const CardMain = style.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
`;
const TableContent = style.div`
  width: 100%;
  height: 100%;
  background-color:#fff;
  padding:20px;
`;
const Style = style.div`
  .button-margin{
    margin-left:10px;
  }
  .input-search{
    width:320px;
  }
  .select-group{
    display:flex;
  }
  .select-customer{
    margin-left:20px;
  }
`
const CardContentTitle = style.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 12px;
  .t-radio-group{
      background-color:#FFFFFF;
  }
`;
const Ellipsis = style.div`
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
width:110px;
`
const SelectTitle = style.div`
  height:32px;
  line-height:32px;
  margin-right:24px;
  min-width:56px;
`
const options: any = [
    { value: 1, label: '版本1' },
    { value: 2, label: '版本2' },
    { value: 3, label: '版本3' },
]

type Props = {
    openPartsDrawer: () => any
    activeId:number,
    relationFlag:boolean
}

export const PartsList: React.FC<Props> = (props: Props) => {
  const history = useHistory();
  const [systemV, setSystemV] = useState<any>({ retrieveColumn: 'system_items.id', retrieveValue: [], retrieveLike: false });
  const [pageSize, setPageSize] = useState<number>(10);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<TableSort>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [modesOptions, setModesOptions] = useState<any>(options);
  const [searchValue, setSearchValue] = useState<any>({
    retrieveColumn: "auto_parts_items.name",
    retrieveLike: true,
    retrieveValue: [],
  });
  const [searchValueText,setSearchValueText]=useState<string>('')
  const [listRadioV, setListRadioV] = useState<string>('ecu');
  const [systemIds,setSystemIds]=useState<any[]>([]);

  useEffect(() => {
    if(props.activeId){
      makeParams();
    }
  }, [listRadioV,pageSize,current,searchValue,systemV,props.activeId,props.relationFlag])

  const rehandleChange = (pageInfo: { current: number, pageSize: number }) => {
    const { current, pageSize } = pageInfo;
    setCurrent(current);
    setPageSize(pageSize);
  }
  // 批量选中列表
  function onSelectChange(value: any[]) {
      setSelectedRowKeys(value);
  }
  const carModelOnChange = (value: any) => {
      setSystemIds(value)
  }
  // 重置btn click
  const reseatSelectGroup = () => {
      setSystemV({ retrieveColumn: 'system_items.id', retrieveValue: [], retrieveLike: false });
  }

  // 查询btn click
  const handleSearch = () => {
    const sv = { retrieveColumn: 'system_items.id', retrieveValue: systemIds, retrieveLike: false }
    setSystemV(sv)
  }
  const makeParams = async () => {
    setTableLoading(true)
    try{
      const paramArr = [systemV,searchValue].filter((item: any) => item.retrieveValue.length !== 0)
      let params = {
        carModelId:props.activeId,
        autoPartsType:listRadioV,
        retrieve: {
          offset: {
            currentPage: current,
            pageSize: pageSize
          },
          retrieveData: paramArr,
          sortData: sort
        }
      }
      // 根据listRadioV的值(1,2,3) 来获取（ECU，零束云，移动端）各自的list
      console.log('params', params);
      const resp:any = await getRelationAutoPartsList(params)
      if(resp.code === 0){
        const list = resp.results
        list.map((item:any,index:number)=>{
          item.index=index+1 
        })
        setList(resp.results)
        setTotal(resp.count)
      }
      else {
        message.error(resp.msg)
      }
    }
    catch(e){
      message.error('请求失败')
      console.log(e)
    }
    finally{
      setTableLoading(false)
    }
  }

  const formatterList = (data: any) => {
      let arr: any = data.map((item: any, index: number) => {
          item.index = index + 1;
          return item;
      });
      console.log('arr===>', arr)
      setList((v: any) => {
          v = [];
          return arr || []
      })
  }

    // 跳转
  const jumpToDetail = (id: any) => {
    console.log('跳转到零部件', id)
    let system = listRadioV

    if(system =='ecu'){
      system = system.toLowerCase()
    }
    
    history.push(`/lingshu/assetsManage/componentManage/${system}Detail/${Number(id)}`);
  }
  // 硬件解除零部件关联
  const relationParts = async (id: any) => {
    try {
      const data = {
        autoPartsId:id,
        carModelId:props.activeId
      }
      const resp:{code:number,msg:string} = await relieveRelationAutoPartsApi(data) as {code:number,msg:string}
      if(resp.code === 0){
        message.success('解除成功')
      }
      else {
        message.error(resp.msg)
      }
    } catch (error) {
      message.error('解除失败');
      console.error(error)
    }
  }

    // 根据名称搜索
  const handleNameSearch = () => {
    let arr: any = [];
    if (searchValueText) {
      arr = [searchValueText];
    } else {
      arr = [];
    }
    setSearchValue({
      retrieveColumn: "auto_parts_items.name", //之后查看修改
      retrieveLike: true,
      retrieveValue: arr,
    });
  };

  const fetchData = () => { };

  const openRelateParts = () => {
    props.openPartsDrawer()
  }

    // radio 按钮切换
  const handleRadioChange = (v: any) => {
    console.log('radio-change', v);
    setListRadioV(v);
  }

  useEffect(()=>{
   if(listRadioV!=='ecu'){
    setSystemIds([]);
    }
  },[listRadioV])

  const columnsFilter=(columns:any)=>{
    if(listRadioV==='ecu'){
     return columns;
    }else{
   return columns.filter((item:any)=>item.colKey!=='belongSystemVersionString')
    }
  }

  const columns = [
    {
      align: 'left',
      width: 80,
      minWidth: 80,
      colKey: 'index',
      title: '序号',
    },
    {
      align: 'left',
      width: 100,
      minWidth: 100,
      colKey: 'number',
      title: '编号',
      sorter: true,
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'name',
      title: '零部件',
      sorter: true,
      render(cell: any) {
        return <span><a onClick={() => jumpToDetail(cell.row.id)}>{cell.row.name}</a></span>
      }
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'version',
      title: '版本号',
      sorter: true
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'belongSystemVersionString',
      title: '操作系统',
      sorter: true,
      render(cell: any) {
          if (cell.row?.belongSystemVersionString !== '-') {
              return <Tooltip theme="light" showArrow={false} content={cell.row?.belongSystemVersionString}><Ellipsis>{cell.row?.belongSystemVersionString}</Ellipsis></Tooltip>
          } else {
              return '-'
          }
      }
  },
    {
      align: 'left',
      width: 400,
      minWidth: 400,
      colKey: 'loophole',
      title: '漏洞分布',
      sorter: true,
      render(cell: any) {
        return <Loophole loophole={cell.row.loophole}/>
      }
    },
    {
      align: 'left',
      width: 104,
      minWidth: 104,
      className: 'row',
      colKey: 'edit',
      title: '操作',
      fixed: 'right',
      render(cell: any) {
          return <span><a onClick={() => relationParts(cell.row.id)}>解除关联</a></span>
      }
    },
  ]
  return (
    <Style>
      <CardMain>
        <CardContentTitle>
          <div>
            <Button style={{ marginRight: 20 }} theme="primary" onClick={() => openRelateParts()} >关联零部件</Button>
            <Radio.Group value={listRadioV} onChange={(v) => handleRadioChange(v)}>
              <Radio.Button value="ecu">ECU</Radio.Button>
              <Radio.Button value="cloud">TSP</Radio.Button>
              <Radio.Button value="mobile">移动端</Radio.Button>
            </Radio.Group>
          </div>
          <Input
            type="search"
            placeholder="请输入你需要搜索的零部件"
            className="input-search"
            value={searchValueText}
            onChange={(value) => setSearchValueText(value.toString())}
            suffixIcon={<SearchIcon onClick={() => handleNameSearch()} style={{ cursor: 'pointer' }} />}
          ></Input>
        </CardContentTitle>
        <TableContent>
          {listRadioV==='ecu'? <div className="select-group">
          <SelectTitle >系统类型</SelectTitle>
            <Select
              value={systemIds}
              minCollapsedNum={1}
              onChange={carModelOnChange}
              placeholder="请选择系统类型"
              multiple
              style={{ width: "200px", marginRight: 32,marginBottom:24 }}
              options={modesOptions}
            />
            <Button theme='primary'  onClick={() => handleSearch()}>查询</Button>
            <Button theme='default' style={{ marginLeft: 8 }} onClick={() => reseatSelectGroup()}>重置</Button>
          </div>:null}
          <Table
            rowKey="id"
            data={list}
            loading={tableLoading}
            //@ts-ignore
            columns={columnsFilter(columns)}
            multipleSort={true}
            onSelectChange={onSelectChange}
            selectedRowKeys={selectedRowKeys}
            // sort={sort} //后端排序时 打开
            onSortChange={(sort) => { setSort(sort) }}
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
        </TableContent>
      </CardMain>
    </Style>
  )
}