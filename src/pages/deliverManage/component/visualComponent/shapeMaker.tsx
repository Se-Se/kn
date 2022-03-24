import { Markup } from "@antv/x6";
import { CircleComponent } from "./Mycomponent";
import '@antv/x6-react-shape'

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
export const  makeCircleOptions = (item: nodeOption) => {
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
    component: (<CircleComponent ></CircleComponent>),
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