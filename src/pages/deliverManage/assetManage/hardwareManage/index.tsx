import React, { useState, useEffect } from "react";
import { Layout } from "@tencent/tea-component";
import { Button, Dialog, Input, Select, Table, TableSort, message, Tooltip } from 'tdesign-react';
import styled from "@emotion/styled/macro";
import { SearchIcon } from 'tdesign-icons-react';
import { MyDrawer } from './components/drawer';
import { UploadDrawer } from './components/upload'
import { useHistory } from 'react-router-dom';
import { postHardwareGetList, hardwaregetGetRetrieveList, hardwaregetDelete, hardwaregetrRlationAutoParts, postHardwaregetAutoPartsListGroup } from '../../util/api';


const { Content, Body } = Layout;
const CardMain = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
`;
const CardContentTitle = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const TableContent = styled.div`
  width: 100%;
  height: 100%;
  background-color:#FFFFFF;
  margin-top:12px;
  padding-top:24px;
`;
const Style = styled.div`
  .button-margin{
    margin-left:8px;
  }
  .input-search{
    width:320px;
  }
  .select-group{
    display:flex;
    padding-left:25px;
    flex-wrap:wrap;
  }
  .select-customer{
    margin-left:20px;
  }
  .kn-button-create{
  width: 116px;
  height: 32px;
  border-radius: 3px;
  opacity: 1;
  background: rgba(0,82,217,1);
  }
  .kn-button-color-w{
    background: rgba(255,255,255,1);
  }
  .kn-dialog{
   .t-dialog__body{
     height:80px;
     padding-bottom:0px;
   }
  }
  .kn-select-200.t-popup__content{
    width:200px !important;
  }
  .tea-layout__header-title{
    padding:0px 24px;
    font-size: 14px;
    font-weight: 700;
    color:#000000;
    height:48px;
    line-height:48px;
}
`
const SelectTitle = styled.div`
  height:32px;
  line-height:32px;
  margin-right:24px;
  min-width:56px;
`
const Ellipsis = styled.div`
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
width:110px;
`
const DialogContent = styled.div`
  .t-select__wrap{
    width:322px;
    float: right;
  }
`

export const Page: React.FC = () => {
  const history = useHistory();

  const [searchValue, setSearchValue] = useState<any>({ retrieveColumn: "hardware_items.name", retrieveLike: true, retrieveValue: [] });
  const [accessory, setAccessory] = useState<any>({ retrieveColumn: 'auto_parts_items.id', retrieveValue: [], retrieveLike: false });
  const [carModel, setCarModel] = useState<any>({ retrieveColumn: 'car_model_items.id', retrieveValue: [], retrieveLike: false });
  const [category, setCategory] = useState<any>({ retrieveColumn: 'hardware_items.category', retrieveValue: [], retrieveLike: true });
  const [categoryOption, setCategoryOption] = useState<any>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState(50)
  const [sort, setSort] = useState<TableSort>([]);
  const [tableLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [drawerShowId, setDrawerShowId] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [relationParts, setRelationParts] = useState<any[]>([]);
  const [batchAccssoryLoading, setBatchAccssoryLoading] = useState<boolean>(false);
  const [uploadDrawerVisible, setUploadDrawerVisible] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [partsOptions, setPartsOptions] = useState<any>([]);
  const [modesOptions, setModesOptions] = useState<any>([]);
  const [editData, setEditData] = useState<any>({})//编辑数据
  const [partsList, setPartsList] = useState<any>([]);//获取需要绑定的零部件list
  const [deleteDialog, setDeleteDialog] = useState<any>(false);
  const [deleteId, setDeleteId] = useState<any>([]);
  const [isGroupDelete, setIsGroupDelete] = useState<any>(false);

  useEffect(() => {
    makeParams()
  }, [pageSize, current, sort]);

  // 页面初次加载
  useEffect(() => {
    initData();
    getPartsList();
  }, []);

  // 初始化加载
  const initData = () => {
    getRetrieveList()
  }

  //硬件：获取搜索框下拉列表 
  const getRetrieveList = () => {
    hardwaregetGetRetrieveList().then((res: any) => {
      if (res?.code === 0) {
        const { retrieveListAutoPartsList, retrieveListCarModelList, retrieveListHardwareCategoryList } = res;
        const parts: any = (retrieveListAutoPartsList || []).map((item: any) => {
          return { value: item.autoPartsId.toString(), label: item.autoPartsNameAndVersion };
        })
        setPartsOptions(parts || []);
        const models: any = (retrieveListCarModelList || []).map((item: any) => {
          return { value: item.carModelId.toString(), label: item.carModelNameAndVersion };
        })
        setModesOptions(models || []);

        const categorys: any = (retrieveListHardwareCategoryList || []).map((item: any) => {
          return { value: item, label: item }
        });
        setCategoryOption(categorys || []);
      }
    })
  }

  // 获取需要绑定的零部件
  const getPartsList = () => {
    postHardwaregetAutoPartsListGroup().then((res: any) => {
      if (res?.code === 0) {
        formatterPartsList(res.results || [])
      }
    })
  }
  // 格式化获取需要绑定的零部件
  const formatterPartsList = (data: any) => {
    let arr: any = [];
    data.forEach((item: any, index: number) => {
      item.children?.forEach((c: any) => {
        let obj: any = {};
        obj.value = c.value;
        obj.label = item.label + '-' + c.label;
        arr.push(obj);
      })
    });
    setPartsList(arr);
  }

  // 重置btn click
  const reseatSelectGroup = () => {
    setAccessory({ retrieveColumn: 'auto_parts_items.id', retrieveValue: [], retrieveLike: false });
    setCarModel({ retrieveColumn: 'car_model_items.id', retrieveValue: [], retrieveLike: false });
    setCategory({ retrieveColumn: 'hardware_items.category', retrieveValue: [], retrieveLike: true });
  }

  const rehandleChange = (pageInfo: { current: number, pageSize: number }) => {
    const { current, pageSize } = pageInfo;
    setCurrent(current);
    setPageSize(pageSize);
  }
  const fetchData = () => {
    makeParams();
  }
  const createHardWare = () => {
    setDrawerShowId('');
    setDrawerVisible(true)
  }
  const jumpToDetail = (id: any) => {
    history.push(`/lingshu/assetsManage/hardwareManage/hardwareDetail/${Number(id)}`);
  }
  const makeParams = () => {
    const paramArr = [accessory, carModel, searchValue, category].filter((item: any) => item.retrieveValue.length !== 0)

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

    postHardwareGetList(params).then((res: any) => {
      if (res?.code === 0) {
        const { result, count } = res;
        setTotal(count || 0);
        formatterList(result || []);
      }
    });
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

  // 根据硬件名称搜索
  const handleNameSearch = (v: any) => {
    let arr: any = [];
    if (v) {
      arr = [v]
    } else {
      arr = []
    }
    setSearchValue({
      retrieveColumn: "hardware_items.name",
      retrieveLike: true,
      retrieveValue: arr
    })

  }

  // 删除确认
  const handleDeleteConfirm = () => {
    console.log('confirm', isGroupDelete, deleteId);
    let request: any = {
      idList: [],
    };
    if (isGroupDelete) {
      let arr: any = selectedRowKeys.map((item: any) => {
        return Number(item);
      });
      request.idList = arr;
    } else {
      request.idList = deleteId;
    }
    hardwaregetDelete(request).then((res: any) => {
      if (res?.code === 0) {
        message.success('删除成功');
        makeParams();
      } else {
        message.error('删除失败');
      }
    });
    setDeleteDialog(false);
  }
  // 删除硬件
  const handleDelete = (e: any) => {
    setDeleteDialog(true);
    setDeleteId([Number(e)]);

  };
  // 批量删除
  const handleGroupDelete = () => {
    setDeleteDialog(true);
    setIsGroupDelete(true);
  };
  // 删除dialog 关闭
  const deleteDialogClose = () => {
    setDeleteDialog(false);
    setDeleteId([]);
    setIsGroupDelete(false);
  }

  // 编辑
  const handleEdit = (data: any) => {
    console.log(123123, data)
    setEditData((v: any) => {
      v = {};
      return { ...data }
    })
    setDrawerVisible(true);
    setDrawerShowId(data.id);

  }

  const columns = [
    {
      colKey: 'row-select',
      type: 'multiple',
      width: 50,
    },
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
      sorter: true
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'name',
      title: '硬件名称',
      sorter: true,
      render(cell: any) {
        return <span><a onClick={() => jumpToDetail(cell.row.id)}>{cell.row.name || '-'}</a></span>
      }
    },
    {
      align: 'left',
      width: 150,
      minWidth: 150,
      colKey: 'category',
      title: '硬件类别',
      sorter: true,
      render(cell: any) {
        return cell.row?.category || '-'
      }
    },
    {
      align: 'left',
      width: 100,
      minWidth: 100,
      colKey: 'manufacturer',
      title: '厂家',
      sorter: true,
      render(cell: any) {
        return cell.row?.manufacturer || '-'
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
      align: 'left',
      width: 150,
      minWidth: 150,
      className: 'row',
      colKey: 'remark',
      title: '备注',
      render(cell: any) {
        if (cell.row?.remark) {
          return <Tooltip
            content={cell.row?.remark}
            theme="light"
            showArrow={false}>
            <Ellipsis>
              {cell.row?.remark}
            </Ellipsis>
          </Tooltip>
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
      render(cell: any) {
        return <div><a onClick={() => handleEdit(cell.row)}>编辑</a> <a style={{ marginLeft: 10 }} onClick={() => handleDelete(cell.row?.id)}>删除</a></div>
      }
    },
  ]

  // 批量选中列表
  function onSelectChange(value: any[]) {
    setSelectedRowKeys(value);
  }

  // 硬件批量关联零部件Dialog
  const batchModal = () => {
    return (
      <Dialog
        visible={dialogVisible}
        header={"关联所属零部件"}
        className="kn-dialog"
        onClose={() => {
          setRelationParts([]);
          setDialogVisible(false);
        }}
        destroyOnClose
        width={480}
        cancelBtn={<Button theme='default' onClick={() => {
          setRelationParts([]);
          setDialogVisible(false);
        }}>取消</Button>}
        confirmBtn={<Button theme='primary' loading={batchAccssoryLoading} onClick={() => submitRelationParts()}>确认关联</Button>}
      >
        <DialogContent>
          <span>所属零部件</span>
          <Select
            multiple
            onChange={(value: any) => setRelationParts(value)}
            value={relationParts}
            options={partsList}
            placeholder="请选择"
          ></Select>
        </DialogContent>

      </Dialog>
    );
  };

  //硬件批量关联零部件
  const submitRelationParts = () => {
    let idList: any = [...selectedRowKeys];
    idList = idList.map((item: any) => Number(item));
    let request: any = {
      belongAutoPartIds: relationParts,
      idList
    }
    if (!idList.length || !relationParts.length) {
      setDialogVisible(false);
      return;
    }
    hardwaregetrRlationAutoParts(request).then((res: any) => {
      if (res?.code === 0) {
        message.success("关联成功");
        setDialogVisible(false);
        setRelationParts([]);
        makeParams();
      } else {
        message.error("关联失败");
        setDialogVisible(false);
        setRelationParts([]);
      }
    });
  }
  const accessoryOnChange = (value: any) => {
    const accessory = { retrieveColumn: 'auto_parts_items.id', retrieveValue: value, retrieveLike: false }
    setAccessory(accessory)
  }
  const carModelOnChange = (value: any) => {
    const carModel = { retrieveColumn: 'car_model_items.id', retrieveValue: value, retrieveLike: false }
    setCarModel(carModel)
  }
  const categoryChange = (value: any) => {
    const category = { retrieveColumn: 'hardware_items.category', retrieveValue: value, retrieveLike: true }
    setCategory(category)
  }


  // 保存回调
  const save = () => {
    makeParams();
  }

  // 查询btn click
  const handleSearch = () => {
    makeParams();
  }


  const handleDataChange = (data: any) => {
    console.log('data123', data)
  }
  return (
    <Style>
      <Body>
        <Content>
          <Content.Header title={'硬件管理'}></Content.Header>
          <Content.Body style={{ width: '100%', height: 'auto' }} full>
            <CardMain>
              <CardContentTitle>
                <div>
                  <Button theme="primary" className="kn-button-create" onClick={() => createHardWare()}>新建硬件资产</Button>
                  <Button theme="default" variant="outline" className="button-margin kn-button-color-w" onClick={() => setUploadDrawerVisible(true)} >
                    导入硬件资产
                  </Button>
                  <Button theme="default" variant="outline" className="button-margin kn-button-color-w" onClick={() => { setDialogVisible(true); setRelationParts([]); }} >
                    批量关联零部件
                  </Button>
                  <Button theme="default" variant="outline" className="button-margin kn-button-color-w" onClick={() => handleGroupDelete()}>
                    批量删除
                  </Button>
                </div>
                <Input
                  type="search"
                  placeholder="请输入你需要搜索的硬件资产"
                  className="input-search"
                  onChange={(value) => handleNameSearch(value)}
                  onEnter={() => fetchData()}
                  suffixIcon={<SearchIcon onClick={() => fetchData()} style={{ cursor: 'pointer' }} />}
                ></Input>
              </CardContentTitle>
              <TableContent>
                <div className="select-group">
                  <SelectTitle >硬件类别</SelectTitle>
                  <Select
                    className="kn-select-200"
                    value={category.retrieveValue}
                    onChange={categoryChange}
                    minCollapsedNum={1}
                    placeholder="请选择硬件类别"
                    multiple
                    style={{ width: 200, marginRight: 24,marginBottom:24 }}
                    options={categoryOption}
                  />
                  <SelectTitle >所属零部件</SelectTitle>
                  <Select
                    className="kn-select-200"
                    value={accessory.retrieveValue}
                    onChange={accessoryOnChange}
                    minCollapsedNum={1}
                    placeholder="请选择所属零部件"
                    multiple
                    style={{ width: "200px", marginRight: 24,marginBottom:24 }}
                    options={partsOptions}
                  />
                  <SelectTitle>所属车型</SelectTitle>
                  <Select
                    className="kn-select-200"
                    value={carModel.retrieveValue}
                    minCollapsedNum={1}
                    onChange={carModelOnChange}
                    placeholder="请选择所属车型"
                    multiple
                    style={{ width: "200px", marginRight: 32,marginBottom:24 }}
                    options={modesOptions}
                  />
                  <Button theme='primary' style={{ marginBottom:24 }}  onClick={() => handleSearch()}>查询</Button>
                  <Button theme='default' style={{ marginLeft: 8,marginBottom:24 }} onClick={() => reseatSelectGroup()}>重置</Button>
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
                  onDataChange={(v) => handleDataChange(v)}
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
      <MyDrawer categoryOption={categoryOption} optList={partsList} editData={editData} visible={drawerVisible} id={drawerShowId} save={() => save()} onClose={() => setDrawerVisible(false)}></MyDrawer>
      <UploadDrawer save={() => save()} optList={partsList} visible={uploadDrawerVisible} onClose={() => setUploadDrawerVisible(false)}></UploadDrawer>
      {batchModal()}
      <Dialog header="确认删除硬件?" onConfirm={() => handleDeleteConfirm()} visible={deleteDialog} onClose={() => deleteDialogClose()}>
      </Dialog>
    </Style>
  );
};
