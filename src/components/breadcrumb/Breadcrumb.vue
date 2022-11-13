<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="bread" :to="'/welcome'" @click="toHome()">首页</el-breadcrumb-item>
      <el-breadcrumb-item class="bread">{{ name1 }}</el-breadcrumb-item>
      <el-breadcrumb-item class="bread">{{ name2 }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    name1: String,
    name2: String
  },
  methods:{
    toHome(){
      window.sessionStorage.setItem('path', "/welcome");
      this.$router.push("/welcome");
    }
  }
}
</script>

<style scoped>
.bread{
  color: #97a8be;
  cursor: text;
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
}
</style>