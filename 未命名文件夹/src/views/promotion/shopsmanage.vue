<template>
  <div>
    <el-card class="box-card" style="width: 90%;margin: auto;">
      <h3>商铺信息</h3>
      <el-form ref="Form" :model="Form" label-width="150px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="Form.title" />
        </el-form-item>

        <el-form-item label="商铺logo" prop="logoUrl">
          <el-image :src="Form.logoUrl">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
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
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="updata">保存更改</el-button>
    </div>
  </div>
</template>

<script>
  import {
    form,
    Updata
  } from '../../api/promotion/shopsmanage.js'
  export default {
    data() {
      return {
        Form: {
          title: undefined,
          logoUrl: undefined,
          description: undefined,
          address: undefined,
          showType: 1
        }
      }
    },
    mounted() {
      this.load()
    },
    methods: {
      load() {
        const that = this
        form().then(function(reds) {
          that.Form = reds.data.data
        })
      },
      updata() {
        const that = this
        if (this.Form.title.trim() !== '') {
          if (this.Form.logoUrl.trim() !== '') {
            if (this.Form.description.trim() !== '') {
              if (this.Form.address.trim() !== '') {
                Updata(that.Form).then(function(reds) {
                  if (reds.data.errmsg === '成功') {
                    that.$message({
                      showClose: true,
                      message: '更改成功',
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
              } else {
                that.$message({
                  showClose: true,
                  message: '地址',
                  type: 'error'
                })
              }
            } else {
              that.$message({
                showClose: true,
                message: '描述',
                type: 'error'
              })
            }
          } else {
            that.$message({
              showClose: true,
              message: '商铺logo',
              type: 'error'
            })
          }
        } else {
          that.$message({
            showClose: true,
            message: '标题',
            type: 'error'
          })
        }
      }
    }
  }
</script>

<style>
</style>
