import styled from '@emotion/styled'
import { Bubble, Button, Card, Form, Icon, Input, Layout, Text, Radio } from '@tencent/tea-component'
import { TextArea } from '@tencent/tea-component/lib/input/TextArea'
import { ManagementSelectTeam } from 'components/PickTeam'
import { SettingPrompt, useFormData } from 'components/Settings'
import { IdWithToggle, SamlSettingInput, useSamlSettingQuery, useUpdateSamlSettingMutation } from 'generated/graphql'
import { useApolloData } from 'hooks/common'
import { useError } from 'hooks/useError'
import { Localized, useGetMessage } from 'i18n'
import { TeamRoleInput } from 'pages/dashboard/team/TeamRoleInput'
import React, { useState } from 'react'

const { Content } = Layout

const AutoInsertTeam = styled.div`
  display: flex;
  flex-direction: column;
`

const LabelTip: React.FC<{ textid: string, tipid?: string }> = ({ textid, tipid }) => {
  const getMessage = useGetMessage()
  return <>
    <Text theme='text'><Localized id={'column-' + textid} /></Text>
    {tipid ? <Bubble content={getMessage('tip-' + tipid)}>
      <Icon type='info' style={{ marginLeft: 4 }} />
    </Bubble> : <></>}
  </>

}


const SelectForm: React.FC<{ id: string, tipid?: string, value: boolean, disabled?: boolean, bind: (v: boolean) => void }> = ({ id, tipid, value, disabled, bind }) => {
  return <Form.Item
    label={<LabelTip textid={id} tipid={tipid}></LabelTip>}
    required>
    <Radio.Group
      value={value ? 'enable' : 'disabled'}
      disabled={disabled}
      onChange={i => bind(i === 'enable')}
    >
      <Radio name='enable'><Localized id='ratio-enabled' /></Radio>
      <Radio name="disabled"><Localized id='ratio-disabled' /></Radio>
    </Radio.Group>
  </Form.Item>
}

type SAMLSettingsProp = {
  enabled: boolean
  url: string
  metaData: string
  autoCreateUser: boolean
  autoJoinTeam?: string
  autoJoinTeamRole?: string
}

const wrapId = (id?: string): IdWithToggle => {
  return {
    id
  }
}

export const SAMLSettings: React.FC<{ oldValue: SAMLSettingsProp }> = ({ oldValue }) => {
  const getMessage = useGetMessage()

  const { value, changed, bind, input } = useFormData(oldValue, {
    toInput(v): SamlSettingInput {
      return {
        ...v,
        autoJoinTeam: wrapId(v.autoJoinTeam),
        autoJoinTeamRole: wrapId(v.autoJoinTeamRole),
      }
    }
  })
  const [update, { loading }] = useUpdateSamlSettingMutation()
  const [err, { checkError }] = useError()
  const save = checkError(async () => {
    await update({
      variables: {
        input,
      }
    })
  })
  const [autoJoinTeamEnabled, setAutoJoinTeamEnabled] = useState(!!(value.autoJoinTeam && value.autoJoinTeamRole))
  const autoJoinTeamCompleted = autoJoinTeamEnabled ? !!(value.autoJoinTeam && value.autoJoinTeamRole) : true

  return <>
    <SettingPrompt when={changed} />
    <Card>
      <Card.Body>
        {err}
        <Form>
          <Form.Title><Text theme='text'><Localized id='management-settings-form-saml' /></Text></Form.Title>
          <SelectForm id='samlenabled' value={value.enabled} bind={bind('enabled')} />
          <Form.Item
            label={<LabelTip textid='url' tipid='samlurl' />}
            required
          >
            <Input
              placeholder={getMessage('input-url')}
              value={value.url}
              onChange={bind('url')}
              style={{ width: 400 }}
              disabled={!value.enabled}
            />
          </Form.Item>
          <Form.Item
            label={<LabelTip textid='metadata' />}
            required
          >
            <TextArea
              placeholder={getMessage('input-xml')}
              value={value.metaData}
              onChange={bind('metaData')}
              style={{ width: 800, height: 500 }}
              disabled={!value.enabled}
            />
          </Form.Item>
          <SelectForm tipid='autocreate-user' id='autocreate-user' disabled={!value.enabled} value={value.autoCreateUser} bind={bind('autoCreateUser')} />

          <Form.Item
            label={<LabelTip textid='autoaddtoteam' tipid='autoaddtoteam' />}
            required
          >
            <AutoInsertTeam>
              <Radio.Group
                disabled={!value.autoCreateUser || !value.enabled}
                value={autoJoinTeamEnabled.toString()}
                onChange={i => {
                  setAutoJoinTeamEnabled(i === 'true')
                  if (i === 'false') {
                    bind('autoJoinTeam')(undefined)
                    bind('autoJoinTeamRole')(undefined)
                  }
                }} >
                <Radio name='true'><Localized id='ratio-enabled' /></Radio>
                <Radio name="false"><Localized id='ratio-disabled' /></Radio>
              </Radio.Group>
              <div style={{ marginTop: 20 }}>
                <ManagementSelectTeam
                  disabled={!autoJoinTeamEnabled || !value.autoCreateUser || !value.enabled}
                  value={value.autoJoinTeam}
                  onChange={bind('autoJoinTeam')}
                  searchable
                />
                <div style={{ display: 'inline-block', width: 10 }} />
                <TeamRoleInput
                  disabled={!autoJoinTeamEnabled || !value.autoCreateUser || !value.enabled}
                  value={value.autoJoinTeamRole}
                  onChange={bind('autoJoinTeamRole')}
                  searchable
                />
              </div>
            </AutoInsertTeam>

          </Form.Item>
        </Form>

        <Form.Action>
          <Button
            onClick={save}
            type='primary'
            disabled={!changed || !autoJoinTeamCompleted || value.metaData === '' || value.url === ''}
            loading={loading}
          ><Localized id='save' /></Button>
        </Form.Action>
      </Card.Body>
    </Card>
  </>
}

export const Page: React.FC = () => {
  return <>
    <Content.Header title={<Localized id='management-settings' />} />
    <Content.Body>
      {useApolloData(useSamlSettingQuery(), ({ management: { SAMLSetting:
        { enabled,
          url,
          metaData,
          autoCreateUser,
          autoJoinTeam,
          autoJoinTeamRole,
        } } }) => {
        return <SAMLSettings oldValue={{
          enabled,
          url,
          metaData,
          autoCreateUser,
          autoJoinTeam: autoJoinTeam?.id,
          autoJoinTeamRole: autoJoinTeamRole?.id,
        }} />
      })}
    </Content.Body>
  </>
}


