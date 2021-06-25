<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  .el-submenu__title:hover {
    background-color: #000000 !important;
  }

  .el-menu {
    background-color: #314156 !important;
  }

  .el-form-item__error {
    /* position: inherit !important; */
  }
  .el-button{
    border: 0 !important;
  }
</style>
