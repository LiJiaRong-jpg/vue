<template>
  <div>
    <div style="width: 100%;height: 60px;"></div>
    <div class="filter-container" style="margin-left: 20px;margin-bottom: 20px;">
      <el-select v-model="ListForm.recommendType" style="width: 200px;margin: 10px;" placeholder="请选择用户状态">
        <el-option v-for="(key, index) in recommendType" :key="index" :label="key.name" :value="key.value" />
      </el-select>
      <el-button style="position: relative;top:-25px;" class="filter-item" type="primary" icon="el-icon-search"
        @click="load">查找</el-button>
      <el-button style="position: relative;top:-25px;" class="filter-item" type="primary" icon="el-icon-edit"
        @click="show=true;addForm.spuId=''">添加</el-button>
    </div>

    <el-table :data="tabDate.items" style="width: 95%;margin: auto;margin-top: 20px;"
      :default-sort="{prop: 'date', order: 'descending'}" border>
      <el-table-column align="center" label="推荐ID" prop="id" sortable>
      </el-table-column>
      <el-table-column align="center" label="推荐商品" prop="spuTitle">
      </el-table-column>
      <el-table-column align="center" label="推荐类型" prop="recommendType">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">{{Type(scope.row.recommendType)}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="DeleteCou(scope.row)">删除</el-button>
          <!-- @click="handleDelete(scope.row)" -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="创建" :visible.sync="show">
      <el-form :model="addForm">
        <el-form-item label="推荐类型" prop="recommendType" label-width="250px">
          <el-select v-model="addForm.recommendType" placeholder="请选择">
            <el-option v-for="(key, index) in recommendType" :key="index" :label="key.name" :value="key.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="推荐商品" label-width="250px">
          <!-- <el-cascader v-model="addForm.spuId" :options="addlist" @change="handleChange"></el-cascader> -->
            <el-cascader
              :options="addlist"
              @change="handleChange"></el-cascader>
<!-- v-model="addForm.spuId" (不绑定值否则需要点两次输入框才显示内容)-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="add">确定</el-button>
      </div>
    </el-dialog>

    <div style="width: 100%;background-color: white;">
      <el-pagination style="padding: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]" :page.sync="ListForm.pageNo" :limit.sync="ListForm.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="tabDate.total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import {
  recommendList,
  recommendDelete,
  addList,
  addshopping
} from '../../api/promotion/recommanage.js'
export default {
  data () {
    return {
      ListForm: { // 获取推荐管理列表所需信息
        pageNo: 1,
        limit: 10,
        recommendType: ''
      },
      tabDate: { // 返回数据
        total: 0,
        items: []
      },
      recommendType: [{
        value: 1,
        unionType: 3,
        name: '橱窗推荐'
      }
      ],
      addlist: [],
      show: false,
      addForm: {
        spuId: '',
        recommendType: 1
      }
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      const that = this
      recommendList(this.ListForm).then(function (reds) {
        that.tabDate = reds.data.data
      })
      addList().then(function (reds) {
        that.addlist = that.clearChildren(reds.data.data)
      })
    },
    clearChildren (data) { // 删除为空的子元素
      if (data === null || data === undefined) {
        return data
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length === 0) {
          data[i].children = undefined
        } else {
          this.clearChildren(data[i].children)
        }
      }
      return data
    },
    handleSizeChange (e) { // 点击控制页数
      this.ListForm.limit = e
      this.load()
    },
    handleCurrentChange (e) { // 输入框控制页数
      this.ListForm.pageNo = e
      this.load()
    },
    Type (e) {
      switch (e) {
        case 1:
          e = '橱窗推荐'
          break
        default:
          e = '全部'
          break
      }
      return e
    },
    DeleteCou (row) { // 删除推荐
      const that = this
      this.$confirm('此操作将永久删除该优惠劵---' + row.spuTitle + '---, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        recommendDelete(row.id, row.recommendType).then(function (reds) {
          if (reds.data.errmsg === '成功') {
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
    add () {
      const that = this
      addshopping(this.addForm).then(function (reds) {
        if (reds.data.errmsg === '成功') {
          that.tableData.items.splice(that.index, 1)
          that.mess ? that.mess.close() : ''
          that.mess = that.$message({
            showClose: true,
            message: '添加成功',
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
          that.load()
        }
      })
    },
    handleChange (value) {
      if (value !== undefined) {
        this.addForm.spuId = value[value.length - 1].substring(2)
      }
    }
  }
}
</script>

<style>
</style>
