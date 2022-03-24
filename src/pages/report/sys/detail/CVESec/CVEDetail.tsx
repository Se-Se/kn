import React from 'react'
import { CveFragment } from 'generated/graphql'
import { Localized } from 'i18n'
import { ExternalLink, Form } from '@tencent/tea-component'
import { FileRef } from 'pages/report/common/component'
import { CvssVector } from 'components/Cvss'
import styled from '@emotion/styled'


const DetailLayout = styled.div`
flex-direction: column;
`

const DetailWidth = 555
export const CveDetail: React.FC<{ cve: CveFragment, libname: string, close: () => void }> = ({ close, cve, libname }) => {
  const linkItem = (field: keyof Pick<CveFragment, 'poc' | 'exp' | 'patch'>) => {
    return <Form.Item label={<Localized id={'cvedetail-basic-' + field} />}>
      {cve[field]?.map(l => <Form.Text key={l}><ExternalLink href={l}>{l}</ExternalLink></Form.Text>)}
    </Form.Item>
  }
  return <DetailLayout>
    <Form layout='fixed' readonly style={{ width: DetailWidth }}>
      <Form.Title>
        <Localized id='cvedetail-basic-title' />
      </Form.Title>
      <Form.Item label={<Localized id='cvedetail-basic-desc' />} align='top'>
        <Form.Text>{cve.description}</Form.Text>
      </Form.Item>
      <Form.Item label={<Localized id='cvedetail-basic-files' />}>
        {cve.file.map(f => <Form.Text key={f}><FileRef onClick={close} path={f} style={{ maxWidth: DetailWidth - 100 }} /></Form.Text>)}
      </Form.Item>
      <Form.Item label={<Localized id='cvedetail-basic-lib' />}>
        <Form.Text>{libname}</Form.Text>
      </Form.Item>
      {linkItem('poc')}
      {linkItem('patch')}
      {linkItem('exp')}
    </Form>
    <br />
    <CvssVector cve={cve} />
  </DetailLayout>
}
