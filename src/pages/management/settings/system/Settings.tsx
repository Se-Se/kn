import React, { useEffect, useState } from 'react'
import { Button, Card, Form, InputAdornment, InputNumber, Justify, Layout, Modal, Radio, Slider, Switch } from '@tencent/tea-component'
import { Localized, useGetMessage } from 'i18n'
import { useApolloData } from 'hooks/common'
import { LogLevel, useSystemSettingQuery, useUpdateSystemSettingMutation } from 'generated/graphql'
import styled from '@emotion/styled'
import { useError } from 'hooks/useError'
import { useInput } from 'hooks/useInput'
import { SettingPrompt, useFormData } from 'components/Settings'

const { Content } = Layout

const Hr = styled.div`
  border-top: 1px solid #BBB;
  height: 0;
  margin: 10px 0;
`

const useConfirm = (nameId: string) => {
  const getMessage = useGetMessage()
  const name = getMessage(nameId)
  return () => {
    return Modal.confirm({
      message: getMessage('reset-to-default'),
      description: getMessage('reset-message', { name }),
      okText: getMessage('reset-confirm'),
      cancelText: getMessage('reset-not-confirm'),
    })
  }
}

const AnalysisDefault = {
  singleUpload: 4096,
  analyzeTimeout: 10,
  maxSingleUpload: 4096,
}
const marksdiv = [0, 3 / 8, 5 / 8, 1.0]
// 将MB单位转成GB单位, 保留1位小数
const roundGB = (mb: number) => Math.round(mb / 1024 * 10) / 10

const AnalysisSettings: React.FC<{ oldValue: { singleUpload: number, analyzeTimeout: number }, maxSingleUpload: number }> = ({ oldValue, maxSingleUpload }) => {
  const { value, changed, bind, setValue } = useFormData(oldValue)
  const getMessage = useGetMessage()
  const [update, { loading }] = useUpdateSystemSettingMutation()
  const [err, { checkError }] = useError()
  const confirm = useConfirm('management-analysis-settings')
  const save = checkError(async (input: typeof value) => {
    update({
      variables: {
        input,
      }
    })
  })
  const setSingleUploadGB = (v: number) => bind('singleUpload')(Math.round(v * 1024))
  const maxUploadSize = Math.round(maxSingleUpload / 1024)

  const UploadMarks = marksdiv.map(i => ({ value: i * maxUploadSize, label: (i * maxUploadSize).toString() }))
  return <>
    <SettingPrompt when={changed} />
    <Card>
      <Card.Body title={<Localized id='management-analysis-settings' />}>
        {err}
        <Form style={{ maxWidth: 600 }}>
          <Form.Item label={<Localized id='column-singleUpload' />} message={<Localized vars={{ size: maxUploadSize }} id='message-singleUpload' />}>
            <Slider
              min={0}
              max={maxUploadSize}
              step={0.1}
              range={[0.1, maxUploadSize]}
              marks={UploadMarks}
              value={roundGB(value.singleUpload)}
              onUpdate={setSingleUploadGB}
              onChange={setSingleUploadGB}
              after={
                <InputNumber
                  min={0.1}
                  max={maxUploadSize}
                  step={0.1}
                  precision={1}
                  value={roundGB(value.singleUpload)}
                  unit='GB'
                  onChange={setSingleUploadGB}
                />
              }
            />
          </Form.Item>
          <Form.Item label={<Localized id='column-analyzeTimeout' />} message={<Localized id='message-analyzeTimeout' />}>
            <InputAdornment after={getMessage('unit-minute')} appearance='pure'>
              <InputNumber
                min={1}
                max={60}
                value={value.analyzeTimeout}
                onChange={bind('analyzeTimeout')}
              />
            </InputAdornment>
          </Form.Item>
        </Form>
        <Hr />
        <Justify left={<>
          <Button onClick={() => save(value)} type='primary' disabled={!changed} loading={loading}><Localized id='save' /></Button>
          <Button onClick={checkError(async () => {
            if (await confirm()) {
              setValue(AnalysisDefault)
              await save(AnalysisDefault)
            }
          })}><Localized id='reset-to-default' /></Button>
        </>} />
      </Card.Body>
    </Card>
  </>
}

const OtherDefault = {
  sessionExpTime: 15,
  logLevel: LogLevel.Info,
}
const clamp = (v: number, min: number, max: number) => {
  if (v < min) return min
  if (v > max) return max
  return v
}
const OtherSettings: React.FC<{ oldValue: { sessionExpTime: number, logLevel: LogLevel } }> = ({ oldValue }) => {
  const { value, changed, setValue } = useFormData(oldValue)
  const [update, { loading }] = useUpdateSystemSettingMutation()
  const [err, { checkError }] = useError()
  const confirm = useConfirm('management-other-settings')
  const save = checkError(async (input: typeof value) => {
    update({
      variables: {
        input,
      }
    })
  })
  const [unit, setUnit] = useState<'hour' | 'minute'>(((oldValue.sessionExpTime % 60 === 0) && oldValue.sessionExpTime !== 60) ? 'hour' : 'minute')
  const [exp] = useInput(unit === 'hour' ? Math.floor(oldValue.sessionExpTime / 60) : oldValue.sessionExpTime)
  const { value: expValue, onChange: setExp } = exp
  useEffect(() => setValue(ov => ({
    ...ov,
    sessionExpTime: unit === 'hour' ? exp.value * 60 : exp.value,
  })), [unit, exp.value, setValue])
  useEffect(() => {
    if (unit === 'hour') {
      setExp(clamp(expValue, 1, 24))
    } else if (unit === 'minute') {
      setExp(clamp(expValue, 10, 1440))
    }
  }, [unit, expValue, setExp])

  return <>
    <SettingPrompt when={changed} />
    <Card>
      <Card.Body title={<Localized id='management-other-settings' />}>
        {err}
        <Form style={{ maxWidth: 600 }}>
          <Form.Item label={<Localized id='column-sessionExpTime' />} message={<Localized id='message-sessionExpTime' />}>
            {unit === 'hour' ?
              <InputNumber
                min={1}
                max={24}
                {...exp}
              /> :
              <InputNumber
                min={10}
                max={1440}
                {...exp}
              />
            }
            <Radio.Group style={{ marginLeft: 10 }} value={unit} onChange={v => setUnit(v === 'hour' ? 'hour' : 'minute')}>
              <Radio name='minute'><Localized id='unit-minute' /></Radio>
              <Radio name='hour'><Localized id='unit-hour' /></Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={<Localized id='column-logLevel' />} message={<Localized id='message-logLevel' />}>
            <div>
              <Switch value={value.logLevel === LogLevel.Debug} onChange={v => setValue(oldV => ({
                ...oldV,
                logLevel: v ? LogLevel.Debug : LogLevel.Info
              }))} />
            </div>
          </Form.Item>
        </Form>
        <Hr />
        <Justify left={<>
          <Button onClick={() => save(value)} type='primary' disabled={!changed} loading={loading}><Localized id='save' /></Button>
          <Button onClick={checkError(async () => {
            if (await confirm()) {
              setValue(OtherDefault)
              exp.onChange(OtherDefault.sessionExpTime)
              setUnit('minute')
              await save(OtherDefault)
            }
          })}><Localized id='reset-to-default' /></Button>
        </>} />
      </Card.Body>
    </Card>
  </>
}

export const Page: React.FC = () => {
  return <>
    <Content.Header title={<Localized id='management-settings' />} />
    <Content.Body>
      {useApolloData(useSystemSettingQuery(), ({ management: { systemSetting: {
        singleUpload,
        maxSingleUpload,
        analyzeTimeout,
        sessionExpTime,
        logLevel,
      } } }) => {
        return <>
          <AnalysisSettings oldValue={{ singleUpload, analyzeTimeout }} maxSingleUpload={maxSingleUpload} />
          <OtherSettings oldValue={{ sessionExpTime, logLevel }} />
        </>
      })}
    </Content.Body>
  </>
}
