import React from 'react'
import { useExpiredLicenseQuery } from 'generated/graphql'
import { Alert } from '@tencent/tea-component'
import { useGetMessage } from 'i18n'

export const ExpireContext = React.createContext<boolean>(false);

export const Patent: React.FC = ({ children }) => {
  const getMessage = useGetMessage()
  const result = useExpiredLicenseQuery()
  const isExpired: boolean = result.data?.expiredLicense?.expireTime ? true : false
  return <>
    {isExpired ?
      <Alert type='error' style={{ margin: 0, height: '48px' }}>
        {getMessage('license-expired-alert')}
      </Alert> : <></>}
    <ExpireContext.Provider value={isExpired}>
      {children}
    </ExpireContext.Provider>
  </>
}
