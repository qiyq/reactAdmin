<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

  export default {
    name: 'app',
  };
</script>

<style>
  @import './assets/style/style.less';
  @import './assets/font/font-awesome/css/font-awesome.min.css';
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
  }
</style>
