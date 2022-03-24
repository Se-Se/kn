import api from '../axios';

// 零部件模块：获得零部件列表信息
export function autoPartsGetList(data: any) {
  return api.post('/autoParts/getList', data)
}

// 零部件模块：获得零部件列表信息
export function autoPartsGetRetrieveList(data: any) {
  return api.post('/autoParts/getRetrieveList', data)
}

// 零部件模块 创建
export function autoPartsCreate(data: any) {
  return api.post('/autoParts/create', data)
}

// 零部件模块：获得检索信息列表（创建列表下拉分组列表）获得所有车型
export function autoPartsGetCreateRetrieveListGroup() {
  return api.post('/autoParts/getCreateRetrieveListGroup')
}

// 零部件模块：导入零部件信息
export function autoPartsImportData(data: any) {
  return api.post('/autoParts/importData',data)
}

// 零部件模块：关联车型，批量
export function autoPartsRelationCarModel(data: any) {
  return api.post('/autoParts/relationCarModel',data)
}

// 零部件模块：批量删除
export function autoPartsDelete(data: any) {
  return api.post('/autoParts/delete',data)
}

// 零部件模块：零部件详情基本信息
export function autoPartsBaseDetail(data: any) {
  return api.post('/autoParts/baseDetail',data)
}

// 零部件模块：批量关联零部件
export function autoPartsRelationSystem(data: any) {
  return api.post('/autoParts/relationSystem',data)
}

// 零部件模块：系统关联 列表
export function autoPartsSystemListGroup(data: any) {
  return api.post('/autoParts/systemListGroup',data)
}

// 零部件模块：关联系统解除关联
export function autoPartsRelieveRelationSystem(data: any) {
  return api.post('/autoParts/relieveRelationSystem',data)
}

// 零部件模块：编辑单个
export function autoPartsEdit(data: any) {
  return api.post('/autoParts/edit',data)
}

// 零部件模块：系统列表
export function autoSystemDetail(data: any) {
  return api.post('/autoParts/systemDetail',data)
}

// 零部件模块：该零部件下关联的所有硬件
export function autoPartsHardwareDetail(data: any) {
  return api.post('/autoParts/hardwareDetail',data)
}

// 零部件模块：解除硬件关联
export function autoPartsRelieveRelationHardware(data: any) {
  return api.post('/autoParts/relieveRelationHardware',data)
}

 // 零部件模块：关联硬件资产
 export function autoPartsHardwareListGroupe(data: any) {
  return api.post('/autoParts/hardwareListGroup',data)
}

// 零部件模块：关联硬件
export function autoPartsRelationHardware(data: any) {
  return api.post('/autoParts/relationHardware',data)
}