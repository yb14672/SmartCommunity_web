<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="6" :ld="24">
        <el-card class="box-card" style="width: 27em;height: 40em">
          <div style="margin-left: 10px">
            <!--左侧个人信息-->
            <div slot="header" class="clearfix">
              <span>个人信息</span>
              <div class="cropper-wrapper">
                <!-- element 上传图片按钮 -->
                <template v-if="!ruleForm.sysUser.avatar">
                  <el-upload class="el-upload-dragger"
                             drag
                             :auto-upload="false"
                             :show-file-list="false"
                             :on-change='handleChangeUpload'>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">点击上传</div>
                  </el-upload>
                </template>
                <div class="pre-box" v-else>
                  <el-upload class="el-upload-dragger"
                             drag
                             :auto-upload="false"
                             :show-file-list="false"
                             :on-change='handleChangeUpload'>
                    <img v-if="ruleForm.sysUser.avatar" :src="ruleForm.sysUser.avatar" style="width: 178px;height: 178px" alt="裁剪图片">
                  </el-upload>
                </div>
                <!-- vueCropper 剪裁图片实现-->
                <el-dialog title="图片剪裁" :visible.sync="dialogVisible" class="crop-dialog" append-to-body>
                  <div class="cropper-content">
                    <div class="cropper" style="text-align:center">
                      <vueCropper
                              ref="cropper"
                              :img="option.img"
                              :outputSize="option.size"
                              :outputType="option.outputType"
                              :info="true"
                              :full="option.full"
                              :canMove="option.canMove"
                              :canMoveBox="option.canMoveBox"
                              :original="option.original"
                              :autoCrop="option.autoCrop"
                              :fixed="option.fixed"
                              :fixedNumber="option.fixedNumber"
                              :centerBox="option.centerBox"
                              :infoTrue="option.infoTrue"
                              :fixedBox="option.fixedBox"
                              :autoCropWidth="option.autoCropWidth"
                              :autoCropHeight="option.autoCropHeight"
                              @cropMoving="cropMoving"
                      />
                    </div>
                  </div>
                  <div class="action-box">
                    <el-upload class="upload-demo"
                               :auto-upload="false"
                               :show-file-list="false"
                               :on-change='handleChangeUpload'>
                      <el-button type="primary" id="changePic">更换图片</el-button>
                    </el-upload>
                    <el-button type="primary" @click="changeScaleHandle(1)"><i class="el-icon-zoom-in"/></el-button>
                    <el-button type="primary" @click="changeScaleHandle(-1)"><i class="el-icon-zoom-out"/></el-button>
                    <el-button type="primary" @click="rotateLeftHandle"><i class="el-icon-refresh-left"/></el-button>
                    <el-button type="primary" @click="rotateRightHandle"><i class="el-icon-refresh-right"/></el-button>
                    <el-button type="primary" @click="finish" :loading="loading">提交</el-button>
                    <el-button type="primary" plain @click="dialogVisible = false">取 消</el-button>
                  </div>
                </el-dialog>
              </div>
            </div>
            <!--右侧修改信息-->
            <div class="text item">
              <ul>
                <li v-for="(item,index) in userInfo" :class="item.icon" class="li-item" :key="index">
                  {{ item.name }}: {{ item.value }}
                </li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14" push="3" :ld="24">
        <el-card class="box-card" style="width: 45em;height: 40em">
          <!--    卡片-->
          <div slot="header" class="clearfix">
            基本资料
          </div>
          <!--    选项卡-->
          <el-tabs type="border-card" style="height: 60vh">
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
                  <el-input v-model="pwdForm.oldPassword" show-password type="password" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="pwdForm.newPassword" show-password type="password" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="pwdForm.confirmPassword" show-password type="password" placeholder="请确认密码"></el-input>
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
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        phonenumber: [
          {required: true, message: "手机号码不能为空", trigger: "blur"},
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        email: [
          {required: true, message: "邮箱地址不能为空", trigger: "blur"},
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
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
      ],
      isPreview: false,
      dialogVisible: false,
      previewImg: '', // 预览图片地址
      fileName: '', // 预览图片地址
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        canMoveBox: true, // 截图框能否拖动
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      // 防止重复提交
      loading: false
    };
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    //提交更新用户信息表单
    submitUpdateForm() {
      this.$refs.updateForm.validate(async (valid) => {
        if (valid) {
          //更新对应的信息
          const {data: res} = await this.$http.put("sysUser/updateUser", this.updateForm)
          //检查是否成功
          if (res.meta.errorCode !== 200) {
            return this.$message.error(res.meta.errorMsg)
          }
          await this.getUserInfo();
          this.$message.success('修改用户信息成功');
        }
      });
    },
    //
    submitResetForm(){
      this.$refs.pwdForm.validate(async (valid) => {
        if (valid) {
          //更新对应的信息
          const {data: res} = await this.$http.put("sysUser/resetPwd", {
            'userId':this.pwdForm.userId,
            'password':this.pwdForm.newPassword
          })
          //检查是否成功
          if (res.meta.errorCode !== 200) {
            return this.$message.error(res.meta.errorMsg)
          }
          await this.getUserInfo();
          this.$message.success('修改密码成功。请重新登录');
          window.sessionStorage.clear();
          return this.$router.push("/login");
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async getUserInfo() {
      const {data: res} = await this.$http.get("sysUser/personal")
      if (res) {
        this.ruleForm.sysUser = res.data.sysUser
        this.ruleForm.sysDept = res.data.sysDept
        this.ruleForm.sysPost = res.data.sysPost
        this.ruleForm.sysRole = res.data.sysRole
        this.updateForm = res.data.sysUser
        this.pwdForm.userId = res.data.sysUser.userId
        this.userInfo.forEach(item => {
          item.value = res.data.sysUser[item.label]
        })
        this.userInfo[3].value = res.data.sysDept.deptName + "/" + res.data.sysPost.postName;
        this.userInfo[4].value = res.data.sysRole.roleName;
      }
    },
    // 上传按钮 限制图片大小和类型
    handleChangeUpload(file) {
      const isJPG = file.raw.type.indexOf("image/") > -1;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('头像只能上传图片!');
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        return false
      }
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(async () => {
        // base64方式
        // this.option.img = await fileByBase64(file.raw)
        this.option.img = URL.createObjectURL(file.raw)
        this.loading = false
        this.dialogVisible = true
        this.fileName=file.name;

      })
    },
    // 放大/缩小
    changeScaleHandle(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 左旋转
    rotateLeftHandle() {
      this.$refs.cropper.rotateLeft();
    },
    // 右旋转
    rotateRightHandle() {
      this.$refs.cropper.rotateRight();
    },
    // 截图框移动回调函数
    cropMoving(data) {
      // 截图框的左上角 x，y和右下角坐标x，y
      let cropAxis = [data.axis.x1, data.axis.y1, data.axis.x2, data.axis.y2]
    },
    finish() {
      this.$refs.cropper.getCropBlob(async (data) => {
        //将裁剪后的图片上传至服务器
        let formData = new FormData()
        let fileOfBlob = new File([data], this.fileName)
        formData.append('file', fileOfBlob)
        const {data: res} = await this.$http.post("/upload", formData)
        //防止网络波动，暂时等待
        this.loading = false
        //重新设置头像
        this.option.img = res.data
        this.ruleForm.sysUser.avatar=res.data;
        //更新数据库
        const {data: res1} = await this.$http.put("sysUser/updateUser", {
          'userId': this.pwdForm.userId,
          'avatar': this.ruleForm.sysUser.avatar
        })
        //检查是否成功
        if (res1.meta.errorCode !== 200) {
          return this.$message.error(res1.meta.errorMsg)
        }
        this.$message.success('修改成功')
        this.dialogVisible = false
        this.isPreview = true
        location.reload();
      })
    }
  }
}

</script>
<style scoped>
  #changePic{
    margin-right: 73px;
  }
  .cropper-wrapper{
    width: 178px;
    height: 178px;
  }
  .cropper-content .cropper {
    width: auto;
    height: 350px;
  }

  .el-upload-dragger {
    width: 178px;
    height: 178px;
    border-radius: 100%;
    margin-left: 5em;
  }
  /deep/ .el-upload{
    width: 178px;
    height: 178px;
  }
  /deep/ .el-upload .el-upload-dragger{
    width: 178px;
    height: 178px;
  }
  .upload-demo{
    display: inline-block;
    width: 100px;
    height: 40px;
    margin-right: 10px;
  }

  .action-box{
    margin-top: 2em;
    margin-left: 5em;
  }
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
  overflow: auto;
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
  border-radius: 50%;
}

li {
  list-style: none;
}

.li-item {
  display: block !important;
  padding: 10px;
}
</style>
