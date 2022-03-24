import React from 'react';
import { ReactShape } from '@antv/x6-react-shape';
import style from '@emotion/styled/macro';

import componentBg from '../../images/smallComponent/icon_component_bg.svg'
import routerComponent from '../../images/smallComponent/icon_component_router.svg'
import satelliteComponent from '../../images/smallComponent/icon_component_satellite.svg'
import obdComponent from '../../images/smallComponent/icon_component_OBD.svg'
import chargerComponentBottom from '../../images/smallComponent/icon_component_charging.svg'

import greenComponentTitleBG from '../../images/icon_ecu_bg_green_top.svg'
import greenComponentCenter from '../../images/icon_ecu_bg_green_center.svg'
import greenComponentBottom from '../../images/icon_ecu_bg_green_buttom.svg'
import greenMobileComponentTitleIcon from '../../images/icon_component_phone.svg'
import greenCloudComponent from '../../images/icon_component_cloud.svg'
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
const bgArr=['router','cloud','satellite','obd','charger']
const noBgArr = ['wifi','usb','bluetooth','cellular']
export class SmallComponent extends React.Component<shapeProps> {
  shouldComponentUpdate() {
    const node = this.props.node;
    if (node) {
      if (node.hasChanged("data")) {
        return true;
      }
    }

    return false;
  }

  makeComponent=()=>{
    const {data}=this.props.node?.data
    const {type}=data
    if(bgArr.indexOf(type)>-1){
      return(
       <div style={{backgroundImage:`url(${componentBg})`,width:'100%',height:'100%'}}>
        {this.makeBgComponent()}
      </div>)
    }
    else if (noBgArr.indexOf(type)>-1){
      return <div></div>
    }
  }

  makeBgComponent=()=>{
    const {data}=this.props.node?.data
    const {type}=data
    console.log(type)
    let text = ''
    let imgSrc = ''

    switch (type) {
      case 'router':
        text = '路由器'
        imgSrc = routerComponent
        break;
      case 'cloud':
        text = '外部云'
        imgSrc = greenCloudComponent
        break;
      case 'satellite':
        text='卫星'
        imgSrc = satelliteComponent
        break;
      case 'obd':
        text='obd'
        imgSrc = obdComponent
        break;
      case 'charger':
        text = '外部无线充电器'
        imgSrc = chargerComponentBottom
        break
    }
    return(
      <ComponentWarpper>
        <img src={imgSrc} style={{marginTop:5,height:32,width:32}}/>
        <ComponentTitleSpan>
          {text}
        </ComponentTitleSpan>
      </ComponentWarpper>
    )
  }



  render() {
    const {data}=this.props.node?.data
    console.log(data)
      return <>{this.makeComponent()}</>;
    
  
  }
}
