<template>
  <div>
    <div style="width: 100%;height: 60px;"></div>

    <el-table :data="tableData" size="small" element-loading-text="正在查询中。。。" >
      <el-table-column align="center" label="类目ID" prop="value" />

      <el-table-column align="center" label="类目名" prop="label">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.label }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="全类目名" prop="fullName">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.fullName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="父类目ID" prop="parent" />

      <el-table-column align="center" label="级别" prop="level">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.level }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标志图片" prop="iconUrl">
        <template slot-scope="scope">
          <el-image :src="scope.row.iconUrl" width="80">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类目图片" prop="picUrl">
        <template slot-scope="scope">
          <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="80" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"
            >编辑</el-button>
          <el-button type="danger" size="mini"
           >删除</el-button>
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
    categoryList
  } from '../../api/goods/goodscategory.js'
  export default {
    data() {
      return {
        form: {
          id: undefined,
          level: undefined,
          limit: 20,
          pageNo: 1,
          parentId: undefined,
          title: undefined,
        },
        tableData: { // 返回的数据
          items: [],
          total: 0
        }
      }
    },
    mounted() {
      this.load()
    },
    methods: {
      load() {
        const that = this
        categoryList(that.form).then(function(reds) {
          that.tableData = reds.data.data
        })
      },
      handleSizeChange(e) { // 点击控制页数
        this.form.limit = e
        this.load()
      },
      handleCurrentChange(e) { // 输入框控制页数
        this.form.pageNo = e
        this.load()
      }
    }
  }
</script>

<style>
</style>
