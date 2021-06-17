<template>
  <div ref="qwer"
          style="position: absolute;background-color: white;z-index: 10;overflow-x: auto;width: 100%;border-bottom: 1px solid #dcdfe6;height: 50px;white-space: nowrap;"
          @mousewheel.prevent="mouse">
    <el-button :class="Index==index?'blue':''" v-for="(item,index) in arr" :key="item.titl" style="padding: 5px 10px;margin: 5px 10px;"
      @click="Buttom(index)" @contextmenu.prevent.native="openMenu($event,index)">{{item.titl}}<i
        class="el-icon-close" @click="Dele(index)"></i></el-button>
  </div>
</template>

<script>
export default {
  props: ['arr', 'Index'],
  methods: {
    Buttom (e) {
      this.$emit('buttom', e)
    },
    openMenu (e, index) {
      this.$emit('openmenu', [e, index])
    },
    Dele (e) {
      this.$emit('dele', e)
    },
    mouse (event) {
      // this.$emit('wheel', event.wheelDelta)
      if (event.wheelDelta > 0) {
        // 如果滚轮往前划则滚动条往左
        this.$refs.qwer.scrollLeft -= 10
      } else {
        // 如果滚轮往后划则滚动条往右
        this.$refs.qwer.scrollLeft += 10
      }
    }
  }
}
</script>

<style>
  .blue{
    background-color: #409EFF;
    color: white;
  }
</style>
