<template>
  <div class="rolemanage">
    <div style="width: 100%;height: 40px;"></div>
    <div class="filter-container" style="margin-top: 20px;margin-left: 20px;margin-bottom: 20px;">
          <el-input
            v-model="form.name"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入角色名称"
          />
          <el-button style="position: relative;top: -13px;left: 10px;"
            v-permission="['admin:role:list']"
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
            >查找</el-button
          >
          <el-button style="position: relative;top: -13px;left: 10px;"
            v-permission="['admin:role:create']"
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreate"
            >添加</el-button
          >
        </div>

    <div>
        <el-table
          :data="tableData.items"
          style="width: 90%;margin: auto;"
          border
          >
          <el-table-column
            prop="name"
            label="角色名称"
            sortable
            align="center"
            width="330">
          </el-table-column>
          <el-table-column
            prop="desc"
            align="center"
            label="说明"
            width="330">
          </el-table-column>
         <el-table-column
            prop="address"
            label="操作"
            align="center"
            :formatter="formatter">
             <template slot-scope="scope">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="handleUpdate(scope.row)"
                        v-permission="['admin:role:update']"
                        >编辑</el-button
                      >
                      <el-button
                        type="danger"
                        size="mini"
                        @click="handleDelete(scope.row)"
                        v-permission="['admin:role:delete']"
                        >删除</el-button
                      >
                      <el-button
                        v-permission="['admin:role:permissionList']"
                        type="primary"
                        size="mini"
                        @click="handlePermission(scope.row)"
                        >授权</el-button
                      >
                    </template>
          </el-table-column>
        </el-table>
    </div>

    <div>
      <el-pagination
            style="padding: 20px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 100]"
            :page.sync="form.page"
            :limit.sync="form.limit"
            layout="total, sizes, prev, pager, next, jumper"
            @pagination="getList"
            :total="tableData.total">
          </el-pagination>
    </div>

    <div v-show="addRole" style="width: 100%;height: 100vh;background-color: $7f7f7f;">

    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        page: 1,
        limit: 10
      },
      tableData: '',
      addRole: false
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
    handleCreate () {
      this.addRole = true
    }
  }
}
</script>

<style>
</style>
