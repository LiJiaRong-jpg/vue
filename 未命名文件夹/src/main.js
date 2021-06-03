import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI, { Message } from 'element-ui'
import instance from './api/HTTP.js'

import echarts from 'echarts'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueAxios, axios)

Vue.prototype.$message = Message
Vue.prototype.$echarts = echarts
Vue.prototype.$instance = instance

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
