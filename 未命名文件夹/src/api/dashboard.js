// import Qs from 'qs'
import axios from './HTTP.js'

// 首页列表
export function listRole () {
  return axios({
    method: 'get',
    params: {
      _gp: 'admin.dashboard',
      _mt: 'integral'
    }
  })
}
