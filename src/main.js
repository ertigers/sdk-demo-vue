import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';

import webcu2plugin from "./utils/lib/webcu2plugin.js"

import 'element-ui/lib/theme-chalk/index.css'
import './assets/style/index.scss'

Vue.use(ElementUI)
Vue.prototype.$webcu2plugin = webcu2plugin

Vue.config.productionTip = false

import {
  api
} from "./api"
Vue.prototype.$api = api

import bus from "./utils/bus"
Vue.prototype.$bus = bus

import x2js from "x2js"
Vue.prototype.$x2js = new x2js({
  attributePrefix: ''
})

new Vue({
  router,
  store,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')