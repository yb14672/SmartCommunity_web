<template>
  <div class="login_container">
    <!-- 登录盒子  -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单 -->
      <el-form :model="loginForm" ref="LoginFormRef" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
<!--          6*.v-model双向数据绑定，绑定需要用的数据-->
          <el-input v-model.trim="loginForm.username" prefix-icon="iconfont icon-user" ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model.trim="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  // *4data数据源
  data () {
    return {
      // 数据绑定
      loginForm: {
        // 5*声明数据
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '登录名长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
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
  // 添加行为，
  methods: {
    // 添加表单重置方法
    resetLoginForm () {
      // this=>当前组件对象，其中的属性$refs包含了设置的表单ref
        console.log(this)
      this.$refs.LoginFormRef.resetFields()
    },
    // 7*登录的方法
    login () {
      // 点击登录的时候先调用validate方法验证表单内容是否有误
      this.$refs.LoginFormRef.validate(async valid => {
        console.log(this.loginFormRules)
        // 如果valid参数为true则验证通过
        if (!valid) {
          return
        }

        // 发送请求进行登录
        // const { data: res } = await this.$http.get('sysUser', this.loginForm)
        //     console.log(res);
        // if (res.meta.status !== 200) {
        //   return this.$message.error('登录失败:' + res.meta.msg) // console.log("登录失败:"+res.meta.msg)
        // }
        // this.$message.success('登录成功')
        // console.log(res)
        // // // 保存token
        // window.sessionStorage.setItem('token', res.data.token)
        // 导航至/home
        // 8*.编程式导航的api home是后台主页的页面，还要声明路由
        this.$router.push('/Person')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b5b6b;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
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
</style>
