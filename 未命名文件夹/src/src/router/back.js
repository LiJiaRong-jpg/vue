export default [
  {
    path: '/back',
    component: resolve => require(['../views/index/index.vue'], resolve),
    children: [
      {
        path: '/',
        component: resolve => require(['../views/back/back.vue'], resolve)
      }
    ]
  }
]
