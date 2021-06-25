//获取权限列表判断用户有哪些权限
import {
  managers
} from '../api/system/adminlist.js'
import {
  jurisdictionList
} from '../api/system/rolemanage.js'

let permission = {
  inserted: function(el, binding) {
    if (window.sessionStorage.getItem('jurisdiction')) { //已储存用户权限列表
      if (JSON.parse(window.sessionStorage.getItem('jurisdiction')).indexOf(binding.value) == -1) {
        //在数组中没找到指令绑定的值(binding.value指令绑定的值)
        el.remove()
        //删除节点
      }
    } else {
      let form = {
        username: JSON.parse(window.localStorage.getItem('account')).account //用户名
      }
      managers(form).then(function(reds) {
        //获取管理员列表
        jurisdictionList(reds.data.data.items[0].roleIds[0]).then(function(Reds) {
          //获取用户权限列表
          window.localStorage.setItem('jurisdiction', JSON.stringify(Reds.data.data.assignedPermissions))
          if (Reds.data.data.assignedPermissions.indexOf(binding.value) == -1) {
            //在数组中没找到指令绑定的值(binding.value指令绑定的值)
            el.remove()
            //删除节点
          }
        })
      })
    }

  }
}
export default permission;
