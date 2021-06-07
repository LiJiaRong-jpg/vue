import Qs from 'qs'
import axios from '../HTTP.js'

// 获取商铺信息
export function form (data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.merchant',
      _mt: 'getMerchant'
    }
  })
}

// 更改商铺信息
export function Updata (FORM) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.merchant',
      _mt: 'updateMerchant',
      title :FORM.title,
      logoUrl:FORM.logoUrl,
      description:FORM.description,
      address:FORM.address,
      showType:FORM.showType
    })
  })
}