<template>
  <div>
    <el-card class="box-card" style="width: 90%;margin: auto;">
      <h3>商铺信息</h3>
      <el-form ref="Form" :model="Form" label-width="150px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="Form.title" />
        </el-form-item>

        <el-form-item label="商铺logo" prop="logoUrl">
          <el-upload :action="img" :show-file-list="false" :on-success="uploadSuccessHandle"
            :before-upload="onBeforeUpload" class="avatar-uploader" accept=".jpg, .jpeg, .png, .gif"
            style="width: 20%;">
            <img v-if="Form.logoUrl" :src="Form.logoUrl" class="avatar" style="width: 100%;float: left;" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="Form.description" />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="Form.address" />
        </el-form-item>
      </el-form>
    </el-card>
    <div style="width: 90%;margin: auto;">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="updata" v-permission="'promote:merchant:create'">保存更改</el-button>
    </div>
  </div>
</template>

<script>
import {
  form,
  Updata,
  UpdataImg
} from '../../api/promotion/shopsmanage.js'
export default {
  data () {
    return {
      Form: { // 获取更改商铺信息
        title: undefined, // 标题
        logoUrl: undefined, // 商铺logo
        description: undefined, // 描述
        address: undefined, // 地址
        showType: 1
      },
      img: 'http://192.168.1.54:8081/upload/admin' // 更改图片的地址
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () { // 获取商铺信息
      const that = this
      form().then(function (reds) {
        that.Form = reds.data.data
      })
    },
    updata () { // 更改商铺信息
      const that = this
      if (this.Form.title.trim() !== '') {
        if (this.Form.logoUrl.trim() !== '') {
          if (this.Form.description.trim() !== '') {
            if (this.Form.address.trim() !== '') {
              Updata(that.Form).then(function (reds) {
                if (reds.data.errmsg === '成功') {
                  that.mess ? that.mess.close() : ''
                  that.mess = that.$message({
                    showClose: true,
                    message: '更改成功',
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
                .catch(() => {
                  this.mess ? this.mess.close() : ''
                  this.mess = this.$message.error('更改失败')
                })
            } else {
              this.mess ? this.mess.close() : ''
              this.mess = this.$message({
                showClose: true,
                message: '地址',
                type: 'error'
              })
            }
          } else {
            this.mess ? this.mess.close() : ''
            this.mess = this.$message({
              showClose: true,
              message: '描述',
              type: 'error'
            })
          }
        } else {
          this.mess ? this.mess.close() : ''
          this.mess = this.$message({
            showClose: true,
            message: '商铺logo',
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
      this.Form.logoUrl = e.url
    }
  }
}
</script>

<style>
</style>
