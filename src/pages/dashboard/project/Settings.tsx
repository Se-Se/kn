import React, { useEffect, useState } from 'react'
import { useFormData } from 'components/Settings'
import { AnalysisSettingFragment, AnalyzeFileType } from 'generated/graphql'
import { Button, Checkbox, Form, Icon, Input, InputNumber, List } from '@tencent/tea-component'
import { Localized, useGetMessage } from 'i18n'
import styled from '@emotion/styled/macro'

const Hr = styled.div`
  border-top: 1px solid #BBB;
  height: 0;
  margin: 10px 0;
`
const Line = styled.div`
  display: flex;
  & > input {
    flex: auto;
  }
  & > button {
    margin-left: 5px;
  }
`

export const useAnalysisSettingForm = ({ __typename, ...oldValue }: AnalysisSettingFragment) => {
  const { value, bind, changed } = useFormData(oldValue)
  const [fileList, setFileList] = useState<string[]>([])
  const getMessage = useGetMessage()
  const setFileType = (v: string[]) => {
    // 必须选择一个
    if (v.length === 0) return
    bind('fileType')(v.sort() as AnalyzeFileType[])
  }
  const addEmpty = () => {
    setFileList(v => [...v, ''])
  }
  const remove = (idx: number) => {
    setFileList(v => {
      const removed = [...v.slice(0, idx), ...v.slice(idx + 1)]
      if (removed.length === 0) {
        removed.push('')
      }
      return removed
    })
  }
  useEffect(() => {
    const v = fileList.filter(i => i)
    bind('fileSkiped')(v)
  }, [fileList, bind])
  useEffect(() => {
    const fileSkiped = oldValue.fileSkiped.length === 0 ? [''] : [...oldValue.fileSkiped]
    setFileList(fileSkiped)
  }, [oldValue.fileSkiped])

  return {
    value,
    changed,
    form: <>
      <Form>
        <Form.Item
          label={<Localized id='column-analyzeTimeout' />}
          tips={<Localized id='message-analyzeTimeout-analysis' />}
        >
          <InputNumber
            value={value.analyzeTimeout}
            onChange={bind('analyzeTimeout')}
            min={1}
            max={60}
            unit={getMessage('unit-minute')}
          />
        </Form.Item>
        <Form.Item
          label={<Localized id='column-analyzeFileType' />}
          tips={<Localized id='message-analyzeFileType' />}
        >
          <Checkbox.Group value={value.fileType} onChange={setFileType}>
            {Object.keys(AnalyzeFileType).map(k => <Checkbox key={k} name={k}>
              <Localized id={`enum-AnalyzeFileType-${k}`} />
            </Checkbox>)}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          label={<Localized id='column-fileSkiped' />}
          tips={<Localized id='message-fileSkiped' />}
        >
          <List>
            {fileList.map((t, i) => <List.Item key={i}>
              <Line>
                <Input value={t} placeholder={getMessage('fileSkipped-placeholder')} onChange={(v) => setFileList(l => {
                  l[i] = v
                  return [...l]
                })} />
                <Button
                  disabled={i === 0 && fileList.length === 1}
                  onClick={() => remove(i)}
                  type='link'
                ><Localized id='operation-delete' /></Button>
              </Line>
            </List.Item>)}
          </List>
          <Hr />
          <Button type='icon' onClick={addEmpty}><Icon type='plus' /></Button>
        </Form.Item>
      </Form>
    </>
  } as const
}
