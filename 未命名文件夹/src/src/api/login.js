// import Qs from 'qs'
import axios from './HTTP.js'

// 用户登录
export function dengLu (account, pass, token) {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin',
      _mt: 'login',
      username: account,
      password: pass,
      verifyCode: token
    }
  })
}
