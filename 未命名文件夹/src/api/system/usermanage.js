import Qs from 'qs'
import axios from '../HTTP.js'

// 管理员列表
export function userList (data) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.user',
      _mt: 'getUser',
      ...data
    }
  })
}
// 修改会员状态
export function status (userId, status) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.user',
      _mt: 'updateStatus',
      userId: userId,
      status: status
    }
  })
}
// 添加会员
export function addUser (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.user',
      _mt: 'addUser',
      user: JSON.stringify(data)
    })
  })
}
// 编辑管理员
export function updateUser (data) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.user',
      _mt: 'updateUser',
      user: JSON.stringify(data)
    })
  })
}
// 删除会员
export function deleteUser (id, nickname) {
  return axios({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.user',
      _mt: 'deleteUser',
      id: id,
      nickname: nickname
    })
  })
}
