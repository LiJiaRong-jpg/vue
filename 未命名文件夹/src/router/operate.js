export default [
  {
    path: '/operate',
    component: resolve => require(['../views/index/index.vue'], resolve),
    children: [
      {
        path: 'ordermanage',
        component: resolve => require(['../views/operate/ordermanage.vue'], resolve)
      }, {
        path: 'commentmanage',
        component: resolve => require(['../views/operate/commentmanage.vue'], resolve)
      }, {
        path: 'freightmanage',
        component: resolve => require(['../views/operate/freightmanage.vue'], resolve)
      }
    ]
  }
]
