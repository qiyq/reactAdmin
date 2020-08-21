<template>
  <el-footer class="footer">
    <!--<p><span>&copy;Copyright 2019</span> <span class="footer-name">万泰和兴 中国星儿歌</span></p>-->
  </el-footer>
</template>

<script>
  export default {
    name: 'footerCom',
  };
</script>

<style scoped lang="less">
  .footer {
    position: relative;
    height: 40px!important;
    line-height: 40px;
    width: 100%;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 21, 41, 0.35);
    text-align: center;

    &-name {
      margin-left: 10px;
      font-weight: bold;
    }
  }
</style>
