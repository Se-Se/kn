import React, { useState, useEffect, useRef } from 'react';
import style from '@emotion/styled/macro';
import { Button, Drawer, Form, Row, Col, message, Tabs } from 'tdesign-react';
import styled from '@emotion/styled/macro';
import { autoPartsBaseDetail } from 'pages/deliverManage/util/carDisplay';
import { Loophole } from '../../../component/loopholeTag';
import { ECUPage } from './ECU/ECUBase';
import { CloudPage } from './cloud/cloudBase';
import { MobilePage } from './mobile/mobileBase';

const { TabPanel } = Tabs;

const Style = styled.div`
  .button-footer {
    width: 100px;
  }
  .t-textarea__inner{
    height:100px;
  }
  .t-drawer__body{
    padding:0;
  }
  .kn-drawer{
    .t-drawer__header{
      color: rgba(0,0,0,0.9);
      font-size: 16px;
      font-weight: 700;
    }
   .t-drawer__content-wrapper{
     width:720px !important;
   }
  }
`;

type DrawerProps = {
  visible: boolean;
  theId?: string;
  onClose: () => void;
  comType: string;

};

export const InfoDrawer: React.FC<DrawerProps> = (props: DrawerProps) => {
  const formRef = useRef<any>();
  const [detailData, setDetailData] = useState<any>({}); 


  useEffect(() => {
    if (props.theId) {
      fetch();
    }
    console.log('drawer--props', props)
  }, [props.theId,]);
  // 获取详情信息
  const fetch = () => {
    autoPartsBaseDetail({ autoPartsId: Number(props.theId) }).then((res: any) => {
      if (res?.code === 0) {
        setDetailData(res || {});
      } else {
        message.error(res.msg || "网络异常！");
      }
    });
  }


  // 关闭drawer
  const handleClose = () => {
    props.onClose();
  }

  // 展示不同类型的零部件详情 ECU,cloud,mobile
  const checkPage = (t: any) => {
    console.log('t--->', t)
    if (t === 'ECU') {
      return <ECUPage theId={props.theId} detailData={detailData}></ECUPage>
    } else if (t === 'cloud') {
      return <CloudPage theId={props.theId} detailData={detailData}></CloudPage>
    } else if (t === 'mobile') {
      return <MobilePage theId={props.theId} detailData={detailData}></MobilePage>
    }
  }
  return (
    <Style>
      <Drawer
        className='kn-drawer'
        visible={props.visible}
        onClose={() => handleClose()}
        destroyOnClose={true}
        header={
          <span style={{ fontWeight: 'bold' }}>
            {detailData.name}
          </span>
        }
        footer={false}
      >
        {checkPage(props.comType)}

      </Drawer>

    </Style>
  );
};
