import Qs from 'qs'
import axios from '../HTTP.js'

// 商铺广告列表
export function queryAdvertisement(data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.advertisement',
      _mt: 'queryAdvertisement',
      ...data
    }
  })
}
// 添加广告
export function addRecommend(data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.advertisement',
      _mt: 'addAdvertisement',
      ...data
    })
  })
}
// 编辑广告
export function updateAdvertisement(data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.advertisement',
      _mt: 'updateAdvertisement',
      ...data
    })
  })
}
// 删除广告
export function deleteAdvertisement(id, type) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.advertisement',
      _mt: 'deleteAdvertisement',
      adId: id,
      adType: type
    })
  })
}
