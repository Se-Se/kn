import React from 'react';
import { Breadcrumb} from 'tdesign-react';
import { useHistory} from 'react-router-dom'

type Props = {
    list: any
};
const { BreadcrumbItem } = Breadcrumb;

export const BreadcrumbPage: React.FC<Props> = (props: Props) => {
    const history = useHistory();

    const breadcrumbFn = () => {
        return (
                <Breadcrumb maxItemWidth="200px" theme="light">
                    {(props.list || []).map((item: any,index:number) => {
                        if (item.path) {
                            return (
                                <BreadcrumbItem key={index} onClick={() => history.push(`${item.path}`)}>{item.text}</BreadcrumbItem>
                            )
                        } else {
                            return (
                                <BreadcrumbItem  key={index}>{item.text}</BreadcrumbItem>
                            )
                        }
                    })}

                </Breadcrumb>
        )
    }
    return (
        <>
            {breadcrumbFn()}
        </>
    );
};
