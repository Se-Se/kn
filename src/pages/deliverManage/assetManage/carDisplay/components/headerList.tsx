import React, { useState } from 'react';
import style from '@emotion/styled/macro';
import car from '../../../images/car.svg';
import grayCar from '../../../images/grayCar.svg';
import toTop from '../../../images/toTop.svg';
import toTopGray from '../../../images/toTopGray.svg';
import { IconFont } from 'tdesign-icons-react';
const Style = style.div`

`;
const Content = style.div`
  width:100%;
  background-color:#fff;
  position:absolute;
  z-index:10;
  top:1px;
  left:0px;
  padding:20px;
  padding-bottom:0px;
  color:#808080;
  .active{
    border-color:#0052D9;
    color:#0052D9;
}
  .top{
    
    padding-bottom:8px;
    .title{
        margin-bottom:10px;
        color: rgba(0,0,0,0.9);
    }
  }
  .list-content{
      display:flex;
      justify-content:flex-start;
      flex-wrap: wrap;
  }

  .group{
    max-height:280px;
    padding-top:16px;
    overflow-y: auto;
    border-top:1px solid #ccc;
    .group-inner{
    .title{
        margin-bottom:10px;
        color: rgba(0,0,0,0.9);
        }
      .group-inner-list{
        display:flex;
        justify-content:flex-start;
        flex-wrap: wrap;
        padding-bottom:8px;
      }
    }
 
  }
  .group::-webkit-scrollbar {/*滚动条整体样式*/
    width: 8px;     
    height: 1px;
  }
  .group::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 8px;
    background: #eee;
  }
  .group::-webkit-scrollbar-track {/*滚动条里面轨道*/
    border-radius: 8px;
    width:10px;
  }
`;
const ListItem = style.div`
    min-width:132px;
    height: 32px;
    border-radius: 2px;
    border: 1px solid #DCDCDC;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0,0,0,0.6);
    background: rgba(255,255,255,1);
    margin-right:16px;
    margin-bottom:16px;
    position:relative;
    padding:5px 10px;
    line-height:32px;
    text-indent:10px;
    cursor:pointer;
    .car-img{
        position:absolute;
        top:50%;
        left:10px;
        transform:translateY(-50%);
    }
    .name{
      width:100%;
      overflow:hidden;
      height:100%;
      line-height:18px;
      text-indent:18px;
      word-break: break-all;
  }
  .right-top-icon{
      color:#CB212A;
      width:5px;
      height:5px;
      position:absolute;
      top: -8px;
      right: 12px;
      font-size:14px;
      cursor:pointer;
  }
  .right-top-icon-add{
    position:absolute;
    top: -8px;
    right: -8px;  
    cursor:pointer;
  }

  .right-top-icon-added{
    position:absolute;
    top: -8px;
    right: -8px;  
  }

`
type Props = {
    topList: any;
    groupList: any;
    changeCar: (v: any) => void;
    show: boolean;
    edit: boolean;
    addChange: (v: any, data: any) => void;
    deleteChange: (v: any) => void;
};


export const HearderList: React.FC<Props> = (props: Props) => {
    const [activeId, setActiveId] = useState<any>(null);

    // 添加到置顶
    const addToTop = (data: any) => {
        console.log('groupList', props.groupList)
        const group: any = props.groupList.map((item: any) => {
            item.carModelList = item.carModelList.map((c: any) => {
                if (c.id === data.id) {
                    c.isAdded = true;
                }
                return c;
            });
            return item;
        });
        console.log('group', group);
        props.addChange(group, data);
    }

    // 删除置顶
    const deleteTopItem = (data: any) => {
        console.log('deleteTopItem', data);
        props.deleteChange(data)

    }


    // 点击车卡片
    const itemClick = (item: any) => {
        console.log('id', item.id)
        setActiveId(item.id);
        props.changeCar(item.name);
    }

    const breadcrumbFn = () => {
        return (

            <Content>
                <div className='top'>
                    <div className='title'>置顶车型</div>
                    <div className='list-content'>
                        {props.topList.map((item: any) => {
                            return (
                                <ListItem
                                    onClick={() => itemClick(item)}
                                    className={`${activeId === item.id ? 'active' : ''}`}
                                    key={item.id}>
                                    <img className='car-img' src={activeId === item.id ? car : grayCar} />
                                    <div className='name'>{item.name}</div>
                                    {props.edit ? <IconFont name="close-circle-filled" className='right-top-icon' onClick={() => deleteTopItem(item)} /> : null}
                                </ListItem>
                            )
                        })}
                    </div>
                </div>
                {props.show ? <div className='group'>
                    {props.groupList.map((g: any) => {
                        return (
                            <div key={g.carModelGroupId}>
                                {g.carModelList?.length ? (<div className='group-inner'>
                                    <div className='title'>{g.carModelGroupName}</div>
                                    <div className='group-inner-list'>
                                        {g.carModelList.map((c: any) => {
                                            return (
                                                <ListItem
                                                    onClick={() => itemClick(c)}
                                                    className={`${activeId === c.id ? 'active' : ''}`}
                                                    key={c.id}>
                                                    <img className='car-img' src={activeId === c.id ? car : grayCar} />
                                                    <div className='name'>{c.name}</div>
                                                    {props.edit ? (!c.isAdded ? <img src={toTop} onClick={() => addToTop(c)}  className='right-top-icon-add' /> : <img src={toTopGray} className='right-top-icon-added' />) : null}
                                                </ListItem>
                                            )
                                        })}
                                    </div>
                                </div>) : null}
                            </div>
                        )
                    })}
                </div> : null}

            </Content>
        )
    }
    return (
        <Style>
            {breadcrumbFn()}
        </Style>
    );
};
