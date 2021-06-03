<template>
  <div class="rolemanage">
    <div style="width: 100%;height: 40px;"></div>
    <div class="filter-container" style="margin-top: 20px;margin-left: 20px;margin-bottom: 20px;">
      <el-input v-model="form.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入角色名称" />
      <el-button style="position: relative;top: -13px;left: 10px;"
        class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button style="position: relative;top: -13px;left: 10px;"
        class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <div>
      <el-table :data="tableData.items" style="width: 90%;margin: auto;" border>
        <el-table-column prop="name" label="角色名称" sortable align="center" width="330">
        </el-table-column>
        <el-table-column prop="desc" align="center" label="说明" width="330">
        </el-table-column>
        <el-table-column prop="address" label="操作" align="center" ><!-- :formatter="formatter" -->
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
              编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
              删除</el-button>
            <el-button type="primary" size="mini"
              @click="handlePermission(scope.row)">授权</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="width: 100%;background-color: white;">
      <el-pagination style="padding: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]" :page.sync="form.page" :limit.sync="form.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="addRole">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="roleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <div style="float: right;">
      <el-button @click="addRole = false">取消</el-button>
      <el-button v-if="title=='创建'" type="primary" @click="roleADD">确定</el-button>
      <el-button v-if="title=='编辑'" type="primary" @click="roleUPDATE">确定</el-button>
  </div>
  </el-dialog>

  <el-dialog title="权限配置" :visible.sync="Authorization">
      <el-tree
        ref="auth"
        :data="authorization.systemPermissions"
        show-checkbox
        :default-checked-keys="authorization.assignedPermissions"
        node-key="id">
      </el-tree>
      <div style="float: right;">
      <el-button @click="Authorization = false">取消</el-button>
      <el-button type="primary" @click="AuthorizaTion">确定</el-button>
  </div>
  </el-dialog>

  </div>

</template>

<script>
import {
  addRole,
  roleList,
  roleUpdate,
  roleDelete,
  jurisdictionList,
  roleJurisdiction
} from '../../api/system/rolemanage.js'
export default {
  data () {
    return {
      form: { // 搜索列表参数
        name: '', // 名字
        page: 1, // 页数
        limit: 10 // 每页几条
      },
      tableData: {
        total: 0,
        items: []
      }, // 返回数据
      addRole: false, // 添加修改框显隐
      title: '', // 添加修改框标题
      roleForm: { // 添加或修改需要的两条数据
        name: '', // 名称
        desc: '' // 说明
      },
      edit: null, // 接受编辑时的参数
      authorization: { // 角色授权
        systemPermissions: null, // 角色所有权限
        assignedPermissions: null // 角色已授权列表
      },
      Authorization: false, // 角色授权框显隐
      AuthorizationId: null // 角色授权ID
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () { // 页面加载
      const that = this
      roleList(that.form).then(function (reds) {
        that.tableData = reds.data.data
      })
    },
    handleSizeChange (e) { // 点击控制页数
      this.form.limit = e
      this.load()
    },
    handleCurrentChange (e) { // 输入框控制页数
      this.form.page = e
      this.load()
    },
    handleFilter () { // 点击查找
      this.load() // 如果角色名称为空，感觉体验不好
    },
    handleCreate () { // 点击添加
      this.title = '创建'
      this.addRole = true
      this.roleForm.name = '' // 清除编辑残留信息
      this.roleForm.desc = ''
    },
    handleUpdate (event) { // 点击编辑
      this.title = '编辑'
      this.addRole = true
      this.roleForm.name = event.name
      this.roleForm.desc = event.desc
      this.edit = event
    },
    roleADD () { // 添加角色
      if (this.roleForm.name.trim() !== '' && this.roleForm.desc.trim() !== '') {
        const that = this
        addRole(that.roleForm).then(function (reds) {
          if (reds.data.errmsg === '成功') {
            that.$message({
              showClose: true,
              message: '添加成功',
              type: 'success'
            })
            that.load()
          } else {
            that.$message({
              showClose: true,
              message: reds.data.errmsg,
              type: 'error'
            })
          }
          that.addRole = false
        })
      } else {
        this.$message({
          showClose: true,
          message: '角色名称或说明不能为空',
          type: 'error'
        })
      }
    },
    roleUPDATE () { // 编辑角色
      if (this.roleForm.name.trim() !== '' && this.roleForm.desc.trim() !== '') {
        const that = this
        this.edit.name = this.roleForm.name
        this.edit.desc = this.roleForm.desc
        roleUpdate(that.edit).then(function (reds) {
          if (reds.data.errmsg === '成功') {
            that.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
            that.load()
          } else {
            that.$message({
              showClose: true,
              message: reds.data.errmsg,
              type: 'error'
            })
          }
          that.addRole = false
        })
      } else {
        this.$message({
          showClose: true,
          message: '角色名称或说明不能为空',
          type: 'error'
        })
      }
    },
    handleDelete (event) { // 删除角色
      console.log(event)
      this.$confirm('此操作将永久删除该角色---' + event.name + '---, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const that = this
        roleDelete(event.id).then(function (reds) {
          if (reds.data.errmsg === '成功') {
            that.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            that.load()
          } else {
            that.$message({
              showClose: true,
              message: reds.data.errmsg,
              type: 'error'
            })
          }
          that.addRole = false
        })
      })
    },
    handlePermission (event) { // 角色授权列表
      this.AuthorizationId = event.id
      const that = this
      jurisdictionList(event.id).then(function (reds) {
        if (reds.data.errmsg === '成功') {
          that.authorization = reds.data.data
          that.Authorization = true
        } else {
          that.$message({
            showClose: true,
            message: reds.data.errmsg,
            type: 'error'
          })
        }
      })
    },
    AuthorizaTion () { // 给角色授权
      const that = this
      const DTO = {
        roleId: null,
        permissions: null
      }
      DTO.roleId = that.AuthorizationId
      DTO.permissions = that.$refs.auth.getCheckedKeys(true)
      roleJurisdiction(DTO).then(function (reds) {
        that.Authorization = false
        if (reds.data.errmsg === '成功') {
          that.$message({
            showClose: true,
            message: '授权成功',
            type: 'success'
          })
          that.load()
        } else {
          that.$message({
            showClose: true,
            message: reds.data.errmsg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
