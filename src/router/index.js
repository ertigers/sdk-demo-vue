import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/video'
  },
  {
    path: '/video',
    name: 'video',
    component: function () {
      return import( '../views/video.vue')
    }
  }
]

const router = new VueRouter({
  routes
})

export default router