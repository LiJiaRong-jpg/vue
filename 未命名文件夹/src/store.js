import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lang: localStorage.lang || 'cn'
  },
  mutations: {
    switchLang (state, lang,vue) {
      state.lang = lang
      localStorage.setItem('lang', lang)
    }
  },
  actions: {}
})
