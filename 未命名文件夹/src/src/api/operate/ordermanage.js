// import Qs from 'qs'
import axios from '../HTTP.js'

// 订单列表
export function orderList(data) {
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

export function summary(data) { //汇总
  return axios({
    method: "post",
    params: {
      _gp: "admin.order",
      _mt: "statistics",
      ...data
    }
  });
}

export function detailsList(orderId) { //汇总
  return axios({
    method: 'get',
    params: {
      _gp: "admin.order",
      _mt: "detail",
      orderId
    }
  })
}

export function detailsEditor(id, Level, Mono) { //订单详情编辑
  return axios({
    method: "post",
    params: {
      _gp: 'admin.order',
      _mt: 'editAdminMono',
      orderId: id,
      level: Level,
      mono: Monojk
    }
  });
}

export function DeliverGoods(data) { //订单详情编辑
  return axios({
    method: "post",
    params: {
      _gp: 'admin.order',
      _mt: 'ship',
      ...data
    }
  });
}

export function RefuseRefund(data) { //订单拒绝退款
  return axios({
    method: "post",
    params: {
      _gp: 'admin.order',
      _mt: 'refund',
      ...data
    }
  });
}
