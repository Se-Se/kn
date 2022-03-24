import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Bubble, Button, Modal, ModalMessage } from '@tencent/tea-component'
import { Localized } from 'i18n'
import { useToggle } from 'hooks/common'
import { useError } from 'hooks/useError'
import { UserPermission, useHasPermission } from 'components/PermissionGate'
import { useViewerQuery } from 'generated/graphql'

export interface ModalRender<T> {
  (props: {
    item: T[]
    close: () => void
  }): React.ReactElement
}
interface UseOnConfirm<T> {
  (): [(item: T[]) => Promise<void>]
}
interface UseLink<T> {
  (item: T[]): {
    url: string
    target?: string
  }
}
interface ActiveType<T, Ctx> {
  (item: T[], ctx?: Ctx): boolean
}
export type ModalSize = 's' | 'm' | 'l' | 'xl' | 'auto' | number
/**
 * Define this type on top level and don't modify the value,
 * some of it properties are React Hooks, modifying it will
 * cause unexpected behavior
 */
export type OperationOptionDef<T, Ctx = undefined> = ({
  type: 'confirm'
  message: React.ReactNode | ((item: T[]) => React.ReactNode)
  description: React.ReactNode | ((item: T[]) => React.ReactNode)
  useOnConfirm: UseOnConfirm<T>
} | {
  type: 'modal'
  size?: ModalSize
  caption?: (item: T[]) => React.ReactElement
  useRender: ModalRender<T>
} | {
  type: 'link'
  useLink: UseLink<T>
}) & {
  key: string
  primary?: boolean
  active?: ActiveType<T, Ctx> | ActiveType<T, Ctx>[]
  useActive?: () => ActiveType<T, Ctx>[]
  perms?: UserPermission | UserPermission[]
  bubble?: (item: T[], ctx?: Ctx) => React.ReactNode | void
}

export interface RenderOption<T, Ctx> {
  link: boolean
  selected: T[]
  ctx?: Ctx
}

type RenderButton = (onClick: () => void) => React.ReactElement
function resolveItemRender<T>(r: React.ReactNode | ((item: T[]) => React.ReactNode), item: T[]): React.ReactNode {
  if (typeof r === 'function') {
    return r(item)
  }
  return r
}
const ConfirmOperation: React.FC<{
  message: React.ReactNode
  description: React.ReactNode
  useOnConfirm: UseOnConfirm<any>
  selected: any[]
  renderButton: RenderButton
}> = ({ message, description, useOnConfirm, selected, renderButton }) => {
  const [error, { checkError, clearError }] = useError()
  const [visible, setVisible, resetVisible] = useToggle(false)
  const [onConfirm] = useOnConfirm()
  const onOk = useMemo(() => checkError(async () => {
    await onConfirm(selected)
    resetVisible()
  }), [onConfirm, selected, resetVisible, checkError])
  const footer = useModalFooter({
    onOk,
    close: resetVisible
  })
  useEffect(() => {
    if (visible) {
      clearError()
    }
  }, [visible, clearError])

  return <>
    {renderButton(setVisible)}
    <Modal visible={visible} onClose={resetVisible}>
      <Modal.Body>
        {error}
        <ModalMessage message={resolveItemRender(message, selected)} description={resolveItemRender(description, selected)} />
      </Modal.Body>
      {footer}
    </Modal>
  </>
}

const ModalBody: React.FC<{
  useRender: ModalRender<any>
  close: () => void
  selected: any[]
}> = ({ useRender, close, selected }) => useRender({
  item: selected,
  close
})

const LinkOperation: React.FC<{
  useLink: UseLink<any>,
  selected: any[]
  renderButton: RenderButton
}> = ({ useLink, selected, renderButton }) => {
  const { url, target } = useLink(selected)

  return renderButton(useCallback(() => {
    window.open(url, target)
  }, [url, target]))
}

const ModalOperation: React.FC<{
  active: boolean
  caption?: (item: any[]) => React.ReactElement
  renderButton: RenderButton
  selected: any[]
  useRender: ModalRender<any>
  size?: ModalSize
}> = ({ active, caption: captionFactory, renderButton, selected, useRender, size }) => {
  const [visible, setVisible, resetVisible] = useToggle(false)
  const [exited, setExited, resetExited] = useToggle(true)
  const caption = (!exited && active && captionFactory && captionFactory(selected)) || undefined

  return <>
    {renderButton(() => {
      setVisible()
      resetExited()
    })}
    <Modal
      visible={visible}
      onClose={resetVisible}
      onExited={setExited}
      caption={caption}
      size={size}
    >
      {!exited && active && <ModalBody
        useRender={useRender}
        close={resetVisible}
        selected={selected}
      />}
    </Modal>
  </>
}

function isActive<T, Ctx>(active: ActiveType<T, Ctx> | ActiveType<T, Ctx>[] | undefined, item: T[], ctx?: Ctx): boolean {
  if (!active) {
    return false
  }
  if (Array.isArray(active)) {
    return active.every(i => i(item, ctx))
  } else {
    return active(item, ctx)
  }
}

const Operation: React.FC<{
  operation: OperationOptionDef<any, any>
} & RenderOption<any, any>> = ({ operation: i, selected, link, ctx }) => {
  const useActive = i.useActive ?? (() => [() => true])
  const active = isActive(useActive(), selected, ctx) && isActive(i.active, selected, ctx)
  const bubble = i.bubble?.(selected, ctx)
  const renderButton: RenderButton = (onClick) => <Bubble content={bubble || null}><Button
    type={link ? 'link' : i.primary ? 'primary' : 'weak'}
    disabled={!active}
    onClick={(e) => {
      e?.stopPropagation()
      onClick()
    }}
  ><Localized id={`operation-${i.key}`} /></Button></Bubble>

  if (i.type === 'confirm') {
    return <ConfirmOperation
      message={i.message}
      description={i.description}
      useOnConfirm={i.useOnConfirm}
      selected={selected}
      renderButton={renderButton}
    />
  } else if (i.type === 'modal') {
    return <ModalOperation
      active={active}
      caption={i.caption}
      useRender={i.useRender}
      selected={selected}
      renderButton={renderButton}
      size={i.size}
    />
  } else if (i.type === 'link') {
    return <LinkOperation
      useLink={i.useLink}
      selected={selected}
      renderButton={renderButton}
    />
  } else {
    throw new Error(`type ${i} is not implement`)
  }
}

export const useRenderOperations = () => {
  const hasPermission = useHasPermission()
  return function <T, Ctx>(operations: (OperationOptionDef<T, Ctx>)[], opt: RenderOption<T, Ctx>) {
    return operations
      .filter(i => hasPermission(i.perms))
      .map((i, id) => <Operation key={id} operation={i} {...opt} />)
  }
}

export const Active = {
  Any: (a: any[]) => true,
  One: (a: any[]) => a.length === 1,
  GtZero: (a: any[]) => a.length > 0,
}
export const UseActive = {
  useViewer: () => {
    const { data } = useViewerQuery()
    return data?.viewer
  }
}

export const useModalFooter = ({ okId = 'modal-ok', cancelId = 'modal-cancel', onOk, close, disabled, loading: outLoading }: {
  okId?: string,
  cancelId?: string,
  disabled?: boolean
  onOk: () => Promise<void>
  close: () => void
  loading?: boolean
}) => {
  const [loading, setLoading] = useState(false)
  const handleOk = useCallback(async () => {
    try {
      setLoading(true)
      await onOk()
    } finally {
      setLoading(false)
    }
  }, [onOk])
  return <Modal.Footer>
    <Button type='primary' onClick={handleOk} disabled={disabled || loading} loading={loading || outLoading}>
      <Localized id={okId} />
    </Button>
    <Button type='weak' onClick={close} disabled={loading}>
      <Localized id={cancelId} />
    </Button>
  </Modal.Footer>
}
