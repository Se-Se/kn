import { Form, Select } from '@tencent/tea-component'
import { AnalysisType } from 'generated/graphql'
import { Localized, useGetMessage } from 'i18n'
import { FeatureConfigFragment } from 'generated/graphql'
import { Values } from 'utils/values'
import { useConfig } from './Config'
import { useInput } from 'hooks/useInput'
import { keys } from 'utils/keys'

const SystemTypeEnum = [
  AnalysisType.SystemLinux,
  AnalysisType.SystemAndroid8,
  AnalysisType.SystemAndroid9,
  AnalysisType.SystemAndroid10,
  AnalysisType.SystemOther,
] as const
const SystemTypes = SystemTypeEnum as readonly AnalysisType[];
export type SystemType = Extract<
  AnalysisType,
  Values<typeof SystemTypeEnum>
>

const ArtifactTypeEnum = [
  AnalysisType.ArtifactApk,
  AnalysisType.ArtifactPackage,
  AnalysisType.ArtifactRtos,
] as const
const ArtifactTypes = ArtifactTypeEnum as readonly AnalysisType[];
export type ArtifactType = Extract<
  AnalysisType,
  Values<typeof ArtifactTypeEnum>
>

export type AnalysisFeatureConfig = Pick<
  FeatureConfigFragment,
  'systemLinux'
  | 'systemAndroid'
  | 'systemOther'
  | 'artifactAPK'
  | 'artifactRTOS'
  | 'artifactPackage'
>

export enum Category {
  System = 'System',
  Artifact = 'Artifact',
}

const EnabledMap: Record<keyof AnalysisFeatureConfig, AnalysisType[]> = {
  systemLinux: [AnalysisType.SystemLinux],
  systemAndroid: [AnalysisType.SystemAndroid8, AnalysisType.SystemAndroid9, AnalysisType.SystemAndroid10],
  systemOther: [AnalysisType.SystemOther],
  artifactAPK: [AnalysisType.ArtifactApk],
  artifactPackage: [AnalysisType.ArtifactPackage],
  artifactRTOS: [AnalysisType.ArtifactRtos],
}

export const CategoryMap: Record<Category, readonly AnalysisType[]> = {
  [Category.System]: SystemTypes,
  [Category.Artifact]: ArtifactTypes,
}

export const analysisTypeCategory = (analysisType: AnalysisType) => {
  if (SystemTypes.includes(analysisType)) {
    return Category.System
  }
  if (ArtifactTypes.includes(analysisType)) {
    return Category.Artifact
  }
  throw new Error('Unreachable: ' + analysisType)
}

export const enabledAnalysisType = (cfg: FeatureConfigFragment) => {
  let enabledType: AnalysisType[] = []

  for (const key of keys(EnabledMap)) {
    if (cfg[key]) {
      enabledType = [...enabledType, ...EnabledMap[key]]
    }
  }

  return enabledType
}

export const categoryOptions = (enabledType: AnalysisType[]) => {
  const enabled = [...new Set(enabledType.map(analysisTypeCategory)).values()]
  return enabled.map(i => ({
    value: i.toString()
  }))
}

export const selectOptions = (enabledTypeInCategory: readonly AnalysisType[], enabledType: AnalysisType[], getMessage: (id: string) => string) => {
  return enabledTypeInCategory
    .filter(i => enabledType.includes(i))
    .map(i => ({
      key: i,
      value: i,
      text: getMessage(i),
    }))
}

export type AnalysisTypeItemProps = {
  value: AnalysisType | undefined,
  onChange: (value: AnalysisType | undefined) => void,
  readonly?: boolean,
  disabled?: boolean,
}

export const AnalysisTypeItem: React.FC<AnalysisTypeItemProps> = ({ value, onChange, readonly, disabled }) => {
  const getMessage = useGetMessage()
  const cfg = useConfig()
  const enabledType = enabledAnalysisType(cfg)
  const options = categoryOptions(enabledType)
  const [category] = useInput<Category | undefined>(value ? analysisTypeCategory(value) : undefined)
  const rop = {
    readonly,
    disabled,
  }

  return <>
    <Form.Item label={<Localized id='column-analysisType' />} required>
      <Select
        type='simulate'
        options={options}
        value={category.value}
        onChange={i => {
          const c = i as Category
          category.onChange(c)
          if (value && c !== analysisTypeCategory(value)) {
            onChange(undefined)
          }
        }}
        {...rop}
        appearance='button'
        boxSizeSync
        size='m'
      />
    </Form.Item>
    {category.value && <Form.Item label={<Localized id='column-systemType' />} required>
      <Select
        key={category.value}
        value={value}
        onChange={i => onChange(i as AnalysisType)}
        {...rop}
        type='simulate'
        appearance='button'
        boxSizeSync
        size='m'
        options={selectOptions(CategoryMap[category.value], enabledType, (i: string) => getMessage(`enum-${category.value}Type-${i}`))}
      />
    </Form.Item>}
  </>
}
