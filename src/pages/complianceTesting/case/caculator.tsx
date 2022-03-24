import { useEffect } from 'react';
type CaculatorType = {
    number: any
}
export const Caculator: React.FC<CaculatorType> = (props) => {
    useEffect(() => {
        // const number_n = 2 / props.number.s;
        // console.log(props.number.s())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // try {
    // return <div>{props.number.s()}</div>
    // }
    // catch {
        return <div>error</div>
    // }
}