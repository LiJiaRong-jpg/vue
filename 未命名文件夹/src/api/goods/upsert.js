import Qs from 'qs'
import axios from '../HTTP.js'

export function freightTemplate () {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.freight',
      _mt: 'getAllFreightTemplate'
    }
  })
}

export function detail (id) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.goods',
      _mt: 'detail',
      spuId: id
    }
  })
}

export function categoryTree () { // 所属类目
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.category',
      _mt: 'categoryTree'
    }
  })
}

export function AddProduct (data) { // 删除商品
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: "admin.category",
      _mt: "addCategory",
      ...data
    })
  })
}
export function UpdateProduct (data) { // 删除商品
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: "admin.category",
      _mt: "edit",
      ...data
    })
  })
}
