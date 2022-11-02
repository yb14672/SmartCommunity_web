<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible1 = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <!--                    插槽 得到整行的数据-->
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="showEditDialog(scope.row)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                       @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页导航区域
            @size-change(pagesize改变时触发)
            @current-change(页码发生改变时触发)
            :current-page(设置当前页码)
            :page-size(设置每页的数据条数)
            :total(设置总页数) -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!--    修改-->
        <el-dialog
                title="修改用户"
                :visible.sync="dialogVisible"
                width="30%">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="姓名" prop="username">
                    <el-input v-model="ruleForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="ruleForm.tel"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateUser">确 定</el-button>
            </span>
        </el-dialog>
        <!--        角色权限-->
        <el-dialog
                title="修改角色"
                :visible.sync="dialogVisibleRole"
                width="30%">
            <el-form :model="roleForm" ref="roleForm" label-width="100px" class="demo-ruleForm">
                <p>当前的用户:{{roleForm.username}}</p>
                <p>当前的角色:{{roleForm.role_name}}</p>
                <el-select v-model="roleId" placeholder="分配角色">
                    <el-option v-for="(role) of roleList" :value="role.id">{{role.roleName}}</el-option>
                </el-select>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleRole = false">取 消</el-button>
                <el-button type="primary" @click="updateRole">确 定</el-button>
            </span>
        </el-dialog>
        <!--    添加-->
        <el-dialog
                title="添加用户"
                :visible.sync="dialogVisible1"
                width="30%">
            <el-form :model="ruleForm1" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
                <el-form-item label="姓名" prop="username">
                    <el-input v-model="ruleForm1.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm1.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm1.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="ruleForm1.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="addUserCommit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                userId: '',
                roleId: '',
                // 获取查询用户信息的参数
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                // 修改
                ruleForm: {
                    username: '',
                    email: '',
                    tel: '',
                    id: ''
                },
                // 添加
                ruleForm1: {
                    username: '',
                    password: '',
                    mobile: '',
                    email: '',
                },
                roleForm: {
                    role_name: '',
                    username: '',
                },
                roleList: {
                    id: '',
                    role_name: '',
                },
                // 保存请求回来的用户列表数据
                userlist: [],
                total: 0,
                dialogVisible: false,
                dialogVisible1: false,
                dialogVisibleRole: false
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                const {data: res} = await this.$http.get('users', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户列表失败！')
                }
                this.userlist = res.data.users
                this.total = res.data.total
                console.log(res)
            },
            handleSizeChange(newSize) {
                // pagesize改变时触发，当pagesize发生改变的时候，我们应该
                // 以最新的pagesize来请求数据并展示数据
                //   console.log(newSize)
                this.queryInfo.pagesize = newSize
                // 重新按照pagesize发送请求，请求最新的数据
                this.getUserList()
            },
            handleCurrentChange(current) {
                // 页码发生改变时触发当current发生改变的时候，我们应该
                // 以最新的current页码来请求数据并展示数据
                //   console.log(current)
                this.queryInfo.pagenum = current
                // 重新按照pagenum发送请求，请求最新的数据
                this.getUserList()
            },
            async userStateChanged(row) {
                // 发送请求进行状态修改
                const {data: res} = await this.$http.put(
                    `users/${row.id}/state/${row.mg_state}`
                )
                // 如果返回状态为异常状态则报错并返回
                if (res.meta.status !== 200) {
                    row.mg_state = !row.mg_state
                    return this.$message.error('修改状态失败')
                }
                this.$message.success('更新状态成功')
            },
            // 修改信息
            async showEditDialog(row) {
                console.log("row" + row);
                this.dialogVisible = true;
                // 左边的是自己定义的，右边是存在row的数据的
                this.ruleForm.username = row.username;
                this.ruleForm.email = row.email;
                this.ruleForm.tel = row.mobile;
                this.ruleForm.id = row.id
            },
            updateUser: async function () {
                // // 发送请求进行状态修改
                const {data: res} = await this.$http.put(
                    `users/${this.ruleForm.id}`, {
                        id: this.ruleForm.id,
                        username: this.ruleForm.username,
                        mobile: this.ruleForm.tel,
                        email: this.ruleForm.email
                    }
                );
                // 如果返回状态为异常状态则报错并返回
                if (res.meta.status !== 200) {
                    this.$message.error('修改用户失败')
                }
                this.$message.success('更新用户成功');
                this.dialogVisible = false;
                this.getUserList();
            },
            // 分配角色
            async setRole(row) {
                console.log(row);
                this.dialogVisibleRole = true;
                // 左边的是自己定义的，右边是存在row的数据的
                // 要把需要的带过来
                this.userId = row.id;
                this.roleForm.username = row.username;
                this.roleForm.role_name = row.role_name;
                const {data: res} = await this.$http.get(`roles/`);
                this.roleList = res.data;
            },
            updateRole: async function () {
                console.log(this.roleList);
                // // 发送请求进行状态修改
                const {data: res} = await this.$http.put(
                    `users/`+this.userId+`/role`, {
                        rid: this.roleId
                    }
                )
                // 如果返回状态为异常状态则报错并返回
                if (res.meta.status !== 200) {
                    this.$message.error('分配角色失败')
                }
                this.$message.success('分配角色成功');
                this.dialogVisibleRole = false;
                this.getUserList();
            },
            // 添加用户
            // 添加按钮确认提交
            addUserCommit: async function () {
                // // 发送请求进行状态修改
                const {data: res} = await this.$http.post(
                    `users/`, this.ruleForm1
                );
                if (res.meta.status !== 201) {
                    return this.$message.error("添加用户失败")
                }
                this.$message.success('添加用户成功');
                this.dialogVisible1 = false;
                this.ruleForm1 = {};
                this.getUserList();
            },
            // 删除用户
            async removeUserById(id) {
                console.log(id);
                //调用接口删除指定数据
                this.$confirm("确定删除吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    // eslint-disable-next-line no-undef
                    // 通过方法？带参
                    this.$http.delete("users/" + id).then((res) => {
                        console.log(res)
                        this.$message.success("删除成功");
                        // 重新获取页面
                        this.getUserList();
                    })

                })
                // 取消删除
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除",
                        });
                    });
            },

        }
    }
</script>

<style scoped>

</style>
