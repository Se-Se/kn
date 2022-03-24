import React from 'react'
import { Graph, Node, Color, Cell } from '@antv/x6'
import '@antv/x6-react-shape'
import style from '@emotion/styled/macro';
import { CircleComponent } from './Mycomponent';
import { Markup } from '@antv/x6';
import ReactDOM from 'react-dom';
import { Attr } from '@antv/x6/lib/registry';
import { SmallComponent } from './SmallComponent';
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
  data?:any;
  id?:string;
  type:string;
}
type edgePath={
  source:{cell:string,port:string};
  target:{cell:string,port:string};
  type:'strokeDash'|'slim'|'strong';
  isTwoWay?:boolean
}
export class MyGraph extends React.Component{
  public container!: HTMLDivElement
  public graph!: Graph;

  refContainer=(container:HTMLDivElement)=>{
    this.container = container
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
      connecting: {
        allowBlank: false,
        router:'manhattan'
      },
    })
    
    const target = this.makeCircleOptions({data:{componentName:'ICC',system:[]},x:650,y:50,type:'ecu',})
    const ecuBlueComponent = this.makeCircleOptions({data:{componentName:'ICC',system:['Linuix模组','Linux-MPU']},x:350,y:100,type:'ecu',id:'ecuBlueComponent'})
    const ecuBlueComponent1 = this.makeCircleOptions({data:{componentName:'ICC',system:['Linuix模组']},x:350,y:350,type:'ecu',id:'ecuBlueComponent1'})
    const ecuBlueComponent2 = this.makeCircleOptions({data:{componentName:'ICC',system:['Linuix模组']},x:350,y:550,type:'ecu',id:'ecuBlueComponent2'})
    const mobileGreenComponent = this.makeCircleOptions({data:{componentName:'手机',system:['iOS','AliOs']},x:50,y:200,type:'mobile',id:'mobileGreenComponent'})
    const cloudGreenComponent = this.makeCircleOptions({data:{componentName:'ICC',system:['Linuix模组']},x:650,y:200,type:'cloud',id:'cloudGreenComponent'})
    const routerComponent = this.makeSmallComponentOptions({data:{type:'router'},type:'smallComponent',x:950,y:50,id:'routerComponent'})
    const cloudComponent = this.makeSmallComponentOptions({data:{type:'cloud'},type:'smallComponent',x:950,y:150,id:'cloudComponent'})
    const satelliteComponent = this.makeSmallComponentOptions({data:{type:'satellite'},type:'smallComponent',x:950,y:250,id:'satelliteComponent'})
    const chargerComponent = this.makeSmallComponentOptions({data:{type:'charger'},type:'smallComponent',x:950,y:350,id:'chargerComponent'})
    const obdComponent = this.makeSmallComponentOptions({data:{type:'obd'},type:'smallComponent',x:950,y:450,id:'obdComponent'})
    this.graph.addNodes([target,ecuBlueComponent,ecuBlueComponent1,ecuBlueComponent2,mobileGreenComponent,cloudGreenComponent])
    this.graph.addNodes([routerComponent,cloudComponent,satelliteComponent,chargerComponent,obdComponent])
    const Edge1 = this.makeEdge({source:{cell:'mobileGreenComponent',port:'top1'},target:{cell:'ecuBlueComponent',port:'left1'},type:'strokeDash',isTwoWay:true})
    const Edge2 = this.makeEdge({source:{cell:'ecuBlueComponent',port:'bottom1'},target:{cell:'ecuBlueComponent1',port:'top1'},type:'slim'})
    const Edge3 = this.makeEdge({source:{cell:'ecuBlueComponent1',port:'bottom1'},target:{cell:'ecuBlueComponent2',port:'top1'},type:'strong'})

    console.log(routerComponent)
      this.graph.addEdges([Edge1,Edge2,Edge3])
  }
  makeCircleOptions = (item: nodeOption) => {
    let width = 0
    let height = 0
    if(item.data.system?.length==0){
      width=96
      height=36
    }
    if(item.data.system?.length>0){
      const length = item.data.system?.length
      width=160
      height=41+(length-1)*42+41
    }
    let option:any = {
      shape: 'react-shape',
      width: width,
      height: height,
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
  makeSmallComponentOptions = (item: nodeOption) => {
    let width = 64
    let height = 64
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
      ports: {
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
    if(item.x){
      option.x = item.x
    }
    if(item.y){
      option.y=item.y
    }
    return option
  };
  render(): React.ReactNode {
    return (
    <Style>
      <div className="app-content" ref={this.refContainer} />
    </Style>)
  }
}