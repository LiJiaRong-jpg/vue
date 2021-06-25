<template>
  <div @click="closeMenu">
    <el-container style="height: 100vh; border: 1px solid #eee" @click="closeMenu">
      <el-aside width="auto" style="background-color: #314156;height: 100vh;z-index: 11;">
        <div v-show="isCollapse"
          style="width: 17px;height: 100vh;position: absolute;left: 63px;background-color: #314156;z-index: 9;"></div>
        -->
        <el-menu :default-active="active" class="el-menu-vertical-demo" :collapse="isCollapse" unique-opened router>
          <el-menu-item index="/dashboard" data-title="首页" data-titl="首页" @click="title">
            <i class="el-icon-s-home"></i>
            <span slot="title">{{$t('message.crumbsA')}}</span>
          </el-menu-item>
          <el-submenu v-for="(item,index) in router" :index="index+''" :key="item.title">
            <template slot="title" class="el-submenu__title"><i
                :class="item.i"></i><span>{{item.title}}</span></template>
            <el-menu-item-group style="background-color: #c;">
              <el-menu-item v-for="Item in item.children" :key="Item.titl" :index="Item.path" :data-title="Item.title"
                :data-titl="Item.titl" @click="title($event,index)">{{Item.titl}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 12px;background-color: white;border-bottom: 1px solid #dcdfe6;">
          <i class="el-icon-s-fold" style=" float: left;line-height: 60px;font-size: 20px;" @click="iconFont"></i>
          <i @click="breadcrumb" style="float: left;font-size: 15px;margin-left: 10px;padding-right: 5px;"
            :class="TITLE!=='首页'?'i':''">{{label}}</i>
          <i v-if="TITLE!=='首页'" style="float: left;font-size: 15px;padding-right: 10px;">>{{TITLE}}</i>
          <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
            <el-button @click="fullScreen" class="iconfont iconfangda"
              style="font-size: 20px;background-color: rgba(0,0,0,0);border: 0;">
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="换肤" placement="bottom" style="vertical-align: middle;">
            <el-color-picker v-model="color"></el-color-picker>
          </el-tooltip>

          <el-dropdown trigger="click" style="line-height: 15px;vertical-align: middle;" @command="handleCommand">
            <el-tooltip class="item" effect="dark" content="中英文切换" placement="bottom">
              <el-button class="iconfont iconzhongyingwenqiehuan"
                style="font-size: 20px;background-color: rgba(0,0,0,0);border: 0;">
              </el-button>
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="c">中文</el-dropdown-item>
              <el-dropdown-item command="d">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown trigger="click" style="line-height: 15px;vertical-align: middle;" @command="handleCommand">
            <span class="el-dropdown-link" style="color: black;">
              <img src="../../../public/zxwy.jpg" style="width: 30px;height: 30px;" alt="">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus" command="a">首页</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-plus" command="b">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main style="padding: 0;">
          <!-- <div ref="qwer"
          style="position: absolute;background-color: white;z-index: 10;overflow-x: clip;width: 100%;border-bottom: 1px solid #dcdfe6;height: 40px;white-space: nowrap;"
          @mousewheel.prevent="mouse">
          <el-button v-for="(item,index) in arr" :key="index" style="padding: 5px 10px;margin: 5px 10px;"
            @click="Buttom(index)" @contextmenu.prevent.native="openMenu($event,index)">{{item.titl}}<i
              class="el-icon-close" @click="Dele(index)"></i></el-button>
        </div> -->
          <div>
            <tabS :arr="arr" :Index="Index" @wheel="mouse" @buttom='Buttom($event)' @openmenu="openMenu($event)"
              @dele="Dele($event)"></tabS>
          </div>
          <router-view></router-view>
        </el-main>
      </el-container>
      <div class="muen" ref="muen"
        style="z-index:20;width: 100px;height: 130px;position: fixed;color: black;box-shadow: 2px 2px 3px 0 rgb(0 0 0 / 30%);background-color: white;"
        v-show="SHOW" @click="closeMenu">
        <i style="display: block;padding: 5px 10px;" @click="Refresh">刷新</i>
        <i style="display: block;padding: 5px 10px;" @click="Close">关</i>
        <i style="display: block;padding: 5px 10px;" @click="CloseOther">关闭其他</i>
        <i style="display: block;padding: 5px 10px;" @click="CloseAll">关闭所有</i>
      </div>
    </el-container>
  </div>
</template>

<script>
  import tabS from '../../components/tabS.vue'
  // import screenfull from 'screenfull' // 全屏

  import {
    mapState
  } from 'vuex'
  export default {
    components: {
      tabS
    },
    computed: {
      ...mapState(['lang']),
      label() {
        return this.$t('message.crumbsA')
      }
    },
    mounted() {
      this.TITLE = this.$route.name[0] // 第一次加载时显示的标签和标题
      this.arr[0].title = this.$route.name[0]
      this.arr[0].titl = this.$route.name[1]
      this.arr[0].route = this.$route.path

      this.active = this.$route.path
    },
    data() {
      return {
        qp: false,
        Index: 0,
        active: '/operate/ordermanage', // 默认展开
        isCollapse: false, // 左侧选项的收缩
        color: '#409EFF', // 换肤的颜色切换
        TITLE: '首页', // 显示当前所在页面
        arr: [{
          titl: this.$t('message.crumbsA'),
          title: this.$t('message.crumbsA'),
          route: '/dashboard'
        }], // 跳转标签
        SHOW: false, // 右键菜单的显隐
        muen: 0, // 是哪个跳转标签显示的右键菜单
        router: [{
          title: this.$t('message.navA'),
          i: 'el-icon-s-marketing',
          children: [{
            path: '/operate/ordermanage',
            title: this.$t('message.navAA'),
            titl: this.$t('message.navAa')
          }, {
            path: '/operate/commentmanage',
            title: this.$t('message.navAB'),
            titl: this.$t('message.navAb')
          }, {
            path: '/operate/freightmanage',
            title: this.$t('message.navAC'),
            titl: this.$t('message.navAc')
          }]
        }, {
          title: this.$t('message.navB'),
          i: 'el-icon-s-shop',
          children: [{
            path: '/goods/goodslist',
            title: this.$t('message.navBA'),
            titl: this.$t('message.navBa')
          }, {
            path: '/goods/goodscategory',
            title: this.$t('message.navBB'),
            titl: this.$t('message.navBb')
          }]
        }, {
          title: this.$t('message.navC'),
          i: 'el-icon-coin',
          children: [{
            path: '/promotion/shopadvert',
            title: this.$t('message.navCA'),
            titl: this.$t('message.navCa')
          }, {
            path: '/promotion/recommanage',
            title: this.$t('message.navCB'),
            titl: this.$t('message.navCb')
          }, {
            path: '/promotion/couponmanage',
            title: this.$t('message.navCC'),
            titl: this.$t('message.navCc')
          }, {
            path: '/promotion/shopsmanage',
            title: this.$t('message.navCD'),
            titl: this.$t('message.navCd')
          }]
        }, {
          title: this.$t('message.navD'),
          i: 'el-icon-setting',
          children: [{
            path: '/system/usermanage',
            title: this.$t('message.navDA'),
            titl: this.$t('message.navDa')
          }, {
            path: '/system/adminlist',
            title: this.$t('message.navDB'),
            titl: this.$t('message.navDb')
          }, {
            path: '/system/rolemanage',
            title:this.$t('message.navDC'),
            titl: this.$t('message.navDc')
          }]
        }]
      }
    },
    mounted() {
      this.color = window.sessionStorage.getItem('color')
    },
    methods: {
      iconFont(e) {
        this.isCollapse = !this.isCollapse // 控制左侧导航条的收缩
        if (this.isCollapse === true) { // 控制控制左侧导航条的收缩的图标的样式(旋转)
          let time = 0
          const seti = setInterval(function() {
            time += 10
            e.srcElement.style.transform = 'rotate(' + time + 'deg)'
            if (time === 180) {
              clearInterval(seti)
            }
          }, 10)
        } else {
          let time = 180
          const seti = setInterval(function() {
            time -= 10
            e.srcElement.style.transform = 'rotate(' + time + 'deg)'
            if (time === 0) {
              clearInterval(seti)
            }
          }, 10)
        }
      },
      title(e, index) {
        this.TITLE = e.$attrs['data-title'] // 切换路由时，右侧顶部显示的文字
        let TRUE = true // 跳转`标签的增加
        for (let i = 0; i < this.arr.length; i++) {
          if (this.arr[i].titl === e.$attrs['data-titl']) {
            TRUE = false
          }
        }
        if (TRUE === true) {
          const a = {
            titl: e.$attrs['data-titl'],
            title: e.$attrs['data-title'],
            route: e.index
          }
          this.arr.push(a)
        }
      },
      Buttom(e) { // 跳转路由
        this.active = this.arr[e].route
        console.log(this.arr[e].title)
        this.TITLE = this.arr[e].title
        this.$router.push({
          path: this.arr[e].route
        }).catch(err => {
          console.log(err)
        })
      },
      breadcrumb() { // 点击面包屑
        this.$router.push({
          path: '/dashboard'
        }).catch(err => {
          console.log(err)
        })
        this.TITLE = '首页'
      },
      Dele(e) { // 删除跳转标签
        window.event ? window.event.cancelBubble = true : e.stopPropagation() // 阻止冒泡事件
        if (this.$route.path !== this.arr[e].route) { // 如果当前路由与删除标签的路由不一样
          this.arr.splice(e, 1)
        } else {
          if (this.arr.length - 1 === e) { // 如果删除的是最后一个
            this.arr.splice(e, 1)
            this.TITLE = this.arr[e - 1].title
            this.$router.push({
              path: this.arr[e - 1].route
            }).catch(err => {
              console.log(err)
            })
          } else {
            this.arr.splice(e, 1)
            this.TITLE = this.arr[e].title
            this.$router.push({
              path: this.arr[e].route
            }).catch(err => {
              console.log(err)
            })
          }
        }
        if (this.arr.length < 1) {
          this.arr = [{
            titl: '首页',
            title: '首页',
            route: '/dashboard'
          }]
          this.$router.push({
            path: '/dashboard'
          }).catch(err => {
            console.log(err)
          })
          this.TITLE = '首页'
        }
      },
      mouse(event) {
        if (event > 0) {
          // 如果滚轮往前划则滚动条往左
          this.$refs.qwer.scrollLeft -= 10
        } else {
          // 如果滚轮往后划则滚动条往右
          this.$refs.qwer.scrollLeft += 10
        }
      },
      openMenu(w) {
        this.muen = w[1]
        this.SHOW = true
        this.$refs.muen.style.top = w[0].clientY + 'px'
        this.$refs.muen.style.left = w[0].clientX + 'px'
      },
      closeMenu() {
        this.SHOW = false
      },
      CloseOther() { // 右键菜单的关闭其他
        const a = this.arr[this.muen]
        this.arr = []
        this.arr.push(a)
      },
      CloseAll() { // 右键的关闭所有
        this.arr = [{
          titl: '首页',
          title: '首页',
          route: '/dashboard'
        }]
        this.$router.push({
          path: '/dashboard'
        }).catch(err => {
          console.log(err)
        })
        this.TITLE = '首页'
      },
      Refresh() { // 右键刷新页面
        if (this.$route.path === this.arr[this.muen].route) { // 判断刷新的页面是不是当前页面
          this.$router.push({
            path: '/back'
          }).catch(err => {
            console.log(err)
            // 在back页面的beforeCreate中写一个返回上一级页面
          })
        } else {
          // 直接跳转到该路由
          this.$router.push({
            path: this.arr[this.muen].route
          }).catch(err => {
            console.log(err)
          })
        }
      },
      Close() { // 右键关闭
        this.arr.splice(this.muen, 1) // 谁开启的右键菜单就移除谁
      },
      handleCommand(command) {
        const that = this
        if (command === 'a') {
          console.log(command)
        } else if (command == 'b') {
          window.sessionStorage.removeItem('token') // 退出登录
          if (this.$route.path !== '/login') {
            window.sessionStorage.setItem('router', this.$route.path) // 存储当前路由
          }
          this.$router.push({
            path: '/login'
          }).catch(err => {
            console.log(err)
            that.$message({
              showClose: true,
              message: '退出成功',
              type: 'success'
            })
          })
        } else if (command == 'c') { //语言为中文
          if (this.$i18n.locale == 'cn') {
            return false
          }
          let lang = ''
          lang = 'cn'
          this.$i18n.locale = lang
          this.$store.commit('switchLang', lang)
          window.history.go(0)
          this.mess ? this.mess.close() : ''
          this.mess = this.$message({
            showClose: true,
            message: '当前语言为中文',
            type: 'success'
          })
        } else if (command == 'd') { //语言为英文
          if (this.$i18n.locale == 'en') {
            return false
          }
          let lang = ''
          lang = 'en'
          this.$i18n.locale = lang
          this.$store.commit('switchLang', lang)
          window.history.go(0)
          this.mess ? this.mess.close() : ''
          this.mess = that.$message({
            showClose: true,
            message: 'The current language is English',
            type: 'success'
          })
        }
      },
      fullScreen() { // 点击全屏
        if (this.qp) {
          document.exitFullscreen() // Chrome
          this.qp = false
        } else { // 没全屏
          const element = document.documentElement
          element.requestFullscreen()
          this.qp = true
        }
      }
    },
    watch: {
      $route(to, from) {
        setTimeout(function() {
          for (var i = 2; i < document.querySelectorAll('.el-button').length; i++) {
            document.querySelectorAll('.el-button')[i].style.backgroundColor = window.sessionStorage.getItem(
              'color')
          }
          for (var j = 0; j < document.querySelectorAll('.el-tag').length; j++) {
            document.querySelectorAll('.el-tag')[j].style.backgroundColor = window.sessionStorage.getItem('color')
          }
        }, 10)
        for (var i = 0; i < this.arr.length; i++) {
          if (this.arr[i].route === to.path) {
            this.Index = i
          }
        }
      },
      color() {
        for (var i = 2; i < document.querySelectorAll('.el-button').length; i++) {
          document.querySelectorAll('.el-button')[i].style.backgroundColor = this.color
          window.sessionStorage.setItem('color', this.color)
        }
        for (var j = 0; j < document.querySelectorAll('.el-tag').length; j++) {
          document.querySelectorAll('.el-tag')[j].style.backgroundColor = this.color
        }
      }
    }
  }
</script>

<style scoped="scoped">
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    height: 100vh;
  }

  .el-menu-vertical-demo {
    background-color: #314156;
    color: white;
    overflow-y: overlay;
    overflow-x: auto;

  }

  ::-webkit-scrollbar {
    width: 0px;
  }

  .el-menu-item:hover,
  .el-menu-item:focus {
    background-color: #000000;
  }

  .el-menu-item {
    color: white;
  }

  span {
    color: white;
  }

  .muen>i:hover {
    background-color: #888;
  }

  .i:hover {
    color: #409EFF;
    cursor: pointer;
  }
</style>
