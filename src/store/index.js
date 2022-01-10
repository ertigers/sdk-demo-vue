import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: "",
  },
  mutations: {
    setToken(state,payload){
      state.token = payload;
    },
  },
  actions: {
  },
  modules
})
