<template>
  <div>
    <!--    <breadcrumb name1="asd" name2="as"></breadcrumb>-->
    <!--页面数据渲染-->
    <el-container>
      <!--左侧部门树状列表-->
      <el-card shadow="hover" style="border: none">
        <el-aside>
          <el-input
              size="small"
              style="width: 60%"
              popper-class="my-autocomplete"
              v-model="filterText"
              :fetch-suggestions="querySearch"
              placeholder="请输入部门名称">
            <i
                class="el-input__icon el-icon-search"
                slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.deptName }}</div>
              <span style="font-size: 2px;
      color: rgba(43,43,44,0.51);">{{ item.parentName }}</span>
            </template>
          </el-input>
          <div style="padding-top: 15%">
            <el-tree :data="deptOptions"
                     ref="tree"
                     :props="defaultProps"
                     :filter-node-method="filterNode"
                     @node-click="handleNodeClick"
                     default-expand-all
                     highlight-current
                     :expand-on-click-node="false"
            ></el-tree>
          </div>
        </el-aside>
      </el-card>
      <!--右侧用户列表和查询条件-->
      <el-card shadow="hover" style="margin-left: 20px;border: none">
        <el-main>
          <!--查询条件表单-->
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
          <!--操作列表-->
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
                  @click="deleteUser"
              >删除
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                  plain
                  size="mini"
                  type="el-button el-button--info is-plain"
                  icon="el-icon-upload2"
                  @click="dialogVisible6 = true"
              >导入
              </el-button>
            </el-col>
            <!--弹出的导入-->
            <el-dialog  :visible.sync="dialogVisible6" :before-close="handleClose"  width="400px" >
              <el-upload ref="upload"
                         action=""
                         drag
                         :http-request="uploadFile"
                         :file-list="fileList"
                         :on-change="judgeFileType"
                         :auto-upload="false"
                         :on-exceed="handleExceed"
                         :multiple="false"
                         :limit="1"
                         accept=".xlsx,.xls">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

                <div class="el-upload__tip" slot="tip"  style="text-align: center">只能上传xls文件，且不超过500kb</div>
              </el-upload>
              <div style="text-align: center">没有模板？点击<a class="el-upload__text" @click="downloadExport" href="#">下载模板</a></div>
              <div style="text-align: center">
                  <span>
                    <el-button @click="cancelUpload">取消</el-button>
                    <el-button type="primary" @click="submitUpload">上传<i class="el-icon-upload2"></i></el-button>
                  </span>
              </div>
            </el-dialog>
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
          </el-row>
          <!--渲染数据的表格-->
          <template>
            <el-table
                :data="tableData"
                style="width: 100%"
                @selection-change="handleSelectionChange">
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
                      :disabled="scope.row.userId === 1"
                      v-model="scope.row.status"
                      active-value="0"
                      inactive-value="1"
                      @change="handleStatusChange(scope.row)"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center" prop="createTime" width="160">
                <template slot-scope="scope">
                  <span>{{ scope.row.createTime | moment }}</span>
                </template>
              </el-table-column>
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
                  <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)"
                               v-hasPermi="['system:user:resetPwd', 'system:user:edit']">
                    <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="handleResetPwd" icon="el-icon-key"
                                        v-hasPermi="['system:user:resetPwd']">重置密码
                      </el-dropdown-item>
                      <el-dropdown-item command="handleAuthRole" icon="el-icon-circle-check"
                                        v-hasPermi="['system:user:edit']">分配角色
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="form.pageNum"
                           :page-sizes="[1, 2, 5, 10]"
                           :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="this.total">
            </el-pagination>
          </template>
        </el-main>
      </el-card>
    </el-container>
    <!--修改添加弹出层-->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body @close="closeFrom()">
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
                           :expand-on-click-node="false"
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
            <el-form-item label="岗位" prop="postId">
              <el-select @change="$forceUpdate" v-model="formData.postId" placeholder="请选择">
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
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="formData.roleId" placeholder="请选择">
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
    <!--重置密码确认框-->
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
    <!--验证重复有多少条数据-->
    <el-dialog
        title="错误"
        :visible.sync="dialogVisibleUpload"
        width="30%">
      <span>{{uploadData}}</span>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisibleUpload = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserList",
  // inject: ["reload"],
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: 'deptId',        // ID字段名
          label: 'deptName',      // 显示名称
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
      dialogVisible6: false,
      dialogVisibleUpload: false,
      uploadData:'',
      defaultExpandedKey: [],
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
        pageNum: 1,
        pageSize: 5,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: 100,
      },
      formData: {
        phonenumber: undefined,
        userId: undefined,
        nickName: undefined,
        email: undefined,
        sex: undefined,
        deptId: undefined,
        postId: '',
        roleId: '',
        userName: undefined,
        status: undefined,
      },
      restaurants: [],
      filterText: '',
      deptList: [],
      defaultProps: {
        value: 'deptId',        // ID字段名
        label: 'deptName',      // 显示名称
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
          {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: "邮箱不能为空", trigger: "blur"},
          {pattern: /^([a-zA-Z0-9]+[-_.]?)+@[a-zA-Z0-9]+\.[a-z]+$/, message: '请输入正确邮箱', trigger: "blur"},
        ],
        userName: [
          {required: true, message: "角色名称不能为空", trigger: "blur"},
          {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '非法字符', trigger: "blur"},
          {min: 2, max: 10, message: "角色名称长度不超过10个字符", trigger: "blur"},
        ],
        password: [
          {required: true, message: "密码不能为空", trigger: "blur"},
          {min: 6, max: 20, message: "密码长度为6-20个字符", trigger: "blur"},
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
        ],
        deptId: [
          {required: true, message: "部门不能为空", trigger: "blur"},
        ],
        postId: [
          {required: true, message: "岗位不能为空", trigger: "blur"},
        ],
        roleId: [
          {required: true, message: "角色不能为空", trigger: "blur"},
        ]
      }
    }
  },
  async created() {
    await this.getDeptList();
    await this.getUserList();
    await this.getPostIds();
    await this.getRoleIds();
    this.loading = false
    this.$forceUpdate();
    //查询需要使用的字典
    await this.getSex("sys_user_sex");
    this.getDicts("sys_normal_disable").then(response => {
      this.statusList = response.data.data;
    });
  },
  methods: {

    /** 初始化值 */
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
    /** 查询数据字典性别 */
    async getSex(deptType) {
      const {data: res} = await this.$http.get(`sysDictData/getDict?dictType=${deptType}`);
      this.sexOptions = res.data;
    },
    /** 获取岗位列表 */
    async getPostIds() {
      const {data: res} = await this.$http.get('sysPost/getAllPost');
      if (res.meta.errorCode !== 200) {
        return this.$message.error("获取岗位失败")
      }
      this.postOptions = res.data;
    },
    /** 获取角色列表 */
    async getRoleIds() {
      const {data: res} = await this.$http.get('sysRole/getAllRole');
      if (res.meta.errorCode !== 200) {
        return this.$message.error("获取角色失败")
      }
      this.roleOptions = res.data;
    },
    /** 获取部门列表 */
    async getDeptList() {
      const {data: res} = await this.$http.get('sysDept/getDeptList');
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.deptOptions = res.data
    },
    /** 获取用户列表 */
    async getUserList() {
      this.form.startTime = this.searchTime[0]
      this.form.endTime = this.searchTime[1]
      this.loading = true;
      const {data: res} = await this.$http.get('/sysUser/selectUsers', {
        params: this.form
      });
      this.tableData = res.data.sysUserDeptDto;
      this.total = res.data.pageable.total
      this.form.pageNum = res.data.pageable.pageNum
      this.loading = false
    },
    /** 更多操作触发 */
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.reLoadPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    /** 重置 */
    formReload() {
      this.form.pageNum = 1
      this.form.userName = undefined
      this.form.phonenumber = undefined
      this.form.status = undefined
      this.searchTime = []
      this.getUserList()
    },
    /**查询表单清空 */
    queryKey() {
      if (this.searchTime == null) {
        this.searchTime = []
      }
      this.getUserList()
    },
    /** 清除选中 */
    clearHandle() {
      this.valueTitle = '智慧社区'
      this.valueId = 100
      this.formData.deptId = 100
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('getValue', null)
    },
    /** 切换选项 */
    handleNodeClick2(node) {
      this.valueTitle = node[this.props.label]
      this.valueId = node[this.props.value]
      this.$emit('getValue', this.valueId)
      this.formData.deptId = this.valueId
      this.defaultExpandedKey = []
    },
    /** 选中部门节点时 */
    handleNodeClick(data) {
      this.form.deptId = data.deptId
      this.deptName = data.deptName
      this.getUserList()
    },
    /** 搜索框变化时 */
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    /**过滤器发生变化时 */
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.deptName.indexOf(queryString.toLowerCase()) === 0);
      };
    },
    /**根据id删除*/
    deleteUser(row) {
      const userIds = row.userId || this.ids;
      this.$confirm('是否确认删除角色编号为"' + userIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return this.$http.delete(`/sysUser?idList=${userIds}`);
      }).then((res) => {
        if (res.data.meta.errorCode !== 200) {
          return this.$message.error(res.data.meta.errorMsg);
        }
        this.getUserList();
        this.$message.success("删除成功");
      })
    },
    /**关闭表单的方法*/
    closeFrom() {
      //清空验证
      this.$refs['formData'].resetFields()
    },
    /** 分配角色操作 */
    handleAuthRole: function (row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    /** 每页显示的条数 */
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.form.pageSize = val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.form.pageNum = 1
      this.getUserList()
    },
    /** 显示第几页 */
    handleCurrentChange(val) {
      // 改变默认的页数
      this.form.pageNum = val
      this.getUserList()
    },
    /**取消 */
    cancel() {
      this.$refs.formData.resetFields();
      this.open = false;
    },
    /** 新增 */
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
    /**批量删除中的查询*/
    filterNode(value, data) {
      return data.deptName.indexOf(value) !== -1;
    },
    /**表单提交 */
    submitForm() {
      console.log(this.formData)
      this.$refs["formData"].validate(async valid => {
        if (valid) {
          if (this.formData.userId === undefined) {
            const {data: res} = await this.$http.post("sysUser/insertUser", this.formData)
            //   phonenumber: this.formData.phonenumber,
            //   nickName: this.formData.nickName,
            //   email: this.formData.email,
            //   sex: this.formData.sex,
            //   deptId: this.formData.deptId,
            //   postId: this.formData.postIds,
            //   roleId: this.formData.roleIds,
            //   userName: this.formData.userName,
            //   status: this.formData.status,
            //   password: this.formData.password
            // });
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg)
            }
            this.getUserList();
            this.$message.success("新增成功");
            this.open = false;
          } else {
            const {data: res} = await this.$http.put('sysUser/adminUpdateUser', {
              userId: this.formData.userId,
              phonenumber: this.formData.phonenumber,
              nickName: this.formData.nickName,
              email: this.formData.email,
              sex: this.formData.sex,
              deptId: this.formData.deptId,
              postId: this.formData.postId,
              roleId: this.formData.roleId,
              userName: this.formData.userName,
              status: this.formData.status,
            });
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg)
            }
            await this.getUserList();
            this.$message.success("修改成功");
            this.open = false;
          }
        }
      });
    },
    /** 重置密码 */
    reLoadPwd(row) {
      this.title = '重置密码';
      this.dialogVisible = true;
      this.user.userId = row.userId;
      this.user.password = row.password;
      this.user.username = row.nickName;
    },
    /**修改密码 */
    async changPwd() {
      const {data: res} = await this.$http.post("sysUser/resetPassword", {
        userId: this.user.userId,
        password: this.user.password
      });
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.dialogVisible = false;
      return this.$message.success("重置成功")
    },
    /** 打开修改表单时 */
    async updateForm(row) {
      this.open = true;
      const {data: res} = await this.$http.get(`sysUser/getUserInfo?userId=`+row.userId);
      this.formData.phonenumber=res.data.sysUser.phonenumber;
      this.formData.userId=res.data.sysUser.userId;
      this.formData.nickName=res.data.sysUser.nickName;
      this.formData.userName=res.data.sysUser.userName;
      this.formData.status=res.data.sysUser.status;
      this.formData.email=res.data.sysUser.email;
      this.formData.sex=res.data.sysUser.sex;
      this.formData.deptId=res.data.sysUser.deptId;
      this.formData.postId=res.data.sysPost.postId;
      this.formData.roleId=res.data.sysRole.roleId;
    },
    /**多选框选中 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      //设置全局配置信息
      const config = {
        method: 'get',
        url: 'sysUser/getExcel?userIds='+this.ids,
        responseType: 'blob'
      };
      //发送请求
      // eslint-disable-next-line no-undef
      axios(config).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '用户管理.xls');
            document.body.appendChild(link);
            link.click();
            if (response.data !== null) {
              this.$message.success("导出成功");
            }
          }
      )
    },
    /** 下载模板 */
    downloadExport() {
      //设置全局配置信息
      const config = {
        method: 'get',
        url: 'sysUser/uploadExcel',
        responseType: 'blob'
      };
      //发送请求
      // eslint-disable-next-line no-undef
      axios(config).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '用户管理模板.xls');
            document.body.appendChild(link);
            link.click();
            if (response.data !== null) {
              this.$message.success("下载成功");
            }
          }
      )
    },
    /** 关闭导入报错有重复的弹窗 */
    handleCloseUpload(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    /** 关闭导入的x */
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
            this.fileList.splice(0,1)
            this.visible = false
          })
          .catch(_ => {});
    },
    /** 判断文件类型 */
    judgeFileType (file) {
      let suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (suffix !== 'xlsx' && suffix !== 'xls') {
        // warning('请选择正确的文件格式的文件')
        this.fileList.splice(0, 1)
      }
    },
    /** 上传文件 */
    async uploadFile(param) {
      let fileObject = param.file
      let formData = new FormData()
      formData.append('file', fileObject)
      const {data: res} = await this.$http.post('sysUser/import-data', formData)
      if (res.meta.errorCode !== 200) {
        this.dialogVisibleUpload=true;
        this.uploadData = res.data;
      }else {
        this.$message({
          message: '导入成功！',
          type: 'success'
        });
        this.getUserList();
      }
      this.fileList.splice(0,1)
      this.visible = false

    },
    /** 关闭上传窗口时 */
    cancelUpload() {
      this.fileList.splice(0,1)
      this.visible = false
    },
    /** 检查是否上传过多的Excel */
    handleExceed (files, fileList) {
      warning('无法添加更多文件')
    },
    /** 点击上传 */
    submitUpload() {
      if (this.$refs.upload.uploadFiles.length === 1) {
        this.$refs.upload.submit()
        this.dialogVisible6=false;
      }
    },
  },
  watch: {
    // 根据名称筛选部门树
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
}
</script>

<style>
.el-card {
  border: none;
}
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
</style>

