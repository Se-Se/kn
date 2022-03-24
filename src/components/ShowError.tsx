import React, { useEffect } from 'react'
import { Alert } from '@tencent/tea-component'
import { useToggle } from 'hooks/common'
import { useErrorToDescription, ErrorType } from 'hooks/useErrorToDescription'


export const ShowError: React.FC<{ error?: ErrorType }> = ({ error, children }) => {
  const [visible, setVisible, resetVisible] = useToggle(false)
  const getDescription = useErrorToDescription()
  useEffect(() => {
    if (error) {
      setVisible()
    }
  }, [error, setVisible])


  return <Alert
    type='error'
    visible={visible}
    onClose={resetVisible}
    extra={children}
  >
    <span className='on-error' data-testid='show-error'>
      {getDescription(error)}
    </span>
  </Alert>
}
