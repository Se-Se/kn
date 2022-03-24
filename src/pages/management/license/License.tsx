import React, { useState, useMemo } from 'react'
import { Layout, Row, Col, Card, Justify, Button, Modal, Form, Segment, Input, Upload } from '@tencent/tea-component'
import { Localized, useGetMessage } from 'i18n'
import { KVTable } from 'components/KVTable'
import { SystemLicenseFragment, useLicenseQuery, useUpdateLicenseMutation } from 'generated/graphql'
import { formatTime } from 'utils/timeFormat'
import { useApolloData, useToggle } from 'hooks/common'
import { useInput } from 'hooks/useInput'
import { useError } from 'hooks/useError'
import { useModalFooter } from 'pages/template/table/Operation'

const { Content } = Layout
const { TextArea } = Input
const PatentCard: React.FC<SystemLicenseFragment> = ({ name, customerCompany, version, expireTime }) => {
  const records = []
  if (customerCompany) {
    records.push({
      key: <Localized id='column-company' />,
      value: customerCompany
    })
  }
  if (expireTime) {
    records.push({
      key: <Localized id='column-expireTime' />,
      value: formatTime(expireTime)
    })
  }
  if (version) {
    records.push({
      key: <Localized id='column-version' />,
      value: version
    })
  }
  return <Card>
    <Card.Body title={name}>
      <KVTable records={records} />
    </Card.Body>
  </Card>
}

export const License: React.FC = () => {
  const result = useLicenseQuery()
  const [err, { checkError }] = useError()
  const [licenseText, setLicenseText] = useInput<string | undefined>(undefined)
  const [visible, open, close] = useToggle(false)
  const [layout, setLayout] = useState('text')
  const [status, setStatus] = useState<string>('')
  const [file, setFile] = useState<File | undefined>()
  const [create] = useUpdateLicenseMutation({
    update(cache) {
      return cache.reset()
    }
  })
  const getMessage = useGetMessage()

  function handleStart(file: File) {
    setFile(file)
    setStatus('validating')
  }

  function handleAbort() {
    setFile(undefined)
    setStatus('')
  }

  const onOk = useMemo(() => checkError(async () => {
    await create({
      variables: file ? {
        file
      } : {
        content: licenseText.value,
      }
    })
    result.refetch()
    close()
    setLicenseText('')
  }), [create, close, licenseText, checkError, file, setLicenseText, result])

  const footer = useModalFooter({
    okId: 'modal-update',
    onOk,
    close,
  })

  return <>
    <Content.Header title={<Localized id='management-license' />} />
    {err}
    <Content.Body>
      <Justify style={{ marginBottom: '20px' }} left={
        <Button type='primary' onClick={open}><Localized id='management-update-license'></Localized></Button>
      } />
      <Modal
        disableEscape
        visible={visible}
        caption={getMessage('management-update-license')}
        onClose={close}
      >
        <Modal.Body>
          <Form>
            <Form.Item label={<Localized id='license-format' />}>
              <Segment
                value={layout}
                onChange={layout => setLayout(layout)}
                options={[
                  { value: 'text', text: getMessage('license-upload-type-text') },
                  { value: 'file', text: getMessage('license-upload-type-file') },
                ]}
              />
            </Form.Item>
            <Form.Item label={<Localized id='license-licenseText' />}>
              {
                layout === 'text' ? <TextArea
                  {...licenseText}
                  size='full'
                  placeholder={getMessage('license-upload-placeholder')}
                /> :
                  <Form.Control message={getMessage('file-upload-limit-message')}>
                    <Upload onStart={handleStart}>
                      {({ open }) => (
                        <Upload.File
                          filename={file && file.name}
                          button={<>
                            <Button onClick={open}>{getMessage('file-upload')}</Button>
                            {status && <Button type='link' style={{ marginLeft: 8 }} onClick={handleAbort}>{getMessage('license-upload-delete')}</Button>}
                          </>}
                        />
                      )}
                    </Upload>
                  </Form.Control>
              }
            </Form.Item>
          </Form>
        </Modal.Body>
        {footer}
      </Modal>
      <Row>
        <>
          {useApolloData(result, ({ management: { license } }) => {
            return <>
              {license.map(i => {
                return <Col span={12} key={i.name}>
                  <PatentCard {...i} />
                </Col>
              })}
            </>
          })}
        </>
      </Row>
    </Content.Body>
  </>
}
