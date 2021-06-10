export default [
  {
    path: '/operate',
    component: resolve => require(['../views/index/index.vue'], resolve),
    children: [
      {
        path: 'ordermanage',
        name: ['运营管理>订单管理', '订单管理'],
        component: resolve => require(['../views/operate/ordermanage.vue'], resolve)
      }, {
        path: 'commentmanage',
        name: ['运营管理>评论管理', '评论管理'],
        component: resolve => require(['../views/operate/commentmanage.vue'], resolve)
      }, {
        path: 'freightmanage',
        name: ['运营管理>运费管理模板', '运费管理模板'],
        component: resolve => require(['../views/operate/freightmanage.vue'], resolve)
      }
    ]
  }
]
