import React from 'react';
import { ReactShape } from '@antv/x6-react-shape';
import style from '@emotion/styled/macro';
import '@antv/x6-react-shape'

import componentBg from '../../images/visual/smallComponent/icon_component_bg.svg'
import routerComponent from '../../images/visual/smallComponent/icon_component_router.svg'
import satelliteComponent from '../../images/visual/smallComponent/icon_component_satellite.svg'
import obdComponent from '../../images/visual/smallComponent/icon_component_OBD.svg'
import chargerComponent from '../../images/visual/smallComponent/icon_component_charging.svg'

import wifiComponent from '../../images/visual/smallComponent/img_Wi_Fi.svg'
import blueToothComponent from '../../images/visual/smallComponent/img_Bluetooth.svg'
import usbComponent from '../../images/visual/smallComponent/img_USB.svg'
import cellularComponent from '../../images/visual/smallComponent/img_cellular.svg'

import greenCloudComponent from '../../images/visual/icon_component_cloud.svg'
const ComponentTitle = style.div`
  display:flex;
  height:41px;
  align-items:center;
  padding-left:15px;
`;

const ComponentTitleSpan = style.div`
  font-family:'Noto Sans SC';
  font-style:normal;
  font-size:12px;
  margin-top:5px;
  width:7em;
  text-align:center
`;

const ComponentWarpper = style.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

`

interface shapeProps {
  node?: ReactShape;
}
const componentArr = [
  {
    type:'router',
    label:'路由器',
    src:routerComponent
  },
  {
    type:'cloud',
    label:'外部云',
    src:greenCloudComponent
  },
  {
    type:'satellite',
    label:'卫星',
    src:satelliteComponent
  },
  {
    type:'obd',
    label:'OBD',
    src:obdComponent
  },
  {
    type:'charger',
    label:'外部无线充电器',
    src:chargerComponent
  },
  {
    type:'wifi',
    label:'',
    src:wifiComponent
  },
  {
    type:'usb',
    label:'',
    src:usbComponent
  },
  {
    type:'bluetooth',
    label:'',
    src:blueToothComponent
  },
  {
    type:'cellular',
    label:'',
    src:cellularComponent
  },
  
]
export class SmallComponent extends React.Component<shapeProps> {
  shouldComponentUpdate(nextprops:any,nextstate:any) {
    console.log(nextprops)
    const node = this.props.node;
    console.log(node)
    if (node) {
      if (node.hasChanged("data")) {
        return true;
      }
    }

    return false;
  }

  makeComponent=()=>{
    const {isHasBg}=this.props.node?.data
    if(isHasBg){
      return(
       <div style={{backgroundImage:`url(${componentBg})`,width:'100%',height:'100%'}}>
        {this.makeBgComponent()}
      </div>)
    }
    else{
      return <div>{this.makeNoBgComponent()}</div>
    }
  }

  makeBgComponent=()=>{
    const data = this.getComponentDetail()
    return(
      <ComponentWarpper>
        <img src={data.imgSrc} style={{marginTop:5,height:32,width:32}}/>
        <ComponentTitleSpan>
          {data.text}
        </ComponentTitleSpan>
      </ComponentWarpper>
    )
  }

  getComponentDetail=()=>{
    const {data}=this.props.node?.data
    const {type}=data
    let text = ''
    let imgSrc = ''
    componentArr.map((item)=>{
      if(item.type===type){
        imgSrc=item.src
        text=item.label
      }
    })
    return {text,imgSrc}
  }
  makeNoBgComponent=()=>{
    const data = this.getComponentDetail()
    return <img src={data.imgSrc}/>
  }

  render() {
    const {data}=this.props.node?.data
    return <>{this.makeComponent()}</>;
  }
}
