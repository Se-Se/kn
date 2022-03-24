import api from '../axios';

/**
 * @description: 新建车型组
 * @url /carModel/editCarModelGroup
 * @param {object} data
 * @return {*}
 */
export function createCarModel(data:{carModelGroupName:string}){
  return api.post('/carModel/createCarModelGroup',data)
}

/**
 * @description: 获取车型列表
 * @param {null} 
 * @return {*}
 */
export function getListGroup(){
  return api.post('/carModel/getListGroup',{carModelGroupName:''})
}

/**
 * @description: 删除车型组
 * @param {object} data
 * @param {*} data
 * @return {*}
 */
export function deleteCarGroupApi(data:{idList:string[]}){
  return api.post('/carModel/deleteCarModelGroup',data)
}

/**
 * @description: 编辑车型组
 * @param {object} data
 * @param {*} data
 * @return {*}
 */
export function editCarGroup(data:{carModelGroupName:string,idList:number[]}){
  return api.post('/carModel/editCarModelGroup',data)
}

/**
 * @description: 车型关联车型组
 * @param {object} data
 * @return {*}
 */
export function relationCarModelGroup(data:{carModeGroupId:number,carModelId:number}){
  return api.post('/carModel/relationCarModelGroup',data)
}

/**
 * @description: 获取关联车型列表
 * @param {*} return
 * @return {*}
 */
export function getCarModelList(){
  return api.post('/carModel/getCarModelGroupRetrieveList')
}

/**
 * @description: 删除车型
 * @param {object} data
 * @param {*} data
 * @return {*}
 */
export function deleteCarMode(data:{idList:number[]}){
  return api.post('/carModel/delete',data)
}
/**
 * @description: 创建车型
 * @param {any} data
 * @param {*} data
 * @return {*}
 */
export function createCarMode(data:any){
  return api.post('/carModel/create',data)
}

/**
 * @description: 编辑车型
 * @param {any} data
 * @param {*} data
 * @return {*}
 */
export  function editcaMode(data:any){
  return api.post('/carModel/edit',data)
}

/**
 * @description: 查看车型绑定的零部件列表
 * @param {any} data
 * @return {*}
 */
export function getRelationAutoPartsList(data:any){
  return api.post('/carModel/relationAutoPartsList',data)
}

/**
 * @description: 关联零部件的列表
 * @param {any} data
 * @return {*}
 */
export function getRelationAutoPartsListGroup(data:any){
  return api.post ('/carModel/relationAutoPartsListGroup',data)
}

/**
 * @description: 车型解除关联零部件
 * @param {object} data
 * @param {*} data
 * @return {*}
 */
export function relieveRelationAutoPartsApi(data:{autoPartsId:number,carModelId:number}){
  return api.post ('/carModel/relieveRelationAutoParts',data)
}

/**
 * @description: 车型关联零部件
 */
 export function carModelRelationAutoParts(data:any){
  return api.post ('/carModel/relationAutoParts',data)
}


