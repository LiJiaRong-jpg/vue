// import Qs from 'qs'
import axios from '../HTTP.js'

//商品类目列表
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