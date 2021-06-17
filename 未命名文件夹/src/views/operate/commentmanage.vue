<template>
  <div>
    <div>
      <div style="width: 100%;height: 60px;"></div>
      <div>
        <el-input v-model="form.title" clearable class="filter-item" style="width: 200px;margin:0 10px"
          placeholder="评论号" />
        <el-input v-model="form.spuName" clearable class="filter-item" style="width: 200px;margin:0 10px"
          placeholder="用户姓名" />
        <el-input v-model="form.content" clearable class="filter-item" style="width: 200px;margin:0 10px"
          placeholder="商品名称" />
        <el-input v-model="form.userName" clearable class="filter-item" style="width: 200px;margin:0 10px"
          placeholder="评论内容" />
        <el-button style="position: relative;top: -13px;left: 10px;" class="filter-item" type="primary"
          icon="el-icon-search" @click="load">查找</el-button>
      </div>
    </div>

    <el-table :data="tableData.items" style="width: 95%;margin: auto;margin-top: 20px;"
      :default-sort="{prop: 'date', order: 'descending'}" border="">

      <el-table-column align="center" label="评论编号" prop="id" sortable />

      <el-table-column align="center" label="评论内容" prop="content" />

      <el-table-column align="center" label="评论分数" prop="score" />

      <el-table-column align="center" label="用户ID" prop="userId" />

      <el-table-column align="center" label="用户昵称" prop="userNickName" />

      <el-table-column align="center" label="订单ID" prop="orderId" />

      <el-table-column align="center" label="商品ID" prop="spuId" />

      <el-table-column align="center" label="商品名称" prop="spuTitle" />

      <el-table-column align="center" label="评论时间" prop="gmtCreate">
        <template slot-scope="scope">
          <span>{{TIME(scope.row.gmtCreate)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" prop="type">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteRow(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="width: 100%;background-color: white;">
      <el-pagination style="padding: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]" :page.sync="form.pageNo" :limit.sync="form.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  AppraiseList,
  deleteAppraise
} from '../../api/operate/commentmanage.js'
export default {
  data () {
    return {
      form: {
        pageNo: 1,
        limit: 20,
        id: '',
        spuName: '',
        content: '',
        userName: ''
      },
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
      AppraiseList(that.form).then(function (reds) {
        that.tableData = reds.data.data
      })
    },
    handleSizeChange (e) { // 点击控制页数
      this.form.limit = e
      this.load()
    },
    handleCurrentChange (e) { // 输入框控制页数
      this.form.pageNo = e
      this.load()
    },
    TIME (time) { // 时间戳转日期
      if (time !== undefined) {
        var date = new Date(time) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日'
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + '时'
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + '分'
        time = M + D + h + m
        return time
      } else {
        return '无'
      }
    },
    deleteRow (row) { // 删除评论
      const that = this
      this.$confirm('此操作将永久删除该角色---' + row.row.content + '---, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAppraise(row.row.id).then(function (reds) {
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
            that.load()
          }
        })
      })
    }
  }
}
</script>

<style>
</style>
