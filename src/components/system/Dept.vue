<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
            <el-form-item label="部门名称" prop="deptName">
                <el-input
                        v-model="queryParams.deptName"
                        placeholder="请输入部门名称"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="部门状态" clearable size="small">
                    <el-option
                            v-for="dict in statusOptions"
                            :key="dict.dictValue"
                            :label="dict.dictLabel"
                            :value="dict.dictValue"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

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
        </el-row>

        <el-table
                v-loading="loading"
                :data="deptList"
                row-key="deptId"
                default-expand-all
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
            <el-table-column prop="deptName" label="部门名称" width="260"></el-table-column>
            <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="statusFormat" width="100"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime | moment }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleUpdate(scope.row)"
                    >修改
                    </el-button>
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-plus"
                            @click="handleAdd(scope.row)"
                    >新增
                    </el-button>
                    <el-button
                            v-if="scope.row.parentId !== 0"
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                    >删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或修改部门对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上级部门" prop="parentId">
                            <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer"
                                        placeholder="选择上级部门"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门名称" prop="deptName">
                            <el-input v-model="form.deptName" placeholder="请输入部门名称"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示排序" prop="orderNum">
                            <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="负责人" prop="leader">
                            <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门状态">
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Treeselect from "@riophae/vue-treeselect";
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";

    export default {
        name: "Dept",
        components: {Treeselect},
        data() {
            return {
                // 遮罩层
                loading: true,
                // 显示搜索条件
                showSearch: true,
                // 表格树数据
                deptList: [],
                // 部门树选项
                deptOptions: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 状态数据字典
                statusOptions: [],
                // 查询参数
                queryParams: {
                    deptName: undefined,
                    status: undefined
                },
                // 表单参数
                form: {},
                // 修改表单参数
                form1: {},
                // 表单校验
                rules: {
                    parentId: [
                        {required: true, message: "上级部门不能为空", trigger: "blur"}
                    ],
                    deptName: [
                        {required: true, message: "部门名称不能为空", trigger: "blur"}
                    ],
                    orderNum: [
                        {required: true, message: "显示排序不能为空", trigger: "blur"}
                    ],
                    email: [
                        {
                            type: "email",
                            message: "'请输入正确的邮箱地址",
                            trigger: ["blur", "change"]
                        }
                    ],
                    phone: [
                        {
                            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                            message: "请输入正确的手机号码",
                            trigger: "blur"
                        }
                    ]
                }
            };
        },
        created() {
            this.getList();
            this.getDicts("sys_normal_disable");
        },
        methods: {
            /** 查询数据字典角色状态 */
            async getDicts(deptType) {
                const {data: res} = await this.$http.get(`sysDictData/getDict?dictType=${deptType}`);
                this.statusOptions = res.data;
            },
            /** 查询部门列表 */
            async getList() {
                //对页面的Loading加载进行控制
                this.loading = true;
                //查询部门数据
                const {data: res} = await this.$http.get('sysDept/getDeptList', {
                    params: {
                        deptName: this.queryParams.deptName,
                        status: this.queryParams.status
                    }
                });
                console.log(res);
                //根据状态码来返回错误信息
                if (res.meta.errorCode !== 200) {
                    return this.$message.error(res.meta.errorMsg)
                }
                this.deptList = res.data;
                this.loading = false;

            },

            /** 转换部门数据结构 */
            normalizer(node) {
                if (node.children && !node.children.length) {
                    delete node.children;
                }if (node.deptName == null) {
                    node.deptName = "智慧社区"
                }
                return {
                    id: node.deptId,
                    label: node.deptName,
                    children: node.children
                };
            },
            // 字典状态字典翻译
            statusFormat(row, column) {
                return this.selectDictLabel(this.statusOptions, row.status);
            },
            // 取消按钮
            cancel() {
                this.open = false;
                this.reset();
            },
            // 表单重置
            reset() {
                this.form = {
                    deptId: undefined,
                    parentId: undefined,
                    deptName: undefined,
                    orderNum: undefined,
                    leader: undefined,
                    phone: undefined,
                    email: undefined,
                    status: "0"
                };
                this.resetForm("form");
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.resetForm("queryForm");
                this.handleQuery();
            },
            /** 查询菜单下拉树结构 */
            async getTreeselect() {
                this.deptOptions = [];
                const dept = {deptId: 0, deptName: '智慧社区', children: []};
                const {data: res} = await this.$http.get('sysDept/getDeptList');
                dept.children = res.data[0].children;
                this.deptOptions.push(dept)
            },
            /** 新增按钮操作 */
            handleAdd(row) {
                this.open = true;
                this.reset();
                this.getTreeselect();
                if (row !== null && row.deptId) {
                    this.form.parentId = row.deptId;
                } else if (row.deptId===100) {
                    this.form.parentId = 0;
                }else {
                    this.form.parentId = 100;
                }
                this.open = true;
                this.title = "添加部门";
            },
            /** 修改按钮操作 */
            async handleUpdate(row) {
              this.open = true;
                this.reset();
                await this.getTreeselect();
                this.form.deptId = row.deptId;
                this.form.parentId = row.parentId;
                this.form.deptName=row.deptName;
                this.form.orderNum=row.orderNum;
                this.form.leader=row.leader;
                this.form.phone=row.phone;
                this.form.email=row.email;
              this.form.status=row.status;
                const {data: res} = await this.$http.get(`sysDept/${row.deptId}`);
                if (res.code !== 0) {
                    return this.$message.error("获取失败！")
                }
                this.open = true;
              this.title = "修改部门";
                this.form = res.data;
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs["form"].validate(async valid => {
                    if (valid) {
                      console.log(this.form)

                      if (this.form.deptId != undefined) {
                            const {data: res} = await this.$http.put("sysDept/updateDept", this.form);
                            if (res.meta.errorCode !== 200) {
                                return this.$message.error(res.meta.errorMsg)
                            }
                            this.open = false;
                            location.reload();
                            return this.$message.success("修改成功！")
                        } else {
                            const {data: res} = await this.$http.post("sysDept/insertDept", this.form);
                            console.log(res);
                            if (res.meta.errorCode !== 200) {
                                return this.$message.error(res.meta.errorMsg);
                            }
                            this.$message.success("新增成功");
                            this.open = false;
                            location.reload();
                        }
                    }
                });
            },
          /**删除单个菜单*/
          async handleDelete(row) {
            this.$confirm('是否确认删除名称为"' + row.deptName + '"的数据项?', "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() =>{
              // 通过方法？带参
              this.$http.delete("/sysDept/deleteDept?idList=" + row.deptId)
                      .then((res) => {
                        console.log(res)
                        console.log(res.data.meta.errorCode)
                        if (res.data.meta.errorCode === 200) {
                          // 重新获取页面
                          this.getList();
                          this.$message.success("删除成功");
                        } else {
                          this.$message.warning(res.data.meta.errorMsg);
                        }
                      })
            })
          },
        }
    };
</script>
