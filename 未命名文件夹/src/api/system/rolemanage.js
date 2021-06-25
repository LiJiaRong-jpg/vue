import Qs from 'qs'
import axios from '../HTTP.js'

// 角色列表
export function roleList (query) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.role',
      _mt: 'list',
      ...query
    }
  })
}
// 新增角色
export function addRole (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.role',
      _mt: 'create',
      role: JSON.stringify(data)
    })
  })
}
// 编辑角色
export function roleUpdate (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.role',
      _mt: 'update',
      role: JSON.stringify(data)
    })
  })
}
// 删除角色
export function roleDelete (id) {
  return axios({
    method: 'post',
    params: {
      _gp: 'admin.role',
      _mt: 'delete',
      roleId: id
    }
  })
}
// 角色权限列表
export function jurisdictionList (data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.role',
      _mt: 'permissionList',
      roleId: data
    }
  })
}
// 给角色授权
export function roleJurisdiction (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.role',
      _mt: 'permissionSet',
      roleSetPermissionDTO: JSON.stringify(data)
    })
  })
}
