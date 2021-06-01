<template>
  <div>
    <el-button v-for="(item,index) in arr" :key="index" style="padding: 5px 10px;margin: 5px 10px;"
      @click="Buttom(index)" @contextmenu.prevent.native="openMenu($event,index)">{{item.titl}}<i
        class="el-icon-close" @click="Dele(index)"></i></el-button>
  </div>
</template>

<script>
export default {
  props: ['arr'],
  methods: {
    Buttom (e) {
      this.$emit('buttom', e)
    },
    openMenu (e) {
      this.$emit('openmenu', e)
    },
    Dele (e) {
      this.$emit('dele', e)
    }
  }
}
</script>

<style>
</style>
