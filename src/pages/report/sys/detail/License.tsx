import React from 'react'
import { LicenseRisk, LicenseTag, useProjectLicenseQuery } from 'generated/graphql'
import { useDetailReportTable, getSysReport, expandedColumns } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { useAnalysisId } from 'pages/report/context'
import { useApolloData } from 'hooks/common'
import { FileRef } from 'pages/report/common/component'
import { Bubble, Button, Col, ExternalLink, Form, PopConfirm, Row, Text } from '@tencent/tea-component'
import { useDrawer } from 'components/Drawer'
import { Localized, useGetMessage, useGqlLanguage } from 'i18n'
import styled from '@emotion/styled/macro'
import { LicenseRiskColors } from 'utils/color'
import { LicenseIcon } from 'icons'
import { useDownloadToken } from 'components/Download'
import { useHistory } from 'react-router-dom'

const Round = styled.i`
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 8px;
  vertical-align: middle;
  margin-right: 4px;

  ${Object.keys(LicenseRiskColors).map(risk => `&[data-risk="${risk}"] { background: ${LicenseRiskColors[risk as LicenseRisk]}; }`)}
`

const Li = styled.li`
  height: 20px;
  line-height: 20px;
`

type State = {
  risk?: LicenseRisk
}

const LicenseExportButton: React.FC<{ isDisabled?: boolean }> = ({ isDisabled = false }) => {
  const { language } = useGqlLanguage()
  const id = useAnalysisId()
  const reportId = `${id};${language}`
  if (!reportId) {
    console.error('no report id')
  }
  const getToken = useDownloadToken()
  return <Button icon='download' disabled={isDisabled} onClick={async () => {
    await getToken().then(token => window.open(`/download_license/${reportId}?token=${token}`))
  }} />
}

const ExpandedLicense = ({ component }: { component: string }) => {
  const id = useAnalysisId()
  return useApolloData(useProjectLicenseQuery({
    variables: {
      id,
      component,
      withFile: true,
    },
  }), ({ analysis }) => {
    const license = getSysReport(analysis)?.license?.nodes?.[0]
    if (!license) return <>Failed to get license file list</>
    const lic = {
      filelist: <>{license.file?.map(f => <FileRef path={f} />)}</>
    }
    return expandedColumns<typeof lic>({
      columns: [
        'filelist',
      ]
    })(lic)
  })
}


/**
 *  required: [LicenseTag!]!
 *  forbidden: [LicenseTag!]!
 *  permitted: [LicenseTag!]!
 */
type TagType = 'required' | 'forbidden' | 'permitted'
const IconMap: Record<TagType, string> = {
  required: LicenseIcon.Required,
  forbidden: LicenseIcon.Forbidden,
  permitted: LicenseIcon.Permitted,
}
const ColorMap: Record<TagType, string> = {
  required: '#FF9D00',
  forbidden: '#E54545',
  permitted: '#0ABF5B',
}
const LBlock: React.FC<{ type: TagType }> = ({ type }) => {
  return <span style={{
    display: 'inline-block',
    background: ColorMap[type],
    width: 3,
    height: 18,
    marginRight: 5,
  }}></span>
}
const LText: React.FC<{ left: React.ReactNode, color?: string }> = ({ left, color, children, ...rest }) => {
  return <div style={{ color, display: 'flex', marginBottom: 10 }} {...rest}>
    {left}
    {children}
  </div>
}
const Tag: React.FC<{ type: TagType, tags: LicenseTag[] }> = ({ type, tags }) => {
  return <>
    <LText
      left={<img alt={type} style={{ marginRight: 5 }} src={IconMap[type]} />}
    ><Localized id={`license-${type}`} /></LText>
    {tags.map((i, id) => <LText left={<LBlock type={type} />}>
      <Bubble
        key={id}
        placement='right'
        content={<>{i.description}</>}
      >{i.name}</Bubble>
    </LText>)}
  </>
}

type LicenseDetailProps = {
  licenseName: string
  component: string
  id: string
}
const LicenseDetail: React.FC<LicenseDetailProps> = ({ id, component, licenseName }) => {
  return useApolloData(useProjectLicenseQuery({
    variables: {
      id,
      component,
      withContent: true,
    },
  }), (data) => {
    const l = getSysReport(data.analysis)?.license?.nodes?.[0]?.license.find(i => i.name === licenseName)
    if (!l) {
      console.error('no license', data)
      return <>No license</>
    }
    const isEmptyTag = !(l.required?.length !== 0 || l.forbidden?.length !== 0 || l.permitted?.length !== 0)
    return <>
      <Form layout='vertical'>
        <Form.Item label={<Text theme='label'><Localized id='column-license' /></Text>}>
          <Text reset>{l.name}</Text>
        </Form.Item>
        {!isEmptyTag && <Row>
          <Col><Tag type='required' tags={l.required ?? []} /></Col>
          <Col><Tag type='forbidden' tags={l.forbidden ?? []} /></Col>
          <Col><Tag type='permitted' tags={l.permitted ?? []} /></Col>
        </Row>}
        <Form.Item label={<Text theme='label'><Localized id='column-license-source' /></Text>}>
          <ExternalLink href={l.source}>{l.source}</ExternalLink>
        </Form.Item>
        <textarea readOnly cols={100} rows={30} value={l.content ?? ''} />,
      </Form>
    </>
  })
}

export const ProjectLicense: React.FC = () => {
  const showDrawer = useDrawer()
  const getLocalizeMsg = useGetMessage()
  const id = useAnalysisId()
  const history = useHistory<State | undefined>()
  const state = history.location.state
  const defaultFilterValue: Record<string, string[]> = { 'risk': state?.risk ? [state.risk] : [] }

  const [table] = useDetailReportTable(
    omitVariables(useProjectLicenseQuery, {
      id,
    }),
    ({ analysis }) => getSysReport(analysis)?.license,
    {
      columns: [
        {
          key: 'component',
          render({ component, description }) {
            return <PopConfirm
              title={<Localized id='popconfirm-components-title' />}
              arrowPointAtCenter
              placement="top-start"
              message={description}
            >
              <Button type={'link'}>{`${component}`}</Button>
            </PopConfirm>
          }
        },
        {
          key: 'license',
          render({ license, component }) {
            return <ul>{license.map(i => <Li key={i.name}><Button
              type='link'
              onClick={() => showDrawer({
                title: getLocalizeMsg('license-detail'),
                body: <LicenseDetail id={id} component={component} licenseName={i.name} />,
              })}
            >{i.name}</Button></Li>)}</ul>
          }
        },
        {
          key: 'risk',
          columnName: 'licenseRisk',
          render({ risk }) {
            return <ul>{risk.map(({ risk }, i) => <Li key={i}>
              <Round data-risk={risk}></Round><Localized id={`enum-license-risk-${risk}`} />
            </Li>)}</ul>
          }
        }
      ],
      recordKey: r => r.component,
      expanded: {
        render: ({ component }) => <ExpandedLicense key={id} component={component} />,
        gapCell: 1,
      },
      verticalTop: true,
      topFilter: 'license',
      rightOps: <LicenseExportButton isDisabled={true} />,
      defaultFilterValue
    }
  )

  return table
}
