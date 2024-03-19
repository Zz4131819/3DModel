import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'weIndex',
      component: () => import('../views/weIndex.vue')
    },
    {
      path: '/vr',
      name: 'vr',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/vR.vue')
    }
  ]
})

export default router
