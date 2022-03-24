import React, { useState, useEffect } from 'react';
import style from '@emotion/styled/macro';
import { Button, Transfer, Drawer } from 'tdesign-react';
import styled from '@emotion/styled/macro';



const FootButtonGroup = style.div`
  display: flex;
  height: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const Style = styled.div`
  .button-footer {
    width: 100px;
  }
  .t-textarea__inner{
    height:100px;
  }
  .t-drawer__body{
    padding:20px;
  }
.transfer-content{
    width:100%;
    height:100%;
    .t-transfer{
        height: calc(100% - 40px);
        .t-transfer__list{
            height:100%;
        }
    }
 
}
.t-transfer__list{
    width:50%
}
.transfer-header{
    display:flex;
    width:100%;
    margin-bottom:2px;
    color:#808080;
}

.t-drawer__content-wrapper{
    width:480px !important;
  }
`;
type DrawerProps = {
    visible?: boolean;
    onClose: () => void;
    save: (v: any) => void;
    title?: any;
    optList?: any;
    selectV?: any;
    selectTitle: string;
};



export const TransferDraw: React.FC<DrawerProps> = (props: DrawerProps) => {
    const [theV, setTheV] = useState([]);
    useEffect(() => {
        setTheV(props.selectV);
    }, [props.selectV]);

    // 确认关联
    const handleSave = () => {
        props.save(theV);
    }
    // 分页
    const pagination = [
        {
            pageSize: 10,
            onPageChange: (current: any) => {
                console.log('current', current);
            },
        },
        {
            pageSize: 10,
            defaultCurrent: 1,
        },
    ];

    const handleChange = (data: any) => {
        setTheV(data)
    }
    return (
        <Style>
            <Drawer
                visible={props.visible}
                onClose={() => { props.onClose() }}
                destroyOnClose={true}
                size='large'
                header={
                    <span style={{ fontWeight: 'bold' }}>
                        {props.title}
                    </span>
                }
                footer={
                    <FootButtonGroup>
                        <Button
                            theme='primary'
                            style={{ width: 88, height: 32 }}
                            className='button-footer'
                            onClick={() => handleSave()}

                        >
                            确认关联
                        </Button>
                        <Button
                            style={{ width: 60, height: 32 }}
                            theme='default'
                            className='button-footer'
                            onClick={() => { props.onClose() }}
                        >
                            取消
                        </Button>
                    </FootButtonGroup>
                }
            >
                <div className='transfer-content'>
                    <div className='transfer-header'>
                        <div style={{ marginRight: 282 }}>{props.selectTitle}</div>
                        <div>已选择</div>
                    </div>
                    {props.visible ? <Transfer
                        value={theV}
                        search
                        onChange={(v) => handleChange(v)}
                        data={props.optList}
                        pagination={pagination}
                    /> : null}
                </div>
            </Drawer>
        </Style>
    )
};
