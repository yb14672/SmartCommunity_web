<template>
  <el-container>
    <el-header  style="background-color: white">
      <div>
        <!-- logo -->
        <img src="../assets/logo.gif" alt="" style="height: 60px;margin-left: 20px;">
        <!-- 顶部标题 -->
        <span style="color: dodgerblue">智慧社区</span>
      </div>
      <el-menu
          unique-opened
          class='el-menu-demo'
          mode='horizontal'
          background-color='white'
          active-text-color='#373D41'>
        <el-submenu index='2'>
          <template slot='title'>
            <el-avatar :src='avatar'></el-avatar>
          </template>
          <el-menu-item type='info' @click='person' align='center'>个人中心</el-menu-item>
          <el-menu-item type='info' @click='logout' align='center'>退出</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- 页面导航-->
        <!-- el-menu：菜单栏的根组件 router: 设置路由可以跳转 -->
        <el-menu
            style="height: 100vh"
            background-color="white"
            active-text-color="dodgerblue"
            unique-opened
            router class="el-menu-vertical-demo"
            :default-active="activePath"
        >
          <!-- submenu：菜单栏中的一项 index: 它的标识（唯一）-->
          <el-menu-item index="/welcome">
            <template>
              <i class="el-icon-loading"></i>
              <span>首页</span>
            </template>
          </el-menu-item>
          <el-submenu
              v-for="(item, index) in menuList"
              :key="index"
              :index="item.path"
              :disabled="item.status == 1"
          >
            <!-- 这一项的图标&文字信息 -->
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.menuName }}</span>
            </template>
            <!-- 判断是否最后一级子元素 -->
            <template v-for="(item1, index1) in item.children">
              <!-- 如果不是最后一级 -->
              <template v-if="item1.children.length !== 0">
                <el-submenu :key="index1" :disabled="item1.status == 1" :index="'/'+item.path+'/'+item1.path">
                  <template slot="title">
                    <i :class="item1.icon"></i>
                    <span>{{ item1.menuName }}</span>
                  </template>
                  <el-menu-item
                      v-for="(item2, index2) in item1.children"
                      :key="index2"
                      :disabled="item2.status == 1"
                      :index="'/'+item.path+'/'+item1.path+'/' + item2.path"
                  >
                    <i :class="item2.icon"></i>
                    <span>{{ item2.menuName }}</span>
                  </el-menu-item>
                </el-submenu>
              </template>
              <!-- // -->
              <!-- 如果是最后一级 -->
              <template v-else>
                <el-menu-item :key="index1" :index="'/'+item.path+'/' + item1.path"
                              :disabled="item1.status == 1"
                              @click="savePath('/'+item.path+'/' + item1.path)">
                  <i :class="item1.icon"></i>
                  <span>{{ item1.menuName }}</span>
                </el-menu-item>
              </template>
              <!-- // -->
            </template>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面主题部分-->
      <el-main style="background-color: #ffffff">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data() {
    return {
      activePath: '',
      avatar: '',
      menuList: ''
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('path');
    // this.$router.push(this.activePath)
    this.getMenuList();
    this.getAvatarById();
  },
  methods: {
    savePath(path) {
      //点击最后一级菜单的时候保存url到sessionStorage中
      window.sessionStorage.setItem('path', path);
      this.activePath = path;
    },
    person() {
      this.$router.push('/user/profile')
    },
    async logout() {
      const {data: res} = await this.$http.post("/sysUser/logout");
      if (res.meta.errorCode !== 2017) {
        return this.$message.error(res.meta.errorMsg);
      }
      window.sessionStorage.clear();
      await this.$router.push("/Login")
    },
    async getMenuList() {
      // 发送请求获取左侧菜单数据
      const {data: res} = await this.$http.get('sysMenu/getMenus')
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    async getAvatarById() {
      // 发送请求获取头像
      const {data: res} = await this.$http.get('sysUser/getAvatarById')
      if (res.meta.errorCode === 2012) return this.$message(res.meta.errorMsg)
      if (res.meta.errorCode !== 200) return this.$message.error(res.meta.errorMsg)
      this.avatar = res.data;
    },
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
  background-color: #fff;
}
  .el-menu {
    border-right: none;
  }


.el-main {
  background-color: #eaedf1;
  overflow: scroll;
  height: 100vh;
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
a {
  color: #337ab7;
  text-decoration: none;
}

a:hover {
  color: #1890ff;
}

a:active {
  color: #1720b7;
}
</style>
