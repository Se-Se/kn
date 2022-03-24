import React, { } from 'react';
import ReactMarkdown from 'react-markdown/with-html';

import { CommonErrorBoundary } from 'components/commonErrorBoundary'
import SyntaxHighlighter from 'react-syntax-highlighter';

// const ReactMarkdown = React.lazy(() => import('react-markdown/with-html'));

interface CodeBlockProps {
    value: string
    language?: string
}
type markDownRenderProps = {
    value: string
    notOverflow?:boolean
    style?:any
}
const TableCellBlock: React.FC = (props) => {
    return <td style={{ border: '1px solid #ccc', padding: '5px 10px' }}>
        {props.children}
    </td>
}
const ImageBlock: React.FC = (props:any) => {
    return <div>
        <img alt="" style={{maxWidth:"100%"}} src={props.src}></img>
    </div>
}
// const H1Block:React.FC = (props) =>{
//     const config = props as any;
//     console.log(config);
//     // switch(config.level){
//     //     case 1:return <span style={{fontSize:20,fontWeight:'bold'}}>{config.children}</span>
//     //     case 2:return <span style={{fontSize:16,fontWeight:'bold'}}>{config.children}</span>
//     //     case 3:return <span style={{fontSize:14,fontWeight:'bold'}}>{config.children}</span>
//     //     case 4:return <span style={{fontSize:12,fontWeight:'bold'}}>{config.children}</span>
//     // }
//     return config.children;
//     // return <div>test simon</div>
// }
const TableHeadBlock: React.FC = (props) => {
    return <thead style={{ fontSize: 14, background: '#eee' }}>
        {props.children}
    </thead>
}
const CodeBlock: React.FC<CodeBlockProps> = ({ value, language }) => {
    return <React.Suspense fallback={null}>
        <SyntaxHighlighter language={language}>
            {value}
        </SyntaxHighlighter>
    </React.Suspense>
}
// export const MarkdownRender: React.FC<markDownRenderProps> = ({ value }) => {
//     return <div>
//         <ReactMarkdown renderers={{
//             code: CodeBlock,
//             tableHead: TableHeadBlock,
//             tableCell: TableCellBlock
//         }}
//             source={value} escapeHtml={false} />
//     </div>
// }
const MarkdownRender: React.FC<markDownRenderProps> = function ({ value,notOverflow,style }) {
    return <div style={{ height: 'calc(100% - 40px)', fontSize:12,overflowY: notOverflow?'visible':'auto', padding: 20,lineHeight:'30px', ...style }}>
        <CommonErrorBoundary lower={<div>{value}</div>}>
            <ReactMarkdown renderers={{
                code: CodeBlock,
                tableHead: TableHeadBlock,
                tableCell: TableCellBlock,
                image:ImageBlock
                // heading:H1Block
                // 'h1':
            }}
                source={value} escapeHtml={false} />

        </CommonErrorBoundary>
    </div>
}
export default MarkdownRender