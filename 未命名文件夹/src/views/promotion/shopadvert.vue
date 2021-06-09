<template>
  <div>
    <div>
      <div style="width: 100%;height: 60px;"></div>
      <el-select v-model="form.status" style="width: 200px;margin: 0 10px;" class="filter-item" placeholder="请选择广告状态">
        <el-option v-for="(key, index) in status" :key="index" :label="key.name" :value="key.value" />
      </el-select>
      <el-select v-model="form.adType" style="width: 200px" class="filter-item" placeholder="请选择广告类型">
        <el-option v-for="(key, index) in adType" :key="index" :label="key.name" :value="key.value" />
      </el-select>
      <el-button style="position: relative;top: -13px;left: 10px;" class="filter-item" type="primary"
        icon="el-icon-search" @click="load">查找</el-button>
      <el-button style="position: relative;top: -13px;left: 10px;" class="filter-item" type="primary"
        icon="el-icon-edit" @click="adD">添加</el-button>
    </div>
    <div>
      <el-table :data="tableData.items" style="width: 95%;margin: auto;margin-top: 20px;"
        :default-sort="{prop: 'date', order: 'descending'}" border="">

        <el-table-column align="center" label="广告ID" prop="id" sortable />

        <el-table-column align="center" label="广告标题" prop="title">
        </el-table-column>

        <el-table-column align="center" label="广告类型" prop="adType" width="200px">
          <template slot-scope="scope">
            <el-button type="primary">{{AdType(scope.row.adType)}}</el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" label="广告状态" prop="status">
          <template slot-scope="scope">
            <el-button type="primary">{{Status(scope.row.status)}}</el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" label="广告图片" prop="imgUrl">
          <template slot-scope="scope">
            <el-image :src='scope.row.imgUrl'>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column align="center" label="活动连接" prop="url">
        </el-table-column>

        <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updata(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="Delete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog :title="title" :visible.sync="show">
      <el-form ref="form" :model="addForm" label-width="100px">
        <el-form-item label="广告标题">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="广告图片">
          <el-upload class="avatar-uploader" :action="img" :show-file-list="false" :on-success="uploadSuccessHandle"
            :before-upload="onBeforeUpload">
            <img v-if="addForm.imgUrl" :src="addForm.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="广告类型">
          <el-select v-model="addForm.adType" style="width: 200px" class="filter-item" placeholder="请选择广告类型">
            <el-option v-for="(key, index) in adType" :key="index" :label="key.name" :value="key.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="广告状态">
          <el-select v-model="addForm.status" style="width: 200px;" class="filter-item" placeholder="请选择广告状态">
            <el-option v-for="(key, index) in status" :key="index" :label="key.name" :value="key.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联1">
          <!-- <el-select v-model="addForm.url" style="width: 200px;" class="filter-item" placeholder="请选择广告状态">
            <el-option v-for="(key, index) in relationOne" :key="index" :label="key.name" :value="key.value" />
          </el-select> -->
          <el-cascader :options="relationOne" :props="{ checkStrictly: true }" v-model="url.one" placeholder="关联类目、商品"
            filterable @change="handleLink1" />
        </el-form-item>
        <el-form-item label="关联2">
          <el-select v-model="url.two" style="width: 200px;" class="filter-item" placeholder="请选择广告状态"
            @change="handleLink2">
            <el-option v-for="(key, index) in relationTwo" :key="key.value" :label="key.label" :value="key.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="float: right;">
        <el-button @click="show = false">取消</el-button>
        <el-button v-if="title=='创建'" type="primary" @click="add">确定</el-button>
        <el-button v-if="title=='编辑'" type="primary" @click="add">确定</el-button>
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
    addList
  } from '../../api/promotion/recommanage.js'
  import {
    queryAdvertisement,
    addRecommend,
    updateAdvertisement,
    deleteAdvertisement
  } from '../../api/promotion/shopadvert.js'
  export default {
    data() {
      return {
        img: 'http://192.168.1.54:8081/upload/admin', //更改图片的地址
        form: { //获取商铺广告列表所需信息
          adType: '',
          pageNo: 1,
          limit: 10,
          status: ''
        },
        status: [{
            value: 0,
            name: "冻结"
          },
          {
            value: 1,
            name: "激活"
          },
          {
            value: "",
            name: "全部"
          }
        ],
        adType: [{
            value: 1,
            unionType: 3,
            name: "轮播"
          },
          {
            value: 2,
            unionType: 1,
            name: "分类精选"
          },
          {
            value: 3,
            unionType: 3,
            name: "横幅"
          },
          {
            value: 4,
            unionType: 1,
            name: "首页轮播下5按钮"
          },
          {
            value: "",
            name: "全部"
          }
        ],
        tableData: { // 返回的数据
          items: [],
          total: 0
        },
        relationTwo: [{
          value: "/pages/groupshop/list",
          label: "团购列表"
        }],
        relationOne: [],
        show: false, //编辑添加的弹出框
        title: '创建', //编辑添加的标题
        addForm: {
          title: '', //标题
          status: '', //状态
          adType: '', //类型
          imgUrl: '', //广告图片地址
          url: '', //广告地址
          color: 'rgb(122, 194, 182)' //广告图片颜色
        },
        url: {
          one: '',
          two: ''
        }
      }
    },
    mounted() {
      this.load()
    },
    methods: {
      load() {
        const that = this
        queryAdvertisement(this.form).then(function(reds) { //广告列表
          that.tableData = reds.data.data
        })
        addList().then(function(reds) { //添加广告所需列表
          that.relationOne = that.clearChildren(reds.data.data)
        })
      },
      AdType(type) {
        switch (type) {
          case 1:
            type = '轮播'
            break;
          case 2:
            type = '分类精选'
            break;
          case 3:
            type = '横幅'
            break;
          case 4:
            type = '首页轮播下5按钮'
            break;
          default:
            type = '全部'
            break;
        }
        return type
      },
      Status(status) {
        switch (status) {
          case 0:
            status = '冻结'
            break;
          case 1:
            status = '激活'
            break;
          default:
            status = '全部'
            break;
        }
        return status
      },
      handleSizeChange(e) { // 点击控制页数
        this.form.limit = e
        this.load()
      },
      handleCurrentChange(e) { // 输入框控制页数
        this.form.pageNo = e
        this.load()
      },
      adD() { //点击添加
        this.show = true
        this.title = '创建'
        this.addForm = {
          title: '', //标题
          status: '', //状态
          adType: '', //类型
          imgUrl: '', //广告图片地址
          url: '', //广告地址
          color: 'rgb(122, 194, 182)' //广告图片颜色
        }
      },
      updata(e) { //点击编辑
        this.show = true
        this.title = '编辑'
        this.addForm = {
          adId: e.id,
          title: e.title,
          status: e.status,
          adType: e.adType,
          imgUrl: e.imgUrl,
          url: e.url,
          color: e.color
        }
        if (this.addForm.url.indexOf("tid") >= 0) {
          this.url.one = "C_" + this.addForm.url.replace(/[^0-9]/gi, "");
        } else {
          this.url.one = "G_" + this.addForm.url.replace(/[^0-9]/gi, "");
        }
      },
      onBeforeUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isJPG && isLt2M;
      },
      uploadSuccessHandle(e) { //上传图片
        this.addForm.imgUrl = e.url;
      },
      clearChildren(data) { // 删除为空的子元素
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
      handleLink1(e) { //关联1
        if (e === undefined || e === null) {
          return;
        }
        this.url.two = undefined; //把关联2设为空
        const tag = e[e.length - 1];
        let url = "";
        if (tag.startsWith("C")) { //字符串以c开头
          if (e.length < 3) {
            this.mess ? this.mess.close() : ''
            this.mess = this.$message.error("请关联第三级类目或者商品");
            return;
          }
          url = "/pages/product/list?tid=" + e[2].substring(2);
        } else {
          url = "/pages/product/detail?id=" + e[3].substring(2);
        }
        this.addForm.url = url
      },
      handleLink2(e) { //关联2
        this.url.one = undefined //把关联1设置为空
        this.addForm.url = e
      },
      add() {
        const that = this
        this.mess ? this.mess.close() : ''
        if (this.addForm.title.trim() !== '') {
          if (this.addForm.status !== '') {
            if (this.addForm.adType !== '') {
              if (this.addForm.imgUrl.trim() !== '') {
                if (this.addForm.url.trim() !== '') {
                  if (this.addForm.color.trim() !== '') {
                    if (this.title == '创建') {
                      this.AddRecommend()
                    } else {
                      this.UpdateAdvertisement()
                    }
                  } else {
                    this.mess ? this.mess.close() : ''
                    this.mess = this.$message({
                      showClose: true,
                      message: '广告图片颜色',
                      type: 'error'
                    })
                  }
                } else {
                  this.mess ? this.mess.close() : ''
                  this.mess = this.$message({
                    showClose: true,
                    message: '广告地址',
                    type: 'error'
                  })
                }
              } else {
                this.mess ? this.mess.close() : ''
                this.mess = this.$message({
                  showClose: true,
                  message: '广告图片地址',
                  type: 'error'
                })
              }
            } else {
              this.mess ? this.mess.close() : ''
              this.mess = this.$message({
                showClose: true,
                message: '类型',
                type: 'error'
              })
            }
          } else {
            this.mess ? this.mess.close() : ''
            this.mess = this.$message({
              showClose: true,
              message: '状态',
              type: 'error'
            })
          }
        } else {
          this.mess ? this.mess.close() : ''
          this.mess = this.$message({
            showClose: true,
            message: '标题',
            type: 'error'
          })
        }
      },
      AddRecommend() { //添加广告
        const that = this
        addRecommend(that.addForm).then(function(reds) {
          if (reds.data.errmsg == '成功') {
            that.show = false

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
          }
        })
      },
      UpdateAdvertisement() { //修改广告信息
        const that = this
        updateAdvertisement(that.addForm).then(function(reds) {
          if (reds.data.errmsg == '成功') {
            that.show = false

            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
              showClose: true,
              message: '编辑成功',
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
      Delete(row) {//删除广告
        const that = this
        this.$confirm('此操作将永久删除该广告---' + row.title + '---, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAdvertisement(row.id, row.adType).then(function(reds) {
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
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

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
