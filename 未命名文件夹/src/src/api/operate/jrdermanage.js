// import Qs from 'qs'
import axios from '../HTTP.js'

// 订单列表
export function orderList (data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.order',
      _mt: 'list',
      sort: 'id',
      order: 'desc',
      ...data
    }
  })
}
// // 删除订单
// export function deleteFreightTemplate (id) {
//   return axios({
//     method: 'post',
//     data: Qs.stringify({
//       _gp: 'admin.freight',
//       _mt: 'deleteFreightTemplate',
//       templateId: id
//     })
//   })
// }
