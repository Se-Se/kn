import React, { createContext, useContext, useMemo } from 'react'
import { UserPermission, CollectorItemFragment, useCollectorAddMutation, useCollectorDeleteMutation, useCollectorStopMutation, useCollectorCollectMutation, useCollectorConfigMutation, CollectorStatus } from 'generated/graphql'
import { OperationOptionDef, Active, useModalFooter } from 'pages/template/table/Operation'
import { Localized } from 'i18n'
import { useError } from 'hooks/useError'
import { useIdProject, IdCtx } from '../Operation'
import { useRefetch } from 'pages/template/table/ActionTable'
import { useInput } from 'hooks/useInput'
import { Modal } from '@tencent/tea-component/lib/modal/ModalMain'
import { Form, Input, Justify, ExternalLink } from '@tencent/tea-component'
import { TomlEditor } from 'components/TomlEditor'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { analysisLink } from 'components/Link'
import { AnalysisMatch } from 'pages/report/Report'
import styled from '@emotion/styled/macro'

export const AnalysisIdCtx = createContext('')
const StatusActive = (...status: CollectorStatus[]) => {
  return [
    Active.One,
    ([i]: CollectorItemFragment[]) => status.includes(i.status)
  ]
}
const ConfigSize = 'xl'
const DefaultConfig = `[tunnel]
  command = "ssh root@localhost"
  setenv = [
    "",
  ]

[cmd]
  enable = true
  timeout = 8
  [cmd.cmdlist]
    getprop = []
    pm = [ "list packages -f" ]
    "cmd package list" = [ "libraries", "features", "permissions"]
    uname = [ "-s", "-n", "-r", "-v", "-m", "-p", "-i", "-o" ]
    lscpu = []
    bash = [ "-c export" ]
    sh = [ "-c export" ]
    date = []
    atq = []
    hostname = [ "-a", "-d", "-i", "-y" ]
    tc = [ "qdisc show", "class show", "filter show" ]
    ip = [ "link", "addr", "neigh", "route show table all", "rule" ]
    ifconfig = [ "-a" ]
    arp = [ "-nv" ]
    route = [ "-n" ]
    ss = [ "-nap" ]
    netstat = [ "-nap" ]
    lsblk = []
    df = [ "-h" ]
    mount = []
    iptables-save = []
    aa-status = []
    udisksctl = [ "dump" ]
    journalctl = [ "-b -x --no-pager" ]

[filesystem]
  enable = true
  timeout = 8
  depth = 8
  delay = 0

  filelist = [
    "/etc",
    "/bin",
    "/lib",
    # "/opt",
    "/proc",
    # "/sbin",
    # "/usr",
  ]
  blacklist = [
    '''^/mnt/.*''',
    '''^/var/.*''',
    '''^/tmp/.*''',
    '''^/usr/share/.*''',

    '''^/proc/[0-9]*?/task.*''',
    '''^/proc/[0-9]*?/map_files.*''',
    '''^/proc/net.*''',
    '''^/proc/irq.*''',
    '''^/proc/asound.*''',
    '''^/proc/bus.*''',
    '''^/proc/kcore.*''',
    '''^/proc/kpagecgroup.*''',
    '''^/proc/kpagecount.*''',
    '''^/proc/kpageflags.*''',
    '''^/proc/self.*''',
    '''^/proc/thread-self.*''',
  ]
  nocatlist = [
    '''^/net/.*''',
    '''^/dev/.*''',
    '''^/sys/.*''',

    '''^/proc/[0-9]*?/mem.*''',
    '''^/proc/[0-9]*?/pagemap.*''',
    '''^/proc/[0-9]*?/auxv.*''',
  ]
`
const WritePerms = [UserPermission.TeamProjectWriteable]
const Label = styled.label`
  font-size: 12px;
`

const useForm = (def?: { name: string, description: string, config: string }) => {
  const [name] = useInput(def?.name ?? '')
  const [description] = useInput(def?.description ?? '')
  const [config] = useInput(def?.config ?? DefaultConfig)

  return {
    form: <>
      <Form layout='inline-vertical'>
        <Form.Item label={<Localized id='column-name' />} required>
          <Input {...name} />
        </Form.Item>
        <Form.Item label={<Localized id='column-collectorNote' />}>
          <Input {...description} />
        </Form.Item>
      </Form>
      <Justify
        left={<Label><Localized id='column-config' /></Label>}
        right={<ExternalLink href='/documentation/sys/collector.md'><Localized id='collector-config-guide' /></ExternalLink>}
      />
      <Form.Control>
        <TomlEditor {...config} />
      </Form.Control>
    </>,
    input: useMemo(() => ({
      name: name.value,
      description: description.value,
      config: config.value,
    }), [config.value, description.value, name.value]),
    disabled: name.value.length === 0
  } as const
}

type OOI = OperationOptionDef<CollectorItemFragment>
export const Add: OOI = {
  key: 'add',
  primary: true,
  type: 'modal',
  active: Active.Any,
  perms: WritePerms,
  size: ConfigSize,
  caption: () => <Localized id='dashboard-new-collector-caption' />,
  useRender({ close }) {
    const [error, { checkError }] = useError()
    const { teamId } = useIdProject()
    const analysisID = useContext(AnalysisIdCtx)
    const refetch = useRefetch()
    const [create] = useCollectorAddMutation()
    const { form, input, disabled } = useForm()

    const onOk = useMemo(() => checkError(async () => {
      await create({
        variables: {
          teamId,
          input: {
            analysisID,
            ...input
          }
        }
      })
      refetch()
      close()
    }), [refetch, close, create, analysisID, input, checkError, teamId])
    const footer = useModalFooter({
      okId: 'dashboard-create',
      disabled,
      onOk,
      close,
    })

    return <>
      <Modal.Body>
        {error}
        {form}
      </Modal.Body>
      {footer}
    </>
  }
}

export const Edit: OOI = {
  key: 'edit',
  type: 'modal',
  primary: true,
  active: Active.One,
  perms: WritePerms,
  size: ConfigSize,
  caption: () => <Localized id='dashboard-edit-collector-caption' />,
  useRender({ close, item: [item] }) {
    const [error, { checkError }] = useError()
    const { teamId } = useIdProject()
    const refetch = useRefetch()
    const [submit] = useCollectorConfigMutation()
    const { form, input, disabled } = useForm(item)

    const onOk = useMemo(() => checkError(async () => {
      await submit({
        variables: {
          teamId,
          input: {
            id: item.id,
            ...input
          }
        }
      })
      refetch()
      close()
    }), [refetch, close, submit, item.id, input, checkError, teamId])
    const footer = useModalFooter({
      okId: 'dashboard-submit',
      disabled,
      onOk,
      close,
    })

    return <>
      <Modal.Body>
        {error}
        {form}
      </Modal.Body>
      {footer}
    </>
  }
}

export const Delete: OOI = {
  key: 'delete',
  type: 'confirm',
  active: Active.One,
  perms: WritePerms,
  message: <Localized id='dashboard-delete-collector-caption' />,
  description: (item) => <Localized id='dashboard-delete-collector-description' vars={{ item: item.map(i => i.name).join(', ') }} />,
  useOnConfirm() {
    const [remove] = useCollectorDeleteMutation()
    const refetch = useRefetch()
    const { teamId } = useContext(IdCtx)

    return [async ([item]) => {
      await remove({
        variables: {
          teamId,
          id: item.id
        }
      })
      refetch()
    }]
  }
}

export const DeleteBack: OOI = {
  key: 'delete',
  type: 'confirm',
  active: Active.One,
  perms: WritePerms,
  message: <Localized id='dashboard-delete-collector-caption' />,
  description: (item) => <Localized id='dashboard-delete-collector-description' vars={{ item: item.map(i => i.name).join(', ') }} />,
  useOnConfirm() {
    const { params } = useRouteMatch<AnalysisMatch>()
    const [remove] = useCollectorDeleteMutation()
    const refetch = useRefetch()
    const { teamId } = useContext(IdCtx)
    const history = useHistory()

    return [async ([item]) => {
      await remove({
        variables: {
          teamId,
          id: item.id
        }
      })
      refetch()
      history.push(analysisLink(params))
    }]
  }
}

export const Stop: OOI = {
  key: 'stop',
  type: 'confirm',
  active: StatusActive(
    CollectorStatus.Waiting,
    CollectorStatus.Collecting,
  ),
  perms: WritePerms,
  message: <Localized id='dashboard-stop-collector-caption' />,
  description: (item) => <Localized id='dashboard-stop-collector-description' vars={{ item: item.map(i => i.name).join(', ') }} />,
  useOnConfirm() {
    const [remove] = useCollectorStopMutation()
    const refetch = useRefetch()
    const { teamId } = useContext(IdCtx)

    return [async ([item]) => {
      await remove({
        variables: {
          teamId,
          id: item.id
        }
      })
      refetch()
    }]
  }
}

export const Collect: OOI = {
  key: 'collect',
  type: 'confirm',
  active: StatusActive(
    CollectorStatus.Failed,
    CollectorStatus.Success,
    CollectorStatus.Ready,
  ),
  primary: true,
  perms: WritePerms,
  message: <Localized id='dashboard-collect-collector-caption' />,
  description: (item) => <Localized id='dashboard-collect-collector-description' vars={{ item: item.map(i => i.name).join(', ') }} />,
  useOnConfirm() {
    const [remove] = useCollectorCollectMutation()
    const refetch = useRefetch()
    const { teamId } = useContext(IdCtx)

    return [async ([item]) => {
      await remove({
        variables: {
          teamId,
          id: item.id
        }
      })
      refetch()
    }]
  }
}
