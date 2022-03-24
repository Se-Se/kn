import React, { useRef } from 'react';
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { MonacoEditor } from "@tencent/tea-component";
import { CommonErrorBoundary } from 'components/commonErrorBoundary'

// const monaco = React.lazy(() => import ('monaco-editor/esm/vs/editor/editor.api'));

type EditorProps = {
    value: string,
    language: string,
    setEditorValue?: (value: string) => void,
    height:number
};

// export const Editor: React.FC<EditorProps> = ({ value, language, setEditorValue }) => {
//     const ref = useRef(null);

//     return <div>
//         <MonacoEditor
//             options={{
//                 theme: 'vs-dark',
//                 minimap: {
//                     enabled: false
//                 }
//             }}
//             ref={ref}
//             monaco={monaco}
//             height={400}
//             language={language}
//             onChange={(value) => {
//                 setEditorValue(value);
//             }}
//             value={value}
//         />
//     </div>
// }

const Editor: React.FC<EditorProps> = function ({ value, language, setEditorValue,height }) {
    const ref = useRef(null);

    return <div>
        <CommonErrorBoundary lower={<text>{value}</text>}>
            <MonacoEditor
                options={{
                    theme: 'vs-dark',
                    minimap: {
                        enabled: false
                    }
                }}
                ref={ref}
                monaco={monaco}
                height={height}
                language={language}
                onChange={(value) => {
                    if (setEditorValue) {
                        setEditorValue(value);
                    }
                }}
                value={value}
            />
        </CommonErrorBoundary>

    </div>
}
export default Editor;