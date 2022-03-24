import api from './axios';

export function postHardwareGetList(data: any) {
  return api.post('/hardware/getList', data)
}

export function postHardwareCreate(data: any) {
  return api.post('/hardware/create', data)
}

// 硬件：获取需要绑定的零部件
export function postHardwaregetAutoPartsListGroup() {
  return api.post('/hardware/getAutoPartsListGroup')
}

// 硬件：获取搜索框下拉列表 
export function hardwaregetGetRetrieveList() {
  return api.post('/hardware/getRetrieveList')
}

// 删除硬件
export function hardwaregetDelete(data:any) {
  return api.post('/hardware/delete',data)
}

//硬件详情
export function hardwaregetDetail(data:any) {
  return api.post('/hardware/detail',data)
}

// 编辑硬件信息 
export function hardwaregetEdit(data:any) {
  return api.post('/hardware/edit',data)
}

//查询硬件所属零部件list 
export function hardwaregetAutoParts(data:any) {
  return api.post('/hardware/autoParts',data)
}

//硬件解除零部件关联 
export function hardwaregetRelationParts(data:any) {
  return api.post('/hardware/relieveRelationAutoPart',data)
}

// 硬件批量关联零部件
export function hardwaregetrRlationAutoParts(data:any) {
  return api.post('/hardware/relationAutoParts',data)
}

// 硬件模块：导入零部件信息 
export function hardwaregetrImportData(data:any) {
  return api.post('/hardware/importData',data)
}

// 资源：上传excel文件，返回一个唯一id
export function staticResourceUploadExcelFile(data:any,progressFn?:any) {
  return api.postUpFile('/staticResource/uploadExcelFile',data,progressFn)
}

// 下载模板
export function staticResourceDownloadTemplate(data:any) {
  return api.downLoad('/staticResource/downloadTemplate',data)
}


// 系统管理-操作系统列表
export function systemGetSystemList(data:any) {
  return api.post('/system/getSystemList',data)
}

// 系统管理-api列表
export function systemGetApiList(data:any) {
  return api.post('/system/getApiList',data)
}

// 系统管理-app列表
export function systemGetAppList(data:any) {
  return api.post('/system/getAppList',data)
}

// 系统管理-搜索下拉框数据
export function systemGetRetrieveList() {
  return api.post('/system/getRetrieveList')
}

// 新建操作系统时零部件下拉列表
export function systemGetAutoPartsGroup() {
  return api.post('/system/getAutoPartsGroup')
}

// 系统管理-新建系统
export function systemCreateSystem(data:any) {
  return api.post('/system/createSystem',data)
}

// 系统管理-新建api
export function systemCreateApi(data:any) {
  return api.post('/system/createApi',data)
}

// 系统管理-新建app
export function systemCreateApp(data:any) {
  return api.post('/system/createApp',data)
}

// 系统管理-批量删除
export function systemDelete(data:any) {
  return api.post('/system/delete',data)
}


// 系统管理- 上传文件（操作系统的上传或app的上传公用一个）
export function systemUploadFile(data:any,progressFn?:any) {
  return api.postUpFile('/system/uploadFile',data,progressFn)
}

// 系统管理-批量关联零部件
export function systemRelationAutoParts(data:any) {
  return api.post('/system/relationAutoParts',data)
}

// 系统管理-系统详情
export function systemDetail(data:any) {
  return api.post('/system/detail',data)
}

// 系统管理-查询所属零部件例表
export function systemBelongAutoParts(data:any) {
  return api.post('/system/belongAutoParts',data)
}

// 系统管理-解除关联零部件
export function systemRelieveRelationAutoPart(data:any) {
  return api.post('/system/relieveRelationAutoPart',data)
}

// 系统管理-系统编辑
export function systemSystemEdit(data:any) {
  return api.post('/system/systemEdit',data)
}

// 系统管理-系统关联软件资产的软件下拉列表
export function systemGetSoftwareGroup(data:any) {
  return api.post('/system/getSoftwareGroup',data)
}

// 系统管理-解除关联软件
export function systemRelieveRelationSoftWare(data:any) {
  return api.post('/system/relieveRelationSoftWare',data)
}

// 系统管理-api编辑
export function systemApiEdit(data:any) {
  return api.post('/system/apiEdit',data)
}

// 系统管理-app编辑
export function systemAppEdit(data:any) {
  return api.post('/system/appEdit',data)
}

// 系统管理-系统关联软件资产
export function systemRelationSoftWare(data:any) {
  return api.post('/system/relationSoftWare',data)
}

// 系统管理-系统所属软件
export function systemBelongSoftware(data:any) {
  return api.post('/system/belongSoftware',data)
}

// 系统模块：导入零部件信息
export function systemImportData(data:any) {
  return api.post('/system/importData',data)
}