import React from 'react';
import { ReactShape } from '@antv/x6-react-shape';
import style from '@emotion/styled/macro';

import blueComponentWithNoSystem from '../../images/ecu_component_no_system.svg'
import blueEcuComponentTitleIcon from '../../images/icon_component_ecu.svg'
import blueComponentTitleBG from '../../images/icon_ecu_bg_blue_top.svg'
import blueComponentCenter from '../../images/icon_ecu_bg_blue_center.svg'
import blueComponentBottom from '../../images/icon_ecu_bg_blue_buttom.svg'

import greenComponentTitleBG from '../../images/icon_ecu_bg_green_top.svg'
import greenComponentCenter from '../../images/icon_ecu_bg_green_center.svg'
import greenComponentBottom from '../../images/icon_ecu_bg_green_buttom.svg'
import greenMobileComponentTitleIcon from '../../images/icon_component_phone.svg'
import greenCloudComponentTitleIcon from '../../images/icon_component_cloud.svg'
const ComponentTitle = style.div`
  display:flex;
  height:41px;
  align-items:center;
  padding-left:15px;
`;

const ComponentTitleSpan = style.span`
  font-family:'Noto Sans SC';
  font-style:normal;
  font-size:16px;
  font-weight:bold;
  margin-left:15px;

`;

const ComponentCenter = style.div`
  display:flex;
  align-items:center;
  justify-content: center;
  font-family:'Noto Sans SC';
  font-size:12px;
`

interface shapeProps {
  node?: ReactShape;
}

export class CircleComponent extends React.Component<shapeProps> {
  shouldComponentUpdate() {
    const node = this.props.node;
    if (node) {
      if (node.hasChanged("data")) {
        return true;
      }
    }

    return false;
  }
  hasNoSystem = () => {
    const {componentName} = this.props.node?.data.data
    return (
      <>
        <div
          style={{
            backgroundImage: `url(${blueComponentWithNoSystem})`,
            height: "100%",
            width: "100%",
            lineHeight: "36px",
          }}
        >
          <ComponentTitleSpan style={{marginLeft:35}}>
            {componentName}
          </ComponentTitleSpan>
        </div>
      
      </>
    );
  };
  titleIcon=()=>{
    const {type} = this.props.node?.data
    let img = ''
    switch (type) {
      case 'ecu':
        img= blueEcuComponentTitleIcon
        break;
      case 'mobile':
        img= greenMobileComponentTitleIcon
        break;
      case 'cloud':
        img= greenCloudComponentTitleIcon
        break;
    }
    return img
  }
  hasSystem = () => {
    const {data,type} = this.props.node?.data
    const {componentName,system} = data
    return (
      <>
        <ComponentTitle style={type ==='ecu'?{ backgroundImage: `url(${blueComponentTitleBG})`}:{ backgroundImage: `url(${greenComponentTitleBG})`}}>
          <img src={this.titleIcon()}/>
          <ComponentTitleSpan>{componentName}</ComponentTitleSpan>         
        </ComponentTitle>
        {system.map((item:string,index:number)=>
            index!==system.length-1?
            <ComponentCenter style={{backgroundImage:type ==='ecu'? `url(${blueComponentCenter})`:`url(${greenComponentCenter})`,height:42}} key={index}>
              {item}
            </ComponentCenter>:
            <ComponentCenter style={{backgroundImage:type ==='ecu'? `url(${blueComponentBottom})`:`url(${greenComponentBottom})`,height:41}} key={index}>
            {item}
          </ComponentCenter>
            
          )}
        <></>
      </>
    )
  };
  render() {
    const {data}=this.props.node?.data
    if(data.system.length>0){
      return <>{this.props.node?.data&&this.hasSystem()}</>
    }
    else {
      return <>{this.props.node?.data&&this.hasNoSystem()}</>;
    }
    
  }
}
