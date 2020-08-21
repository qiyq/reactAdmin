<template>
  <el-container class="container">
    <Menu></Menu>
    <el-main class="main">
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
  import Menu from '@/components/menu.vue';

  export default {
    name: 'pageWrap',
    components: {
      Menu,
    },
  };
</script>

<style scoped lang="less">
  .container {
    height: calc(~'100vh - 60px');
  }

  .main {
    width: calc(~"100% - 256px");
    height: 100%;
    overflow: hidden;
  }
</style>
