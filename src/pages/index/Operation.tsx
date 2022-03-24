import React, { useCallback, Fragment } from 'react'
import { useSetToken } from 'components/TokenService'
import { List } from '@tencent/tea-component'
import { Localized } from '@fluent/react'
import { useHistory } from 'react-router-dom'
import { useLogoutMutation } from 'generated/graphql'

// const useProfile = () => {
//   const history = useHistory()

//   return [
//     <List.Item onClick={() => history.push('/dashboard/settings/profile')}>
//       <Localized id='profile' />
//     </List.Item>
//   ]
// }

const useLogout = () => {
  const setToken = useSetToken()
  const [logout] = useLogoutMutation()
  const clearToken = useCallback(async () => {
    await logout()
    setToken('')
  }, [setToken, logout])

  return [
    <List.Item onClick={clearToken}>
      <Localized id='logout' />
    </List.Item>
  ]
}


export const useOperation = () => {
  const buttonList: React.ReactElement[] = []
  const modalList: React.ReactElement[] = []
  const add = ([button, modal]: (React.ReactElement | undefined)[]) => {
    if (button) {
      buttonList.push(button)
    }
    if (modal) {
      modalList.push(modal)
    }
  }
  // add(useProfile())
  add(useLogout())

  return {
    overlay: <List type='option'>
      {buttonList.map((i, id) => <Fragment key={id}>{i}</Fragment>)}
    </List>,
    modal: <>
      { modalList.map((i, id) => <Fragment key={id}>{i}</Fragment>)}
    </>
  }
}
