import Qs from 'qs'
import axios from '../HTTP.js'

// 推荐列表
export function recommendList (data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.recommend',
      _mt: 'queryRecommendByType',
      ...data
    }
  })
}
// 删除推荐
export function recommendDelete (id, type) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.recommend',
      _mt: 'deleteRecommend',
      id: id,
      recommendType: type
    })
  })
}
// 添加推荐所需的选择列表
export function addList (data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.goods',
      _mt: 'getSpuBigTree'
    }
  })
}
// 添加推荐
export function addshopping (data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.recommend',
      _mt: 'addRecommend',
      ...data
    }
  })
}
