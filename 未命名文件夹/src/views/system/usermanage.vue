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
      <el-button type="primary"
        icon="el-icon-search" @click="load">查找
      </el-button>
      <el-button type="primary" icon="el-icon-edit">添加用户
      </el-button>
    </div>

    <el-table :data="tableData.items" style="width: 95%;margin: auto;margin-top: 20px;" :default-sort="{prop: 'date', order: 'descending'}" border="">
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
          <el-button type="primary" style="padding: 10px;" plain>{{GmtLastLogin(scope.row.gmtLastLogin)}}</el-button>
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
            {{ scope.row.status === 0 ? "激活" : "冻结" }}</el-button>
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

  </div>
</template>

<script>
import {
  userList
} from '../../api/system/usermanage.js'
export default {
  data () {
    return {
      userForm: { // 会员管理列表请求信息
        nickname: '',
        pageNo: 1,
        limit: 10,
        id: '',
        level: '',
        gender: '',
        status: ''
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
      }
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      const that = this
      userList(that.userForm).then(function (reds) {
        that.tableData.total = reds.data.data.count
        that.tableData.items = reds.data.data.items
      })
    },
    handleSizeChange (e) { // 点击控制页数
      this.userForm.limit = e
      this.load()
    },
    handleCurrentChange (e) { // 输入框控制页数
      this.userForm.pageNo = e
      this.load()
    },
    GENDER (gender) {
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
    LV (level) {
      console.log(level)
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
    Status (status) {
      switch (status) {
        case 0:
          status = '一起'
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
    GmtLastLogin (gmtLastLogin) {

    }
  }
}
</script>

<style>
</style>
