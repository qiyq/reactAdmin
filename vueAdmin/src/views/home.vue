<template>
  <el-container class="home">
    <Menu></Menu>
    <div class="content">
      <HeaderCom></HeaderCom>
      <el-main class="main">
        <router-view/>
      </el-main>
    </div>

  </el-container>
</template>

<script>
  // @ is an alias to /src
  import HeaderCom from '@/components/header.vue';
  import Menu from '@/components/menu.vue';

  export default {
    name: 'home',
    components: {
      HeaderCom,
      Menu
    }
  };
</script>
<style scoped lang="less">
  .home {
    height: 100%;
    width: 100%;
    display: flex;
    background-color: #f6f6f6;

    .content {
      width: calc(~'100% - 256px');

      .main {
        height: calc(~'100% - 60px');
      }
    }


  }
</style>
