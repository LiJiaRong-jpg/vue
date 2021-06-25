import Qs from 'qs'
import axios from '../HTTP.js'

export function categoryTree () {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.category',
      _mt: 'categoryTree'
    }
  })
}

export function list (data) { // 列表
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.goods',
      _mt: 'list',
      ...data
    }
  })
}

export function seeGoods (id) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.goods',
      _mt: 'detail',
      spuId: id
    }
  })
}

export function Delete (data) { // 删除商品
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.goods',
      _mt: 'batchDelete',
      ids: JSON.stringify(data)
    })
  })
}

export function Status (spuId, status) { // 修改状态商品
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.goods',
      _mt: 'freezeOrActivation',
      spuId,
      status
    })
  })
}
