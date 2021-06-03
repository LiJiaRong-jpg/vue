
// 新建vue 实例
import axios from 'axios'
import router from '../router'
import Vue from 'vue'
import { Message } from 'element-ui'

// 导入登录页面，做无痛刷新
import { dengLu } from './login.js'
Vue.prototype.$message = Message

const instance = axios.create({
  baseURL: 'http://192.168.1.54:8081/m.api', // url请求路径
  timeout: 5000// 超时
})

router.beforeEach((to, from, next) => { // 路由拦截器
  if (to.path === '/login') { // 去的页面是否去的是登录页面
    const bool = window.sessionStorage.getItem('token')
    if (bool) {
      // 登录则，返回原页面
      Message({
        showClose: true,
        message: '请勿重复登录',
        type: 'error'
      })
      next({
        path: from.path
      })
    } else {
      // 没登录则，用户继续跳转
      next()
    }
  } else {
    // 如果去的不是登录页面，则看用户是否登录
    const bool = window.sessionStorage.getItem('token')
    if (bool) {
      // 登录则，用户继续跳转
      next()
    } else {
      // 没登录则，用户跳转至登录页面
      next({
        path: '/login'
      })
    }
  }
})

instance.interceptors.response.use(function (response) { // 请求返回拦截器
  const pass = JSON.parse(window.localStorage.getItem('account')) // 获取储存的用户账号信息，做无痛刷新
  if (response.config.method === 'get') { // 排除不是登录页面的请求
    if (pass && response.data.errmsg === '成功' && response.config.params._mt !== 'login') { // 如果用户登录成功且返回成功且不是登录页面的请求就做刷新
      dengLu(pass.account, pass.pass, pass.toke).then(function (data) {
        window.sessionStorage.token = data.data.data
      })
    }
  } else {
    dengLu(pass.account, pass.pass, pass.toke).then(function (data) {
      window.sessionStorage.token = data.data.data
    })
  }
  // 如果状态码为1001或1006，就要用户重新登录
  if (response.data.errno === 10006 || response.data.errno === 10001) {
    window.sessionStorage.removeItem('token')
    console.log(router)
    if (router.history.current.path !== '/login') {
      window.sessionStorage.setItem('router', router.history.current.path) // 存储当前路由
    }
    router.push({
      path: '/login'
    }).catch(err => {
      console.log(err)
    })
    Message({
      showClose: true,
      message: '登录超时，请重新登录',
      type: 'error'
    })
  } else {
    return response
  }
})

instance.interceptors.request.use( // 请求拦截器
  config => {
  // 在临时储存中获取token加入到请求头
    const token = sessionStorage.getItem('token')
    config.headers.ADMINTOKEN = token
    return config
  },
  error => {
    return Promise.reject(error)
  })

export default instance
