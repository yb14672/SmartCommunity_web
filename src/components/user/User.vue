<template>
  <div>
    <breadcrumb name1="asd" name2="as"></breadcrumb>
    <el-container>
      <el-card style="width: 500px">
        <el-aside>
          <el-autocomplete
              size="small"
              style="width: 80%"
              popper-class="my-autocomplete"
              v-model="state"
              :fetch-suggestions="querySearch"
              placeholder="请输入部门名称"
              @select="handleSelect"
              @blur="selectDept">
            <i
                class="el-input__icon el-icon-search"
                slot="suffix"
                @click="handleIconClick">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.deptName }}</div>
              <span style="font-size: 2px;
      color: rgba(43,43,44,0.51);">{{ item.parentName }}</span>
            </template>
          </el-autocomplete>
          <div style="padding-top: 15%">
            <el-tree e :data="deptList" :props="defaultProps" @node-click="handleNodeClick" default-expand-all
                     highlight-current
            ></el-tree>
          </div>
        </el-aside>
      </el-card>
      <el-card style="margin-left: 60px">
        <el-main>

          <el-form :model="form" ref="queryForm" :inline="true" label-width="68px" :rules="formRules">
            <el-form-item label="用户名称">
              <el-input
                  v-model="form.userName"
                  placeholder="请输入用户名称"
                  clearable
                  @clear="queryKey"
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery()"
                  @blur="getUserList"
              />
            </el-form-item>
            <el-form-item label="手机号码"
                          prop="phonenumber">
              <el-input

                  v-model="form.phonenumber"
                  placeholder="请输入手机号码"
                  clearable
                  @clear="queryKey"
                  size="small"
                  style="width: 240px"
                  @blur="getUserList"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                  v-model="form.status"
                  placeholder="用户状态"
                  clearable
                  @clear="queryKey"
                  size="small"
                  style="width: 240px"
                  @change="getUserList"
              >
                <el-option
                    style="margin-left: 15px"
                    v-for="dict in statusList"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker

                  v-model="searchTime"
                  size="small"
                  style="width: 240px"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getUserList"

              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="getUserList">搜索
              </el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="formReload()">重置</el-button>
            </el-form-item>
          </el-form>

          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                  plain
                  size="small"
                  type="primary"
                  icon="el-icon-plus"
                  @click="handleAdd"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  :disabled="multiple"
                  @click="handleDelete"
              >删除
              </el-button>
            </el-col>

            <el-col :span="1.5">
<!--              <el-upload action="#" :auto-upload="false" :multiple="false" :show-file-list="false"-->
<!--                         :on-change="uploadByJsqd" :file-list="fileList">-->
<!--                <el-button-->
<!--                    plain-->
<!--                    size="mini"-->
<!--                    type="el-button el-button&#45;&#45;info is-plain"-->
<!--                    icon="el-icon-upload2"-->
<!--                >导入-->
<!--                </el-button>-->
<!--              </el-upload>-->
            </el-col>
            <el-col :span="1.5">
              <el-button
                  plain
                  size="mini"
                  type="warning"
                  icon="el-icon-download"
                  @click="handleExport"
              >导出
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                  plain
                  size="mini"
                  type="warning"
                  icon="el-icon-download"
                  @click="downloadExport"
              >下载模板
              </el-button>
            </el-col>
          </el-row>


          <template>
            <el-table
                @selection-change="handleSelectionChange"
                :data="tableData"
                style="width: 100%">
              <el-table-column type="selection" width="50" align="center"/>
              <el-table-column label="用户编号" align="center" prop="userId"/>
              <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true"/>
              <el-table-column label="用户昵称" align="center" prop="nickName" :show-overflow-tooltip="true"/>
              <el-table-column label="部门" align="center" prop="dept.deptName"
                               :show-overflow-tooltip="true"/>
              <el-table-column label="手机号码" align="center" prop="phonenumber" width="120"/>
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <el-switch
                      v-model="scope.row.status"
                      active-value="0"
                      inactive-value="1"
                      @change="handleStatusChange(scope.row)"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center" prop="createTime"
                               width="160"></el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope" v-if="scope.row.userName != 'admin'">
                  <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-edit"
                      @click="updateForm(scope.row)"
                  >修改
                  </el-button>
                  <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="deleteUser(scope.row)"
                  >删除
                  </el-button>
                  <el-button
                      size="mini"
                      type="text"
                      @click="reLoadPwd(scope.row)">重置密码
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="form.nowPage"
                           :page-sizes="pageSizes"
                           :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
          </template>
        </el-main>
      </el-card>
    </el-container>

    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body @close="closeFrom()
">
      <el-form ref="formData" :model="formData" label-width="80px" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="formData.nickName" placeholder="请输入用户昵称"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="归属部门" prop="deptId">
              <el-select :value="valueTitle" :clearable="clearable" @clear="clearHandle">
                <el-option :value="valueTitle" :label="valueTitle">
                  <el-tree id="tree-option"
                           ref="selectTree"
                           :accordion="accordion"
                           :data="deptOptions"
                           :props="props"
                           :node-key="props.value"
                           :default-expanded-keys="defaultExpandedKey"
                           @node-click="handleNodeClick2">
                  </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="formData.phonenumber" clearable placeholder="请输入手机号码" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" clearable placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="formData.userId == undefined" label="用户名称" prop="userName">
              <el-input v-model="formData.userName" clearable placeholder="请输入用户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="formData.userId == undefined" label="用户密码" prop="password">
              <el-input v-model="formData.password" clearable placeholder="请输入用户密码" type="password"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别" prop="sex">
              <el-select v-model="formData.sex" placeholder="请选择">
                <el-option
                    style="margin-left: 15px"
                    v-for="dict in sexOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="formData.status">
                <el-radio
                    v-for="dict in statusList"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select @change="$forceUpdate" v-model="formData.postIds" multiple placeholder="请选择">
                <el-option
                    style="margin-left: 15px"
                    v-for="item in postOptions"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId"
                    :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="formData.roleIds" multiple placeholder="请选择">
                <el-option
                    style="margin-left: 15px"
                    v-for="item in roleOptions"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                    :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark" clearable type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open=false">取 消</el-button>
      </div>
    </el-dialog>
    <div>
      <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          center>
        <span>确认要重置{{ user.usernamne }}用户的密码</span>
        <el-input v-model="user.password" placeholder="请输入密码"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changPwd()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserList",
  inject: ["reload"],
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: 'deptId',             // ID字段名
          label: 'deptName',         // 显示名称
          children: 'children'    // 子级字段名
        }
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    /* 初始值 */
    value: {
      type: Number,
      default: () => {
        return 100
      }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true
      }

    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return true
      }
    },
  },
  data() {
    return {
      ids: '',
      user: {
        usernamne: '',
        userId: '',
        password: '',
      },
      dialogVisible: false,
      defaultExpandedKey: [],
      pageSizes: [2,4, 6, 8, 10],
      loading: true,
      open: false,
      multiple: true,
      //状态
      valueTitle: '智慧社区',
      deptName: '',
      statusList: [],
      deptOptions: [],
      sexOptions: [],
      postOptions: [],
      roleOptions: [],
      searchTime: [],
      total: 0,
      title: '',
      fileList: [],
      form: {
        nowPage: 1,
        pageSize: 3,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: 100
      },
      formData: {
        phonenumber: undefined,
        userId: undefined,
        nickName: undefined,
        email: undefined,
        sex: undefined,
        deptId: undefined,
        postIds: [],
        roleIds: [],
        userName: undefined,
        status: undefined,
      },
      restaurants: [],
      state: '',
      deptList: [],
      defaultProps: {
        value: 'deptId',             // ID字段名
        label: 'deptName',         // 显示名称
        children: 'children'    // 子级字段名
      },
      tableData: [],
      formRules: {
        phonenumber: [
          {max: 11, message: "手机号最长为11位", trigger: "blur"},
          {pattern: /^-?[1-9]\d*$/, message: '手机号只能为数字'},
        ],
      },
      // 表单校验
      rules: {
        nickName: [
          {required: true, message: "角色名称不能为空", trigger: "blur"},
          {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '非法字符', trigger: "blur"},
          {min: 1, max: 10, message: "角色名称长度不超过10个字符", trigger: "blur"},
        ],
        email: [
          {required: true, message: "邮箱不能为空", trigger: "blur"},
          {pattern: /^([a-zA-Z0-9]+[-_.]?)+@[a-zA-Z0-9]+\.[a-z]+$/, message: '请输入正确邮箱', trigger: "blur"},

        ],
        userName: [
          {required: true, message: "角色名称不能为空", trigger: "blur"},
          {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '非法字符', trigger: "blur"},
          {min: 1, max: 10, message: "角色名称长度不超过10个字符", trigger: "blur"},
        ],
        password: [
          {required: true, message: "密码不能为空", trigger: "blur"},
          {min: 1, max: 15, message: "密码长度最多10个字符", trigger: "blur"},
          {
            pattern: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_])/,
            message: "密码必须包含大小写英文字母,特殊字符",
            trigger: "blur"
          },
        ],

        phonenumber: [
          {required: true, message: "手机号不能为空", trigger: "blur"},
          {max: 11, message: "手机号最长为11位", trigger: "blur"},
          {pattern: /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/, message: '输入有效的手机号', trigger: "blur"},
        ],
        sex: [
          {required: true, message: "用户性别不能为空", trigger: "blur"},

        ],
        remark: [
          {max: 50, message: "角色备注不能超过50字符", trigger: "blur"}
        ]
      }
    }
  },
  async created() {
    await this.getDeptList()
    await this.getformInfo()
    await this.getUserList()
    this.loading = false
    this.$forceUpdate();
  },
  methods: {
    /* 重置*/
    formReload(){
      this.form.nowPage = 1
      this.form.userName = undefined
      this.form.phonenumber = undefined
      this.form.status = undefined
      this.getUserList()
    },
    //查询表单清空
    queryKey() {
      if (this.searchTime == null) {
        this.searchTime = []
      }
      this.getUserList()
    },


    // 初始化值
    initHandle() {
      // eslint-disable-next-line vue/no-mutating-props
      this.options = []
      if (this.valueId) {
        this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[this.props.label]     // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.valueId)       // 设置默认选中
        this.defaultExpandedKey = [this.valueId]      // 设置默认展开
      }
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        scrollBar.forEach(ele => ele.style.width = 0)
      })

    },
    // 切换选项
    handleNodeClick2(node) {
      this.valueTitle = node[this.props.label]
      this.valueId = node[this.props.value]
      this.$emit('getValue', this.valueId)
      this.formData.deptId = this.valueId
      this.defaultExpandedKey = []
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = '智慧社区'
      this.valueId = 100
      this.formData.deptId = 100
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('getValue', null)
    },
    async getformInfo() {


    },
    handleNodeClick(data) {
      this.form.deptId = data.deptId
      this.deptName = data.deptName
      this.getUserList()
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.deptName.indexOf(queryString.toLowerCase()) === 0);
      };
    },
    async getDeptList() {

    },
    handleSelect() {

    },
    handleIconClick() {
      //console.log(ev)
    },
    async getUserList() {
      this.form.startTime = this.searchTime[0]
      this.form.endTime = this.searchTime[1]
      this.loading = true;
      const {data: userList} = await this.$http.get('/system/sysUser/selectUsers', {
        params: this.form
      })
      this.tableData = userList.data
      this.form.nowPage = parseInt(userList.nowPage)
      this.form.pageSize = parseInt(userList.pageSize)
      this.total = parseInt(userList.totalPage)
      this.loading = false
      console.log(userList);
    },
    async selectDept() {


    },
    /*修改状态*/
    handleStatusChange() {

    },
    handleSelectionChange() {

    },
    /* 选中删除*/
    handleDelete() {

    },
    deleteUser() {

    },
    /*关闭表单的方法*/
    closeFrom(){
      //清空验证
      this.$refs['formData'].resetFields()
    },
    updateForm() {

    },
    async getPostIds() {

    },
    async getRoleIds() {

    },
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.form.pageSize = val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.form.nowPage = 1
      this.getUserList()
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.form.nowPage = val
      this.getUserList()
    },
    //取消
    cancel() {
      this.$refs.formData.resetFields();
      this.open = false;
    },
    /* 新增*/
    handleAdd() {
      this.title = '添加'
      this.valueTitle = this.deptName
      this.formData = {
        phonenumber: undefined,
        userId: undefined,
        nickName: undefined,
        email: undefined,
        sex: undefined,
        deptId: undefined,
        postIds: [],
        roleIds: [],
        userName: undefined,
        status: "0",
      }
      this.open = true
      this.$refs.formData.resetFields();

    },
    //文件校验方法
    beforeAvatarUpload() {

    },
    /*导出*/
    handleExport() {

    },
    /*下载模板*/
    downloadExport() {

    },
    /*表单提交*/
    async submitForm() {


    },
    reLoadPwd() {

    },
    /*修改密码*/
    async changPwd() {

    }
  },

}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}

.el-row .el-card {
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  transition: all .5s;
}


li {
  line-height: normal;
  padding: 7px;
}

.name {
  text-overflow: ellipsis;
  overflow: hidden;
}

.addr {
  font-size: 12px;
  color: #eaedf1;
}

.highlighted .addr {
  color: #eaedf1;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}

.el-select-dropdown__item.selected {
  font-weight: normal;
}

ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}

.el-tree >>> .is-current .el-tree-node__label {
  color: #409EFF;
  font-weight: 700;
}

.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
</style>

