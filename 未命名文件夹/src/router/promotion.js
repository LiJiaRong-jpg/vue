export default [
  {
    path: '/promotion',
    component: resolve => require(['../views/index/index.vue'], resolve),
    children: [
      {
        path: 'shopadvert',
        name: ['推广管理>商铺广告', '商铺广告'],
        component: resolve => require(['../views/promotion/shopadvert.vue'], resolve)
      }, {
        path: 'recommanage',
        name: ['推广管理>推荐管理', '推荐管理'],
        component: resolve => require(['../views/promotion/recommanage.vue'], resolve)
      }, {
        path: 'couponmanage',
        name: ['推广管理>优惠劵管理', '优惠劵管理'],
        component: resolve => require(['../views/promotion/couponmanage.vue'], resolve)
      }, {
        path: 'shopsmanage',
        name: ['推广管理>商铺信息', '商铺信息'],
        component: resolve => require(['../views/promotion/shopsmanage.vue'], resolve)
      }
    ]
  }
]
