<template>
  <div class="login_container">
    <vue-particles
        color="#409EFF"
        :particleOpacity="0.7"
        :particlesNumber="60"
        shapeType="circle"
        :particleSize="6"
        linesColor="#409EFF"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push">
    </vue-particles>
    <!-- 登录盒子  -->
    <div class="login_box">
      <div class="text">智 慧 社 区</div>
      <!-- 头像 -->
      <div class="avatar_box">

        <!--                <img src="../assets/logo.jpg" alt="">-->
      </div>
      <!-- 登录表单 -->
      <el-form :model="loginForm" ref="LoginFormRef" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <!--          6*.v-model双向数据绑定，绑定需要用的数据-->
          <el-input clearable v-model.trim="loginForm.username" prefix-icon="el-icon-s-custom" placeholder="输入账号"

          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
              type="password"
              prefix-icon="el-icon-lock"
              placeholder="请输入密码"
              show-password
              v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
        <Vcode :show="dialogVisible" @success="onSuccess" @close="close"/>
      </el-form>
    </div>
  </div>
</template>

<script>
import Vcode from "vue-puzzle-vcode";

export default {
  // *4data数据源
  data() {
    return {
      dialogVisible: false,
      msg: '',
      // 数据绑定
      loginForm: {
        // 5*声明数据
        username: '',
        password: ''
      },

      // 表单验证规则
      loginFormRules: {
        username: [
          {required: true, message: '请输入登录名', trigger: 'blur'},
          {
            min: 3,
            max: 10,
            message: '登录名长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    // eslint-disable-next-line no-unused-vars
    document.onkeydown = function (e) {
      let key = window.event.keyCode;
      if (key == 13) {        // do something
      }
    }
  },
  mounted() {
    // 绑定监听事件
    window.addEventListener("keydown", this.keyDown);
  },
  destroyed() {
    // 销毁事件
    window.removeEventListener("keydown", this.keyDown, false);
  },
  // 添加行为，
  methods: {
    keyDown(e) {
      // 回车则执行登录方法 enter键的ASCII是13
      if (e.keyCode == 13 || e.keyCode == 100) {
        this.login(); // 定义的登录方法
      }
    },
    login: function () {
      //进行登录{
      // 点击登录的时候先调用validate方法验证表单内容是否有误
      this.$refs.LoginFormRef.validate(async valid => {
        console.log(this.loginFormRules)
        // 如果valid参数为true则验证通过
        if (!valid) {
          return
        }
        const {data: res} = await this.$http.post('sysUser/login', {}, {
          params: {
            userName: this.loginForm.username,
            password: this.loginForm.password
          }
        })
        console.log(res)
        if (res.meta.errorCode !== 200) {
          return this.$message.error(res.meta.errorMsg)
        } else {
          // 保存token
          window.sessionStorage.setItem('token', res.data)
          this.dialogVisible = true;

        }
      })

    },
    // 添加表单重置方法
    resetLoginForm() {
      // this=>当前组件对象，其中的属性$refs包含了设置的表单ref
      //   console.log(this)
      this.$refs.LoginFormRef.resetFields()
    },
    // 7*登录的方法
    async onSuccess() {
      this.msg = '验证成功';
      this.dialogVisible = false
      // 导航至/home
      // 8*.编程式导航的api home是后台主页的页面，还要声明路由
      this.$message.success('登录成功');
      await this.$router.push('/home')
    },
    close() {
      this.dialogVisible = false;
    },
    onRefresh() {
      this.msg = ''
    },
  },
  components: {
    Vcode,
  }
}
</script>

<style lang="less" scoped>
/*动态js背面*/
#particles-js {
  width: 100%;
  height: calc(100% - 100px);
  position: absolute;
}

.login_container {
  background-image: url("../assets/bg.png");
  background-color: white;
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  .text {

    font-size: 30px;
    margin-top: 30px;
    color: white;
  }


  .avatar_box {
    background-color: unset;
    height: 130px;
    width: 130px;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .iconfont icon-user {

  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.el-dialog__wrapper {
  position: fixed;
  top: -200px;
}
</style>
