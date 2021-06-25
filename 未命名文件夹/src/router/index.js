import Vue from 'vue'
import VueRouter from 'vue-router'

// 用于退回上一页面
import back from './back.js'
// 登录
import login from './login.js'
// 首页
// import index from '../views/index/index.vue'
// 首页内容
import dashboard from './dashboard.js'
// 运营管理
import operate from './operate.js'
// 商品管理
import goods from './goods.js'
// 推广管理
import promotion from './promotion.js'
// 系统管理
import system from './system.js'

Vue.use(VueRouter)

const routes = [
  ...back,
  ...login,
  ...dashboard,
  ...operate,
  ...goods,
  ...promotion,
  ...system,
  {
    path: '/',
    redirect: '/login'
  }
]

const router = new VueRouter({
  routes
})

export default router
