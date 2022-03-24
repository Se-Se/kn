import React, { useEffect, useState, useRef } from 'react'
import { ReactShape } from '@antv/x6-react-shape';
import { Graph, Dom, Addon, Shape } from '@antv/x6'
// import '@antv/x6-react-shape'
import './app.css'
import style from '@emotion/styled/macro';
import { makeCircleOptions } from 'pages/deliverManage/component/visualComponent/shapeMaker';
import blueComponentWithNoSystem from 'pages/deliverManage/images/visual/ecu_component_no_system.svg'
import { CircleComponent } from 'pages/deliverManage/component/visualComponent/Mycomponent';
import { SmallComponent } from 'pages/deliverManage/component/visualComponent/SmallComponent';

const { Dnd, Stencil } = Addon;
const { Rect, Circle } = Shape

const imageShapes = [

  {
    label: 'Http',
    image: blueComponentWithNoSystem,
  },
  {
    label: 'Api',
    image:
      'https://gw.alipayobjects.com/zos/bmw-prod/c55d7ae1-8d20-4585-bd8f-ca23653a4489.svg',
  },
  {
    label: 'Sql',
    image:
      'https://gw.alipayobjects.com/zos/bmw-prod/6eb71764-18ed-4149-b868-53ad1542c405.svg',
  },

]
// #region 初始化图形
const ports = {
  groups: {
    top: {
      position: 'top',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    right: {
      position: 'right',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    bottom: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    left: {
      position: 'left',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
  },
  items: [
    {
      group: 'top',
    },
    {
      group: 'right',
    },
    {
      group: 'bottom',
    },
    {
      group: 'left',
    },
  ],
}

const Style = style.div`
 width:100%;
 height:800px;

`;
type Props = {
  tabV: string;
}

export const TestAntv: React.FC<Props> = (props: Props) => {
  // private graph!: Graph
  // private container!: HTMLDivElement
  // private dnd: any
  const [graph, setGraph] = useState<any>();
  const [dnd, setDnd] = useState<any>();
  const theRef = useRef<any>();
  const theRefStencil = useRef<any>();

  useEffect(() => {
    console.log('antvProps-->', props)
    if (props.tabV === '1') {
      graphEffectFn();
    }
  }, [props.tabV])

  const targetDom = makeCircleOptions({ componentName: 'ICC', system: [], x: 650, y: 50, type: 'ecu', })
  const graphEffectFn = () => {
    const graphData = new Graph({
      container: theRef.current,
      grid: true,
      history: true,
      autoResize: true,
      snapline: {
        enabled: true,
        sharp: true,
      },
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: true,
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
    })

    const source = graphData.addNode({
      x: 130,
      y: 30,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'Hello',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    })

    const target = graphData.addNode({
      x: 180,
      y: 160,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'World',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    })

    graphData.addEdge({ source, target })
    graphData.centerContent()
    let dadData: any = new Dnd({
      target: graphData,
      scaled: false,
      animation: true,
      validateNode(droppingNode, options) {
        return droppingNode.shape === 'html'
          ? new Promise<boolean>((resolve) => {
            const { draggingNode, draggingGraph } = options
            const view = draggingGraph.findView(draggingNode)!
            const contentElem = view.findOne('foreignObject > body > div')
            Dom.addClass(contentElem, 'validating')
            setTimeout(() => {
              Dom.removeClass(contentElem, 'validating')
              resolve(true)
            }, 3000)
          })
          : true
      },
    })
    setDnd(dadData);
    Graph.registerNode(
      'custom-image',
      {
        inherit: 'rect',
        width: 52,
        height: 52,
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'image',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
        ],
        attrs: {
          body: {
            stroke: '#5F95FF',
            fill: '#5F95FF',
            strokeWidth: 0,
          },
          image: {
            width: 52,
            height: 52,
            refX: 0,
            refY: 0,
          },
          label: {
            refX: 3,
            refY: 2,
            textAnchor: 'left',
            textVerticalAnchor: 'top',
            fontSize: 12,
            fill: '#fff',
          },
        },
        // ports: { ...ports },
      },
      true,
    )
    setGraph(graphData);

    // const stencil = new Stencil({
    //   title: 'Components',
    //   target: graphData,
    //   collapsable: true,
    //   stencilGraphWidth: 200,
    //   stencilGraphHeight: 300,
    //   groups: [
    //     {
    //       name: 'group1',
    //       title: 'ECU',
    //     },
    //     {
    //       name: 'group2',
    //       title: '零束云',
    //       // collapsable: false,
    //     },
    //   ],
    // })

    // theRefStencil?.current?.appendChild(stencil.container);
    // const r3 = new Rect({
    //   width: 70,
    //   height: 40,
    //   attrs: {
    //     rect: { fill: '#31D0C6', stroke: '#4B4A67', strokeWidth: 6 },
    //     text: { text: 'rect', fill: 'white' },
    //   },
    // })
    // const r2 = new Rect({
    //   width: 70,
    //   height: 40,
    //   // attrs: {
    //   //   rect: blueComponentWithNoSystem as any,
    //   //   text: { text: 'rect13', fill: 'white' },
    //   // },
    //   background: `url(${blueComponentWithNoSystem})`,
    // })
    // const c3 = new Circle({
    //   width: 60,
    //   height: 60,
    //   attrs: {
    //     circle: { fill: '#FE854F', strokeWidth: 6, stroke: '#4B4A67' },
    //     text: { text: 'ellipse', fill: 'white' },
    //   },
    // })

    // const c2 = new Circle({
    //   width: 60,
    //   height: 60,
    //   attrs: {
    //     circle: { fill: '#4B4A67', 'stroke-width': 6, stroke: '#FE854F' },
    //     text: { text: 'ellipse', fill: 'white' },
    //   },
    // })

    // // const reactNod = new ReactShape({...targetDom})

    // stencil.load([c3, r3, c2], 'group1');
    // // stencil.load([r3.clone(),reactNod], 'group2');

    // leftListImgFn(stencil, graphData);

  }


  const startDrag = (e: any) => {
    const target: any = e.currentTarget
    const type: any = target.getAttribute('data-type')
    const node: any = type === 'rect' ? graph.createNode({
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'Rect',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    })
      : graph.createNode({
        width: 60,
        height: 60,
        shape: 'html',
        html: () => {
          const wrap = document.createElement('div')
          wrap.style.width = '500px'
          wrap.style.height = '100%'
          wrap.style.display = 'flex'
          wrap.style.alignItems = 'center'
          wrap.style.justifyContent = 'center'
          wrap.style.border = '2px solid rgb(49, 208, 198)'
          wrap.style.background = '#fff'
          wrap.style.borderRadius = '100%'
          wrap.innerText = 'Circle'
          return wrap
        },
      })

    dnd.start(node, e.nativeEvent as any)
  }

  // 左侧图片
  const leftListImgFn = (stencil: any, graph: any) => {
    // const imageNodes = imageShapes.map((item) =>
    //   graph.createNode({
    //     ...targetDom,
    //     // shape: 'react-shape',

    //   }),
    // )
  // let aa:any=  graph.createNode({...targetDom});
 
    console.log('targetDom=>',targetDom)

    // stencil.load(aa, 'group2')
  }



  return (
    <Style>
      <div className="kn-app">
        <div className="dnd-wrap">
          <div
            data-type="rect"
            className="dnd-rect"
            onMouseDown={(e) => startDrag(e)}
          >
            Rect
          </div>
          <div
            data-type="circle"
            className="dnd-circle"
            onMouseDown={(e) => startDrag(e)}
          >
            Circle
          </div>
        </div>

        {/* <div className="app-stencil" ref={theRefStencil} ></div> */}
        <div className="kn-app-content" ref={theRef} ></div>
      </div>
    </Style>

  )

}
