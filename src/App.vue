<template>
  <div id="app">
    <!--        *3.路由的占位符-->
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
  }
</script>

<style>


  #app{
    -webkit-overflow-scrolling: touch;
  }
</style>
