export default [
  {
    path: '/system',
    component: resolve => require(['../views/index/index.vue'], resolve),
    children: [
      {
        path: 'usermanage',
        component: resolve => require(['../views/system/usermanage.vue'], resolve)
      }, {
        path: 'adminlist',
        component: resolve => require(['../views/system/adminlist.vue'], resolve)
      }, {
        path: 'rolemanage',
        component: resolve => require(['../views/system/rolemanage.vue'], resolve)
      }
    ]
  }
]
