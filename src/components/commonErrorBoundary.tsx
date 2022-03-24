// // import { useEffect } from 'react';
// export const CommonErrorBoundary:React.FC = (props)=>{
//     try{
//         // console.log(props);
//         // return <div>{props.children}</div>
//         return <div>{props.children}</div>
//     }
//     catch(e){

//         return <div>error</div>
//     }
// }
import React from 'react';
export class CommonErrorBoundary extends React.Component<any,any> {
    constructor(props:any) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error:any) {
      // 更新 state 使下一次渲染能够显示降级后的 UI
      return { hasError: true };
    }
  
    componentDidCatch(error:any, errorInfo:any) {
      // 你同样可以将错误日志上报给服务器
    //   logErrorToMyService(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // 你可以自定义降级后的 UI 并渲染
        return <div>{this.props.lower}</div>;
      }
  
      return this.props.children; 
    }
  }