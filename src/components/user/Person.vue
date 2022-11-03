<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
            <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload" style="margin: 30px 0px 0px 62px;">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="text item">
            <ul>
              <li v-for="(item,index) in userInfo" :class="item.icon" class="li-item" :key="index">
                {{ item.name }}: {{ item.value }}
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card class="box-card" style="margin-left: 171px;">
          <!--    卡片-->
          <div slot="header" class="clearfix">
            基本资料
          </div>
          <!--    选项卡-->
          <el-tabs type="border-card">
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date"></i> 基本资料</span>
              <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="100px"
                       class="demo-ruleForm">
                <el-form-item label="用户昵称" prop="nickName">
                  <el-input v-model="updateForm.nickName" placeholder="请输入用户昵称"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phonenumber">
                  <el-input v-model="updateForm.phonenumber" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="updateForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="updateForm.sex">
                    <el-radio label="1">男</el-radio>
                    <el-radio label="0">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitUpdateForm()">保存</el-button>
                  <el-button @click="resetForm('updateForm')">清空</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date"></i> 修改密码</span>
              <el-form :model="pwdForm" :rules="rules" ref="pwdForm" label-width="100px"
                       class="demo-ruleForm">
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input v-model="pwdForm.oldPassword" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="pwdForm.newPassword" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="pwdForm.confirmPassword" placeholder="请确认密码"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitResetForm()">保存</el-button>
                  <el-button @click="resetForm('pwdForm')">清空</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>

</template>
<script>
export default {
  data() {
    //判断新密码和确认密码是否一致
    const equalToPassword = (rule, value, callback) => {
      if (this.pwdForm.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    //判断新旧密码是否一致
    const equalToOldPassword = (rule, value, callback) => {
      if (this.pwdForm.oldPassword === value) {
        callback(new Error("新旧密码不能一致"));
      } else {
        callback();
      }
    };
    return {
      imageUrl: '',
      ruleForm: {
        sysUser: '',
        sysDept: '',
        sysPost: '',
        sysRole: '',
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      updateForm: {
        // userId:'',
        // phonenumber:'',
        // email:'',
        // sex:'',
      },
      pwdForm: {
        userId: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      rules: {
        nickName: [
          {required: true, message: '请输入用户昵称', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        phonenumber: [
          {required: true, message: '请输入手机号码', trigger: 'change'}
        ],
        email: [
          {required: true, message: '请输入正确的邮箱', trigger: 'change'}
        ],
        oldPassword: [
          {required: true, message: "旧密码不能为空", trigger: "blur"}
        ],
        newPassword: [
          {required: true, message: "新密码不能为空", trigger: "blur"},
          {min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur"},
          {required: true, validator: equalToOldPassword, trigger: "blur"}
        ],
        confirmPassword: [
          {required: true, message: "确认密码不能为空", trigger: "blur"},
          {required: true, validator: equalToPassword, trigger: "blur"}
        ]
      },
      userInfo: [
        {
          icon: 'el-icon-user-solid',
          name: "用户名称",
          label: "userName",
          value: ""
        },
        {
          icon: "el-icon-phone-outline",
          name: "手机号码",
          label: "phonenumber",
          value: ""
        },
        {
          icon: "el-icon-message",
          name: "用户邮箱",
          label: "email",
          value: ""
        },
        {
          icon: "el-icon-set-up",
          name: "所属部门",
          label: "postName",
          value: ""
        },
        {
          icon: "el-icon-s-custom",
          name: "所属角色",
          label: "roleName",
          value: ""
        },
        {
          icon: "el-icon-date",
          name: "创建日期",
          label: "createTime",
          value: ""
        }
      ]
    };
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    submitUpdateForm() {
      this.$refs.updateForm.validate(async (valid) => {
        if (valid) {
          //更新对应的信息
          const {data: res} = await this.$http.put("sysUser/updateUser", this.updateForm)
          console.log(res);
          //检查是否成功
          if (res.meta.errorCode !== 200) {
            return this.$message.error(res.meta.errorMsg)
          }
          await this.getUserInfo();
          this.$message.success('修改用户信息成功');
        }
      });
    },
    submitResetForm(){
      this.$refs.pwdForm.validate(async (valid) => {
        if (valid) {
          //更新对应的信息
          const {data: res} = await this.$http.put("sysUser/resetPwd", {
            'userId':this.pwdForm.userId,
            'password':this.pwdForm.newPassword
          })
          console.log(res);
          //检查是否成功
          if (res.meta.errorCode !== 200) {
            return this.$message.error(res.meta.errorMsg)
          }
          await this.getUserInfo();
          this.$message.success('修改密码成功');
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    async getUserInfo() {
      const {data: res} = await this.$http.get("sysUser/personal", {
        params: {
          userId: '1'
        }
      })
      console.log(res);
      if (res) {
        this.ruleForm.sysUser = res.data.sysUser
        this.ruleForm.sysDept = res.data.sysDept
        this.ruleForm.sysPost = res.data.sysPost
        this.ruleForm.sysRole = res.data.sysRole
        this.updateForm = res.data.sysUser
        this.pwdForm.userId = res.data.sysUser.userId
        this.pwdForm.oldPassword = res.data.sysUser.password
        this.userInfo.forEach(item => {
          item.value = res.data.sysUser[item.label]
        })
        this.userInfo[3].value = res.data.sysDept.deptName + "/" + res.data.sysPost.postName;
        this.userInfo[4].value = res.data.sysRole.roleName;
      }
      // console.log(this.userInfo)
    },
  }
}

</script>
<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

li {
  list-style: none;
}

.li-item {
  display: block !important;
  padding: 10px;
}
</style>