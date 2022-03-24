import React, { useState } from 'react'
import { useProjectLibCveSecQuery, useProjectKernelCveSecQuery, CvssRank } from 'generated/graphql'
import { useDetailReportTable, TableTabs, getSysReport, JustifyLeftFilterRenderProp } from 'pages/report/common'
import { omitVariables } from 'utils/omitVariables'
import { Localized, useGetMessage } from 'i18n'
import { Button, Modal, Radio, Tooltip, Form, Text, SelectMultiple, TagSelect, PopConfirm, Icon } from '@tencent/tea-component'
import { useDownloadToken } from 'components/Download'
import { useAnalysisCtx, useAnalysisId } from 'pages/report/context'
import { useToggle } from 'hooks/common'
import { useModalFooter } from 'pages/template/table/Operation'
import { useReportConfig } from 'components/Config'
import { CvssRiskField, } from 'components/RiskField'
import { KernelCveTable, LibCveTable } from './CVETable'
import { FileRef } from 'pages/report/common/component'
import { FlexDiv } from 'components/FlexDiv'
import { WeakButton } from '../component'
import { useHistory } from 'react-router-dom'
import styled from '@emotion/styled'
import { Values } from 'utils/values'

type FieldValues = Record<string, string[]>


const RightWidth = 600


type State = {
  pid?: number,
  cvssRank?: CvssRank,
}

const BottomMargin = styled.div`
  margin-bottom: 10px;
`

const DownloadOptions = ['all', 'lib', 'kernel'] as const
const DownloadButton: React.FC<{ reportId: string, isDisabled?: boolean }> = ({ reportId, isDisabled = false }) => {
  const getToken = useDownloadToken()
  const [type, setType] = useState<Values<typeof DownloadOptions>>('all')
  const [visible, setVisible, close] = useToggle(false)
  const onOk = async () => {
    const token = await getToken()
    window.open(`/download_cve/${reportId}/${type}?token=${token}`)
    close()
  }
  const footer = useModalFooter({
    onOk,
    close,
  })

  return <>
    <Modal
      visible={visible}
      caption={<Localized id='download-cvesec-report' />}
      onClose={close}
    >
      <Modal.Body>
        <Radio.Group value={type} onChange={i => setType(i as Values<typeof DownloadOptions>)}>
          {DownloadOptions.map(i => <Radio key={i} name={i}>
            <Localized id={`enum-cve-${i}`} />
          </Radio>)}
        </Radio.Group>
      </Modal.Body>
      {footer}
    </Modal>
    <Tooltip title={<Localized id='export' />}>
      <Button type='icon' icon='download' onClick={setVisible} disabled={isDisabled}></Button>
    </Tooltip>
  </>
}

const LeftFilterOrder = ['time', 'cvssRank', 'status']
const LeftFilter: React.FC<{ prop: JustifyLeftFilterRenderProp, filterMapSetter: React.Dispatch<React.SetStateAction<FieldValues>>, defaultFilterValue?: Record<string, string[]> }> = ({ prop, filterMapSetter, defaultFilterValue }) => {
  const getMessage = useGetMessage()
  const leftOther = <TagSelect style={{ width: 200 }}
    options={prop.fields ? prop.fields['detail']?.filter(i => i.value !== '')?.map(i => {
      return { value: i.value, text: getMessage('cvesec-leftfilter-option-' + i.value) }
    }) : []}
    onChange={value => prop.setFilter(old => {
      const ret = {
        ...old,
        detail: value,
      }
      filterMapSetter(ret)
      return ret
    }
    )}
  />
  return <FlexDiv>
    {LeftFilterOrder.map(filterItem =>
      <SelectMultiple
        key={filterItem}
        staging={false}
        appearance="button"
        size='s'
        defaultValue={defaultFilterValue?.[filterItem]}
        disabled={prop.fields ? prop.fields[filterItem]?.filter(i => i.value !== '').length === 0 ? true : false : false}
        placeholder={getMessage('cvesec-leftfilter-plholder-' + filterItem)}
        options={prop.fields ? prop.fields[filterItem]?.filter(i => i.value !== '')?.map(i => {
          if (filterItem !== 'time') {
            return { value: i.value, text: getMessage('cvesec-leftfilter-option-' + i.value) }
          } else {
            return { value: i.value }
          }
        }) : []}
        allOption={{ value: "", text: getMessage('cvesec-leftfilter-option-all') }}
        onChange={value => prop.setFilter(old => {
          let ret = {
            ...old,
            [filterItem]: value,
          }
          filterMapSetter(ret)
          return ret
        }
        )}
      />)}
    <Form>
      <Form.Item label={<Localized id='cvesec-leftfilter-plholder-detail' />}>
        {leftOther}
      </Form.Item>
    </Form>
  </FlexDiv>
}

const CVESecLib: React.FC = () => {
  const id = useAnalysisId()
  const reportId = useAnalysisCtx().reportId
  const [filterFields, setFilterFields] = useState<FieldValues>({})
  const history = useHistory<State | undefined>()
  const state = history.location.state
  const defaultFilterValue: Record<string, string[]> = { 'cvssRank': state?.cvssRank ? [state.cvssRank] : [] }

  const perHeader = <BottomMargin>
    {state?.pid && <WeakButton type="weak" onClick={() => {
      history.push({ ...history.location, state: undefined })
    }}>
      <FlexDiv style={{ "alignItems": "center" }}><Localized id='filter-pid' vars={{ pid: state.pid ?? -1 }} /><Icon size="s" type="close" /></FlexDiv>
    </WeakButton>}
  </BottomMargin>
  const [table] = useDetailReportTable(
    omitVariables(useProjectLibCveSecQuery, {
      id,
      pid: state?.pid ?? null
    }),
    ({ analysis }) => getSysReport(analysis)?.system.libCveSec,
    {
      columns: [{
        columnName: 'component',
        key: 'component',
        render: ({ component, version, description }) => {
          return <PopConfirm
            title={<Localized id='popconfirm-components-title' />}
            arrowPointAtCenter
            placement="top-start"
            message={description}
          >
            <Button type={'link'}>{`${component} ${version}`}</Button>
          </PopConfirm>

        }
      }, {
        columnName: 'risk-stat',
        key: 'risk',
        width: RightWidth + 10,
        render: ({ risk }) => {
          return <CvssRiskField cvssRank={risk} />
        }
      }],
      recordKey: r => r.component,
      expanded: {
        render({ component, version }) {
          return <LibCveTable component={component} version={version} filterFields={filterFields} />
        },
        gapCell: 1,
      },
      rightOps: <><DownloadButton reportId={reportId} isDisabled={true} /></>,
      justifyLeftFilterRender: (fieldValues) => {
        return <><LeftFilter prop={fieldValues} filterMapSetter={setFilterFields} defaultFilterValue={defaultFilterValue} /></>
      },
      defaultFilterValue
    }
  )
  return <>{perHeader}{table}</>
}

const CVESecKernel: React.FC = () => {
  const id = useAnalysisId()
  const reportId = useAnalysisCtx().reportId
  const [filterFields, setFilterFields] = useState<FieldValues>({})
  const history = useHistory<State | undefined>()
  const state = history.location.state
  const perHeader = <BottomMargin>
    {state && <WeakButton type="weak" onClick={() => {
      history.push({ ...history.location, state: undefined })
    }}>
      <FlexDiv style={{ "alignItems": "center" }}><Localized id='filter-pid' vars={{ pid: state.pid ?? -1 }} /><Icon size="s" type="close" /></FlexDiv>
    </WeakButton>}
  </BottomMargin>
  const [table] = useDetailReportTable(
    omitVariables(useProjectKernelCveSecQuery, {
      id,
      pid: state?.pid
    }),
    ({ analysis }) => getSysReport(analysis)?.system.kernelCveSec,
    {
      columns: [
        {
          columnName: 'component',
          key: 'component',
          render: ({ component, version }) => {
            return <Text>{`${component} ${version}`}</Text>
          }
        },
        {
          columnName: 'path',
          key: 'path',
          render: ({ path }) => {
            return path ? <FileRef path={path} /> : <></>
          }
        }, {
          columnName: 'risk-stat',
          key: 'risk',
          width: RightWidth + 10,
          render: ({ risk }) => {
            return <CvssRiskField cvssRank={risk} />
          }
        }],
      recordKey: r => r.component,
      expanded: {
        render({ path, component, version }) {
          return path ?
            <KernelCveTable component={component} version={version} path={path} filterFields={filterFields} /> :
            <>Missing Path</>
        },
        gapCell: 1,
      },
      rightOps: <><DownloadButton reportId={reportId} /></>,
      justifyLeftFilterRender: (fieldValues) => {
        return <><LeftFilter prop={fieldValues} filterMapSetter={setFilterFields} /></>
      }
    }
  )
  return <>{perHeader}{table}</>
}


export const ProjectCVESec: React.FC = () => {
  const tabs: { id: string, component: React.FC<{}> }[] = []

  const { cveSec, cveKernel } = useReportConfig()
  if (cveSec) {
    tabs.push({
      id: 'third-party',
      component: CVESecLib
    })
  }
  if (cveKernel) {
    tabs.push({
      id: 'kernel',
      component: CVESecKernel,
    })
  }
  return <TableTabs tabs={tabs} />
}
