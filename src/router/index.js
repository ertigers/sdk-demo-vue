import Vue from 'vue'
import VueRouter from 'vue-router'

// 视频播放布局
import Video from '@/views/index.vue'
import Real from '@/views/real/index.vue'
import History from '@/views/history/index.vue'
import Elemap from '@/views/elemap/index.vue'


// import Other from '@/views/video.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/video'
  },
  {
    path: '/video',
    name: 'video',
    component: Video,
    redirect: '/real',
    children:[
      {
        path: '/real',
        name: 'real',
        component: Real
      },
      {
        path: '/history',
        name: 'history',
        component: History
      },
      {
        path: '/elemap',
        name: 'elemap',
        component: Elemap
      },
    ]
  },
  // {
  //   path: '/other',
  //   name: 'other',
  //   component: Other
  // }
]

const router = new VueRouter({
  routes
})

export default router