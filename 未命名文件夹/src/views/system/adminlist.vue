<template>
  <div>
    <div style="width: 100%;height: 40px;"></div>
    <div class="filter-container" style="margin-top: 20px;margin-left: 20px;margin-bottom: 20px;">
      <el-input v-model="form.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入角色名称" />
      <el-button style="position: relative;top: -13px;left: 10px;" class="filter-item" type="primary"
        icon="el-icon-search" @click="load">查找</el-button>
      <el-button style="position: relative;top: -13px;left: 10px;" class="filter-item" type="primary"
        icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <el-table :data="tableData.items" style="width: 90%;margin: auto;" :default-sort="{prop: 'date', order: 'descending'}" border="">
      <el-table-column prop="id" label="管理员ID" sortable width="180" align="center">
      </el-table-column>
      <el-table-column prop="username" label="管理员姓名" width="180" align="center">
      </el-table-column>
      <el-table-column prop="avatar" label="管理员头像" align="center">
        <template slot-scope='scope'>
          <!-- <img v-if="scope.row.avatar" /> -->
          <el-image :src="scope.row.avatar" width="40"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="roleIds" label="管理员角色" align="center">
        <template slot-scope="scope">
          <el-button type="primary" style="padding: 10px;" plain v-for="item in scope.row.roleIds" :key="item" >{{buttom[item]}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center">
        <!-- :formatter="formatter" -->
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope)">
            编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">
            删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="width: 100%;background-color: white;">
      <el-pagination style="padding: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]" :page.sync="form.page" :limit.sync="form.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="addAdmin">
        <el-form ref="form" label-width="80px">

          <el-form-item label="登录名" v-if="title == '创建'">
            <el-input v-model="adminForm.username"></el-input>
          </el-form-item>
          <el-form-item label="登录名" v-if="title != '创建'">
            <el-input v-model="adminForm.username" disabled></el-input>
          </el-form-item>

          <el-form-item label="密码">
            <el-input v-model="adminForm.password"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="adminForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="adminForm.realname" @keyup.native="inputChange($event)" @keydown.native="inputChange($event)"></el-input>
          </el-form-item>
          <el-form-item label="授权角色">
              <el-select v-model="adminForm.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in value"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
        </el-form>
        <div style="float: right;">
        <el-button @click="addAdmin = false">取消</el-button>
        <el-button type="primary" @click="addName">确定</el-button>
    </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  managers,
  addOptions,
  addAdmin,
  updateAdmin,
  deleteAdmin
} from '../../api/system/adminlist.js'
export default {
  data () {
    return {
      form: { // 搜索列表参数
        username: '',
        page: 1, // 页数
        limit: 10, // 每页几条
        sort: 'add_time',
        order: 'desc'
      },
      tableData: { // 返回的数据
        items: [],
        total: 0
      },
      title: '创建', // 弹出框的标题
      index: 0, // 修改哪一行的内容
      addAdmin: false, // 弹出框的显隐
      adminForm: { // 要添加管理员的数据
        username: '',
        password: '',
        roleIds: [],
        phone: '',
        realname: ''
      },
      value: [], // 所有授权角色
      buttom: {

      } // 管理员角色的内容是数字，所以用这个匹配
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      const that = this
      managers(that.form).then(function (reds) {
        that.tableData = reds.data.data
      })
      addOptions().then(function (reds) {
        that.value = reds.data.data
        for (let i = 0; i < that.value.length; i++) {
          that.buttom[that.value[i].value] = that.value[i].label
        }
      })
    },
    handleCreate () {
      this.title = '创建'
      this.addAdmin = true
      this.adminForm.username = '' // 清除编辑残留信息
      this.adminForm.password = ''
      this.adminForm.roleIds = []
      this.adminForm.phone = ''
      this.adminForm.realname = ''
    },
    handleUpdate (row) {
      this.title = '编辑'
      this.addAdmin = true
      this.index = row.$index
      this.adminForm.username = row.row.username // 编辑输入框信息
      this.adminForm.roleIds = row.row.roleIds
      this.adminForm.phone = row.row.phone
      this.adminForm.realname = row.row.realname
      this.adminForm.id = row.row.id
      this.adminForm.password = ''
    },
    handleSizeChange (e) { // 点击控制页数
      this.form.limit = e
      this.load()
    },
    handleCurrentChange (e) { // 输入框控制页数
      this.form.page = e
      this.load()
    },
    inputChange (e) {
      const o = e.target
      o.value = o.value.replace(/[^\u4E00-\u9FA5]/g, '') // 清除除了中文以外的输入的字符
      this.name = o.value
    },
    addName () { // 验证弹出框的输入
      if (this.adminForm.username.trim() !== '') { // 登录名不能为空
        if (this.adminForm.password.length > 5 && this.adminForm.password.length < 19) { // 密码长度为6到18
          const zz = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
          if (zz.test(this.adminForm.phone)) { // 电话号码
            if (this.title === '创建') {
              this.adminADD()
            } else {
              this.adminUpdate()
            }
          } else {
            this.$message({
              showClose: true,
              message: '请输入正确电话号码',
              type: 'error'
            })
          }
        } else {
          this.$message({
            showClose: true,
            message: '密码长度为6到18',
            type: 'error'
          })
        }
      } else {
        this.$message({
          showClose: true,
          message: '登录名不能为空',
          type: 'error'
        })
      }
    },
    adminADD () { // 添加管理员
      const that = this
      addAdmin(this.adminForm).then(function (reds) {
        if (reds.data.errmsg === '成功') {
          that.tableData.items.push(reds.data.data)
          that.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          this.adminForm = { // 添加后清除编辑残留信息
            realname: '',
            username: '',
            phone: '',
            password: '',
            roleIds: []
          }
        } else {
          that.$message({
            showClose: true,
            message: reds.data.errmsg,
            type: 'error'
          })
        }
        that.addAdmin = false
      })
    },
    adminUpdate () { // 编辑管理员
      this.tableData.items.splice(this.index, 1, this.adminForm)
      const that = this
      updateAdmin(that.adminForm).then(function (reds) {
        if (reds.data.errmsg === '成功') {
          that.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
        } else {
          that.$message({
            showClose: true,
            message: reds.data.errmsg,
            type: 'error'
          })
        }
        that.addAdmin = false
      })
    },
    handleDelete (row) { // 删除管理员
      const that = this
      this.index = row.$index
      this.$confirm('此操作将永久删除该角色---' + row.name + '---, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.items.splice(this.index, 1)
        deleteAdmin(row.row.id).then(function (reds) {
          if (reds.data.errmsg === '成功') {
            that.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
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
    }
  }
}
</script>

<style>
</style>
