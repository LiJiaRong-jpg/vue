import Qs from 'qs'
import axios from '../HTTP.js'

// 运费模板列表
export function getAllFreightTemplate () {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.freight',
      _mt: 'getAllFreightTemplate'
    }
  })
}
// 删除运费模板
export function deleteFreightTemplate (id) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.freight',
      _mt: 'deleteFreightTemplate',
      templateId: id
    })
  })
}
// 添加运费模板
export function addFreightTemplate (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.freight',
      _mt: 'addFreightTemplate',
      ...data
    })
  })
}
// 修改运费模板
export function updateFreightTemplate (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.freight',
      _mt: 'updateFreightTemplate',
      ...data
    })
  })
}
