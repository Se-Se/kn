import React from 'react'
import { Graph, Node, Color, Cell } from '@antv/x6'
import { ReactShape } from '@antv/x6-react-shape';

import '@antv/x6-react-shape'
import style from '@emotion/styled/macro';
import { Markup } from '@antv/x6';
import ReactDOM from 'react-dom';
import { Attr } from '@antv/x6/lib/registry';
import { CircleComponent } from 'pages/deliverManage/component/visualComponent/Mycomponent';
import { SmallComponent } from 'pages/deliverManage/component/visualComponent/SmallComponent';
const Style = style.div`
body {
  min-width:inherit;
}
height:100%;
width:100%;
.app-content {
  flex: 1;
  height:calc(100vh - 170px) !important;
};
`;
type nodeOption= {
  x?: number;
  y?: number;
  text?:string;
  componentName:string;
  system:string[];
  id?:string;
  type:string;
}
type smallNodeOption= {
  x?: number;
  y?: number;
  text?:string;
  data?:{
    type:string
  };
  id?:string;
  type:string;
  isHasBg:boolean;
}
type edgePath={
  source:{cell:string,port:string};
  target:{cell:string,port:string};
  type:'strokeDash'|'slim'|'strong';
  isTwoWay?:boolean
}
export class MyGraphContaioner extends React.Component{
  public container!: HTMLDivElement
  public graph!: Graph;

  refContainer=(container:HTMLDivElement)=>{
    this.container = container
  }

  constructor(props:any){
    super(props)
    this.state = {

    }
  }
  
  componentDidMount=()=>{
    this.graph=new Graph({
      container:this.container, 
      grid: true,
      background:{
        // color:'white'
      },
      onPortRendered(args){
        const selector = args.contentSelectors
        const container = selector && selector.foContent
        if(container){
          ReactDOM.render(
            (
              <div className="my-port" />
            ) as any,
            container as HTMLElement,
          )
        }
      },
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()
          return this.getNodes().filter((node) => {
            const data = node.getData<any>()
            if (data && data.parent) {
              const targetBBox = node.getBBox()
              return bbox.isIntersectWithRect(targetBBox)
            }
            return false
          })
        },
      },
      connecting: {
        allowBlank: false,
        router:'manhattan'
      },
    })
    
    const target = this.makeCircleOptions({componentName:'ICC',system:[],x:650,y:50,type:'ecu',})
    const ecuBlueComponent = this.makeCircleOptions({componentName:'ICC',system:['Linuix模组','Linux-MPU'],x:350,y:100,type:'ecu',id:'ecuBlueComponent'})
    const ecuBlueComponent1 = this.makeCircleOptions({componentName:'ICC',system:['Linuix模组'],x:350,y:350,type:'ecu',id:'ecuBlueComponent1'})
    const ecuBlueComponent2 = this.makeCircleOptions({componentName:'ICC',system:['Linuix模组'],x:350,y:550,type:'ecu',id:'ecuBlueComponent2'})
    const mobileGreenComponent = this.makeCircleOptions({componentName:'手机',system:['iOS','AliOs'],x:50,y:200,type:'mobile',id:'mobileGreenComponent'})
    const cloudGreenComponent = this.makeCircleOptions({componentName:'ICC',system:['Linuix模组'],x:650,y:200,type:'cloud',id:'cloudGreenComponent'})
    const routerComponent = this.makeSmallComponentOptions({data:{type:'router'},type:'smallComponent',x:950,y:50,id:'routerComponent',isHasBg:true})
    const cloudComponent = this.makeSmallComponentOptions({data:{type:'cloud'},type:'smallComponent',x:950,y:150,id:'cloudComponent',isHasBg:true})
    const satelliteComponent = this.makeSmallComponentOptions({data:{type:'satellite'},type:'smallComponent',x:950,y:250,id:'satelliteComponent',isHasBg:true})
    const chargerComponent = this.makeSmallComponentOptions({data:{type:'charger'},type:'smallComponent',x:950,y:350,id:'chargerComponent',isHasBg:true})
    const obdComponent = this.makeSmallComponentOptions({data:{type:'obd'},type:'smallComponent',x:950,y:450,id:'obdComponent',isHasBg:true})
    const wifiComponent = this.makeSmallComponentOptions({data:{type:'wifi'},type:'smallComponent',x:1050,y:50,id:'wifiComponent',isHasBg:false})
    const usbComponent = this.makeSmallComponentOptions({data:{type:'usb'},type:'smallComponent',x:1050,y:100,id:'usbComponent',isHasBg:false})
    const blueToothComponent = this.makeSmallComponentOptions({data:{type:'bluetooth'},type:'smallComponent',x:1050,y:150,id:'bluetoothComponent',isHasBg:false})
    const cellularComponent = this.makeSmallComponentOptions({data:{type:'cellular'},type:'smallComponent',x:1050,y:200,id:'cellularComponent',isHasBg:false})

    this.graph.addNodes([target,mobileGreenComponent,cloudGreenComponent])
    const groupNodes = [ecuBlueComponent,ecuBlueComponent1,ecuBlueComponent2].map((item)=>this.graph.addNode(item))



    this.graph.addNodes([routerComponent,cloudComponent,satelliteComponent,chargerComponent,obdComponent])
    this.graph.addNodes([wifiComponent,usbComponent,blueToothComponent,cellularComponent])
    const Edge1 = this.makeEdge({source:{cell:'mobileGreenComponent',port:'top1'},target:{cell:'ecuBlueComponent',port:'left1'},type:'strokeDash',isTwoWay:true})
    const Edge2 = this.makeEdge({source:{cell:'ecuBlueComponent',port:'bottom1'},target:{cell:'ecuBlueComponent1',port:'top1'},type:'slim'})
    const Edge3 = this.makeEdge({source:{cell:'ecuBlueComponent1',port:'bottom1'},target:{cell:'ecuBlueComponent2',port:'top1'},type:'strong'})

    console.log('routerComponent',routerComponent)
    this.graph.addEdges([Edge1,Edge2,Edge3])

    const parent = this.graph.addNode({
      x: 300,
      y: 80,
      width: 240,
      height: 600,
      zIndex: 1,
      // label: 'Parent',
      attrs: {
        body: {
          stroke: '#ffe7ba',
        },
        label: {
          fontSize: 12,
        },
      },
      data: {
        parent: true,
      },
    })
    this.graph.on('node:contextmenu',({e,x,y,node,view})=>{
      console.log(e,x,y,node,view)
      console.log(node.getData())
      // console.log(node.getParent())
      let data = JSON.parse(JSON.stringify(node.getData()) )
      if(data.system){
        data.system.push('123')
        node.setData(data)
        if(data.system?.length>0){
          node.setSize({width:160,height:41+(data.system?.length-1)*42+41})
        }
        else {
          node.setSize({width:96,height:36})
        }
        
      }
      // node.setSize({width:100,height:1000})
      console.log(node.getData())
      // console.log(node.hasChanged('data'))
      console.log(this.graph.toJSON())
    })
    parent.addChild(this.graph.getCellById('ecuBlueComponent'))
    
    groupNodes.map((item)=>{
      parent.addChild(item)
    })
    // parent.addChild(cellularComponent)
  }
  
  


  makeCircleOptions = (item: nodeOption) => {
    let width = 0
    let height = 0
    if(item.system?.length==0){
      width=96
      height=36
    }
    if(item.system?.length>0){
      const length = item.system?.length
      width=160
      height=41+(length-1)*42+41
    }
    let option:any = {
      shape: 'react-shape',
      size:{width,height},
      id:item.id,
      data:item,
      component: <CircleComponent ></CircleComponent>,
      portMarkup: [Markup.getForeignObjectMarkup()],
      // label: item.text,
      attrs: {
        body: {
          strokeWidth: 1,
        },
        label:{
          fontSize:15
        }
        
      },
      ports: {
        items: [
          { group: 'in', id: 'top1' },
          { group: 'in', id: 'top2' },
          { group: 'inLeft', id: 'left1' },
          { group: 'inLeft', id: 'left2' },
          { group: 'out', id: 'bottom1' },
          { group: 'out', id: 'bottom2' },
          { group: 'outRight', id: 'right3' },
          { group: 'outRight', id: 'right4' },
        ],
        groups: {
          in: {
            position: { name: 'top' },
            attrs: {
              fo: {
                width: 10,
                height: 10,
                x: -10,
                y: -10,
                magnet: 'true',
              },
            },
            zIndex: 10000,
          },
          inLeft: {
            position: { name: 'left' },
            attrs: {
              fo: {
                width: 10,
                height: 10,
                x: -10,
                y: -10,
                magnet: 'true',
              },
            },
            zIndex: 10000,
          },
          out: {
            position: { name: 'bottom' },
            attrs: {
              fo: {
                width: 10,
                height: 10,
                x: -10,
                y: -10,
                magnet: 'true',
              },
            },
            zIndex: 10000,
          },
          outRight: {
            position: { name: 'right' },
            attrs: {
              fo: {
                width: 10,
                height: 10,
                x: -10,
                y: -10,
                magnet: 'true',
              },
            },
            zIndex: 10000,
          },
        }
      }
    }
    if(item.x){
      option.x = item.x
    }
    if(item.y){
      option.y=item.y
    }
    return option
  };
  makeEdge=(data:edgePath)=>{
    let option:Cell.Metadata = {
      source:data.source,
      target:data.target,
    }
    let attrs:Attr.CellAttrs = {
      line:{
        stroke:'#478BFF',
        targetMarker:{
          name:'block',
          size:6,
          offset:5
        }
      },
    }
    if(data.isTwoWay){
      attrs.line.sourceMarker={
        name:'block',
        size:6,
        offset:5
      }
    }
    switch (data.type) {
      case 'slim':
        attrs.line.strokeWidth=1
        break;
      case 'strokeDash':
        attrs.line.strokeDasharray = 5
        attrs.line.strokeWidth=1
        break;

      case 'strong':
        attrs.line.strokeWidth=10
        attrs.line.targetMarker={name:'block',size:20,offset:5}
        if(data.isTwoWay){
          attrs.line.sourceMarker={name:'block',size:20,offset:5}
        }
        break
      default:
    }
    option.attrs=attrs
    return option
  }
  makeSmallComponentOptions = (item: smallNodeOption) => {
    let width = 64
    let height = 64
    if(!item.isHasBg){
      width=32
      height=32
    }
    let option:any = {
      shape: 'react-shape',
      width: width,
      height: height,
      id:item.id,
      data:item,
      component: <SmallComponent ></SmallComponent>,
      portMarkup: [Markup.getForeignObjectMarkup()],
      // label: item.text,
      attrs: {
        body: {
          strokeWidth: 1,
        },
        label:{
          fontSize:15
        }
        
      },
    }
    if(item.x){
      option.x = item.x
    }
    if(item.y){
      option.y=item.y
    }
    if(item.isHasBg){
      option.ports={
        items: [
          { group: 'in', id: 'top1' },
          { group: 'inLeft', id: 'left1' },
          { group: 'out', id: 'bottom1' },
          { group: 'outRight', id: 'right1' },
        ],
        groups: {
          in: {
            position: { name: 'top' },
            attrs: {
              fo: {
                width: 10,
                height: 10,
                x: -10,
                y: -10,
                magnet: 'true',
              },
            },
            zIndex: 10000,
          },
          inLeft: {
            position: { name: 'left' },
            attrs: {
              fo: {
                width: 10,
                height: 10,
                x: -10,
                y: -10,
                magnet: 'true',
              },
            },
            zIndex: 10000,
          },
          out: {
            position: { name: 'bottom' },
            attrs: {
              fo: {
                width: 10,
                height: 10,
                x: -10,
                y: -10,
                magnet: 'true',
              },
            },
            zIndex: 10000,
          },
          outRight: {
            position: { name: 'right' },
            attrs: {
              fo: {
                width: 10,
                height: 10,
                x: -10,
                y: -10,
                magnet: 'true',
              },
            },
            zIndex: 10000,
          },
        }
      }
    }
    return option
  };
  render(): React.ReactNode {
    return (
    <Style>
      <div className="app-content" ref={this.refContainer} />
    </Style>
    )
  }
}