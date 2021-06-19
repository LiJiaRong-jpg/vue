// 新建vue 实例
import axios from 'axios'
import router from '../router'
import Vue from 'vue'
import {
  Message
} from 'element-ui'

// 导入登录页面，做无痛刷新
import { dengLu } from './login.js'
Vue.prototype.$message = Message

const instance = axios.create({
  baseURL: 'http://192.168.1.54:8081/m.api', // url请求路径
  timeout: 5000 // 超时
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

instance.interceptors.response.use(function (response) {
  if (response.config.method == 'get') {
    if (response.config.params._mt !== 'login') { // 不是登录的请求
      if (response.config.headers.ADMINTOKEN === undefined) { // 没有token
        if (pass) { // 如果用户记住密码
          response.data.data = '成功'
          return getToken(pass, response)
        } else {
          window.sessionStorage.removeItem('token')
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
        }
      } else {
        if (response.data.errno === 10006 || response.data.errno === 10001) { // 如果状态码为1001或1006，就要刷新token
          const pass = JSON.parse(window.localStorage.getItem('account'))
          if (pass) { // 如果用户记住密码
            return getToken(pass, response)
          } else {
            window.sessionStorage.removeItem('token')
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
          }
        } else {
          return response
        }
      }
    } else {
      return response
    }
    return response
  } else {
    if (response.config.headers.ADMINTOKEN === undefined) { // 没有token
      if (pass) { // 如果用户记住密码
        response.data.data = '成功'
        return getToken(pass, response)
      } else {
        window.sessionStorage.removeItem('token')
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
      }
    } else {
      if (response.data.errno === 10006 || response.data.errno === 10001) { // 如果状态码为1001或1006，就要刷新token
        const pass = JSON.parse(window.localStorage.getItem('account'))
        if (pass) { // 如果用户记住密码
          return getToken(pass, response)
        } else {
          window.sessionStorage.removeItem('token')
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
        }
      } else {
        return response
      }
    }
  }
}, error => {
  return Promise.reject(error)
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

async function getToken (pass, Request) {
  const toke = await dengLu(pass.account, pass.pass, pass.toke)// 获取token
  window.sessionStorage.token = toke.data.data
  Request.config.headers.ADMINTOKEN = toke.data.data
  const req = await axios.request(Request.config) // 重新执行原请求
  return req
}
export default instance
