import React, { useContext, useCallback } from 'react'
import { createValueContext, useValueContext } from 'hooks/common'
import { ModalAlert, Modal } from '@tencent/tea-component'

const ModalCtx = createValueContext<React.ReactNode>(undefined)

export const GlobalModal: React.FC = ({ children }) => {
  const [value] = useValueContext<React.ReactNode>(undefined)
  return <ModalCtx.Provider value={value}>
    {value.value}
    {children}
  </ModalCtx.Provider>
}

export const useModalError = () => {
  const { setValue } = useContext(ModalCtx)
  return useCallback((message: React.ReactNode) => {
    setValue(<ModalAlert visible type='error' message={message} onButtonClick={() => setValue(undefined)}></ModalAlert>)
  }, [setValue])
}

export const useModal = () => {
  const { setValue } = useContext(ModalCtx)

  const closeModal = useCallback(() => setValue(undefined), [setValue])
  const showModal = useCallback(({ body, caption, size = 'm' }: { caption?: React.ReactElement, body: React.ReactElement, size?: "s" | "m" | "l" | "xl" | "auto" }) => {
    setValue(<Modal caption={caption} visible size={size} onClose={closeModal}>
      <Modal.Body>{body}</Modal.Body>
    </Modal>)
  }, [setValue, closeModal])

  return {
    closeModal,
    showModal,
  }
}

// type FormItem = {
//   id?: string
//   type: 'text'
//   required?: boolean
//   label?: string
// }
// const TypeMap = {
//   'text': {
//     defaultValue: '',
//     render: (p: { value: string, onChange: (v: string) => void }) => <Input {...p} />,
//   }
// }

// const ModalForm: React.FC<{
//   form: Record<any, FormItem>
//   description?: React.ReactElement
//   onSubmit: (form: Record<string, string>) => Promise<unknown>
//   close: () => void
// }> = ({ form, description, onSubmit, close }) => {
//   const getState = useCallback(() => Object.fromEntries(Object.entries(form).map(([k, v]) => {
//     let value;
//     switch (v.type) {
//       case 'text':
//         value = ''
//         break
//     }
//     return [k, { ...v, value }] as const
//   })), [ form ])
//   const [ state, setState ] = useState(getState())
//   // const initState = useCallback(() => setState(getState()), [ getState ])
//   const getProps = useCallback((key: string) => ({
//     value: state[key].value,
//     onChange (v: string) {
//       setState(o => ({
//         ...o,
//         [key]: {
//           ...o[key],
//           value: v
//         }
//       }))
//     }
//   }), [ state ])
//   const [ loading, setLoading ] = useState(false)
//   const disabled = Object.values(state).some(i => i.required && i.value === '')
//   const data = useMemo(() => Object.fromEntries(Object.entries(state).map(([k, v]) => [k, v.value] as const)), [state])

//   return <>
//     <Modal.Body>
//       { description }
//       <Form>
//         { Object.entries(form).map(([k, v]) => <Form.Item required={v.required} key={k} label={v.label ?? <Localized id={'column-' + (v.id ?? k)} />}>
//           { TypeMap[v.type].render(getProps(k)) }
//         </Form.Item>) }
//       </Form>
//     </Modal.Body>
//     <Modal.Footer>
//       <Button type='primary' onClick={async () => {
//         setLoading(true)
//         try {
//           await onSubmit(data).then(close)
//         } finally {
//           setLoading(false)
//         }
//       }} disabled={disabled || loading} loading={loading}>
//         <Localized id='modal-ok' />
//       </Button>
//       <Button type='weak' onClick={close} disabled={loading}>
//         <Localized id='modal-cancel' />
//       </Button>
//     </Modal.Footer>
//   </>
// }

// type GetData<T> = T extends Record<infer K, FormItem> ? Record<K, string> : never
// export const useModalForm = <T extends Record<any, FormItem>>(form: T) => {
//   const { setValue } = useContext(ModalCtx)
//   return useCallback(<R extends any>({ onSubmit, caption, description, size='m' }: {
//     onSubmit: (form: GetData<T>) => Promise<R>
//     caption?: React.ReactElement
//     description?: React.ReactElement
//     size?: "s" | "m" | "l" | "xl" | "auto"
//   }) => {
//     return new Promise<R | undefined>((res, rej) => {
//       const close = (v?: R) => {
//         setValue(undefined)
//         res(v)
//       }
//       setValue(<Modal caption={caption} visible size={size} onClose={close}>
//         <ModalForm form={form} description={description} onSubmit={d => onSubmit(d as GetData<T>).catch(rej)} close={close} />
//       </Modal>)
//     })
//   }, [ setValue, form ])
// }
