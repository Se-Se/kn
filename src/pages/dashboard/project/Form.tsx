import React, { useMemo, useEffect, useCallback, useState, useRef } from 'react'
import { AnalysisType, UploadFileType, FileInput, AnalysisListFileItemFragment, Maybe } from 'generated/graphql'
import { Form, Input, Select, Button, SelectOptionWithGroup, Upload, Table, Icon, Text } from '@tencent/tea-component'
import styled from '@emotion/styled'
import { useInput } from 'hooks/useInput'
import { Localized, useGetMessage } from 'i18n'
import { useTableColumn } from 'pages/template/common'
import { useUploadTypeFilter } from 'components/Config'
import { extname } from 'path'
import { BubbleStyle } from 'utils/style'
import { analysisTypeCategory, AnalysisTypeItem, Category } from 'components/AnalysisTypeItem'

type AnalysisTypeConfig = {
  availableFileType: UploadFileType[]
  defaultFileType: UploadFileType
  limit: number
}

const SystemTypeConfig: AnalysisTypeConfig = {
  availableFileType: [UploadFileType.Collector, UploadFileType.Image],
  defaultFileType: UploadFileType.Collector,
  limit: Infinity,
}
const AnalysisTypeFileConfig: Record<AnalysisType, AnalysisTypeConfig> = {
  [AnalysisType.SystemLinux]: SystemTypeConfig,
  [AnalysisType.SystemAndroid8]: SystemTypeConfig,
  [AnalysisType.SystemAndroid9]: SystemTypeConfig,
  [AnalysisType.SystemAndroid10]: SystemTypeConfig,
  [AnalysisType.SystemOther]: SystemTypeConfig,
  [AnalysisType.ArtifactApk]: {
    availableFileType: [UploadFileType.Apk],
    defaultFileType: UploadFileType.Apk,
    limit: 1,
  },
  [AnalysisType.ArtifactPackage]: {
    availableFileType: [UploadFileType.Package],
    defaultFileType: UploadFileType.Package,
    limit: 1,
  },
  [AnalysisType.ArtifactRtos]: {
    availableFileType: [UploadFileType.RtosFirmware],
    defaultFileType: UploadFileType.RtosFirmware,
    limit: 1,
  },
}
// 为了防止默认值被修改, 这里使用函数返回
const defaultAnalyzeParam = (type: UploadFileType) => {
  const defaultValue: Record<UploadFileType, unknown> = {
    [UploadFileType.Image]: {
      type: '',
      mountPoint: ''
    },
    [UploadFileType.Collector]: '',
    [UploadFileType.Apk]: '',
    [UploadFileType.Package]: '',
    [UploadFileType.RtosFirmware]: {
      type: '',
    },
  }
  return defaultValue[type]
}

const Flex = styled.span`
  display: flex;
`
const GlowInput = styled(Input)`
  flex: auto;
`
const UploadButton = styled(Button)`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ImageOptions: SelectOptionWithGroup[] = ['extfs', 'vfatfs', 'ubifs', 'squashfs', 'tar'].map(value => ({ value }))
const RtosOptions: SelectOptionWithGroup[] = ['bin', 'hex', 's19'].map(value => ({ value }))
interface FileListItem {
  id?: string
  type: UploadFileType
  name?: string
  file?: File
  analyzeParam: Record<string, any>
}

type ReturnType = FileInput
type DefaultParam = () => any

const fileTypeRecord: Record<string, [UploadFileType, DefaultParam?] | undefined> = {
  '.cdat': [UploadFileType.Collector],
  '.img': [UploadFileType.Image],
  '.apk': [UploadFileType.Apk],
  '.s19': [UploadFileType.RtosFirmware, () => ({ type: 's19' })],
  '.hex': [UploadFileType.RtosFirmware, () => ({ type: 'hex' })],
  '.bin': [UploadFileType.RtosFirmware, () => ({ type: 'bin' })],
}

const FileField: React.FC<{ analysisType: AnalysisType, item: FileListItem, refresh: () => void }> = ({ analysisType, item, refresh }) => {
  const name = item.name ? item.name : item.file ? item.file.name : 'Upload'
  const guessFileType = (file: File): { type: UploadFileType, analyzeParam?: any } => {
    const ext = extname(file.name)
    const fileType = fileTypeRecord[ext]

    if (fileType) {
      const [guessedType, guessedParam] = fileType
      const cfg = AnalysisTypeFileConfig[analysisType]
      if (cfg.availableFileType.includes(guessedType)) {
        const analyzeParam = guessedParam ? {
          [guessedType]: guessedParam(),
        } : undefined

        return {
          type: guessedType,
          analyzeParam,
        }
      }
    }

    return {
      type: AnalysisTypeFileConfig[analysisType].defaultFileType,
    }
  }

  return <>
    <Upload beforeUpload={(file: File) => {
      item.file = file
      item.name = file.name
      const guessed = guessFileType(file)
      item.type = guessed.type
      if (guessed.analyzeParam) {
        item.analyzeParam = guessed.analyzeParam
      }
      refresh()
      return false
    }}><UploadButton title={name}>{name}</UploadButton></Upload>
  </>
}

const useAnalyzeParam = ({ value, type, onChange }: {
  value: Record<string, any>
  onChange: (param: Record<string, any>) => void
  type: UploadFileType
}) => {
  // 为了防止useEffect每次被更新, 这里使用useRef来获取最新值
  const valueRef = useRef(value)
  const onChangeRef = useRef(onChange)
  valueRef.current = value
  onChangeRef.current = onChange

  const valueType = value[type]
  useEffect(() => {
    if (valueType === undefined) {
      onChangeRef.current({
        ...valueRef.current,
        [type]: defaultAnalyzeParam(type)
      })
    }
  }, [valueType, type])

  return [value[type] ?? defaultAnalyzeParam(type), useCallback((child: any) => onChange({
    ...value,
    [type]: child
  }), [onChange, type, value])] as const
}
const AnalyzeParamInput: React.FC<{
  type: UploadFileType,
  value: Record<string, any>,
  onChange?: (param: Record<string, any>) => void
}> = ({ type, value, onChange }) => {
  const handleChange = onChange ?? (() => { })
  const [childValue, setChildValue] = useAnalyzeParam({
    value,
    onChange: handleChange,
    type,
  })
  const readonly = !onChange
  const rop = {
    readonly,
    disabled: readonly
  }

  if (type === UploadFileType.Image) {
    return <>
      <Select type='simulate' {...rop} size='s' options={ImageOptions} value={childValue.type} onChange={type => setChildValue({
        ...childValue,
        type
      })} />
      <GlowInput {...rop} value={childValue.mountPoint} onChange={mountPoint => setChildValue({
        ...childValue,
        mountPoint
      })} />
    </>
  } else if (type === UploadFileType.RtosFirmware) {
    return <>
      <Select type='simulate' {...rop} size='s' options={RtosOptions} value={childValue.type} onChange={type => setChildValue({
        ...childValue,
        type
      })} />
    </>
  } else {
    return <GlowInput {...rop} value={childValue} onChange={v => setChildValue(v)} />
  }
}

const checkAnalyzeParam = (item: FileInput, type: UploadFileType, cb: (v: any) => boolean) => {
  return item.type === type && cb(item.analyzeParam?.[type])
}

export const useFileList = (analysisType: AnalysisType, oldList?: AnalysisListFileItemFragment[] | null, readonly = false) => {
  const [fileList, setFileList] = useState<FileListItem[]>(oldList || [])
  const uploadTypeFilter = useUploadTypeFilter()
  const setFileItem = useCallback((item: FileListItem, val: Partial<FileListItem>) => {
    setFileList(list => {
      const id = list.indexOf(item)
      if (id === -1) throw new Error('item not found')
      return [...list.slice(0, id), {
        ...list[id],
        ...val,
      }, ...list.slice(id + 1)]
    })
  }, [])
  useEffect(() => {
    if (readonly && oldList) {
      setFileList(oldList)
    }
  }, [oldList, readonly])
  const getMessage = useGetMessage()
  const analysisCategory = analysisTypeCategory(analysisType)
  const config = AnalysisTypeFileConfig[analysisType]
  const options = useMemo<SelectOptionWithGroup[]>(() =>
    config.availableFileType.filter(type => uploadTypeFilter(type))
      .map(i => ({ text: getMessage(`option-${i}`), value: i })
      ), [config.availableFileType, uploadTypeFilter, getMessage])
  const addEmpty = useCallback(() => {
    setFileList(fileList => [...fileList, {
      type: options[0].value as UploadFileType,
      analyzeParam: {},
    }])
  }, [options])
  const readonlyColumns = useTableColumn<FileListItem>([{
    key: 'type',
    width: 120,
    render({ type }) {
      return options.find(o => o.value === type)?.text ?? type
    }
  }, {
    key: 'file',
    width: 200,
    render({ name }) {
      return name
    }
  }, {
    key: 'param',
    render({ type, analyzeParam }) {
      return <AnalyzeParamInput type={type} value={analyzeParam} />
    }
  }])
  const columns = useTableColumn<FileListItem>(useMemo(() => [{
    key: 'file',
    width: 200,
    render(item) {
      return <FileField analysisType={analysisType} item={item} refresh={() => setFileList(o => [...o])} />
    }
  }, {
    key: 'type',
    width: 120,
    header: () =>
      <>
        {getMessage('column-type')}
        <BubbleStyle content={
          <Text theme='label' style={{ whiteSpace: 'nowrap' }}>
            <Localized id='type-tips' />
          </Text>
        }>
          {analysisCategory === Category.System && <Icon type='info' />}
        </BubbleStyle>
      </>
    ,
    render(item) {
      return options?.length === 1 ? <Text>{options[0].text}</Text> :
        <Select type='simulate' options={options} value={item.type} onChange={(v) => {
          setFileItem(item, { type: v as UploadFileType })
        }} />
    }
  }, {
    key: 'param',
    render(item) {
      return <Flex>
        <AnalyzeParamInput type={item.type} value={item.analyzeParam} onChange={(v) => {
          setFileItem(item, { analyzeParam: v })
        }} />
        <Button icon='close' onClick={() => setFileList(o => {
          const id = o.indexOf(item)
          if (id === -1) {
            return o
          }
          return [...o.slice(0, id), ...o.slice(id + 1)]
        })} />
      </Flex>
    }
  }], [analysisType, getMessage, analysisCategory, options, setFileItem]))

  const uploadResult: ReturnType[] = useMemo(
    () => fileList.filter(i => i.file || i.name).map(i => ({
      id: i.id,
      type: i.type,
      name: i.name,
      file: i.file,
      analyzeParam: i.analyzeParam,
    })) as ReturnType[],
    [fileList]
  )

  const form = readonly ? <Table columns={readonlyColumns} records={fileList} /> : <>
    <Table
      columns={columns}
      records={fileList}
    />
    {fileList.length < config.limit && <Button type='icon' onClick={addEmpty}><Icon type='plus' /></Button>}
  </>

  const disabled = uploadResult.some(item => checkAnalyzeParam(item, UploadFileType.Image, i => !i?.type)
    || checkAnalyzeParam(item, UploadFileType.RtosFirmware, i => !i?.type))
  return { form, input: uploadResult, disabled } as const
}

export const useAnalysisForm = (defaultParams?: {
  name: string,
  description: string,
  analysisType: AnalysisType,
  file?: Maybe<AnalysisListFileItemFragment[]>
}, readonly?: boolean) => {
  const [name] = useInput(defaultParams?.name ?? '')
  const [description] = useInput(defaultParams?.description ?? '')
  const [analysisType] = useInput<AnalysisType | undefined>(defaultParams?.analysisType)
  const disabled = !name.value || !analysisType.value
  const rop = {
    readonly,
    disabled: readonly
  }
  const form = <>
    <Form>
      <Form.Item label={<Localized id='column-analysisName' />} required>
        <Input {...name} {...rop} />
      </Form.Item>
      <Form.Item label={<Localized id='column-analysisNote' />}>
        <Input {...description} {...rop} />
      </Form.Item>
      <AnalysisTypeItem {...analysisType} {...rop} disabled={!!defaultParams?.analysisType} />
    </Form>
  </>

  return [form, {
    name: name.value || undefined,
    description: description.value,
    analysisType: analysisType.value ?? AnalysisType.SystemLinux,
  }, disabled] as const
}
