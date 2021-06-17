<template>
  <div>
    <div style="width: 100%;height: 60px;"></div>
    <div>
      <el-input v-model="form.title" clearable style="width: 200px;margin: 0 10px;" placeholder="请输入商品名称" />
      <el-input v-model="form.barcode" clearable style="width: 200px;margin: 0 10px;" placeholder="请输入商品" />
      <el-select v-model="form.status" clearable style="width: 200px;margin: 0 10px;" placeholder="请选择商品状态">
        <el-option v-for="item in LEVEL" :label="item.name" :value="item.value" />
      </el-select>
      <el-cascader :options="ParentCategory" :props="{ checkStrictly: true }" v-model="form.categoryId"
        style="width: 200px;margin: 0 10px;top: 15px;" placeholder="请选择类目" filterable clearable />
      <el-button type="primary" icon="el-icon-search" @click="load" style="position: relative;top: -15px;">查找
      </el-button>
      <el-button type="primary" icon="el-icon-edit" @click="add" style="position: relative;top: -15px;">添加
      </el-button>

      <el-button :disabled="option.length === 0" style="position: relative;top: -15px;" type="danger"
        icon="el-icon-delete" @click="optionDelete">批量删除</el-button>
    </div>

    <el-table :data="tableData.items" size="small" @selection-change="handleSelectionChange" border
      style="width: 95%;margin: auto;margin-top: 20px;" ref="table">
      <el-table-column align="center" type="selection" width="55" />

      <el-table-column type="expand" label="商品信息">
        <template slot-scope="props">
          <el-table :data="props.row.skuList" size="small" border>
            <el-table-column align="center" label="商品条码" prop="barCode" />
            <el-table-column align="center" label="商品规格" prop="title" />
            <el-table-column align="center" label="商品库存" prop="stock" />
            <el-table-column align="center" label="商品冻结库存" prop="freezeStock" />
            <el-table-column align="center" label="原价" prop="originalPrice">
              <template slot-scope="scope">{{
                  scope.row.originalPrice / 100
                }}</template>
            </el-table-column>
            <el-table-column align="center" label="现价" prop="price">
              <template slot-scope="scope">{{
                  scope.row.price / 100
                }}</template>
            </el-table-column>
            <el-table-column align="center" label="VIP价格" prop="vipPrice">
              <template slot-scope="scope">{{
                  scope.row.vipPrice / 100
                }}</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品ID" prop="id" />

      <el-table-column align="center" min-width="100" label="名称" prop="title" />

      <el-table-column align="center" property="img" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.img" width="40" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品详细介绍" prop="detail">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="clickSee(scope.row)">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类目ID" prop="categoryId" />

      <el-table-column align="center" label="邮费模板ID" prop="freightTemplateId" />

      <el-table-column align="center" label="销量" prop="sales" />

      <el-table-column align="center" label="单位" prop="unit" />

      <el-table-column align="center" label="是否在售" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">{{
              scope.row.status == 1 ? "在售" : "未售"
            }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="描述" prop="description" />

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="add(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status == 1" type="warning" size="mini" @click="STATUS(scope.row)">下架</el-button>
          <el-button v-else type="success" size="mini" @click="STATUS(scope.row)">上架</el-button>
          <el-button type="danger" size="mini" @click="DELETE(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="seeShow" title="商品详情">
      <div v-html="goodsImgs" />
    </el-dialog>

    <div style="width: 100%;background-color: white;">
      <el-pagination style="padding: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]" :page.sync="form.page" :limit.sync="form.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    categoryTree,
    list,
    seeGoods,
    Delete,
    Status
  } from '../../api/goods/goodslist.js'
  export default {
    data() {
      return {
        form: {
          page: 1,
          limit: 10,
          title: '',
          barcode: '',
          status: '',
          categoryId: ''
        },
        ParentCategory: [],
        LEVEL: [{
            value: 0,
            name: '下架'
          },
          {
            value: 1,
            name: '正常'
          }
        ],
        tableData: {
          items: [],
          total: 0
        },
        seeShow: false,
        goodsImgs: '',
        option: []
      }
    },
    mounted() {
      this.load()
    },
    methods: {
      load() {
        const that = this
        list(that.form).then(function(reds) {
          that.tableData = reds.data.data
        })
        categoryTree().then(function(reds) {
          that.ParentCategory = reds.data.data
        })
      },
      add(row) { // 点击添加或编辑
        if (row.categoryId) {
          this.$router.push({
            path: './upsert',
            query: {
              data: row
            }
          })
        } else {
          this.$router.push({
            path: './upsert'
          })
        }
      },
      handleSizeChange(e) { // 点击控制页数
        this.form.limit = e
        this.load()
      },
      handleCurrentChange(e) { // 输入框控制页数
        this.form.page = e
        this.load()
      },
      clickSee(row) { // 点击行内查看
        const that = this
        if (!that.seeShow) {
          seeGoods(row.id).then(response => {
            that.goodsImgs = response.data.data.detail.replace(
              /<img/g,
              "<img style='max-width:100%;height:auto;line-height:0px'"
            )
            that.seeShow = true
          })
        }
      },
      optionDelete() {
        const that = this
        that.$confirm(
            '此操作将永久删除选中的' +
            that.option.length +
            '件商品, 是否继续?',
            '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
          .then(function() {
            Delete(that.option)
              .then(function(reds) {
                if (reds.data.errmsg == '成功') {
                  that.mess ? that.mess.close() : ''
                  that.mess = that.$message({
                    showClose: true,
                    message: '删除成功',
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
          })
      },
      DELETE(row) {
        const that = this
        that.$confirm(
            '此操作将永久删除选中的' +
            row.title +
            '件商品, 是否继续?',
            '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
          .then(function() {
            const arr = []
            arr.push(row.id)
            Delete(arr)
              .then(function(reds) {
                if (reds.data.errmsg == '成功') {
                  that.mess ? that.mess.close() : ''
                  that.mess = that.$message({
                    showClose: true,
                    message: '删除成功',
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
          })
      },
      handleSelectionChange(e) {
        const temp = []
        e.forEach(item => {
          temp.push(item.id)
        })
        this.option = temp
      },
      STATUS(row) {
        const that = this
        if (row.status == 0) {
          row.titlE = '下架'
          row.Status = 1
        } else {
          row.titlE = '上架'
          row.Status = 0
        }
        that.$confirm(
          '此操作将' +
          row.titlE + '-----' + row.title + '-----' +
          ', 是否继续?',
          '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(function() {
          Status(row.id, row.Status).then(function(reds) {
            if (reds.data.errmsg == '成功') {
              that.mess ? that.mess.close() : ''
              that.mess = that.$message({
                showClose: true,
                message: row.titlE + '成功',
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
        })
      }
    }
  }
</script>

<style>
</style>
