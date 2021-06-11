import Qs from 'qs'
import axios from '../HTTP.js'

// 管理员列表
export function managers (query) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin',
      _mt: 'list',
      ...query
    }
  })
}
// 添加管理员表单的授权角色
export function addOptions () {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.role',
      _mt: 'options'
    }
  })
}
// 添加管理员
export function addAdmin (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin',
      _mt: 'create',
      adminDTO: JSON.stringify(data)
    })
  })
}
// 编辑管理员
export function updateAdmin (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin',
      _mt: 'update',
      adminDTO: JSON.stringify(data)
    })
  })
}
// 删除管理员
export function deleteAdmin (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin',
      _mt: 'delete',
      id: data
    })
  })
}
