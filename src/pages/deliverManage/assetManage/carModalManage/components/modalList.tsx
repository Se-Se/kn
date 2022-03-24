import React, { useEffect, useState } from 'react';
import { Button, Dropdown, List, Popup, Input, message, Dialog } from 'tdesign-react';
import style from '@emotion/styled/macro';
import { IconFont, FolderOpenIcon, Icon } from 'tdesign-icons-react';
import { deleteCarGroupApi, deleteCarMode, relationCarModelGroup } from 'pages/deliverManage/util/carModalApi/api';
import { editCarGroup } from '../../../util/carModalApi/api';
import car from '../../../images/car.svg'
import { OptionType } from '../index';

const { DropdownMenu, DropdownItem } = Dropdown;

const { ListItem } = List;

const Style = style.div`
width:100%;
height:100%;
.t-list{
  width:100%;
  height:calc(100% - 20px);
  background-color:#fff;
}
.content-item{
  width:100%;
  .item-inner{
    display:flex;
    justify-content: flex-start;
  }
}
.t-list-item{
  cursor:pointer;
  padding: 10px;
}
.t-list-item:hover{
  background-color:rgb(0 ,110 ,255 ,0.3);
}
.active.t-list-item{
  background-color:rgb(0 ,110 ,255 ,0.3);
}
.create-text{
  color:#006eff;
  cursor:pointer;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  background-color: #f3f4f7;
}
.group-list-content{
  height: 100%;
  overflow-y: auto;
  background-color:#fff;
}

`
const ItemIcon = style.span`
 margin-right:10px;
`
const ItemInfo = style.div`
 width:100%;
.name-content{
  display:flex;
  justify-content: space-between;
}
.item-title{
  display:flex;
  align-items: center
}
.item-name{
  margin-left:3px
}
.info-tag{
  display:inline-block;
}
.info-item{
  color:#00000066;
  font-size:12px;
  margin-left:18px;
}
`
const ListGroupTitle = style.div`
  display: flex;
  width: 100%;
  height: 40px;
  line-height:40px;
  padding:5px 10px;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color:#fff;
  font-weight: bold;
  line-height: 30px;
  font-size: 14px;
  border-bottom: 1px solid #e7eaef;
`;

const ListGroup = style.div`

`

type Props = {
  list: any[],
  edit: (v: any, CarModelGroupId: number) => any,
  createNew: (v: any) => any,
  carModleClick: (v: any) => any,
  getList: () => void,
  carModelList: OptionType[]
}
export const ModalList: React.FC<Props> = (props: Props) => {
  const [list, setList] = useState<any>([]);
  const [, update] = useState<any>(null);
  const [activeId, setActiveId] = useState<any>(''); //当前点击的列表id
  const [mouseOverId, setMouseOverId] = useState<string>('');
  const [editGroupNameId, setEditGroupNameId] = useState<string>('')
  const [editGroupNameText, setEditGroupNameText] = useState<string>('')
  const [effectCount, setEffectCount] = useState<number>(0);
  const [deleteDialog, setDeleteDialog] = useState<any>(false);
  const [deleteId, setDeleteId] = useState<any>(null);
  const [deleteGroupDialog, setDeleteGroupDialog] = useState<any>(false);
  const [deleteGroupId, setDeleteGroupId] = useState<any>(null);

  // 页面初次加载
  useEffect(() => {
    getData();
    setEffectCount(effectCount + 1)
  }, [props.list]);

  // 获取列表信息
  const getData = () => {
    setList(formatterList(props.list) || []);
  }

  // 格式化列表信息
  const formatterList = (data: any) => {
    const listArr: number[] = []
    list.map((item: any) => {
      if (item.show) {
        listArr.push(item.CarModelGroupId)
      }
    })
    let flagNum: any = 0;
    return data.map((item: any) => {
      if (effectCount == 0) {
        item.show = false;
      }
      else {
        listArr.map((listId) => {
          if (item.CarModelGroupId === listId) {
            item.show = true
          }
        })
      }
      if (item.carModelList?.length && flagNum === 0) {
        flagNum++;
        item.show = true;
        item.carModelList.forEach((i: any, index: number) => {
          if (index === 0) {
            setActiveId(i.id);
            props.carModleClick(i.id);
            return;
          }
        })
      }
      return item;
    })
  }

  // 箭头点击展开合并 
  const arrowClick = (data: any) => {
    console.log('arrow', data)
    let newList: any = list.map((item: any) => {
      if (item.CarModelGroupId === data.CarModelGroupId) {
        item.show = !item.show;
      };
      return item;
    })
    setList(newList);
  }

  // 新建车型
  const createCarModal = (data: any) => {
    props.createNew(data)
  }

  // 点击左侧列表
  const handleClickItem = (data: any) => {
    console.log('handleClickItem', data);
    setActiveId(data.id);
    props.carModleClick(data.id);
  }

  const handleEdit = (i: any, CarModelGroupId: number) => {
    console.log('edit', i);
    props.edit(i, CarModelGroupId);
  }
  const contentOnmouseOver = (id: string) => {
    setMouseOverId(id)
  }

  const editCarGroupName = (data: any) => {
    setEditGroupNameId(data.carModelGroupName)
    setEditGroupNameText(data.carModelGroupName)
  }
  const deleteCarGroup = async (id: string) => {
    console.log(id)
    try {
      const resp: any = await deleteCarGroupApi({ idList: [id] })
      if (resp.code === 0) {
        message.success('删除成功')
        props.getList()
      }
      else {
        message.error('删除失败')
      }
    }
    catch (e) {
      message.error('删除失败')
      console.log(e)
    }

  }

  const editCarGroupText = async (id: number) => {
    try {
      const data = {
        idList: [id],
        carModelGroupName: editGroupNameText
      }
      const resp: any = await editCarGroup(data)
      if (resp.code === 0) {
        message.success('编辑成功')
        setEditGroupNameId('')
        props.getList()
      }
      else {
        message.error('编辑成功')
      }
    }
    catch (e) {
      message.error('编辑成功')
      console.log(e)
    }
  }


  const relationCarModelGroupApi = async (carModeGroupId: number, carModelId: number) => {
    try {
      const resp: any = await relationCarModelGroup({ carModeGroupId, carModelId })
      if (resp.code === 0) {
        console.log('关联成功')
        message.success('关联成功')
        props.getList()
      }
    } catch (error: any) {
      message.error('关联失败')
      console.error(error.toString())
    }
  }
  const contentNode = (i: any, CarModelGroupId: number) => {
    return (
      <div className='content-item' onMouseEnter={() => { contentOnmouseOver(i.id) }} onMouseLeave={() => setMouseOverId('')}>
        <div className='item-inner'>
          <ItemInfo>
            <div className='name-content'>
              <div className='item-title'><img src={car} /><span className='item-name'>{i.name}</span></div>
              {mouseOverId == i.id &&
                <div>
                  <IconFont name="edit" size="1.2em" onClick={() => handleEdit(i, CarModelGroupId)} style={{ color: '#0354d9' }} />
                  <IconFont name="delete" size="1.2em" onClick={() => handleDeleteCar(i.id)} style={{ marginLeft: 10, color: '#0354d9' }} />
                  <Dropdown >
                    <IconFont name="folder-add" size="1.2em" style={{ marginLeft: 10, color: '#0354d9' }} />
                    <DropdownMenu>
                      {props.carModelList.map((item, index) =>
                        <DropdownItem key={index} onClick={() => relationCarModelGroupApi(item.value, i.id)} >
                          {item.label}
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              }
            </div>
            <div className='info-item'>
              <div className='info-tag'>创建人：</div><span >{i.createUserName}</span>
            </div>
            <div className='info-item'>
              <div className='info-tag'>创建时间：</div><span>{i.createTimeFormat}</span>
            </div>
          </ItemInfo>
        </div>
      </div>
    )
  }
  const deleteCarModeApi = async (carModeId: number) => {
    try {
      const resp: any = await deleteCarMode({ idList: [carModeId] })
      if (resp.code === 0) {
        message.success('删除成功')
        props.getList()
      } else {
        message.error('删除失败')
      }
    } catch (error) {
      message.error('删除失败')
      console.log(error)
    }
  }

  // 删除车模型
  const handleDeleteCar = (id: any) => {
    setDeleteId(id);
    setDeleteDialog(true);

  }
  // 删除确认
  const handleDeleteConfirm = () => {
    deleteCarModeApi(deleteId);
    setDeleteId(null);
    setDeleteDialog(false);
  }
  // 删除dialog 关闭
  const deleteDialogClose = () => {
    setDeleteDialog(false);
    setDeleteId(null);
  }

  // 删除车型组
  const handleDeleteCarGroup = (id: any) => {
    setDeleteGroupId(id);
    setDeleteGroupDialog(true);
  }
  // 确认删除车型组
  const handleDeleteGroupConfirm = () => {
    deleteCarGroup(deleteGroupId);
    setDeleteGroupId(null);
    setDeleteGroupDialog(false);
  }

  // 删除dialog 关闭
  const deleteGroupDialogClose = () => {
    setDeleteGroupDialog(false);
    setDeleteGroupId(null);
  }
  return (
    <Style>
      <div className='group-list-content'>
        {list.map((item: any) => {
          return (
            <div key={item.CarModelGroupId}>
              <ListGroupTitle onClick={() => arrowClick(item)}>
                <div style={{ display: 'flex' }}>
                  <ItemIcon onClick={(e) => e.stopPropagation()}>
                    <FolderOpenIcon />
                  </ItemIcon>
                  {editGroupNameId == item.carModelGroupName ?
                    <span onClick={(e) => e.stopPropagation()}>
                      <Input value={editGroupNameText}
                        onChange={(value) => { setEditGroupNameText(value.toString()) }}
                        style={{ width: 160 }}
                        onBlur={() => { editCarGroupText(item.CarModelGroupId) }}
                        autofocus />
                    </span> :
                    <span onClick={(e) => e.stopPropagation()}>{item.carModelGroupName}</span>}</div>
                <div>
                  <IconFont name={item.show ? 'caret-left-small' : 'caret-down-small'} size="1.2em" style={{ marginLeft: 10, cursor: 'pointer' }} />
                  {item.CarModelGroupId !== 0 &&
                    <span onClick={(e) => e.stopPropagation()}>
                      <Dropdown >
                        <Button theme="default" variant="text" style={{ padding: 0 }}>
                          <Icon name="ellipsis" size="16" />
                        </Button>
                        <DropdownMenu>
                          <DropdownItem onClick={() => editCarGroupName(item)}>
                            编辑名称
                          </DropdownItem>
                          <DropdownItem onClick={() => handleDeleteCarGroup(item.CarModelGroupId)}>
                            删除
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </span>
                  }
                </div>

              </ListGroupTitle>
              {item.show ? (
                <ListGroup  >
                  <List split={true}>
                    {item.carModelList.map((i: any) => (
                      <div key={i.id} onClick={() => handleClickItem(i)}>
                        <ListItem className={activeId === i.id ? 'active' : ''} content={
                          i.remark ?
                            <Popup overlayStyle={{ width: 200 }} style={{ width: '100%' }} content={i.remark} placement="right" showArrow destroyOnClose>
                              {contentNode(i, item.CarModelGroupId)}
                            </Popup>
                            :
                            contentNode(i, item.CarModelGroupId)


                        } ></ListItem>
                      </div>
                    ))}
                  </List>
                </ListGroup>
              ) : null}
            </div>
          )
        })}
      </div>
      <Dialog header="确认删除车型?" onConfirm={() => handleDeleteConfirm()} visible={deleteDialog} onClose={() => deleteDialogClose()} />
      <Dialog header="确认删除车型组?" onConfirm={() => handleDeleteGroupConfirm()} visible={deleteGroupDialog} onClose={() => deleteGroupDialogClose()} />
    </Style>
  );
}