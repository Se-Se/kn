import React, { useState, Fragment } from 'react'
import { Form, Text, Segment, Justify, H3 } from '@tencent/tea-component'
import { Localized } from 'i18n'
import { CheckRisk, CveFragment, Cvss2Info, Cvss3Info } from 'generated/graphql'
import styled from '@emotion/styled/macro'
import { RiskColors, RiskIcons } from './RiskField'

enum cvssBarColor {
  Critical = '#E54545',
  High = '#FF9D00',
  Medium = '#FFC218',
  Low = '#0ABF5B',
  NA = '#f3f4f7',
}

const RiskItemBox = styled.span`
  align-items: center;
  display: flex;
  & > svg {
    width: 12px;
    height: 12px;
    vertical-align: middle;
    margin-right: 5px;
  }
`

const CvssBarTabs = styled.div`
display:flex;
margin-bottom:0;
`

const CvssBarTab = styled.div`
display:flex;
flex-direction:column;
margin-bottom:0;
`
const CvssBar = styled.div`
height: 4px;
background:#0abf5b;
margin-bottom:0;
`
const CvssBarPadding = styled.div`
display:flex;
height: 4px;
width: 1px;
`

const cvss2VectorList: CvssVectorBarProp<Cvss2Info>[] = [
  {
    labelID: 'accessVector',
    useID: '',
    ids: ['NETWORK', 'ADJACENT_NETWORK', 'LOCAL']
  },
  {
    labelID: 'accessComplexity',
    useID: '',
    ids: ['LOW', 'MEDIUM', 'HIGH']
  },
  {
    labelID: 'authentication',
    useID: '',
    ids: ['NONE', 'SINGLE', 'MULTIPLE']
  },
  {
    labelID: 'confidentialityImpact',
    useID: '',
    ids: ['COMPLETE', 'PARTIAL', 'NONE']
  },
  {
    labelID: 'integrityImpact',
    useID: '',
    ids: ['COMPLETE', 'PARTIAL', 'NONE']
  },
  {
    labelID: 'availabilityImpact',
    useID: '',
    ids: ['COMPLETE', 'PARTIAL', 'NONE']
  }
]

const cvss3VectorList: CvssVectorBarProp<Cvss3Info>[] = [
  {
    labelID: 'attackVector',
    useID: '',
    ids: ['NETWORK', 'ADJACENT_NETWORK', 'LOCAL', 'PHYSICAL']
  },
  {
    labelID: 'attackComplexity',
    useID: '',
    ids: ['LOW', 'HIGH']
  },
  {
    labelID: 'privilegesRequired',
    useID: '',
    ids: ['NONE', 'LOW', 'HIGH']
  },
  {
    labelID: 'userInteraction',
    useID: '',
    ids: ['NONE', 'REQUIRED']
  },
  {
    labelID: 'scope',
    useID: '',
    ids: ['UNCHANGED', 'CHANGED']
  },
  {
    labelID: 'confidentialityImpact',
    useID: '',
    ids: ['HIGH', 'LOW', 'NONE']
  },
  {
    labelID: 'integrityImpact',
    useID: '',
    ids: ['HIGH', 'LOW', 'NONE']
  },
  {
    labelID: 'availabilityImpact',
    useID: '',
    ids: ['HIGH', 'LOW', 'NONE']
  }
]

const getBarStyle: Record<number, { colors: cvssBarColor[], width: number }> = {
  2: { colors: [cvssBarColor.Critical, cvssBarColor.High], width: 120 },
  3: { colors: [cvssBarColor.Critical, cvssBarColor.High, cvssBarColor.Low], width: 120 },
  4: { colors: [cvssBarColor.Critical, cvssBarColor.High, cvssBarColor.Medium, cvssBarColor.Low], width: 90 },
}

export type CvssVectorBarProp<T extends Cvss2Info | Cvss3Info> = {
  labelID: keyof T
  useID?: string
  ids: string[]
}

export const CvssVectorBar = function <T extends Cvss2Info | Cvss3Info>(): React.FC<{ prop: CvssVectorBarProp<T> }> {
  return ({ prop }) => {
    const barstyle = getBarStyle[prop.ids.length]
    const barTabs = <>
      {prop.ids.map((v, i) =>
        <Fragment key={i}>
          <CvssBarTab style={{ width: barstyle.width }}>
            {prop.useID === v ?
              <><Text theme='text'><Localized id={'cvssbar-content-' + prop.labelID + '-' + v} /></Text><CvssBar style={{ background: barstyle.colors[i] }} /></> :
              <><Text theme='weak'><Localized id={'cvssbar-content-' + prop.labelID + '-' + v} /></Text><CvssBar style={{ background: cvssBarColor.NA }} /></>
            }
          </CvssBarTab>
          <CvssBarPadding />
        </Fragment>
      )}
    </>
    return <>
      <Form.Item align='middle' label={<Localized id={'cvssbar-label-' + prop.labelID} />}>
        <Form.Text>
          <CvssBarTabs>
            {barTabs}
          </CvssBarTabs>
        </Form.Text>
      </Form.Item>
    </>
  }

}

type CvssInfo = Cvss2Info | Cvss3Info

const getGqlCvssData = function <T extends CvssInfo>(input: T, field: keyof T) {
  return input[field] || ''
}

const CVSSScore: React.FC<{ score: number }> = ({ score }) => {
  let s: CheckRisk
  if (score >= 9.0) {
    s = CheckRisk.High
  } else if (score >= 7.0) {
    s = CheckRisk.Medium
  } else if (score >= 4.0) {
    s = CheckRisk.Warning
  } else if (score >= 0.1) {
    s = CheckRisk.Pass
  } else {
    s = CheckRisk.NotAvailable
  }
  const Icon = RiskIcons[s]

  return <RiskItemBox>
    <Icon />
    <Text style={{ color: RiskColors[s] }}>{score.toPrecision(2)}</Text>
  </RiskItemBox>

}

const Cvssbars: React.FC<{ cvss: CvssInfo }> = ({ cvss }) => {
  let cvssret: JSX.Element[] = []
  if (cvss.__typename === 'Cvss2Info') {
    cvssret = cvss2VectorList.map(i => {
      i.useID = (getGqlCvssData(cvss, i.labelID) || '').toString()
      const Cvss2Bar = CvssVectorBar<Cvss2Info>()
      return <Fragment key={'cvss2-' + i.labelID + i.useID}><Cvss2Bar prop={i}></Cvss2Bar></Fragment>
    })
  } else if (cvss.__typename === 'Cvss3Info') {
    cvssret = cvss3VectorList.map(i => {
      i.useID = (getGqlCvssData(cvss, i.labelID) || '').toString()
      const Cvss3Bar = CvssVectorBar<Cvss3Info>()
      return <Cvss3Bar key={'cvss3-' + i.labelID + i.useID} prop={i}></Cvss3Bar>
    })
  }
  return <>
    <Form.Item label="CVSS">
      <Form.Text>
        <CVSSScore score={cvss.cvss} />
      </Form.Text>
    </Form.Item>
    {cvssret}
  </>
}


export const CvssVector: React.FC<{ cve: CveFragment }> = ({ cve }) => {
  const cvss2Seg = { name: 'CVSS2.0', c: cve.cvss2Info }
  const cvss3Seg = { name: 'CVSS3.0', c: cve.cvss3Info }
  const [name, setName] = useState(cvss3Seg.c ? cvss3Seg.name : cvss2Seg.name);
  return <>
    <Justify top left={
      <H3><Localized id='cvedetail-cvss-title' /></H3>
    }
      right={
        <Segment
          value={name}
          onChange={c => {
            setName(c === cvss2Seg.name ? cvss2Seg.name : cvss3Seg.name)
          }}
          options={[
            { value: cvss2Seg.name },
            { value: cvss3Seg.name, disabled: cvss3Seg.c ? false : true },
          ]}
        />
      }
    />
    <Form layout='fixed' >
      <Cvssbars cvss={(name === cvss2Seg.name ? cvss2Seg.c : cvss3Seg.c) || {} as Cvss2Info} />
    </Form>
  </>
}
