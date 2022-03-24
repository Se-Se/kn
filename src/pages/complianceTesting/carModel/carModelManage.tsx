import React, { useState, useEffect } from 'react';
import { Localized, useGetMessage } from 'i18n';
import { Layout, Progress, Card, Table, Icon, Button, Modal, Status, notification } from '@tencent/tea-component';
import { AddNewCarModelModal } from './addNewCarModelModal';
import { EditNewCarModelModal } from './editNewCarModelModal';
import { useGetCarInfoListQuery, useDelCarInfoMutation, Order, useCollectorCarInfoMutation } from 'generated/graphql';
import { CmdModal } from './cmdModal';
const { pageable, autotip, columnsResizable, expandable } = Table.addons;
const { Content, Body } = Layout;


export const Page: React.FC = () => {
  const [deleteCarInfo] = useDelCarInfoMutation();
  // const [editCarInfo] = useEditCarInfoMutation();
  const [collectCarInfo] = useCollectorCarInfoMutation();
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const getValue = useGetMessage();
  const teamId = 'team_items;1';
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
  const [carListDataCount, setCarListDataCount] = useState<number>(0)
  const carListHook = useGetCarInfoListQuery({ variables: { teamId: teamId, search: pageQueryInfo } });
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['id']);
  const [selectItem, setSelectItem] = useState<any>({});
  const [isShowCmdModal, setIsShowCmdModal] = useState<boolean>(false);
  const [selectModelId, setSelectModelId] = useState<string>('');
  const [ticker, setTicker] = useState<any>('');

  const deleteFn = async (id: string) => {
    const yes = await Modal.confirm({
      message: getValue('compliance-deleteConfirm'),
      description: getValue("compliance-carModelDeleteDesc"),
      okText: getValue("operation-delete"),
      cancelText: getValue("modal-cancel"),
    });
    if (yes) {
      await deleteCarInfo({
        variables: {
          teamId: teamId,
          id: id
        }
      }).then(() => {
        notification.success({
          description: getValue('compliance-oprationSuccess')
        })
      }).catch((error) => {
        notification.error({
          description: error.toString()
        })
      })
      carListHook.refetch();
    }

  };
  const startCollect = async (value: any) => {
    const yes = await Modal.confirm({
      message: getValue('compliance-recollectConfirm'),
      description: getValue("compliance-recollectDesc"),
      okText: getValue("compliance-startCollect"),
      cancelText: getValue("modal-cancel"),
    });
    if (yes) {

      if (value.modelType === "Android") {
        await collectCarInfo({
          variables: {
            teamId: teamId,
            id: value.id
          }
        }).then(() => {
          carListHook.refetch();
        }).catch((error) => {

          notification.error({
            description: error.toString()
          });
        })
      }
      else {
        setSelectModelId(value.id);
        setIsShowCmdModal(true);
      }
    }
  }
  // const [editIndex, setEditIndex] = useState<string>('');
  // const [editValue, setEditValue] = useState<string>('');

  const carModelColumns = [
    {
      key: "carName",
      header: getValue('compliance-columnCarModel')
    }, {
      key: "createUser",
      header: getValue('column-creator')
    }, {
      key: "createTime",
      header: getValue('column-createTime')
    }, {
      key: "checkResult",
      header: getValue('column-operation'),
      width: 150,
      render: (value: any) => {

        return <div>
          {/* <Button type="link" style={{ marginLeft: 10 }} onClick={(e) => { startCollect(value.id) }}>
            {value.collectStatus == 0 ? <Localized id='compliance-startCollect'></Localized> :
              <Localized id='compliance-resetCollect'></Localized>}

          </Button> */}
          <Button type="link" style={{ marginLeft: 10 }} onClick={(e) => { setSelectItem(value); setIsShowEdit(true) }}>
            {value.collectStatus === 0 ? <Localized id='operation-edit'></Localized> :
              <Localized id='operation-edit'></Localized>}

          </Button>
          <Button type="link" style={{ marginLeft: 10 }} onClick={(e) => { deleteFn(value.id) }}>
            <Localized id='operation-delete'></Localized>
          </Button>
        </div>
      }
    }
  ];
  const [carModelList, setCarModelList] = useState<any[]>([]);

  useEffect(() => {
    carListHook.refetch({ teamId: teamId, search: pageQueryInfo })
  }, [pageQueryInfo]);
  useEffect(() => {
    setCarModelList(carListHook.data?.getCarInfoList?.carInfoList || []);
    setCarListDataCount(carListHook.data?.getCarInfoList?.count || 0);
  }, [carListHook.data])



  const subTableColumns = [
    {
      key: "modelType",
      header: '零部件类型',
      width: 100
    }, {
      key: "modelName",
      header: getValue('compliance-carParts'),
      width: 150
    }, {
      key: "version",
      header: getValue('compliance-versionNum'),
      width: 80
    }, {
      key: "collectorProgress",
      header: getValue('compliance-collectProgress'),
      width: 250,
      render: (value: any) => {
        const statusDom = <>
          {
            value.collectStatus === 0 ? <div><Icon style={{ marginLeft: 10, marginRight: 10 }} type='pending-gray' /><Localized id="compliance-unstart"></Localized></div> :
              value.collectStatus === 1 ? <div><Icon style={{ marginLeft: 10, marginRight: 10 }} type='pending' /><Localized id="compliance-collecting"></Localized></div> :
                value.collectStatus === 2 ? <div><Icon style={{ marginLeft: 10, marginRight: 10 }} type='success' /><Localized id="compliance-collectDone"></Localized></div> :
                  value.collectStatus === 3 ? <div><Icon style={{ marginLeft: 10, marginRight: 10 }} type='error' /><Localized id="compliance-collectFailed"></Localized></div> :
                    value.collectStatus === 4 ? <div><Icon style={{ marginLeft: 10, marginRight: 10 }} type='pending' /><Localized id="compliance-collecting"></Localized></div> : null
          }
        </>
        return <div style={{ display: 'flex', alignItems: 'center' }}>
          {
            value.collectType !== 'Others' ? <><Progress style={{ marginBottom: 0, width: '60%' }} percent={value.collectorProgress} ></Progress>
              <span>{value.collectorProgress + '%'}</span>
              {statusDom}</> : null
          }
        </div>
      }
    }, {
      key: "checkResult",
      header: getValue('column-operation'),
      width: 80,
      render: (value: any) => {

        return <div>
          <Button disabled={value.collectType === 'Others'} type="link" style={{ marginLeft: 10 }} onClick={(e) => { startCollect(value) }}>
            {value.collectStatus === 0 ? <Localized id='compliance-startCollect'></Localized> :
              <Localized id='compliance-resetCollect'></Localized>}
          </Button>
        </div>
      }
    }
  ];

  const renderSubTable = (record: any) => {
    return <div>
      <Table addons={[]} columns={subTableColumns} records={record.carInfoItem}></Table>
    </div>;
  };
  useEffect(()=>{
    return ()=>{
      window.clearInterval(ticker);
    }
  },[ticker])
  useEffect(() => {
    if(!ticker){
      let tickerId = setInterval(() => {
        carListHook.refetch();
      }, 1000);
      setTicker(tickerId);
    }
  }, [])
  return <>
    <Body>
      <Content>
        <Content.Header
          title={<Localized id='compliance-checkConfig-carModule'></Localized>}
        ></Content.Header>
        <Content.Body full>
          <Button type="primary" onClick={() => {
            setIsShowAdd(true);
          }}><Localized id="compliance-addNewCar"></Localized></Button>
          <Card>
            <Table columns={carModelColumns} style={{ marginTop: 20 }}
              records={carModelList}
              recordKey="id"
              addons={[
                pageable({
                  recordCount: carListDataCount,
                  onPagingChange: (value) => {
                    let query = pageQueryInfo;
                    query.offset.offset = (value.pageIndex as number - 1) * (value.pageSize as number);
                    query.offset.limit = value.pageSize;
                    setPageQueryInfo(JSON.parse(JSON.stringify(query)))
                  }
                }),
                columnsResizable({
                  minWidth: 100,
                  maxWidth: 1000,
                  onResizeEnd: columns => {
                  },
                }),
                autotip({
                  emptyText: <div>
                    <Status icon={'blank'} title={<Localized id="compliance-nodata"></Localized>}></Status>
                  </div>,
                }),
                expandable({
                  expandedKeys: expandedKeys,
                  render(record) {
                    const subtable = renderSubTable(record);
                    return subtable
                  },
                  onExpandedKeysChange: (keys, { event }) => {
                    setExpandedKeys(keys)
                  }
                }),
              ]}></Table>

          </Card>
        </Content.Body>
      </Content>
    </Body>
    <AddNewCarModelModal refreshFn={() => { carListHook.refetch() }} isShow={isShowAdd} setIsShowAddDialog={setIsShowAdd}></AddNewCarModelModal>
    <EditNewCarModelModal selectItem={selectItem} refreshFn={() => { carListHook.refetch() }} isShow={isShowEdit} setIsShowAddDialog={setIsShowEdit}></EditNewCarModelModal>
    <CmdModal modelId={selectModelId} isShow={isShowCmdModal} setIsShowAddDialog={setIsShowCmdModal}></CmdModal>
  </>
}