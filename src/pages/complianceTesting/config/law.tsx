import React from 'react';
import { Layout, Card } from '@tencent/tea-component';
import { Localized } from 'i18n';

const { Content, Body } = Layout;

export const Page: React.FC = () => {


  return <>
    <Body>
      <Content>
        <Content.Header
          title={<Localized id='compliance-checkConfig-law'></Localized>}
        ></Content.Header>
        <Content.Body>
          <Card>
            <Card.Body>
              {/* {renderWelcomeCpn} */}
            </Card.Body>
          </Card>
          <div>
            {/* {renderGroceriesCpn} */}
          </div>
          {/* {renderMatterListCpn} */}
          <Card>
            <Card.Body title={<Localized id='studio-myProject-title'></Localized>}>
              {/* {renderProjectCpn} */}
            </Card.Body>
          </Card>
        </Content.Body>
      </Content>
    </Body>
  </>
}
