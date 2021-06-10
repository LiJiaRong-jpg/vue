export default [
  {
    path: '/goods',
    component: resolve => require(['../views/index/index.vue'], resolve),
    children: [
      {
        path: 'goodslist',
        name: ['商品管理>商品列表', '商品列表'],
        component: resolve => require(['../views/goods/goodslist.vue'], resolve)
      }, {
        path: 'goodscategory',
        name: ['商品管理>商品类目', '商品类目'],
        component: resolve => require(['../views/goods/goodscategory.vue'], resolve)
      }
    ]
  }
]
