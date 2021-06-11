import Qs from 'qs'
import axios from '../HTTP.js'

// 评论列表
export function AppraiseList (data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.appraise',
      _mt: 'getAppraiseList',
      ...data
    }
  })
}
// 删除评论
export function deleteAppraise (id) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.appraise',
      _mt: 'deleteAppraise',
      id: id
    })
  })
}
