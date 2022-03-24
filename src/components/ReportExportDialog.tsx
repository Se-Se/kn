import { Checkbox } from '@tencent/tea-component'
import { Modal } from '@tencent/tea-component/lib/modal/ModalMain'
import { useDependenceQuery } from 'generated/graphql'
import { useError } from 'hooks/useError'
import { Localized, useGqlLanguage } from 'i18n'
import { ModalRender, useModalFooter } from 'pages/template/table/Operation'
import { useEffect, useMemo, useState } from 'react'
import { useDownloadToken } from './Download'

export const ExportUseRender: ModalRender<{ id: string }> = ({ item: [item], close }) => {
  const { language } = useGqlLanguage()
  const { loading, data } = useDependenceQuery()
  const reportId = `${item.id};${language}`
  if (!reportId) {
    console.error('no report id')
  }
  const [value, setValue] = useState<string[]>([])
  const [error, { checkError, setError }] = useError()
  const getToken = useDownloadToken()
  const onOk = useMemo(() => checkError(async () => {
    if (value.includes('baseline')) {
      await getToken().then(token => window.open(`/download_report/${reportId}?token=${token}`))
    }
    if (value.includes('audit-detail')) {
      await getToken().then(token => window.open(`/download_report_excel/${reportId}?token=${token}`))
    }
    close()
  }), [close, value, reportId, getToken, checkError])
  useEffect(() => {
    if (data) {
      if (!data.dependence.latex) {
        setError('error-latex-not-installed')
      }
    }
  }, [data, setError])
  const footer = useModalFooter({
    disabled: (value.includes('baseline') && (loading || !data?.dependence.latex)) || value.length === 0,
    onOk,
    close,
    loading,
  })

  return <>
    <Modal.Body>
      {error}
      <Checkbox.Group layout='column' value={value} onChange={setValue}>
        <Checkbox name='baseline'><Localized id='dashboard-export-baseline' /></Checkbox>
        <Checkbox name='audit-detail'><Localized id='dashboard-export-audit-detail' /></Checkbox>
      </Checkbox.Group>
    </Modal.Body>
    {footer}
  </>
}
