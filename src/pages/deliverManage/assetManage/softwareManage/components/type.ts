export type retrieveListType = {
  ModuleBusinessUsedSelector: OptionType[];
  belongAutoPartsSelector: OptionType[];
  belongCarInfoSelector: OptionType[];
  belongSystemSelector: OptionType[];
  code: number;
  logTypeSelector: any[];
  msg: string;
};

export type OptionType = {
  value: number;
  label: string;
};

export type ModelList<T> = {
  code: number;
  count: number;
  module: string;
  msg: string;
  result: Array<T>;
};
export type ModelListObj = {
  belongAutoParts: OptionType[];
  belongAutoPartsString: string;
  belongCarModel: OptionType[];
  belongCarModelString: string;
  belongSystem: OptionType[];
  belongSystemString: string;
  createTimeFormat: string;
  createUser: string;
  id: number;
  moduleBusinessUsed: number;
  moduleBusinessUsedString: string;
  moduleDescription: string;
  moduleIsCommercialUse: boolean;
  moduleIsModify: boolean;
  moduleLicense: string;
  moduleLicenseRisk: string;
  moduleVersion: string;
  name: string;
  number: string;
  remark: string;
};
export type SoftWareProps = {
  modelsOptions: { label: string; value: any }[];
  systemOptions: { label: string; value: any }[];
  partsOptions: { label: string; value: any }[];
  relationSystemOptions:{label:string,value:any}[];
  configTypeSelector?:{label:string,value:any}[];
  relationSystemGroupOptions:{
    label:string,
    children:{
      value:any,
      label:string
    }[]
  }[]
};
export type LogsFileProps = {
  modelsOptions: { label: string; value: any }[];
  systemOptions: { label: string; value: any }[];
  partsOptions: { label: string; value: any }[];
  relationSystemOptions:{label:string,value:any}[];
  logTypeSelector:{label:string,value:any}[];
  relationSystemGroupOptions:{
    label:string,
    children:{
      value:any,
      label:string
    }[]
  }[]
};
export type ConfigProps = {
  modelsOptions: { label: string; value: any }[];
  systemOptions: { label: string; value: any }[];
  partsOptions: { label: string; value: any }[];
  relationSystemOptions:{label:string,value:any}[];
  configTypeSelector:{label:string,value:any}[];
  relationSystemGroupOptions:{
    label:string,
    children:{
      value:any,
      label:string
    }[]
  }[]
};
export type FirmListObj = {
  belongAutoParts: OptionType[];
  belongAutoPartsString: string;
  belongCarModel: OptionType[];
  belongCarModelString: string;
  belongSystem: OptionType[];
  belongSystemString: string;
  createTimeFormat: string;
  createUser: string;
  firmwarePackageFileUrl: boolean;
  firmwareReleaseTime: number;
  firmwareReleaseTimeFormat: string;
  firmwareVersion: string;
  id: number;
  name: string;
  number: string;
  remark: string;
};
export type SecretKeyObj = {
  belongAutoParts: OptionType[];
  belongAutoPartsString: string;
  belongCarModel: OptionType[];
  belongCarModelString: string;
  belongSystem: OptionType[];
  belongSystemString: string;
  createTimeFormat: string;
  createUser: string;
  id: number;
  name: string;
  number: string;
  remark: string;
  secretKeyFileUrl: boolean;
  secretKeyPath: string;
  secretKeyPurpose: string;
};

export type LogObj = {
  belongAutoParts: OptionType[];
  belongAutoPartsString: string;
  belongCarModel: OptionType[];
  belongCarModelString: string;
  belongSystem: OptionType[];
  belongSystemString: string;
  createTimeFormat: string;
  createUser: string;
  id: number;
  name: string;
  number: string;
  remark: string;
  logFileUrl: true;
  logPath: string;
  logPurpose: string;
  logType: number;
  logTypeString: string;
};


export type ConfigObj = {
  belongAutoParts: OptionType[];
  belongAutoPartsString: string;
  belongCarModel: OptionType[];
  belongCarModelString: string;
  belongSystem: OptionType[];
  belongSystemString: string;
  createTimeFormat: string;
  createUser: string;
  id: number;
  name: string;
  number: string;
  remark: string;
  configPath: string
  configPurpose: string
  configType: number
  configTypeString: string
};

export type ServiceObj = {
  belongAutoParts: OptionType[];
  belongAutoPartsString: string;
  belongCarModel: OptionType[];
  belongCarModelString: string;
  belongSystem: OptionType[];
  belongSystemString: string;
  createTimeFormat: string;
  createUser: string;
  id: number;
  name: string;
  number: string;
  remark: string;
  servicePath: string
  serviceScene: string

};
export type CertificateObj = {
  belongAutoParts: OptionType[];
  belongAutoPartsString: string;
  belongCarModel: OptionType[];
  belongCarModelString: string;
  belongSystem: OptionType[];
  belongSystemString: string;
  createTimeFormat: string;
  createUser: string;
  id: number;
  name: string;
  number: string;
  remark: string;
  certificateFileUrl: string
  certificatePath: string
  certificatePurpose: string
};

export type relationSystemOptionsType = {
  code: number
  msg: string
  result:OptionType[]
}
export type relationSystemGroupOptionsType = {
  code: number
  msg: string
  results:{
    label:string,
    children:{
      value:any,
      label:string
    }[]
  }[]
}

export type configTypeSelectorType = {
  code:number
  msg:string
  configTypeSelector:OptionType[]
  logTypeSelector:OptionType[]
  moduleBusinessUsedSelector:OptionType[]
}