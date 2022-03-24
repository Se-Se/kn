import React, { useState, useEffect } from 'react'
import { Layout, Card, Justify, Segment, DatePicker, Button } from '@tencent/tea-component'
import { Localized, useGetMessage } from 'i18n'
import moment from 'moment'
import { SegmentOption } from '@tencent/tea-component/lib/segment/SegmentOption'
import { useManagementLogQuery } from 'generated/graphql'
import { useApolloData } from 'hooks/common'
import { Code } from 'components/Code'
import styled from '@emotion/styled/macro'
import { downloadBlob } from 'utils/download'

const BorderCode = styled(Code)`
  border: 1px solid black;
  padding: 5px;
  margin-top: 10px;
`

const { Content } = Layout

enum Options {
  Now,
  Before24h,
}

export const Page: React.FC = () => {
  const getMessage = useGetMessage()
  const [segmentValue, setSegmentValue] = useState<string | undefined>(Options.Now.toString())
  const [value, setValue] = useState<moment.Moment | undefined>(undefined)
  const [earliestLogDate, setEarliestLogDate] = useState<string | null | undefined>(undefined)
  const options: SegmentOption[] = [
    { text: getMessage('segment-realtime'), value: Options.Now.toString() },
    { text: getMessage('segment-before24h'), value: Options.Before24h.toString() },
  ]
  const optionMap: Record<Options, moment.Moment | undefined> = {
    [Options.Now]: undefined,
    [Options.Before24h]: moment().subtract(1, 'd'),
  }
  const result = useManagementLogQuery({
    variables: {
      date: value?.toISOString()
    }
  })
  const ed = result.data?.management.earliestLogDate
  useEffect(() => setEarliestLogDate(ed), [ed])
  const handleDownload = (filename: string) => () => {
    const blob = new Blob([result.data!.management.log!.content])
    downloadBlob(blob, filename)
  }

  return <>
    <Content.Header title={<Localized id='management-log' />} />
    <Content.Body>
      <Card>
        <Card.Body>
          <Justify
            left={<>
              <Segment
                value={segmentValue}
                options={options}
                onChange={value => {
                  setSegmentValue(value);
                  setValue(optionMap[value as unknown as Options])
                }}
              />
              <DatePicker
                range={earliestLogDate ? [moment(earliestLogDate), moment()] : undefined}
                value={value}
                onChange={value => {
                  setValue(value)
                  setSegmentValue(undefined)
                }}
              />
              {result.data && <Button><Localized id='current-server' vars={{ server: result.data.management.hostname }} /></Button>}
            </>}
            right={
              <><Button icon='download' onClick={handleDownload(`log_${(value ?? moment()).format('YYMMDD')}.log`)} /></>
            }
          />
          {useApolloData(result, ({ management }) => {
            return <>
              <BorderCode code={management.log?.content!} />
            </>
          })}
        </Card.Body>
      </Card>
    </Content.Body>
  </>
}
