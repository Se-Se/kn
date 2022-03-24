import React, { useContext, useCallback } from 'react'
import { createValueContext, useValueContext } from 'hooks/common'
import { Drawer } from '@tencent/tea-component'

type DrawerProps = {
  title: string
  visible: boolean
  body?: React.ReactNode
}
const DefaultProp = {
  title: '',
  visible: false
}

const DrawerCtx = createValueContext<DrawerProps>(DefaultProp)

export const ReportDrawer: React.FC = ({ children }) => {
  const [ctxValue, value, setValue] = useValueContext<DrawerProps>(DefaultProp)
  return <DrawerCtx.Provider value={ctxValue}>
    <Drawer
      showMask
      maskStyle={{ backgroundColor: '#ffffff00' }}
      title={value.title}
      visible={value.visible}
      size={'l'}
      placement={'right'}
      onClose={() => setValue(v => ({
        ...v,
        visible: false
      }))}
      style={{ width: 'auto' }}
    >
      {value.body}
    </Drawer>
    {children}
  </DrawerCtx.Provider>
}

export type DrawerParams = { title: string, body: React.ReactElement }

export const useDrawer = () => {
  const { setValue } = useContext(DrawerCtx)
  const close = useCallback(() => setValue(v => ({ ...v, visible: false })), [setValue])
  return useCallback((params: ((v: { close: () => void }) => DrawerParams) | DrawerParams) => {
    const { title, body } = typeof params === 'function' ? params({ close }) : params
    setValue({
      title: title,
      body: body,
      visible: true
    })
  }, [close, setValue])
}
