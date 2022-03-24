import api from '../axios';

/**
 * @description: 整车展示列表，包含置顶车型
 */
 export function carModelShowGetList(){
    return api.post ('/carModelShow/getList')
  }

  /**
 * @description: 更新/保存置顶信息
 */
 export function carModelShowSaveTopCarModel(data:any){
    return api.post ('/carModelShow/saveTopCarModel',data)
  }


/**
 * @description:零部件模块：零部件详情基本信息
 */
 export function autoPartsBaseDetail(data:any){
  return api.post ('/autoParts/baseDetail',data)
}
