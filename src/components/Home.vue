<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- logo -->
        <img src="../assets/logo.png" alt="" style="height: 60px;margin-left: 140px;">
        <!-- 顶部标题 -->
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout"> 退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
<!--      <el-aside width="200px">-->
<!--        &lt;!&ndash; 侧边栏菜单 &ndash;&gt;-->
<!--        <el-menu-->
<!--          background-color="#333744"-->
<!--          text-color="#fff"-->
<!--          active-text-color="#ffd04b" router :default-active="activePath">-->
<!--          &lt;!&ndash; 一级菜单 &ndash;&gt;-->
<!--&lt;!&ndash;          12*.是通过循环渲染上去的&ndash;&gt;-->
<!--          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">-->
<!--            &lt;!&ndash; 一级菜单模板 &ndash;&gt;-->
<!--            <template slot="title">-->
<!--              &lt;!&ndash; 图标 &ndash;&gt;-->
<!--              <i :class="iconsObj[item.id]"></i>-->
<!--              &lt;!&ndash; 文本 &ndash;&gt;-->
<!--              <span>{{item.authName}}</span>-->
<!--            </template>-->
<!--            &lt;!&ndash; 二级子菜单 &ndash;&gt;-->
<!--            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"-->
<!--                          @click="saveNavState('/'+subItem.path)">-->
<!--              &lt;!&ndash; 二级菜单模板 &ndash;&gt;-->
<!--              <template slot="title">-->
<!--                &lt;!&ndash; 图标 &ndash;&gt;-->
<!--                <i class="el-icon-menu"></i>-->
<!--                &lt;!&ndash; 文本 &ndash;&gt;-->
<!--                <span>{{subItem.authName}}</span>-->
<!--              </template>-->
<!--            </el-menu-item>-->
<!--          </el-submenu>-->
<!--        </el-menu>-->
<!--      </el-aside>-->
      <!-- 主体结构 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: null,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    // 在created阶段请求左侧菜单数据
    console.log("token: "+window.sessionStorage.getItem("user_token"))
  },
  methods: {
    saveNavState (path) {
      //  点击二级菜单的时候保存被点击的二级菜单信息
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
    logout () {


      // 移除session数据
      window.sessionStorage.clear()
      // 10*.强行跳转登录页面
      this.$router.push('/login')
    }
  }
}

</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
