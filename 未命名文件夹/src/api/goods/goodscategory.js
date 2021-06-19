import Qs from 'qs'
import axios from '../HTTP.js'

// 商品类目列表
export function categoryList (data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.category',
      _mt: 'queryCategory',
      ...data
    }
  })
}
// 获取父级类目选择内容
export function parentCategory (data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.category',
      _mt: 'categorySecondLevelTree'
    }
  })
}

// 添加类目
export function addCategory (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.category',
      _mt: 'addCategory',
      ...data
    })
  })
}
// 添加类目
export function updateCategory (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.category',
      _mt: 'updateCategory',
      ...data
    })
  })
}
// 删除类目
export function deleteCategory (id) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.category',
      _mt: 'deleteCategory',
      id
    })
  })
}
