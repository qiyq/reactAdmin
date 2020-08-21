<template>
  <div class="notfound">
    <router-link tag="a"
                 :to="{name:'login'}">
      <el-button type="success" class="systemColor back" size="small">
        返回首页
      </el-button>
    </router-link>

  </div>
</template>

<script>
  export default {
    name: 'notfound',
  };
</script>

<style scoped lang="less">
  .notfound {
    height: 100%;
    background: url("../assets/imgs/404.png") no-repeat;
    background-size: cover;
    width: 100%;
    overflow: hidden;
    .back{
      margin-top: 420px;
      margin-left: 1100px;
    }
  }
</style>
