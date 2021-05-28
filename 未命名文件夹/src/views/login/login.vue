<template>
  <div style="width: 100%;height: 100vh;background-color: skyblue;display: flex;align-items: center;">
    <img src="../../../public/cloud.bef3ccbc.jpg" style="width: 100%;height: 100vh;position: fixed;" alt="">
    <div
      style="width: 1000px;height: 500px;background-color: salmon;margin: auto;position: relative;z-index: 1;box-shadow: -4px 5px 10px rgb(0 0 0 / 40%);">
      <div
        style="width: 50%;height: 100%;background-color: #3A9EFC;float: left;padding: 10pxbox-sizing: border-box;display: flex;">
        <div style="color: white;">
          <i>欢迎使用</i>
        </div>
        <div style="color: white;margin: auto;display: grid;justify-content: center;">
          <img src="../../../public/zxwy.jpg" style="display: block;margin: auto;" alt="">
          <i style="text-align: center;font-size: 25px;">智学无忧商城后台登录</i>
        </div>
      </div>
      <div style="width: 50%;height: 100%;background-color: white;padding-bottom: 20px;">
        <div style="text-align: center;margin-top: 50px;">
          <i style="font-size: 20px;">登录</i>
        </div>
        <div class="div">
          <i class="el-icon-user el-input__inne"></i>
          <el-input class="input" placeholder="请输入账号" v-model="account" clearable>
          </el-input>
        </div>
        <div class="div">
          <i class="el-icon-key el-input__inne"></i>
          <el-input placeholder="请输入密码" v-model="pass" show-password clearable class="input"></el-input>
        </div>
        <div class="div">
          <i class="el-icon-position el-input__inne"></i>
          <el-input class="input" size="mini" placeholder="请输入验证码" v-model="token" clearable>
            <template slot="append">
              <span :class="[{ display: !show }]" class="msg-text"
                @click="sendShortMsg">验证码</span>
            </template>
          </el-input>
        </div>
        <div @click="login">登录</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      account: '',
      pass: '',
      token: '666666'
    }
  },
  methods: {
    login () {
      this.$router.push({ path: '/dashboard' }).catch(err => {
        console.log(err)
      })
    }
  },
  beforeCreate () {
    alert('直接点登录')
  }
}
</script>

<style scoped="scoped">
  .el-input__inne {
    /*width: 50%;
    margin-left: 25%; */
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
  }
</style>
