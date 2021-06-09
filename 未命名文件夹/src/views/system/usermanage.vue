<template>
  <div style="padding-left: 20px;">
    <div style="width: 100%;height: 60px;"></div>
    <div>
      <el-select v-model="userForm.status" style="width: 200px;margin: 10px;" placeholder="请选择用户状态">
        <el-option v-for="(key, index) in statusDic" :key="index" :label="key.name" :value="key.value" />
      </el-select>
      <el-select v-model="userForm.level" style="width: 200px;margin: 10px;" placeholder="请选择用户会员等级">
        <el-option v-for="(key, index) in evelDic" :key="index" :label="key.name" :value="key.value" />
      </el-select>
      <el-select v-model="userForm.gender" style="width: 200px;margin: 10px;" placeholder="请选择用户性别">
        <el-option v-for="(key, index) in Gender" :key="index" :label="key.name" :value="key.value" />
      </el-select>
      <el-input v-model="userForm.id" clearable style="width: 200px;margin: 10px;" placeholder="请输入用户Id" />
      <el-input v-model="userForm.nickname" clearable style="width: 200px;margin: 10px;" placeholder="请输入昵称" />
      <el-button type="primary" icon="el-icon-search" @click="load">查找
      </el-button>
      <el-button type="primary" icon="el-icon-edit" @click="AddUser">添加用户
      </el-button>
    </div>

    <el-table :data="tableData.items" style="width: 95%;margin: auto;margin-top: 20px;"
      :default-sort="{prop: 'date', order: 'descending'}" border="">
      <el-table-column prop="id" label="用户ID" sortable align="center">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" align="center">
      </el-table-column>
      <el-table-column prop="gender" label="性别" align="center">
        <template slot-scope="scope">
          <el-button type="primary" style="padding: 10px;" plain>{{GENDER(scope.row.gender)}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="会员等级" align="center">
        <template slot-scope="scope">
          <el-button type="primary" style="padding: 10px;" plain>{{LV(scope.row.level)}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="gmtLastLogin" label="上次登录时间" align="center">
        <template slot-scope="scope">
          <span>{{GmtLastLogin(scope.row.gmtLastLogin)}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-button type="primary" style="padding: 10px;" plain>{{Status(scope.row.status)}}</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="lastLoginIp" label="上次登录IP" align="center">
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center" width="250">
        <!-- :formatter="formatter" -->
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="statusUpdate(scope)">
            {{ scope.row.status === 0 ? "激活" : "冻结" }}
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope)">
            编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">
            删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="width: 100%;background-color: white;">
      <el-pagination style="padding: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]" :page.sync="userForm.pageNo" :limit.sync="userForm.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="show">
      <el-form ref="form" :model="addForm" label-width="90px">
        <el-form-item label="角色昵称">
          <el-input v-model="addForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-select v-model="addForm.gender" style="width: 200px;margin: 10px;" placeholder="请选择用户性别">
            <el-option v-for="(key, index) in Gender" :key="index" :label="key.name" :value="key.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户等级">
          <el-select v-model="addForm.level" style="width: 200px;margin: 10px;" placeholder="请选择用户会员等级">
            <el-option v-for="(key, index) in evelDic" :key="index" :label="key.name" :value="key.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="addForm.status" style="width: 200px;margin: 10px;" placeholder="请选择用户状态">
            <el-option v-for="(key, index) in statusDic" :key="index" :label="key.name" :value="key.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="float: right;">
        <el-button @click="show = false">取消</el-button>
        <el-button v-if="title=='创建'" type="primary" @click="userADD">确定</el-button>
        <el-button v-if="title=='编辑'" type="primary" @click="userUPDATE">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    userList,
    status,
    deleteUser,
    addUser,
    updateUser
  } from '../../api/system/usermanage.js'
  export default {
    data() {
      return {
        userForm: { // 会员管理列表请求信息
          nickname: '',
          pageNo: 1,
          limit: 10,
          id: '',
          level: 0,
          gender: 2,
          status: 0
        },
        Gender: [ // 搜索性别
          {
            value: 1,
            name: '女'
          },
          {
            value: 2,
            name: '男'
          },
          {
            value: '',
            name: '全部'
          }
        ],
        evelDic: [{ // 搜索权限
            value: 0,
            name: '普通会员'
          },
          {
            value: 1,
            name: 'VIP会员'
          },
          {
            value: '',
            name: '全部'
          }
        ],
        statusDic: [{ // 搜索状态
            value: 0,
            name: '冻结'
          },
          {
            value: 1,
            name: '激活'
          },
          {
            value: '',
            name: '全部'
          }
        ],
        tableData: { // 返回的数据
          items: [],
          total: 0
        },
        addForm: { // 添加修改会员所需的数据
          avatarUrl: '',
          gender: '',
          gmtCreate: '',
          gmtLastLogin: '',
          gmtUpdate: '',
          id: '',
          lastLoginIp: '',
          level: '',
          loginType: '',
          nickname: '',
          openId: '',
          password: '',
          phone: '',
          status: ''
        },
        index: 0, // 点击tab列表中的按钮的位置
        show: false, // 弹出框的显隐
        title: '创建', // 弹出框的标题
        STatus: null
      }
    },
    mounted() {
      this.load()
    },
    methods: {
      load() {
        const that = this
        userList(that.userForm).then(function(reds) {
          that.tableData.total = reds.data.data.count
          that.tableData.items = reds.data.data.items
        })
      },
      handleSizeChange(e) { // 点击控制页数
        this.userForm.limit = e
        this.load()
      },
      handleCurrentChange(e) { // 输入框控制页数
        this.userForm.pageNo = e
        this.load()
      },
      GENDER(gender) {
        switch (gender) {
          case 1:
            gender = '女'
            break
          case 2:
            gender = '男'
            break
          default:
            gender = '未知性别'
            break
        }
        return gender
      },
      LV(level) {
        switch (level) {
          case 0:
            level = '普通会员'
            break
          case 1:
            level = 'VIP会员'
            break
          default:
            level = '全部'
            break
        }
        return level
      },
      Status(status) {
        switch (status) {
          case 0:
            status = '冻结'
            break
          case 1:
            status = '激活'
            break
          default:
            status = '全部'
            break
        }
        return status
      },
      GmtLastLogin(gmtLastLogin) {
        var date = new Date(gmtLastLogin) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日'
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + '时'
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + '分'
        gmtLastLogin = M + D + h + m
        return gmtLastLogin
      },
      statusUpdate(row) { // 改变用户状态
        const that = this
        if (row.row.status === 0) {
          this.STatus = 1
        } else {
          this.STatus = 0
        }
        status(row.row.id, this.STatus).then(function(reds) {
          if (reds.data.errmsg === '成功') {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
            that.load()
          } else {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
              showClose: true,
              message: reds.data.errmsg,
              type: 'error'
            })
          }
        })
      },
      handleDelete(row) { // 删除会员
        const that = this
        this.index = row.$index
        this.$confirm('此操作将永久删除该角色---' + row.row.nickname + '---, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(row.row.id, row.row.nickname).then(function(reds) {
            if (reds.data.errmsg === '成功') {
              that.tableData.items.splice(that.index, 1)
              that.mess ? that.mess.close() : ''
              that.mess = that.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              })
              if (that.tableData.items.length < 2) {
                that.load()
              }
            } else {
              that.mess ? that.mess.close() : ''
              that.mess = that.$message({
                showClose: true,
                message: reds.data.errmsg,
                type: 'error'
              })
              that.load()
            }
          })
        })
      },
      AddUser() { // 点击创建
        this.title = '创建'
        this.show = true
        this.addForm = {
          nickname: '',
          phone: '',
          level: '',
          gender: '',
          password: '',
          status: '',
          avatarUrl: ''
        }
      },
      handleUpdate(row) { // 点击编辑
        console.log(row)
        this.title = '编辑'
        row = JSON.stringify(row.row)
        this.addForm = JSON.parse(row)
        this.show = true
      },
      userUPDATE() { // 修改会员
        const that = this
        that.show = false
        updateUser(this.addForm).then(function(reds) {
          if (reds.data.errmsg === '成功') {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
            that.load()
          } else {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
              showClose: true,
              message: reds.data.errmsg,
              type: 'error'
            })
          }
        })
      },
      userADD() { // 添加会员
        const that = this
        addUser(this.addForm).then(function(reds) {
          console.log(reds.data.data)
          if (reds.data.errmsg === '成功') {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
              showClose: true,
              message: '添加成功',
              type: 'success'
            })
            // that.load()
          } else {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
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

<style scoped="scoped">
</style>
