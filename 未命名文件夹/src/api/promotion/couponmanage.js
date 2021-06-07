import Qs from 'qs'
import axios from '../HTTP.js'

// 优惠劵列表
export function couList (data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.coupon',
      _mt: 'queryCouponByTitle',
      ...data
    }
  })
}
// 删除优惠劵
export function deleteCou (data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.coupon',
      _mt: 'deleteCoupon',
      id: data
    }
  })
}
// 修改优惠劵状态
export function updateStatus (data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.coupon',
      _mt: 'updateCouponStatus',
      ...data
    }
  })
}
// 添加优惠劵
export function addCou (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.coupon',
      _mt: 'addCoupon',
      ...data
    })
  })
}
// 编辑优惠劵
export function pudateCou (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.coupon',
      _mt: 'updateCoupon',
      ...data
    })
  })
}
// 添加列表的商品限制范围的指定分类
export function classIfication () {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.category',
      _mt: 'categoryTree'
    }
  })
}
