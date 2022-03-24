import api from '../axios';
//获取下拉列表
export function softwaregetGetRetrieveList(data:any) {
  return api.post('/software/getRetrieveList',data)
}
//获取列表数据
export function getModuleList(data:any){
  return api.post('/software/getModuleList',data)
}
//获取关联系统下拉列表
export function getRelationSystemSelectorList(){
  return api.post('software/relationSystemSelectorList')
}
//获取关联系统组下拉列表
export function GetRelationSystemSelectorGroupList(){
  return api.post('/software/relationSystemSelectorGroupList')
}

export function getResourceList(){
  return api.post ('/software/resourceList')
}
//创建软件
export function createSoftware(data:any){
  return api.post('/software/create',data)
}
//获取软件详情
export function getSoftwareDetail(data:any){
  return api.post('/software/detail',data)
}
//编辑软件
export function editSoftWatre(data:any){
  return api.post('/software/edit',data)
}
//
export function relationSystem(data:any){
  return api.post('/software/relationSystem',data)
}
//删除软件
export function deleteSoftwareApi(data:any){
  return api.post('/software/delete',data)
}
//获取系统详情
export function getsystemDetailList(data:any){
  return api.post ('/software/systemDetailList',data)
}
export function relieveRelationSystem(data:any){
  return api.post('/software/relieveRelationSystem',data)
}

//获取软件回显
export function getSoftWareEcho(data:any){
  return api.post('/software/editEcho',data)
}
//导入软件
export function softWareImportData(data:any){
  return api.post('/software/importData',data)
}