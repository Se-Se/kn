import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { FeatureConfigFragment, ReportFeatureConfigFragment, UploadFileType } from 'generated/graphql'
import { keys } from 'utils/keys'

const DefaultConfig: FeatureConfigFragment = {
  systemLinux: false,
  systemAndroid: false,
  systemOther: false,
  artifactAPK: false,
  artifactRTOS: false,
  artifactPackage: false,
  uploadPackage: false,
  uploadRTOSFirmware: false,
  uploadImage: false,
  uploadCDat: false,
  uploadAPK: false,
  plugin: false,
  collector: false,
  timesLimitEnabled: false,
}

export type ReportFeatureConfig = Omit<ReportFeatureConfigFragment, '__typename'>
const DefaultReportConfig: ReportFeatureConfig = {
  baseline: false,
  custom: false,
  cveSec: false,
  cveKernel: false,
  license: false,
  detail: false,
  sensitive: false,
  risk: false,
}
const ConfigContext = createContext<FeatureConfigFragment | undefined>(undefined)
const ReportConfigContext = createContext<ReportFeatureConfig | undefined>(undefined)

export const useConfig = () => useContext(ConfigContext) ?? DefaultConfig
export const useReportConfig = () => useContext(ReportConfigContext) ?? DefaultReportConfig
export type ReportConfigKeys = Exclude<keyof ReturnType<typeof useReportConfig>, '__typename'>

export const useReportVariable = () => {
  const { baseline, custom, cveKernel, cveSec, license, detail } = useReportConfig()
  return useMemo(() => ({
    baseline,
    custom,
    cve: cveKernel || cveSec,
    license,
    detail,
  }), [baseline, custom, cveKernel, cveSec, license, detail])
}

export const useUploadConfig = () => {
  const { uploadPackage, uploadImage, uploadCDat } = useConfig()
  return useMemo(() => ({
    uploadPackage,
    uploadImage,
    uploadCDat,
  }), [uploadPackage, uploadImage, uploadCDat])
}

const uploadMap = {
  uploadAPK: UploadFileType.Apk,
  uploadRTOSFirmware: UploadFileType.RtosFirmware,
  uploadPackage: UploadFileType.Package,
  uploadImage: UploadFileType.Image,
  uploadCDat: UploadFileType.Collector,
}

export const useUploadTypeFilter = () => {
  const cfg = useConfig()
  return useCallback((type: UploadFileType): boolean => {
    for (const key of keys(uploadMap)) {
      if (uploadMap[key] === type) {
        return cfg[key]
      }
    }
    return true
  }, [cfg])
}

export const ConfigProvider: React.FC<{ value: FeatureConfigFragment | undefined }> = ({ value, children }) => {
  return <ConfigContext.Provider value={value}>
    {children}
  </ConfigContext.Provider>
}
export const ReportConfigProvider: React.FC<{ value: ReportFeatureConfigFragment | undefined }> = ({ value, children }) => {
  return <ReportConfigContext.Provider value={value}>
    {children}
  </ReportConfigContext.Provider>
}
