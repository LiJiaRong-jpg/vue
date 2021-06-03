export default [
  {
    path: '/dashboard',
    component: resolve => require(['../views/index/index.vue'], resolve),
    children: [{
      path: '/',
      name: ['首页', '首页'],
      component: resolve => require(['../views/dashboard/dashboard.vue'], resolve)
    }]
  }
]
