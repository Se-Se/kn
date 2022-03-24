import React, { useState, useEffect } from 'react';
import { Localized } from 'i18n';
import { useGetCommonalityAutoTaskReportQuery } from 'generated/graphql';
import { Modal, Card } from '@tencent/tea-component';
import style from '@emotion/styled/macro';


interface RpDetailLicenseType {
  reportData: any
  projectId: string
  caseId: string
  caseStepId: string
}

const MdArea = style.div`
    max-height: 500px;
    overflow: auto;
`
const MdRow = style.div`
    display: flex
`
const MdATitle = style.div`
    padding: 5px;
    width: 150px;
    font-weight: bold;
`
const MdAContent = style.div`
    padding: 5px;
    width: 100%;
    min-width: 50px;
`

export const RpDetailLicense: React.FC<RpDetailLicenseType> = (props) => {

  const [listData, setListData] = useState<any[]>([]);

  const teamId = 'team_items;1';

  const dataHook = useGetCommonalityAutoTaskReportQuery({
    variables: {
      teamId: teamId,
      component: '',
      version: '',
      path: '',
      projectId: props.projectId,
      caseId: props.caseId,
      caseStepId: props.caseStepId,
      search: {}
    }
  })

  const renderCards = () => {
    return listData.map((value: any, key: any) => {
      console.log(value);
      return <Card bordered={true} key={key}>
        <Card.Body title={value.appName}>
          <MdRow>
            <MdATitle>Form</MdATitle>
            <MdAContent>{value.from}</MdAContent>
          </MdRow>
          <MdRow>
            <MdATitle>To</MdATitle>
            <MdAContent>{value.to}</MdAContent>
          </MdRow>
          <MdRow>
            <MdATitle>OID</MdATitle>
            <MdAContent>{value.oid}</MdAContent>
          </MdRow>
          <MdRow>
            <MdATitle>Subject</MdATitle>
            <MdAContent>{value.subject}</MdAContent>
          </MdRow>
          <MdRow>
            <MdATitle>版本</MdATitle>
            <MdAContent>{value.version}</MdAContent>
          </MdRow>
          <MdRow>
            <MdATitle>Algorithm</MdATitle>
            <MdAContent>{value.algorithm}</MdAContent>
          </MdRow>

        </Card.Body>
      </Card>
    })
  }

  useEffect(() => {
    console.log(dataHook.data);

    setListData(dataHook.data?.getCommonalityAutoTaskReport?.reportApkSignature || [])
  }, [dataHook.data])

  return <MdArea>
    {
      renderCards()
    }
  </MdArea>
}