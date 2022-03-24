import React, { useCallback, useState } from 'react'
import { Form, Input, Button, Layout, H2 } from '@tencent/tea-component'
import { useInput } from 'hooks/useInput'
import { useLoginMutation, useViewerQuery } from 'generated/graphql'
import { useSetToken } from 'components/TokenService'
import { useHistory, useLocation } from 'react-router-dom'
import { Localized } from 'i18n'
import styled from '@emotion/styled/macro'
import { useGetMessage } from 'i18n'
import { useEnterCallback } from 'hooks/useEnterCallback'
import { useError } from 'hooks/useError'

const { Content } = Layout

const Title = styled(H2)`
  text-align: center;
  margin-bottom: 20px;
  font-weight: normal;
`
const FormContainner = styled.div`
  width: 320px;
  margin: 0 auto;
  padding: 60px 40px;
  background: white;
  border-radius: 10px;
  font-size: 16px;

  input {
    width: 100%;
    margin-bottom: 20px;
    padding: 15px;

    height: 46px;
    border-radius: 5px;
  }
`
const FullButton = styled(Button)`
  width: 100%;

  height: 46px;
  border-radius: 5px;
`

export type Login = {
  errorMessage?: string
}

export const Page: React.FC = () => {
  useViewerQuery({ fetchPolicy: 'network-only' })
  const { state } = useLocation<Login>()
  const errorMessage = state?.errorMessage
  const getMessage = useGetMessage()
  const history = useHistory()
  const setToken = useSetToken()
  const [doLogin] = useLoginMutation()
  const [username] = useInput('')
  const [password] = useInput('')
  const [error, { checkError }] = useError(errorMessage)
  const [loading, setLoading] = useState(false)
  const handleLogin = checkError(useCallback(async () => {
    try {

      setLoading(true)
      const variables = {
        username: username.value,
        password: password.value
      }
      const { data } = await doLogin({
        variables
      })
      const token = data?.loginByPassword?.token
      if (!token) throw new Error('token empty')
      setToken(token)
      history.replace(history.location.search.substr(1) || '/')
    } finally {
      setLoading(false)
    }
  }, [doLogin, history, password.value, setToken, username.value]))

  const enter = useEnterCallback(handleLogin)

  return <>
    <Content>
      <Content.Body>
        <FormContainner>
          <Title><Localized id='login' /></Title>
          {error}
          <Form>
            <Input data-testid='username' {...username} {...enter} placeholder={getMessage('username')} />
            <Input data-testid='password' {...password} {...enter} placeholder={getMessage('password')} type='password' />
          </Form>
          <FullButton data-testid='submit' loading={loading} type='primary' onClick={handleLogin}><Localized id='login' /></FullButton>
        </FormContainner>
      </Content.Body>
    </Content>
  </>
}
