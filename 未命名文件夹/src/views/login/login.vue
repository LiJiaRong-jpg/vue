<template>
  <div style="width: 100%;height: 100vh;background-color: skyblue;display: flex;align-items: center;">
    <img src="../../../public/cloud.bef3ccbc.jpg" style="width: 100%;height: 100vh;position: fixed;" alt="">
    <div
      style="width: 1000px;height: 500px;background-color: salmon;margin: auto;position: relative;z-index: 1;box-shadow: -4px 5px 10px rgb(0 0 0 / 40%);border-radius: 10px;">
      <div
        style="width: 50%;height: 100%;background-color: #3A9EFC;float: left;padding: 10pxbox-sizing: border-box;display: flex;">
        <div style="color: white;position: absolute;">
          <i>欢迎使用</i>
        </div>
        <div style="color: white;margin: auto;display: grid;justify-content: center;white-space: nowrap;">
          <img src="../../../public/zxwy.jpg" style="display: block;margin: auto;" alt="">
          <i style="text-align: center;font-size: 25px;width: 250px;">智学无忧商城后台登录</i>
        </div>
      </div>
      <div style="width: 50%;height: 100%;background-color: white;padding-bottom: 20px;">
        <div style="text-align: center;margin-top: 50px;">
          <i>登录</i>
        </div>
        <div class="div">
          <i class="el-icon-user el-input__inne"></i>
          <el-input class="input" placeholder="请输入账号" v-model="account" @blur="ACCOUNT" clearable>
          </el-input>
        </div>
        <div class="div">
          <i class="el-icon-key el-input__inne"></i>
          <el-input placeholder="请输入密码" v-model="pass" @blur="PASS" show-password clearable class="input"></el-input>
        </div>
        <div class="div">
          <i class="el-icon-position el-input__inne"></i>
          <el-input class="input" size="mini" placeholder="请输入验证码" v-model="token" clearable>
            <template slot="append">
              <span class="msg-text">
                验证码
              </span>
            </template>
          </el-input>
        </div>
        <div @click="login" style="font-size: 18px;width: 58%;border: 1px solid rgb(64, 158, 255);color: rgb(64, 158, 255);cursor: pointer;margin: 20px 0 0 25%;padding: 10px 0px;">
          <i style="display: table;margin: auto;">登录</i>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      account: 'admin',
      pass: '123456',
      token: '666666'
    }
  },
  methods: {
    login () {
      const that = this
      this.axios.get('http://192.168.1.54:8081/m.api', {
        params: {
          _gp: 'admin',
          _mt: 'login',
          username: that.account, // 用户名
          password: that.pass, // 密码
          verifyCode: that.token // 验证码
        }
      }).then(function (data) {
        if (data.data.errmsg === '成功') {
          that.$message({
            showClose: true,
            message: '成功',
            type: 'success'
          })
          window.sessionStorage.token = data.data.data
          that.$router.push({ path: '/dashboard' }).catch(err => {
            console.log(err)
          })
        } else {
          that.$message({
            showClose: true,
            message: data.data.errmsg,
            type: 'error'
          })
        }
      })
    },
    ACCOUNT () {
      if (this.account.trim() === '') {
        this.$message({
          showClose: true,
          message: '输入内容不能为空',
          type: 'error'
        })
      }
    },
    PASS () {
      if (this.pass.trim() === '') {
        this.$message({
          showClose: true,
          message: '输入内容不能为空',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped="scoped">
  .el-input__inne {
    float: left;
    font-size: 25px;
  }

  .input {
    width: 70%;
    float: left;
  }

  .div {
    clear: both;
    margin: 20px 0 0 25%;
    display: flex;
    /* margin-top: 20px; */
  }
  .msg-text{
    cursor: pointer;
  }
</style>
