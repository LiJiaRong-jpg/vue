export default [
  {
    path: '/system',
    component: resolve => require(['../views/index/index.vue'], resolve),
    children: [
      {
        path: 'usermanage',
        name: ['系统管理>会员管理', '会员管理'],
        component: resolve => require(['../views/system/usermanage.vue'], resolve)
      }, {
        path: 'adminlist',
        name: ['系统管理>管理员', '管理员'],
        component: resolve => require(['../views/system/adminlist.vue'], resolve)
      }, {
        path: 'rolemanage',
        name: ['系统管理>角色管理', '角色管理'],
        component: resolve => require(['../views/system/rolemanage.vue'], resolve)
      }
    ]
  }
]
