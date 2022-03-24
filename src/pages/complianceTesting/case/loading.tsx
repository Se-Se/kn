import React from 'react';
import { Status } from "@tencent/tea-component";
export const Loading: React.FC = () => {
    return <div><Status
        // @ts-ignore
        icon={'blank'}
        // @ts-ignore
        size={'l'}
        title={"Loading"}
        description="Loading"
    /></div>
}