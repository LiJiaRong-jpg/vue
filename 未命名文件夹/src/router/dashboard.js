export default [
  {
    path: '/dashboard',
    component: resolve => require(['../views/index/index.vue'], resolve),
    children: [{
      path: '/',
      component: resolve => require(['../views/dashboard/dashboard.vue'], resolve)
    }]
  }
]
