import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI, {
  Message
} from 'element-ui'
import instance from './api/HTTP.js'
import permission from "../src/components/instructions.js";
import echarts from 'echarts'
import i18n from './i18n/i18n'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.directive("permission", permission);

Vue.prototype.$message = Message
Vue.prototype.$echarts = echarts
Vue.prototype.$instance = instance

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
window.App=Vue
