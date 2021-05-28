export default [
  {
    path: '/promotion',
    component: resolve => require(['../views/index/index.vue'], resolve),
    children: [
      {
        path: 'shopadvert',
        component: resolve => require(['../views/promotion/shopadvert.vue'], resolve)
      }, {
        path: 'recommanage',
        component: resolve => require(['../views/promotion/recommanage.vue'], resolve)
      }, {
        path: 'couponmanage',
        component: resolve => require(['../views/promotion/couponmanage.vue'], resolve)
      }, {
        path: 'shopsmanage',
        component: resolve => require(['../views/promotion/shopsmanage.vue'], resolve)
      }
    ]
  }
]
