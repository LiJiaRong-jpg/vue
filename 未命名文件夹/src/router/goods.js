export default [
  {
    path: '/goods',
    component: resolve => require(['../views/index/index.vue'], resolve),
    children: [
      {
        path: 'goodslist',
        component: resolve => require(['../views/goods/goodslist.vue'], resolve)
      }, {
        path: 'goodscategory',
        component: resolve => require(['../views/goods/goodscategory.vue'], resolve)
      }
    ]
  }
]
