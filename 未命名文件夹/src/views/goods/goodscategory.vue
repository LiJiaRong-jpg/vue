<template>
  <div>
    <div style="width: 100%;height: 60px;"></div>

    <div class="filter-container">
      <el-input v-model="form.id" clearable style="width: 200px;margin: 0 10px;" placeholder="请输入类目ID" />
      <el-input v-model="form.title" clearable style="width: 200px;margin: 0 10px;" placeholder="请输入类目名称" />
      <el-select v-model="form.level" clearable style="width: 200px;margin: 0 10px;" placeholder="请选择类目级别">
        <el-option v-for="item in LEVEL" :label="item.text" :value="item.value" />
      </el-select>
      <el-cascader :options="ParentCategory" :props="{ checkStrictly: true }" v-model="form.parentId"
        style="width: 200px;margin: 0 10px;top: 15px;" placeholder="请选择父类目" filterable clearable />
      <el-button type="primary" icon="el-icon-search" @click="load" style="position: relative;top: -15px;" v-permission="'operation:category:query'">查找
      </el-button>
      <el-button type="primary" icon="el-icon-edit" @click="addPopup" style="position: relative;top: -15px;" v-permission="'operation:category:create'">添加
      </el-button>
    </div>

    <el-table :data="tableData.items" size="small" style="width: 95%;margin: auto;margin-top: 20px;"
      :default-sort="{prop: 'date', order: 'descending'}" border="">
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
          <el-tag>{{ level(scope.row.level) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标志图片" prop="iconUrl">
        <template slot-scope="scope">
          <el-image :src="scope.row.iconUrl">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类目图片" prop="picUrl">
        <template slot-scope="scope">
          <el-image :src="scope.row.picUrl">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="update(scope.row)" v-permission="'operation:category:update'">编辑</el-button>
          <el-button type="danger" size="mini" @click="DeleteCategory(scope.row)" v-permission="'operation:category:delete'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="TIELE" :visible.sync="show">
      <el-form ref="form" :model="addForm" label-width="100px">
        <el-form-item label="优惠劵名称">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="类目图片">
          <el-upload class="avatar-uploader" :action="img" :show-file-list="false" :on-success="uploadSuccessHandle"
            :before-upload="onBeforeUpload">
            <img v-if="addForm.picUrl" :src="addForm.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="父类目">
          <el-cascader :options="ParentCategory" :props="{ checkStrictly: true }" v-model="addForm.parentId"
            style="width: 200px;" placeholder="请选择父类目" filterable clearable @change="updateCascader" />
        </el-form-item>
      </el-form>
      <div style="float: right;">
        <el-button @click="show = false">取消</el-button>
        <el-button v-if="TIELE=='创建'" type="primary" @click="AddPopup">确定</el-button>
        <el-button v-if="TIELE=='编辑'" type="primary" @click="UpdateCategory">确定</el-button>
      </div>
    </el-dialog>

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
  categoryList,
  parentCategory,
  addCategory,
  updateCategory,
  deleteCategory
} from '../../api/goods/goodscategory.js'
export default {
  data () {
    return {
      img: 'http://192.168.1.54:8081/upload/admin', // 更改图片的地址
      form: {
        id: undefined,
        level: undefined,
        limit: 20,
        pageNo: 1,
        parentId: undefined,
        title: undefined
      },
      tableData: { // 返回的数据
        items: [],
        total: 0
      },
      LEVEL: [{
        text: '一级类目',
        value: 0
      },
      {
        text: '二级类目',
        value: 1
      },
      {
        text: '三级类目',
        value: 2
      }
      ],
      ParentCategory: [],
      TIELE: '创建', // 弹出框的标题
      show: false, // 弹出框的显隐
      addForm: { // 添加，编辑所需数据
        title: '', // 类目名称
        parentId: '', // 商品类目
        picUrl: '' // 图片地址
      }
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      const that = this
      if (that.form.parentId) {
        that.form.parentId = that.form.parentId[that.form.parentId.length - 1]
      }
      categoryList(that.form).then(function (reds) {
        that.tableData = reds.data.data
      })
      parentCategory().then(function (reds) {
        that.ParentCategory = that.clearChildren(reds.data.data)
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
    level (num) { // 处理表单的级别
      switch (num) {
        case 0:
          return '一级类目'
          break
        case 1:
          return '二级类目'
          break
        case 2:
          return '三级类目'
          break
        default:
          return '无'
          break
      }
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
    addPopup () {
      this.show = true
      this.TIELE = '创建'
      this.addForm = { // 添加，编辑所需数据
        title: '', // 类目名称
        parentId: '', // 商品类目
        picUrl: '' // 图片地址
      }
    },
    onBeforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    uploadSuccessHandle (e) { // 上传图片
      this.addForm.picUrl = e.url
    },
    AddPopup () { // 添加类目
      const that = this
      if (that.addForm.title.trim() != '') {
        addCategory(that.addForm).then(function (reds) {
          if (reds.data.errmsg == '成功') {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message.success('添加类目成功')
            that.load()
            that.show = false
          } else {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message.error(reds.data.errmsg)
          }
        })
      } else {
        this.mess ? this.mess.close() : ''
        this.mess = this.$message.error('类目名称不能为空')
      }
    },
    update (row) { // 点击编辑
      const that = this
      that.TIELE = '编辑'
      that.show = true
      that.addForm = {
        title: row.label, // 类目名称
        id: row.value, // 商品id
        parentId: row.level, // 商品类目
        picUrl: row.picUrl // 图片地址
      }
    },
    UpdateCategory () { // 点击编辑弹出框中的确定
      const that = this
      if (typeof (that.addForm.parentId) !== 'number') {
        that.addForm.parentId = that.addForm.parentId[that.addForm.parentId.length - 1]
      }
      if (that.addForm.title.trim() != '') {
        updateCategory(that.addForm).then(function (reds) {
          if (reds.data.errmsg == '成功') {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message.success('修改类目成功')
            that.load()
            that.show = false
          } else {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message.error(reds.data.errmsg)
          }
        })
      } else {
        this.mess ? this.mess.close() : ''
        this.mess = this.$message.error('类目名称不能为空')
      }
    },
    updateCascader (e) { // 修改商品类目时触发
      if (e == null || e === undefined) {
        return false
      }
      const tag = e[e.length - 1]

      if (this.TIELE === '编辑') {
        if (this.addForm.id === tag) {
          this.$message.error('请不要选择本节点作为父节点')
        }
      }
      if (this.addForm.parentId) {
        this.addForm.parentId = this.addForm.parentId[this.addForm.parentId.length - 1]
      }
      this.addForm.parentId = tag
    },
    DeleteCategory (row) { // 删除类目
      const that = this
      this.$confirm('此操作将永久删除该类目---' + row.label + '---, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategory(row.value).then(function (reds) {
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
    }
  }
}
</script>

<style>
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
</style>
