import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI, { Message } from 'element-ui'

import echarts from 'echarts'

import global from './store/global.js'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueAxios, axios)

Vue.prototype.$message = Message
Vue.prototype.$echarts = echarts
Vue.prototype.global = global

router.beforeEach((to, from, next) => {
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

axios.interceptors.request.use(
  config => {
  // 判断是否存在token，如果存在的话，则每个http header都加上token
  // get没用qs转formData,他就有token
  // post用qs转formData,他就没有token
    const token = sessionStorage.getItem('token')
    if (!config.headers.ADMINTOKEN) {
      config.headers.ADMINTOKEN = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
