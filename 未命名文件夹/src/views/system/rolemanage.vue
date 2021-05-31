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
      <el-button v-if="title=='创建'" style="background-color: aqua;" type="primary" @click="roleADD">确定</el-button>
      <el-button v-if="title=='编辑'" style="background-color: black;" type="primary" @click="roleUPDATE">确定</el-button>
  </div>
  </el-dialog>
  </div>

</template>

<script>
export default {
  data () {
    return {
      form: { // 搜索列表参数
        name: '',
        page: 1,
        limit: 10
      },
      tableData: '', // 返回数据
      addRole: false, // 添加修改框显隐
      title: '', // 添加修改框标题
      roleForm: {
        name: '',
        desc: ''
      },
      edit: null // 接受编辑时的参数
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () { // 页面加载
      const that = this
      const token = window.sessionStorage.getItem('token')
      this.axios.get('http://192.168.1.54:8081/m.api', {
        headers: {
          ADMINTOKEN: token
        },
        params: {
          _gp: 'admin.role',
          _mt: 'list',
          name: that.form.name,
          page: that.form.page,
          limit: that.form.limit
        }
      }).then(function (reds) {
        console.log(reds.data.data)
        that.tableData = reds.data.data
      })
    },
    handleSizeChange (e) { // 点击控制页数
      this.form.limit = e
      this.load()
    },
    handleCurrentChange () { // 输入框控制页数
      this.form.limit = event.eventPhase
      this.load()
    },
    handleFilter () {
      this.load()
    },
    handleCreate () { // 点击添加
      this.title = '创建'
      this.addRole = true
      this.roleForm.name = ''
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
      const that = this
      const token = window.sessionStorage.getItem('token')
      this.axios.get('http://192.168.1.54:8081/m.api', {
        headers: {
          ADMINTOKEN: token
        },
        params: {
          _gp: 'admin.role',
          _mt: 'create',
          role: that.roleForm
        }
      }).then(function (reds) {
        console.log(reds)

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
    },
    roleUPDATE () { // 编辑角色
      const that = this
      this.edit.name = this.roleForm.name
      this.edit.desc = this.roleForm.desc
      const token = window.sessionStorage.getItem('token')
      this.axios.get('http://192.168.1.54:8081/m.api', {
        headers: {
          ADMINTOKEN: token
        },
        params: {
          _gp: 'admin.role',
          _mt: 'update',
          role: that.edit
        }
      }).then(function (reds) {
        console.log(reds)

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
    },
    handleDelete(event){

    }


  }
}
</script>

<style>

</style>
