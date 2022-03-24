import React, { useState, useEffect } from "react";
import { Localized } from "i18n";
import { Link, useHistory } from "react-router-dom";
import { Layout, } from "@tencent/tea-component";
import style from "@emotion/styled/macro";
import { generateLink, Pattern } from "route";
import { useGetLawListQuery } from "generated/graphql";
import { Button, Dialog, Input, message, Select, Table, TableSort, Tabs, Tooltip } from 'tdesign-react';
import { SearchIcon } from 'tdesign-icons-react';
import { MyDrawer } from './drawer';
import { UploadDrawer } from "../uploadDrawer";
import { MyCasCader } from "../cascader";
import { CheckCircleFilledIcon, TimeFilledIcon } from 'tdesign-icons-react';
import { CertificateObj, ModelList, ServiceObj, SoftWareProps } from "../type";
import { deleteSoftwareApi, getModuleList, relationSystem } from "pages/deliverManage/util/softwareApi/api";

const { TabPanel } = Tabs;

const { Content, Body } = Layout;
const CardMain = style.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;    
`;
const ButtonGroup = style.div`
 display:flex;
`
const TopGroup = style.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
`
const TableContent = style.div`
width: 100%;
height: 100%;
background-color:#FFFFFF;
margin-top:12px;
padding-top:24px;
`;
const Style = style.div`
  .tea-layout__content-body{
    padding:0
  }
  .t-tabs{
    width:100%
  }
  .tabs-content{
    margin:0px;
    padding:20px;
    background-color:#f3f4f7;
  }
  .btn-margin{
    margin-right:8px;
  }
  .select-customer{
    margin-left:20px;
  }
  .input-search{
    width:320px;
  }
  .select-group{
    display:flex;
    padding-left:25px;
    flex-wrap:wrap; 
  }
`
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
export const AppServer: React.FC<SoftWareProps> = (props: SoftWareProps) => {
  const history = useHistory();
  const [searchValueObj, setSearchValueObj] = useState<any>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [systemVersion, setSystrmVersion] = useState<any>({ retrieveColumn: "systemVersion", retrieveLike: false, retrieveValue: [] });
  const [carModel, setCarModel] = useState<any>({ retrieveColumn: 'car_model_items.id', retrieveValue: [], retrieveLike: false });
  const [accessory, setAccessory] = useState<any>({ retrieveColumn: 'auto_parts_items.id', retrieveValue: [], retrieveLike: false });
  const [pageSize, setPageSize] = useState<number>(10);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState(50)
  const [sort, setSort] = useState<TableSort>([]);
  const [list, setList] = useState<any>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [drawerShowId, setDrawerShowId] = useState<string>('');
  const [editData, setEditData] = useState<any>({})//编辑数据
  const [partsList, setPartsList] = useState<any>([]);//获取需要绑定的零部件list
  const [uploadDrawerVisible, setUploadDrawerVisible] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [batchLoading, setBatchLoading] = useState<boolean>(false);
  const [batchValue, setBatchValue] = useState<any>([]);
  const [filedParams, setFiledParams] = useState<any[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<any>(false);
  const [deleteId, setDeleteId] = useState<any>([]);

  useEffect(() => {
    fetchData()
  }, [pageSize, current, sort, filedParams, searchValueObj]);

  const makeFiledParams = () => {
    const paramArr = [accessory, carModel, systemVersion].filter((item: any) => item.retrieveValue.length !== 0)
    setFiledParams(paramArr)
  }
  const searchValueChange = (value: any) => {
    console.log(value)
    setSearchValue(value)
  }
  const handleNameSearch = () => {
    searchValue ? setSearchValueObj({
      retrieveColumn: "software_items.name",
      retrieveLike: true,
      retrieveValue: [searchValue]
    }) : setSearchValueObj(null)
  }
  const fetchData = async () => {
    const paramArr = searchValueObj ? [...filedParams, searchValueObj] : filedParams
    let params = {
      module: 'service',
      retrieve: {
        offset: {
          currentPage: current,
          pageSize: pageSize
        },
        retrieveData: paramArr,
        sortData: sort
      }
    }
    console.log('params', params);
    setTableLoading(true)
    const resp = await getModuleList(params) as ModelList<ServiceObj>
    if (resp?.code === 0) {
      resp.result.map((item: any, index: number) => {
        item.index = index + 1
      })
      setList(resp.result)
      setTableLoading(false)
      setTotal(resp.count)
    } else {
      setTableLoading(false)
      message.error(resp.msg || '网络异常')
    }
  }
  const handleSearch = () => {
    makeFiledParams()
  }
  const systemVersionOnChange = (value: any) => {
    const accessory = { retrieveColumn: 'systemVersion', retrieveValue: value, retrieveLike: false }
    setSystrmVersion(accessory)
  }
  const carModelOnChange = (value: any) => {
    const carModel = { retrieveColumn: 'car_model_items.id', retrieveValue: value, retrieveLike: false }
    setCarModel(carModel)
  }
  const accessoryOnChange = (value: any) => {
    const accessory = { retrieveColumn: 'auto_parts_items.id', retrieveValue: value, retrieveLike: false }
    setAccessory(accessory)
  }

  const rehandleChange = (pageInfo: { current: number, pageSize: number }) => {
    const { current, pageSize } = pageInfo;
    setCurrent(current);
    setPageSize(pageSize);
  }
  const reseatSelectGroup = () => {
    setAccessory({ retrieveColumn: 'auto_parts_items.id', retrieveValue: [], retrieveLike: false });
    setCarModel({ retrieveColumn: 'car_model_items.id', retrieveValue: [], retrieveLike: false });
    setSystrmVersion({ retrieveColumn: "systemVersion", retrieveLike: false, retrieveValue: [] });
  }
  const save = () => {
    fetchData()
  }
  const makeParams = () => {
    const paramArr = [accessory, carModel, systemVersion, searchValue].filter((item: any) => item.retrieveValue.length !== 0)

    let params = {
      retrieve: {
        offset: {
          currentPage: current,
          pageSize: pageSize
        },
        retrieveData: paramArr,
        sortData: sort
      }
    }
    console.log('params', params);
  }
  function onSelectChange(value: any[]) {
    setSelectedRowKeys(value);
    fetchData()
  }
  const createSoftWare = () => {
    setDrawerShowId('');
    setDrawerVisible(true)
  }
  const jumpToDetail = (id: string) => {
    history.push(`/lingshu/assetsManage/softwareManage/appserverDetail/${Number(id)}`);

  }
  const columns = [
    {
      colKey: 'row-select',
      type: 'multiple',
      width: 50,
    },
    {
      align: 'left',
      width: 100,
      maxWidth: 100,
      colKey: 'index',
      title: '序号',
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'number',
      title: '编号',
      sorter: true
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'name',
      title: '软件名称',
      sorter: true,
      //@ts-ignore
      render(context) {
        return <span><a onClick={() => jumpToDetail(context.row.id)}>{context.row.name}</a></span>
        // return 1
      }
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'serviceScene',
      title: '场景',
      sorter: true
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'servicePath',
      title: '应用路径',
      sorter: true
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'belongSystemString',
      title: '所属系统',
      sorter: true,
      render(cell: any) {
        if (cell.row?.belongSystemString !== '') {
          return <Tooltip theme="light" showArrow={false} content={cell.row?.belongSystemString}><Ellipsis>{cell.row?.belongSystemString}</Ellipsis></Tooltip>
        } else {
          return '-'
        }
      }
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'belongAutoPartsString',
      title: '所属零部件',
      sorter: true,
      render(cell: any) {
        if (cell.row?.belongAutoPartsString !== '') {
          return <Tooltip theme="light" showArrow={false} content={cell.row?.belongAutoPartsString}><Ellipsis>{cell.row?.belongAutoPartsString}</Ellipsis></Tooltip>
        } else {
          return '-'
        }
      }
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'belongCarModelString',
      title: '所属车型',
      sorter: true,
      render(cell: any) {
        if (cell.row?.belongCarModelString !== '') {
          return <Tooltip theme="light" showArrow={false} content={cell.row?.belongCarModelString}><Ellipsis>{cell.row?.belongCarModelString}</Ellipsis></Tooltip>
        } else {
          return '-'
        }
      }
    },
    {
      align: 'left',
      width: 128,
      minWidth: 128,
      className: 'row',
      colKey: 'edit',
      title: '操作',
      fixed: 'right',
      render(context: any) {
        return <span><a onClick={() => editSoftWare(context.row.id)}>编辑</a> <a onClick={() => handleDelete([context.row.id])}>删除</a></span>

      }
    },
  ]
  const editSoftWare = (id: any) => {
    setDrawerShowId(id)
    setDrawerVisible(true)
  }
  const batchModal = () => {
    return (
      <Dialog
        visible={dialogVisible}
        header={"关联所属系统"}
        onClose={() => {
          setBatchValue([]);
          setDialogVisible(false);
        }}
        destroyOnClose
        width={700}
        confirmBtn={<Button theme='primary' loading={batchLoading} onClick={submitBatchAccssory}>确认关联</Button>}
      >
        <MyCasCader
          onChange={(value) => setBatchValue(value)}
          optList={props.relationSystemGroupOptions}
          value={batchValue}
          visible={true}
          isShowWarning={false}
          width={500}
          isNotForm
        ></MyCasCader>

      </Dialog>
    );
  };
  const submitBatchAccssory = () => {
    const params = {
      softwareIds: selectedRowKeys,
      systemIds: batchValue
    }
    setBatchLoading(true)
    relationSystem(params).then((res: any) => {
      setBatchLoading(false)
      if (res.code === 0) {
        message.success('批量关联系统成功')
        setDialogVisible(false)
        fetchData()
      }
      else {
        message.error('批量关联系统失败')
      }
    })
  }
  const deleteSoftWare = (keys: string[]) => {
    deleteSoftwareApi({ idList: keys }).then((res: any) => {
      if (res.code === 0) {
        message.success('删除成功')
        fetchData()
      }
      else {
        message.error('删除失败')
      }
    })
  }

  const drawerOnClose = (isFetch: boolean) => {
    setDrawerVisible(false)
    setDrawerShowId('')

    if (isFetch) {
      fetchData()
    }
  }

  // 删除dialog 关闭
  const deleteDialogClose = () => {
    setDeleteDialog(false);
    setDeleteId([]);
  }

  // 删除确认
  const handleDeleteConfirm = () => {
    console.log('confirm', deleteId);
    if (deleteId.length) {
      deleteSoftWare(deleteId);
    } else if (selectedRowKeys.length) {
      deleteSoftWare(selectedRowKeys);
    }
    setDeleteId([]);
    setDeleteDialog(false);
  }

  // 批量删除
  const handleGroupDelete = () => {
    setDeleteDialog(true);
  };

  // 删除
  const handleDelete = (e: any) => {
    setDeleteDialog(true);
    setDeleteId([Number(e)]);
  };
  return (
    <Style>
      <Body>
        <Content>
          <Content.Body style={{ width: "100%", height: "auto" }} full>
            <CardMain>
              <TopGroup>
                <ButtonGroup>
                  <Button theme='primary' className="btn-margin" onClick={() => createSoftWare()}>新建软件资产</Button>
                  <Button theme='default' variant="outline" className="btn-margin" onClick={() => setUploadDrawerVisible(true)}>导入软件资产</Button>
                  <Button theme='default' variant="outline" className="btn-margin" onClick={() => { setDialogVisible(true); setBatchValue([]); }}>批量关联所属系统</Button>
                  <Button theme="default" variant="outline" className="btn-margin" onClick={() => handleGroupDelete()}>
                    批量删除
                  </Button>
                </ButtonGroup>
                <Input
                  type="search"
                  placeholder="请输入你需要搜索的软件资产"
                  className="input-search"
                  onChange={(value) => searchValueChange(value)}
                  value={searchValue}
                  suffixIcon={<SearchIcon onClick={() => handleNameSearch()} style={{ cursor: 'pointer' }} />}
                ></Input>

              </TopGroup>
              <TableContent>
                <div className="select-group">
                <SelectTitle >所属系统</SelectTitle>
                  <Select
                    value={systemVersion.retrieveValue}
                    onChange={systemVersionOnChange}
                    minCollapsedNum={1}
                    placeholder="请选择所属系统"
                    multiple
                    style={{ width: 200, marginRight: 24,marginBottom:24 }}
                    options={props.systemOptions}

                  />
                  <SelectTitle >所属零部件</SelectTitle>
                  <Select
                    value={accessory.retrieveValue}
                    onChange={accessoryOnChange}
                    minCollapsedNum={1}
                    placeholder="请选择所属零部件"
                    multiple
                    style={{ width: 200, marginRight: 24,marginBottom:24 }}
                    options={props.partsOptions}
                  />
                  <SelectTitle >所属车型</SelectTitle>
                  <Select
                    value={carModel.retrieveValue}
                    minCollapsedNum={1}
                    onChange={carModelOnChange}
                    placeholder="请选择所属车型"
                    multiple
                    style={{ width: 200, marginRight: 24,marginBottom:24 }}
                    options={props.modelsOptions}
                  />
                  <Button theme='primary' style={{ marginBottom:24}} onClick={() => handleSearch()}>查询</Button>
                  <Button theme='default'  style={{ marginLeft: 8,marginBottom:24}} onClick={() => reseatSelectGroup()}>重置</Button>
                </div>
                <Table
                  rowKey="id"
                  data={list}
                  loading={tableLoading}
                  //@ts-ignore
                  columns={columns}
                  multipleSort={true}
                  onSelectChange={onSelectChange}
                  selectedRowKeys={selectedRowKeys}
                  sort={sort}
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
          </Content.Body>
        </Content>
      </Body>
      <MyDrawer optList={props.relationSystemGroupOptions} visible={drawerVisible} id={drawerShowId} save={() => save()} onClose={(isFetch) => drawerOnClose(isFetch)}></MyDrawer>;
      <UploadDrawer optList={props.relationSystemOptions} visible={uploadDrawerVisible} onClose={() => setUploadDrawerVisible(false)} type='service'></UploadDrawer>
      {batchModal()}
      <Dialog header="确认删除软件?" onConfirm={() => handleDeleteConfirm()} visible={deleteDialog} onClose={() => deleteDialogClose()} />
    </Style>
  );
};


