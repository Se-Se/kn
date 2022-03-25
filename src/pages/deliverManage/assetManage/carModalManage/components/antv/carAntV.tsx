import React, { useEffect, useState, useRef } from 'react'
import { Graph, Dom, Addon, Shape } from '@antv/x6'
import style from '@emotion/styled/macro';
// import { makeCircleOptions } from 'pages/deliverManage/component/visualComponent/shapeMaker';
import blueComponentWithNoSystem from 'pages/deliverManage/images/visual/ecu_component_no_system.svg';
import MobileWithNoSystem from 'pages/deliverManage/images/visual/mobile_component_no_system.svg';

import { CircleComponent } from 'pages/deliverManage/component/visualComponent/Mycomponent';
import { SmallComponent } from 'pages/deliverManage/component/visualComponent/SmallComponent';
import './app.css';
import { Icon } from 'tdesign-icons-react';
import '@antv/x6-react-shape';
import { MyGraphContaioner } from './graph'
import { Attr } from '@antv/x6/lib/registry';
import '@antv/x6-react-shape';
import { Markup } from '@antv/x6';
import { makeCircleOptions } from 'pages/deliverManage/component/visualComponent/shapeMaker';
import { Button } from '@tencent/tea-component';
import ReactDOM from 'react-dom';


const { Dnd, Stencil } = Addon;
const { Rect, Circle } = Shape

const testList: any = [
  { componentName: 'ICM', system: [], x: 350, y: 100, type: 'mobile', id: 'mobileGreenComponent' },
  { componentName: 'IAM', system: ['Linuix模组2', 'Linux-MPU'], x: 350, y: 200, type: 'cloud', id: 'ecuBlueComponent2' },
  { componentName: 'ICC', system: ['Linuix模组3', 'Linux-MPU'], x: 350, y: 300, type: 'ecu', id: 'ecuBlueComponent3' },
  { componentName: 'BCM', system: ['Linuix模组4', 'Linux-MPU'], x: 100, y: 100, type: 'ecu', id: 'ecuBlueComponent4' },
  { componentName: 'BPE', system: ['Linuix模组5', 'Linux-MPU'], x: 500, y: 200, type: 'ecu', id: 'ecuBlueComponent5' },
  { componentName: 'IPD', system: ['Linuix模组6', 'Linux-MPU'], x: 700, y: 150, type: 'ecu', id: 'ecuBlueComponent6' },
  { componentName: 'ICM', system: [], x: 350, y: 100, type: 'ecu', id: 'ecuBlueComponent1' },
  { componentName: 'IAM', system: ['Linuix模组2', 'Linux-MPU'], x: 350, y: 200, type: 'ecu', id: 'ecuBlueComponent2' },
  { componentName: 'ICC', system: ['Linuix模组3', 'Linux-MPU'], x: 350, y: 300, type: 'ecu', id: 'ecuBlueComponent3' },

]
const ecuList: any = [
  { componentName: 'ICMICMICMadsadad111', system: [], x: 350, y: 100, type: 'ecu', id: 'mobileGreenComponent' },
  { componentName: 'IAM', system: ['Linuix模组2', 'Linux-MPU'], x: 350, y: 200, type: 'ecu', id: 'ecuBlueComponent2' },
  { componentName: 'ICC', system: ['Linuix模组3', 'Linux-MPU'], x: 350, y: 300, type: 'ecu', id: 'ecuBlueComponent3' },
  { componentName: 'BCM', system: ['Linuix模组4', 'Linux-MPU'], x: 100, y: 100, type: 'ecu', id: 'ecuBlueComponent4' },
]
const cloudList: any = [
  { componentName: 'ICM', system: [], x: 350, y: 100, type: 'cloud', id: 'mobileGreenComponent' },
  { componentName: 'IAM', system: ['Linuix模组2', 'Linux-MPU'], x: 350, y: 200, type: 'cloud', id: 'ecuBlueComponent2' },
  { componentName: 'ICC', system: ['Linuix模组3', 'Linux-MPU'], x: 350, y: 300, type: 'cloud', id: 'ecuBlueComponent3' },
  { componentName: 'BCM', system: ['Linuix模组4', 'Linux-MPU'], x: 100, y: 100, type: 'cloud', id: 'ecuBlueComponent4' },
]

const mobileList: any = [
  { componentName: 'ICM', system: [], x: 350, y: 100, type: 'mobile', id: 'mobileGreenComponent' },
  { componentName: 'IAM', system: ['Linuix模组2', 'Linux-MPU'], x: 350, y: 200, type: 'mobile', id: 'ecuBlueComponent2' },
  { componentName: 'ICC', system: ['Linuix模组3', 'Linux-MPU'], x: 350, y: 300, type: 'mobile', id: 'ecuBlueComponent3' },
  { componentName: 'BCM', system: ['Linuix模组4', 'Linux-MPU'], x: 100, y: 100, type: 'mobile', id: 'ecuBlueComponent4' },
]

const componentsList: any = [
  { data: { type: 'wifi' }, type: 'smallComponent', x: 1050, y: 50, id: 'wifiComponent', isHasBg: false },
  { data: { type: 'usb' }, type: 'smallComponent', x: 1050, y: 100, id: 'usbComponent', isHasBg: false },
  { data: { type: 'bluetooth' }, type: 'smallComponent', x: 1050, y: 150, id: 'bluetoothComponent', isHasBg: false },
  { data: { type: 'cellular' }, type: 'smallComponent', x: 1050, y: 200, id: 'cellularComponent', isHasBg: false },
  { data: { type: 'router' }, type: 'smallComponent', x: 950, y: 50, id: 'routerComponent', isHasBg: true },
  { data: { type: 'cloud' }, type: 'smallComponent', x: 950, y: 150, id: 'cloudComponent', isHasBg: true },
  { data: { type: 'satellite' }, type: 'smallComponent', x: 950, y: 250, id: 'satelliteComponent', isHasBg: true },
  { data: { type: 'charger' }, type: 'smallComponent', x: 950, y: 350, id: 'chargerComponent', isHasBg: true },
  { data: { type: 'obd' }, type: 'smallComponent', x: 950, y: 450, id: 'obdComponent', isHasBg: true },

]

const testData:any={
  "cells": [
      {
          "position": {
              "x": 40,
              "y": 40
          },
          "size": {
              "width": 100,
              "height": 40
          },
          "attrs": {
              "text": {
                  "text": "Hello"
              },
              "body": {
                  "rx": 10,
                  "ry": 10
              }
          },
          "shape": "rect",
          "id": "6e5b66ae-fa8a-4f7f-b80c-455203bb8fc5",
          "zIndex": 1
      },
      {
          "position": {
              "x": 240,
              "y": 180
          },
          "size": {
              "width": 100,
              "height": 40
          },
          "attrs": {
              "text": {
                  "text": "World"
              }
          },
          "shape": "ellipse",
          "id": "250328cf-d934-4eb8-8043-46eafa39c4eb",
          "zIndex": 2
      },
      {
          "shape": "edge",
          "id": "9502dfdd-c9ed-4dbb-9102-ce030dbf5310",
          "zIndex": 3,
          "source": {
              "cell": "6e5b66ae-fa8a-4f7f-b80c-455203bb8fc5"
          },
          "target": {
              "cell": "250328cf-d934-4eb8-8043-46eafa39c4eb"
          }
      },
      {
          "position": {
              "x": 120,
              "y": 260
          },
          "size": {
              "width": 160,
              "height": 124
          },
          "view": "react-shape-view",
          "attrs": {
              "body": {
                  "strokeWidth": 1
              },
              "label": {
                  "fontSize": 15
              }
          },
          "shape": "react-shape",
          "id": "cfbba0fe-e2d6-4621-9f2c-97b4ddcc648f",
          "data": {
              "componentName": "ICMICMICMadsadad111",
              "system": [
                  "123",
                  "123"
              ],
              "x": 350,
              "y": 100,
              "type": "ecu",
              "id": "mobileGreenComponent"
          },
          "component": {
              "key": null,
              "ref": null,
              "props": {},
              "_owner": null,
              "_store": {}
          },
          "portMarkup": [
              {
                  "tagName": "foreignObject",
                  "selector": "fo",
                  "children": [
                      {
                          "ns": "http://www.w3.org/1999/xhtml",
                          "tagName": "body",
                          "selector": "foBody",
                          "attrs": {
                              "xmlns": "http://www.w3.org/1999/xhtml"
                          },
                          "style": {
                              "width": "100%",
                              "height": "100%",
                              "background": "transparent"
                          },
                          "children": [
                              {
                                  "tagName": "div",
                                  "selector": "foContent",
                                  "style": {
                                      "width": "100%",
                                      "height": "100%"
                                  }
                              }
                          ]
                      }
                  ]
              }
          ],
          "ports": {
              "items": [
                  {
                      "group": "in",
                      "id": "top1"
                  },
                  {
                      "group": "in",
                      "id": "top2"
                  },
                  {
                      "group": "inLeft",
                      "id": "left1"
                  },
                  {
                      "group": "inLeft",
                      "id": "left2"
                  },
                  {
                      "group": "out",
                      "id": "bottom1"
                  },
                  {
                      "group": "out",
                      "id": "bottom2"
                  },
                  {
                      "group": "outRight",
                      "id": "right3"
                  },
                  {
                      "group": "outRight",
                      "id": "right4"
                  }
              ],
              "groups": {
                  "in": {
                      "position": {
                          "name": "top"
                      },
                      "attrs": {
                          "fo": {
                              "width": 10,
                              "height": 10,
                              "x": -10,
                              "y": -10,
                              "magnet": "true"
                          }
                      },
                      "zIndex": 10000
                  },
                  "inLeft": {
                      "position": {
                          "name": "left"
                      },
                      "attrs": {
                          "fo": {
                              "width": 10,
                              "height": 10,
                              "x": -10,
                              "y": -10,
                              "magnet": "true"
                          }
                      },
                      "zIndex": 10000
                  },
                  "out": {
                      "position": {
                          "name": "bottom"
                      },
                      "attrs": {
                          "fo": {
                              "width": 10,
                              "height": 10,
                              "x": -10,
                              "y": -10,
                              "magnet": "true"
                          }
                      },
                      "zIndex": 10000
                  },
                  "outRight": {
                      "position": {
                          "name": "right"
                      },
                      "attrs": {
                          "fo": {
                              "width": 10,
                              "height": 10,
                              "x": -10,
                              "y": -10,
                              "magnet": "true"
                          }
                      },
                      "zIndex": 10000
                  }
              }
          },
          "zIndex": 4
      }
  ]
}
// const Style = style.div`
//  width:100%;
//  height:800px;

// `;
const Style = style.div`
  background:#FFFFFF;
  body {
    min-width:inherit;
  }
  height:100%;
  width:100%;
  .kn-app-content {
    flex: 1;
    height:calc(100vh - 120px) !important;
  };

`;
type Props = {
  tabV: string;
}
const ListContent = style.div`
 width:200px;
 height:800px;
 padding:8px 4px;
 .kn-click-list{
  background:#0052D9;
  color: rgba(255,255,255,0.9) !important;
 }

`;
const ListItem = style.div`
 width:100%;
 margin-top:8px;

`;
const ItemHeader = style.div`
    width: 192px;
    height: 36px;
    border-radius: 3px;
    border: 1px solid #0052D9;
    line-height:36px;
    padding-left:16px;
    color:#0052D9;
    cursor:pointer;
`;
const ItemContent = style.div`
   display:flex;
   flex-wrap:wrap;
   justify-content: space-between;
   padding-bottom:16px;
   overflow-y: auto;
   max-height:326px;
   background-color:#F3F3F3;
  .kn-list-item{
    background:url(${blueComponentWithNoSystem}) 90px 36px;
    width:90px;
    height:36px;
    line-height:36px;
    font-size: 16px;
    font-weight: 700;
    color: rgba(0,0,0,0.9);
    margin-top:16px;
    cursor: pointer;
    display:inline-block;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    text-indent: 27px;
  }
  .kn-list-item.green{
    background:url(${MobileWithNoSystem}) 90px 36px;
  }
`
const ComponentsContent = style.div`
   display:flex;
   flex-wrap:wrap;
   justify-content: space-between;
   padding-bottom:16px;
   overflow-y: auto;
   max-height:326px;
   background-color:#F3F3F3;
   padding:0 18px 16px 18px;
  .kn-components-item{
    margin-top:16px;
    cursor:pointer;
  }
  .kn-components-item.is-bg{
    margin-top:16px;
    width:64px;
    height:64px;
    cursor:pointer;
  }
`
export const AntVPage: React.FC<Props> = (props: Props) => {
  // private graph!: Graph
  // private container!: HTMLDivElement
  // private dnd: any
  const [graph, setGraph] = useState<any>();
  const [dnd, setDnd] = useState<any>();
  const theRef = useRef<any>();
  const theRefStencil = useRef<any>();
  const [activeList, setActiveList] = useState<any>('');// ecu |mobile|cloud|components

  useEffect(() => {
    console.log('antvProps-->', props)
    if (props.tabV === '2') {
      graphEffectFn();
    }
  }, [props.tabV])

  const makeCircleOptions = (item: any) => {
    let width = 0
    let height = 0
    if (item.system?.length == 0) {
      width = 96
      height = 36
    }
    if (item.system?.length > 0) {
      const length = item.system?.length
      width = 160
      height = 41 + (length - 1) * 42 + 41
    }
    let option: any = {
      shape: 'react-shape',
      size: { width, height },
      id: item.id,
      data: item,
      component: <CircleComponent ></CircleComponent>,
      portMarkup: [Markup.getForeignObjectMarkup()],
      // label: item.text,
      attrs: {
        body: {
          strokeWidth: 1,
        },
        label: {
          fontSize: 15
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
    if (item.x) {
      option.x = item.x
    }
    if (item.y) {
      option.y = item.y
    }
    return option
  };

  const makeSmallComponentOptions = (item: any) => {
    let width = 64
    let height = 64
    if (!item.isHasBg) {
      width = 32
      height = 32
    }
    let option: any = {
      shape: 'react-shape',
      width: width,
      height: height,
      id: item.id,
      data: item,
      component: <SmallComponent ></SmallComponent>,
      portMarkup: [Markup.getForeignObjectMarkup()],
      // label: item.text,
      attrs: {
        body: {
          strokeWidth: 1,
        },
        label: {
          fontSize: 15
        }

      },
    }
    if (item.x) {
      option.x = item.x
    }
    if (item.y) {
      option.y = item.y
    }
    if (item.isHasBg) {
      option.ports = {
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


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const graphEffectFn = () => {
    const targetDom = makeCircleOptions({ componentName: 'ICC', system: [], x: 650, y: 50, type: 'ecu', iconSrc: '' })
    const ecuBlueComponent = makeCircleOptions({ componentName: 'ICC', system: ['Linuix模组', 'Linux-MPU'], x: 350, y: 100, type: 'ecu', id: 'ecuBlueComponent' })
    const ecuBlueComponent1 = makeCircleOptions({ componentName: 'ICC', system: ['Linuix模组'], x: 350, y: 350, type: 'ecu', id: 'ecuBlueComponent1' })
    const ecuBlueComponent2 = makeCircleOptions({ componentName: 'ICC', system: ['Linuix模组'], x: 350, y: 550, type: 'ecu', id: 'ecuBlueComponent2' })

    const cloudGreenComponent = makeCircleOptions({ componentName: 'ICC', system: ['Linuix模组'], x: 650, y: 200, type: 'cloud', id: 'cloudGreenComponent' })
    const routerComponent = makeSmallComponentOptions({ data: { type: 'router' }, type: 'smallComponent', x: 950, y: 50, id: 'routerComponent', isHasBg: true })
    const cloudComponent = makeSmallComponentOptions({ data: { type: 'cloud' }, type: 'smallComponent', x: 950, y: 150, id: 'cloudComponent', isHasBg: true })
    const satelliteComponent = makeSmallComponentOptions({ data: { type: 'satellite' }, type: 'smallComponent', x: 950, y: 250, id: 'satelliteComponent', isHasBg: true })
    const chargerComponent = makeSmallComponentOptions({ data: { type: 'charger' }, type: 'smallComponent', x: 950, y: 350, id: 'chargerComponent', isHasBg: true })
    const obdComponent = makeSmallComponentOptions({ data: { type: 'obd' }, type: 'smallComponent', x: 950, y: 450, id: 'obdComponent', isHasBg: true })
    const wifiComponent = makeSmallComponentOptions({ data: { type: 'wifi' }, type: 'smallComponent', x: 1050, y: 50, id: 'wifiComponent', isHasBg: false })
    const usbComponent = makeSmallComponentOptions({ data: { type: 'usb' }, type: 'smallComponent', x: 1050, y: 100, id: 'usbComponent', isHasBg: false })
    const blueToothComponent = makeSmallComponentOptions({ data: { type: 'bluetooth' }, type: 'smallComponent', x: 1050, y: 150, id: 'bluetoothComponent', isHasBg: false })
    const cellularComponent = makeSmallComponentOptions({ data: { type: 'cellular' }, type: 'smallComponent', x: 1050, y: 200, id: 'cellularComponent', isHasBg: false });


    const graphObj = new Graph({
      container: theRef.current,
      grid: false,
      history: true,
      autoResize: true,
      background: {
        color: '#F3F3F3',
      },
      snapline: {
        enabled: true,
        sharp: true,
      },
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: false,
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },

      selecting: {
        enabled: true,
        rubberband: true, // 启用框选
      },

      ////////////////////////////////////////////
      // container:theRef.current, 
      // grid: true,
      // background:{
      //   // color:'white'
      // },
      // onPortRendered(args){
      //   const selector = args.contentSelectors
      //   const container = selector && selector.foContent
      //   if(container){
      //     ReactDOM.render(
      //       (
      //         <div className="my-port" />
      //       ) as any,
      //       container as HTMLElement,
      //     )
      //   }
      // },
      // embedding: {
      //   enabled: true,
      //   findParent({ node }) {
      //     const bbox = node.getBBox()
      //     return this.getNodes().filter((node) => {
      //       const data = node.getData<any>()
      //       if (data && data.parent) {
      //         const targetBBox = node.getBBox()
      //         return bbox.isIntersectWithRect(targetBBox)
      //       }
      //       return false
      //     })
      //   },
      // },
      // connecting: {
      //   allowBlank: false,
      //   router:'manhattan'
      // },
    })
    const mobileGreenComponent = makeCircleOptions({ componentName: '手机', system: ['iOS', 'AliOs'], x: 50, y: 200, type: 'mobile', id: 'mobileGreenComponent' });
    const groupNodes = [ecuBlueComponent, ecuBlueComponent1, ecuBlueComponent2].map((item) => graphObj.addNode(item));
    graphObj.addNodes([mobileGreenComponent]);

    const parent = graphObj.addNode({
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
    graphObj.on('node:contextmenu', ({ e, x, y, node, view }) => {
      console.log(e, x, y, node, view)
      console.log(node.getData())
      // console.log(node.getParent())
      let data = JSON.parse(JSON.stringify(node.getData()))
      if (data.system) {
        data.system.push('123')
        node.setData(data)
        if (data.system?.length > 0) {
          node.setSize({ width: 160, height: 41 + (data.system?.length - 1) * 42 + 41 })
        }
        else {
          node.setSize({ width: 90, height: 36 })
        }

      }
      // node.setSize({width:100,height:1000})
      console.log(node.getData())
      // console.log(node.hasChanged('data'))
      console.log(graphObj.toJSON())
      // graphObj.fromJSON(testData);
    })
    parent.addChild(graphObj.getCellById('ecuBlueComponent'))

    groupNodes.map((item) => {
      parent.addChild(item)
    })

    setGraph(graphObj);

    let dndObj: any = new Dnd({
      target: graphObj,
      scaled: true,
      animation: true,
      // validateNode(droppingNode, options) {
      //     return droppingNode.shape === 'html'
      //         ? new Promise<boolean>((resolve) => {
      //             const { draggingNode, draggingGraph } = options
      //             const view = draggingGraph.findView(draggingNode)!
      //             const contentElem = view.findOne('foreignObject > body > div')
      //             Dom.addClass(contentElem, 'validating')
      //             setTimeout(() => {
      //                 Dom.removeClass(contentElem, 'validating')
      //                 resolve(true)
      //             }, 3000)
      //         })
      //         : true
      // },
    })
    setDnd(dndObj);

  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  const startDrag = (e: any, data: any) => {
    const smallComponentsOptions = makeSmallComponentOptions(data);
    const partsOptions = makeCircleOptions(data);
    

    const target: any = e.currentTarget
    const type: any = target.getAttribute('data-type')
    const node: any = type === 'small' ? graph.createNode(smallComponentsOptions) : graph.createNode(partsOptions)
    dnd.start(node, e.nativeEvent as any);
  }

  // 左侧图片
  const leftListImgFn = (stencil: any, graph: any) => {

  }

  // 点击左侧list 展开列表
  const listClick = (n: any) => {
    setActiveList(n === activeList ? '' : n);
    graph.fromJSON(testData);
  }

  return (
    <Style>
      <div className="kn-app">
        <ListContent>
          <ListItem>
            <ItemHeader onClick={() => listClick('ecu')} className={activeList === 'ecu' ? 'kn-click-list' : ''}>
              <span>
                <Icon name={activeList === 'ecu' ? 'chevron-down' : 'chevron-right'} size="16" /> ECU</span>
            </ItemHeader>
            {activeList === 'ecu' ? <ItemContent>
              {(ecuList || []).map((item: any, index: number) => {
                return (
                  <div className='kn-list-item ecu' data-type="big" key={index} onMouseDown={(e) => startDrag(e, item)}>{item.componentName}</div>
                )
              })}
            </ItemContent> : null}
          </ListItem>
          <ListItem>
            <ItemHeader onClick={() => listClick('cloud')} className={activeList === 'cloud' ? 'kn-click-list' : ''}>
              <span>
                <Icon name={activeList === 'cloud' ? 'chevron-down' : 'chevron-right'} size="16" /> 零束云</span>
            </ItemHeader>
            {activeList === 'cloud' ? <ItemContent>
              {(cloudList || []).map((item: any, index: number) => {
                return (
                  <div className='kn-list-item green' data-type="big" key={index} onMouseDown={(e) => startDrag(e, item)}>{item.componentName}</div>
                )
              })}
            </ItemContent> : null}
          </ListItem>
          <ListItem>
            <ItemHeader onClick={() => listClick('mobile')} className={activeList === 'mobile' ? 'kn-click-list' : ''}>
              <span>
                <Icon name={activeList === 'mobile' ? 'chevron-down' : 'chevron-right'} size="16" /> 移动端</span>
            </ItemHeader>
            {activeList === 'mobile' ? <ItemContent>
              {(mobileList || []).map((item: any, index: number) => {
                return (
                  <div className='kn-list-item green' data-type="big" key={index} onMouseDown={(e) => startDrag(e, item)}>{item.componentName}</div>
                )
              })}
            </ItemContent> : null}
          </ListItem>
          <ListItem>
            <ItemHeader onClick={() => listClick('components')} className={activeList === 'components' ? 'kn-click-list' : ''}>
              <span>
                <Icon name={activeList === 'components' ? 'chevron-down' : 'chevron-right'} size="16" /> 组件</span>
            </ItemHeader>
            {activeList === 'components' ? <ComponentsContent >
              {(componentsList || []).map((item: any, index: number) => {
                return (
                  <div className={item.isHasBg?'kn-components-item is-bg':'kn-components-item'} data-type="small" key={index} onMouseDown={(e) => startDrag(e, item)}>
                    <SmallComponent node={{ data: item } as any}></SmallComponent>
                  </div>
                )
              })}
            </ComponentsContent> : null}
          </ListItem>
        </ListContent>


        {/* <div className="app-stencil" ref={theRefStencil} ></div> */}
        <div className="kn-app-content" ref={theRef} ></div>
      </div>
    </Style>

  )

}
