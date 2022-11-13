<template>
    <div class="app-container">
        <!-- 面包屑导航 -->
        <breadcrumb name1="首页" name2="系统管理" name3="用户管理"></breadcrumb>
        <el-row :gutter="20">
            <!--部门数据-->
            <el-col :span="4" :xs="24">
                <div >
                    <el-input
                            v-model="deptName"
                            placeholder="请输入部门名称"
                            clearable
                            size="small"
                            prefix-icon="el-icon-search"
                            style="margin-bottom: 20px"
                    />
                </div>
                <div class="width:285px">
                    <el-tree
                            class="filter-tree"
                            :data="deptOptions"
                            row-key="deptId"
                            :props="defaultProps"
                            default-expand-all
                            :filter-node-method="filterNode"
                            ref="tree"
                            @node-click="handleNodeClick"
                    />
                </div>
            </el-col>

            <!--用户数据-->
            <el-col :span="20" :xs="24">
                <!--        搜索框-->
                <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
                    <el-form-item label="用户名称" prop="userName">
                        <el-input
                                v-model="queryParams.userName"
                                placeholder="请输入用户名称"
                                clearable
                                @clear="getUserList"
                                size="small"
                                style="width: 240px"
                                @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phonenumber">
                        <el-input
                                v-model="queryParams.phonenumber"
                                placeholder="请输入手机号码"
                                clearable
                                @clear="getUserList"
                                size="small"
                                style="width: 240px"
                                @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="queryParams.status" placeholder="用户状态" clearable @clear="getUserList"
                                   size="small" style="width: 240px">
                            <el-option
                                    v-for="dict in statusOptions"
                                    :key="dict.dictValue"
                                    :label="dict.dictLabel"
                                    :value="dict.dictValue"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker
                                v-model="dateRange"
                                size="small"
                                style="width: 240px"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                clearable
                                @clear="getUserList"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>


                <!--按钮-->
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                @click="handleAdd"

                        >新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                :disabled="multiple"
                                @click="handleDelete"
                        >删除
                        </el-button>
                    </el-col>
                    <!--  导入按钮-->

                    <el-col :span="1.5">
                        <el-upload action="#" :auto-upload="false" :multiple="false" :show-file-list="false"
                                   :on-change="uploadByJsqd" :file-list="fileList">
                            <el-button
                                    plain
                                    size="mini"
                                    type="el-button el-button--info is-plain"
                                    icon="el-icon-upload2"
                            >导入
                            </el-button>
                        </el-upload>
                    </el-col>
                    <!--  导出按钮-->
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
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getUserList"></right-toolbar>
                </el-row>
                <br>


                <!--用户数据渲染-->
                <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" align="center"/>
                    <el-table-column label="用户编号" align="center" prop="userId" width="150"/>
                    <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true"
                                     width="150"/>
                    <el-table-column label="用户昵称" align="center" prop="nickName" :show-overflow-tooltip="true"
                                     width="150"/>
                    <el-table-column label="部门" align="center" prop="sysDept.deptName" :show-overflow-tooltip="true"
                                     width="150"/>
                    <el-table-column label="手机号码" align="center" prop="phonenumber" width="150"/>
                    <el-table-column label="状态" align="center" width="150">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"
                                       @change="handleStatusChange(scope.row)" v-if="scope.row.userId==1?false:true">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" align="center" prop="createTime" width="160"/>
                    <el-table-column
                            label="操作"
                            align="center"
                            width="230"
                            class-name="small-padding fixed-width"
                    >
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="text"
                                    icon="el-icon-edit"
                                    @click="handleUpdate(scope.row)"
                                    v-hasPermi="['system:user:edit']"
                                    v-if="scope.row.userId==1?false:true"
                            >修改
                            </el-button>
                            <el-button
                                    v-if="scope.row.userId !== 1"
                                    size="mini"
                                    type="text"
                                    icon="el-icon-delete"
                                    @click="handleDeleteOne(scope.row.userId)"
                                    v-hasPermi="['system:user:remove']"
                            >删除
                            </el-button>
                            <el-button
                                    :rules="rules"
                                    size="mini"
                                    type="text"
                                    icon="el-icon-key"
                                    @click="handleResetPwd(scope.row)"
                                    v-hasPermi="['system:user:resetPwd']"
                                    v-if="scope.row.userId==1?false:true"
                            >重置
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <!-- 分页器 -->
        <div style="display: block;margin-top: 20px" align="right">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="form.nowPage"
                           :page-sizes="pageSizes"
                           :placement="right"
                           :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户昵称" prop="nickName">
                            <el-input v-model="form.nickName" placeholder="请输入用户昵称"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="归属部门" prop="deptId">
                            <treeselect
                                    v-model="form.deptId"
                                    :options="deptOptions"
                                    :show-count="true"
                                    :normalizer="normalizer"
                                    placeholder="请选择归属部门"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="phonenumber">
                            <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
                            <el-input v-model="form.userName" placeholder="请输入用户名称"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
                            <el-input v-model="form.password" placeholder="请输入用户密码" type="password"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户性别">
                            <el-select v-model="form.sex" placeholder="请选择">
                                <el-option
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
                            <el-radio-group v-model="form.status">
                                <el-radio
                                        v-for="dict in statusOptions"
                                        :key="dict.dictValue"
                                        :label="dict.dictValue"
                                >{{dict.dictLabel}}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="岗位">
                            <el-select v-model="form.postIds" multiple placeholder="请选择">
                                <el-option
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
                            <el-select v-model="form.roleIds" multiple placeholder="请选择">
                                <el-option
                                        v-for="item in roleOptions.slice(1)"
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
                        <el-form-item label="备注">
                            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 用户导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
            <el-upload
                    ref="upload"
                    :limit="1"
                    accept=".xlsx, .xls"
                    :headers="upload.headers"
                    :action="upload.url + '?updateSupport=' + upload.updateSupport"
                    :disabled="upload.isUploading"
                    :on-progress="handleFileUploadProgress"
                    :on-success="handleFileSuccess"
                    :auto-upload="false"
                    drag
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                    <el-checkbox v-model="upload.updateSupport"/>
                    是否更新已经存在的用户数据
                    <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
                </div>
                <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="upload.open = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Treeselect from "@riophae/vue-treeselect";
    import axios from "axios";

    export default {
        inject: ['reload'],
        components: {Treeselect},

        data() {
            return {
                // 导入按钮的文本
                importDataText: '导入',
                // 导入按钮的图标
                importDataIcon: 'el-icon-upload2',
                // 导入按钮是否被禁用
                importDisabled: false,


                // 遮罩层
                loading: true,
                // 选中数组
                ids: [],
                // 非单个禁用
                single: true,
                // 非多个禁用
                multiple: true,
                // 显示搜索条件
                showSearch: true,
                // 总条数
                total: 0,
                // 用户表格数据
                userList: null,
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 默认密码
                initPassword: 123456,
                // 日期范围
                dateRange: [],
                // 状态数据字典
                statusOptions: [],
                // 性别状态字典
                sexOptions: [],
                // 岗位选项
                postOptions: [],
                // 角色选项
                roleOptions: [],
                // 表单参数
                form: {},
                // 部门树选项
                deptOptions: [],
                // 部门名称
                deptName: "",

                defaultProps: {
                    label: "deptName",
                    children: "children"
                },
                // 用户导入参数
                upload: {
                    // 是否显示弹出层（用户导入）
                    open: false,
                    // 弹出层标题（用户导入）
                    title: "",
                    // 是否禁用上传
                    isUploading: false,
                    // 是否更新已经存在的用户数据
                    updateSupport: 0,
                },
                // 查询参数
                queryParams: {
                    nowPage: 1,
                    pageSize: 5,
                    userName: "",
                    phonenumber: "",
                    status: "",
                    deptId: "",
                    beginTime: '',
                    endTime: ''
                },
                // 表单校验
                rules: {
                    userName: [
                        {required: true, message: "用户名称不能为空", trigger: "blur"}
                    ],
                    nickName: [
                        {required: true, message: "用户昵称不能为空", trigger: "blur"}
                    ],
                    deptId: [
                        {required: true, message: "归属部门不能为空", trigger: "change"}
                    ],
                    password: [
                        {required: true, message: "用户密码不能为空", trigger: "blur"},
                        {min: 6, max: 16, message: "密码长度在6-16个字符", trigger: "blur"}
                    ],
                    email: [
                        {required: true, message: "邮箱地址不能为空", trigger: "blur"},
                        {
                            type: "email",
                            message: "'请输入正确的邮箱地址",
                            trigger: ["blur", "change"]
                        }
                    ],
                    phonenumber: [
                        {required: true, message: "手机号码不能为空", trigger: "blur"},
                        {
                            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                            message: "请输入正确的手机号码",
                            trigger: "blur"
                        }
                    ]
                }
            };
        },
        watch: {
            // 根据名称筛选部门树
            deptName(val) {
                this.$refs.tree.filter(val);
            }
        },

        created() {
            this.getUserList();
        },
        methods: {
            //每页条数改变时触发 选择一页显示多少行
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.queryParams.nowPage = 1;
                this.queryParams.pageSize = val;
            },
            //当前页改变时触发 跳转其他页
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.queryParams.nowPage = val;
                this.getlivestockInfo(val);
            },
            getlivestockInfo: async function (num1) {
                this.queryParams.nowPage = num1;
                this.getUserList();

            },

            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.userId);
                this.single = selection.length != 1;
                this.multiple = !selection.length;
            },
            /** 搜索按钮操作 */
            handleQuery() {
                //获取开始日期
                this.queryParams.beginTime = this.dateRange[0]
                //获取结束日期
                this.queryParams.endTime = this.dateRange[1]
                this.queryParams.pageNum = 1;
                this.getUserList();

            },
            //重置按钮
            resetQuery() {
                this.reload();
            },

            // 取消按钮
            cancel() {
                this.open = false;
                this.reset();
            },

            // 表单重置
            reset() {
                this.form = {
                    userId: undefined,
                    deptId: undefined,
                    userName: undefined,
                    nickName: undefined,
                    password: 123456,
                    phonenumber: undefined,
                    email: undefined,
                    sex: undefined,
                    status: "0",
                    remark: undefined,
                    postIds: [],
                    roleIds: []
                };
                // this.resetForm("form");
            },

            /** 查询用户数据列表 */
            async getUserList() {
                // 发送请求
                this.loading = true;
                console.log(this.queryParams)
                const {data: res} = await this.$http.post('sys/selectUserList', {
                    nowPage: this.queryParams.nowPage,
                    pageSize: this.queryParams.pageSize,
                    userName: this.queryParams.userName,
                    phonenumber: this.queryParams.phonenumber,
                    status: this.queryParams.status,
                    deptId: this.queryParams.deptId,
                    beginTime: this.queryParams.beginTime,
                    endTime: this.queryParams.endTime
                })
                //查询状态  正常or停用
                const {data: r} = await this.$http.get('role/getDict');
                this.statusOptions = r;
                //* 查询部门下拉树结构
                const {data: deptMenu} = await this.$http.post('dept/selectDeptList', {status: 0})
                this.deptOptions = deptMenu;
                this.queryParams.nowPage = res.nowPage;
                // this.pages = res.pages;
                this.total = res.total;
                this.queryParams.pageSize = res.pageSize;
                this.userList = res.userList;
                this.loading = false;
            },

            //* 查询部门下拉树结构
            /*async getTreeselect() {
              this.loading = true;
              //data{status：0}  部门被禁用时  用户管理直接不显示
              const {data: res} = await this.$http.post('dept/selectDeptList', {status: 0})
              this.deptOptions = res;
              this.loading = false
            },*/

            // 用户状态修改
            handleStatusChange: async function (row) {
                // console.log(row+'-----------------------------------')
                this.form = row
                console.log(this.form)
                const {data: res} = await this.$http.put('sys/updateUser', this.form)
                if (res.code !== 200) {
                    this.$message.error("修改失败")
                }
                this.$message.success("修改成功")
            },

            // 部门节点单击事件
            handleNodeClick(data) {
                this.queryParams.deptId = data.deptId;
                this.getUserList();
            },

            /**过滤子节点*/
            filterNode(value, deptList) {
                if (!value) return true;
                return deptList.deptName.indexOf(value) !== -1;
            },

            /** 新增按钮操作 */
            async handleAdd(row) {
                this.reset();
                // await this.getTreeselect();
                this.open = true;
                this.title = "添加用户";
                if (row != null) {
                    this.form.deptId = this.queryParams.deptId;
                } else {
                    this.form.deptId = "智慧社区"
                }
                //岗位
                const {data: res} = await this.$http.get('post/getPostAll');
                this.postOptions = res;
                console.log(11111111)
                console.log(res)
                //性别
                let dictId = 1;
                const {data: s} = await this.$http.get('sys/getDict?dictId=' + dictId);
                this.sexOptions = s;
                //角色
                const {data: e} = await this.$http.get('role/selectRoleById');
                this.roleOptions = e;

                this.form.password = this.initPassword;

            },
            /** 修改按钮操作 */
            async handleUpdate(row) {
                console.log(row)
                this.reset();
                // this.getTreeselect();
                this.open = true;
                this.title = "修改用户";
                //岗位
                const {data: res} = await this.$http.get('post/getPostAll');
                this.postOptions = res;
                //性别
                let dictId = 1;
                const {data: s} = await this.$http.get('sys/getDict?dictId=' + dictId);
                this.sexOptions = s;
                //角色
                const {data: e} = await this.$http.get('role/selectRoleById');
                this.roleOptions = e;
                //修改回显
                console.log("row.userId")
                console.log(row.userId)
                const {data: p} = await this.$http.get("sys/getUserById?userId=" + row.userId);
                console.log("p")
                console.log(p)
                this.form = {
                    userId: p.userId,
                    deptId: p.deptId,
                    nickName: p.nickName,
                    phonenumber: p.phonenumber,
                    email: p.email,
                    sex: p.sex,
                    status: p.status,
                    postIds: p.postIds,
                    roleIds: p.roleIds,
                    remark: p.remark,
                }
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.form.userId != undefined) {
                            console.log("this.form");
                            console.log(this.form);
                            this.$http.put('sys/updateUser', this.form).then(res => {
                                console.log(111111111111111111)
                                console.log(res)
                                if (res.data.code !== 200) {
                                    this.$message.error("修改失败:" + res.data.msg)
                                } else {
                                    this.$message.success("修改成功")
                                    this.open = false;
                                    this.getUserList();
                                }
                            })
                        } else {
                            this.$http.post('sys/addUser', this.form).then(res => {
                                if (res.data.code !== 200) {
                                    this.$message.error("添加失败:" + res.data.msg)
                                } else {
                                    this.$message.success("添加成功");
                                    this.open = false;
                                    this.getUserList();
                                }
                            })
                        }
                    }
                });
            },


            /** 批量删除按钮操作 */
            handleDelete(row) {
                const userIds = row.userId || this.ids;
                let axin = this
                this.$confirm('是否确认删除名称为"' + userIds + '"的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(async () => {
                    const {data: res} = await axin.$http.post('sys/delUserByIds', userIds);
                    if (res.status.status !== 'success') {
                        this.$message.error('删除失败！');
                    } else {
                        this.$message.success('删除成功！');
                        this.getUserList()
                    }
                }).catch(() => {
                    this.getUserList()
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            /*  单删除操作按钮*/
            async handleDeleteOne(id) {
                this.$confirm('是否删除角色编号为"' + id + '"的数据项？', "警告", {
                    confirmButtonClass: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(async () => {
                    const {data: res} = await this.$http.delete('sys/delUserById?userId=' + id)
                    if (res.status.status !== 'success') {
                        this.$message.error('删除失败！');
                    } else {
                        this.$message.success('删除成功');
                        this.getUserList();
                    }
                }).catch(() => {
                    this.getUserList()
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            /** 重置密码按钮操作 */
            handleResetPwd(row) {
                this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnClickModal: false,
                    inputPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
                    inputErrorMessage: "⾄少8-16个字符，⾄少1个⼤写字母，1个⼩写字母和1个数字，其他可以是任意字符",
                }).then(async ({value}) => {
                    const {data: res} = await this.$http.put('sys/resetPwd', {password: value, userId: row.userId});
                    if (res.status.status !== 'success') {
                        this.$message.error("修改失败");
                    } else {
                        this.$message.success("修改成功，新密码是：" + value);
                    }
                }).catch(() => {
                });
            },


            //菜单数结构
            normalizer(node) {
                if (node.children && !node.children.length) {
                    delete node.children;
                }
                if (node.deptName == null) {
                    node.deptName = "智慧社区"
                }
                return {
                    id: node.deptId,
                    label: node.deptName,
                    children: node.children
                }
            },


            // 导入文件失败后回调
            onError(row) {
                console.log(row)
                this.importDataText = '导入数据';
                this.importDataIcon = 'el-icon-upload2';
                this.importDisabled = false;
                this.$message.success("导入重复了！");
                this.reload();
            },
            // 导入文件成功后回调
            onSuccess(row) {
                console.log(row)
                if (row.success !== row.size) {
                    this.$message.success('成功导入' + row.success + '条数据，' + '失败' + (row.size - row.success) + '条数据！（重复）');
                } else {
                    this.$message.success('导入成功！');
                }

                // 成功后文本修改为原来的导入数据
                this.importDataText = '导入数据';
                // 图标修改
                this.importDataIcon = 'el-icon-upload2';
                // 将上传组件改为允许使用
                this.importDisabled = false;
                this.reload();
            },
            // 上传文件调用
            beforeUpload() {
                // 将文本修改为正在导入
                this.importDataText = '正在导入';
                // 修改其图标
                this.importDataIcon = 'el-icon-loading';
                // 将其上传组件暂时禁用
                this.importDisabled = true;
            },
            /** 导出按钮操作 */
            handleExport() {
                //设置全局配置信息
                const config = {
                    method: 'post',
                    url: 'sys/getExcel',
                    data: this.ids,
                    responseType: 'blob'
                };
                //发送请求
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
        }
    }
</script>

<style lang="less" scoped>

</style>
