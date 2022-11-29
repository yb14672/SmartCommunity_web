<template>
  <div class="app-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报修管理</el-breadcrumb-item>
      <el-breadcrumb-item>报修信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="app-container">
      <el-card>
        <div>
          <!--按钮-->
          <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="报修状态" prop="repairState">
              <el-select v-model="queryParams.repairState" placeholder="请选择报修状态" clearable size="small"
                         @clear="getRepairList">
                <el-option
                  v-for="item in repairOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="业主姓名" prop="ownerRealName">
              <el-input
                v-model="queryParams.ownerRealName"
                placeholder="请输入业主姓名"
                clearable
                size="small"
                @clear="getRepairList"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="业主电话" prop="ownerPhoneNumber">
              <el-input
                v-model="queryParams.ownerPhoneNumber"
                placeholder="请输入业主姓名"
                clearable
                size="small"
                @clear="getRepairList"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <!--增删改查按钮-->
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['system:repair:remove']"
              >删除
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['system:repair:export']"
              >导出
              </el-button>
            </el-col>
            <el-col :span="1.5" :offset="14">
              <el-select v-model="queryParams.communityId" @change="selectedCommunity(queryParams.communityId)"
                         style="border: 0;position: relative;margin-left: 265px" filterable placeholder="请选择小区"
                         size="mini"
                         class="avatar-container right-menu-item hover-effect">
                <el-option
                  v-for="item in options"
                  :key="item.communityId"
                  :label="item.communityName"
                  :value="item.communityId">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-table v-loading="loading" :data="repairList" @selection-change="handleSelectionChange"
                    ref="repairTable" style="width: 100%" show-header>
            <el-table-column type="selection" width="100" align="center"/>
            <el-table-column
              label="序号"
              type="index"
              width="100">
            </el-table-column>
            <el-table-column label="小区id" v-if="false" prop="communityId"/>
            <el-table-column label="报修id" v-if="false" prop="repairId"/>
            <el-table-column label="报修编号" prop="repairNum" show-overflow-tooltip/>
            <el-table-column label="报修状态" align="center" prop="repairState" :formatter="repairStatusFormat"/>
            <el-table-column label="业主姓名" prop="ownerRealName" show-overflow-tooltip/>
            <el-table-column label="业主电话" prop="ownerPhoneNumber" show-overflow-tooltip/>
            <el-table-column label="报修内容" prop="repairContent" show-overflow-tooltip/>
            <el-table-column label="详细地址" prop="address" show-overflow-tooltip/>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="期待上门时间" align="center" prop="doorTime" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.doorTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="处理人姓名" prop="completeName" show-overflow-tooltip/>
            <el-table-column label="备注" prop="remark" show-overflow-tooltip/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="handleUpdate(scope.row),queryAllUser()"
                >查看详情
                </el-button>
                <br>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <!--分页-->
          <el-pagination style="margin-left: 500px" @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="queryParams.pageNum"
                         :page-sizes="pageSizes"
                         :page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </div>
      </el-card>
    </div>

    <!-- 查看详情对话框 -->
    <el-dialog title="报修详情信息" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="queryParams" :model="form" :rules="rule" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="报修编号" prop="repairNum">
              <el-input disabled style="width: 220px" v-model="form.repairNum" placeholder="请输入报修编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修状态" prop="repairState">
              <el-select v-model="form.repairState" placeholder="请选择报修状态" clearable size="small"
                         @clear="getRepairList">
                <el-option
                  v-for="item in repairOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="form.repairState!='Pending'">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="业主姓名" prop="ownerRealName">
              <el-input disabled style="width: 220px" v-model="form.ownerRealName" placeholder="请输入业主姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker
                disabled
                v-model="form.createTime"
                type="datetime"
                clearable
                placeholder="选择创建时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="派单时间" prop="assignmentTime">
              <el-date-picker
                disabled
                v-model="form.assignmentTime"
                type="datetime"
                clearable
                placeholder="选择派单时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接单时间" prop="receivingOrdersTime">
              <el-date-picker
                v-model="form.receivingOrdersTime"
                type="datetime"
                clearable
                placeholder="选择接单时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="处理完成时间" prop="completeTime">
              <el-date-picker
                v-model="form.completeTime"
                type="datetime"
                clearable
                placeholder="处理完成时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="取消时间" prop="cancelTime">
              <el-date-picker
                v-model="form.cancelTime"
                type="datetime"
                clearable
                placeholder="取消时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="期待上门时间" prop="doorTime">
              <el-date-picker
                disabled
                v-model="form.doorTime"
                type="datetime"
                clearable
                placeholder="期待上门时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分派人id" prop="assignmentId">
              <el-input disabled style="width: 220px" v-model="form.assignmentId" placeholder="请输入处理人电话"/>
<!--              <el-select-->
<!--                v-model="form.assignmentId"-->
<!--                placeholder="请选择分派人id"-->
<!--                size="small"-->
<!--                style="width: 220px"-->
<!--                @change="changeUserId()"-->
<!--              >-->
<!--                <el-option-->
<!--                  v-for="dict in userOptions"-->
<!--                  :key="dict.userId"-->
<!--                  :label="dict.userId"-->
<!--                  :value="dict.userId"-->
<!--                />-->
<!--              </el-select>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="处理人姓名" prop="completeName">
              <el-select
                v-model="form.completeName"
                placeholder="请输入处理人姓名"
                size="small"
                style="width: 220px"
                @change="changeUserId()"
              >
                <el-option
                  v-for="dict in userOptions"
                  :key="dict.userName"
                  :label="dict.userName"
                  :value="dict.userName"
                  :disabled="userOptions.status===0||form."
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理人电话" prop="completePhone">
              <el-input disabled style="width: 220px" v-model="form.completePhone" placeholder="请输入处理人电话"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="报修内容" prop="repairContent">
              <el-input disabled style="width: 220px" v-model="form.repairContent" placeholder="请输入报修内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="address">
              <el-input disabled style="width: 220px" v-model="form.address" placeholder="请输入详细地址"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input disabled style="width: 220px" v-model="form.remark" placeholder="请输入备注"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小区id" prop="communityId">
              <el-input disabled style="width: 220px" v-model="form.communityId"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveForm()">修 改</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    import axios from "axios";

    export default {
        name: "Repair",
        data: function () {
            let checkCompletePhone = (rule, value, callback) => {
                // 验证手机号的正则表达式
                const phone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if (phone.test(value)) {
                    return callback()
                }
                return callback(new Error('请输入合法的手机号'))
            };
            return {
                rule: {
                    completePhone: [
                        {validator: checkCompletePhone, trigger: "blur"}
                    ]
                },
                show: false,
                //绑定状态
                Coptions: [{
                    value: 'Pending',
                    label: '待处理'
                }, {
                    value: 'Allocated',
                    label: '已分派'
                }, {
                    value: 'Processing',
                    label: '处理中'
                }, {
                    value: 'Processed',
                    label: '已处理'
                }, {
                    value: 'No_Processed',
                    label: '不处理'
                }, {
                    value: 'Cancelled',
                    label: '已取消'
                }],
                value: '',

                repairOption: [{
                    value: 'Pending',
                    label: '待处理'
                }, {
                    value: 'Allocated',
                    label: '已分派'
                }, {
                    value: 'Processing',
                    label: '处理中'
                }, {
                    value: 'Processed',
                    label: '已处理'
                }, {
                    value: 'No_Processed',
                    label: '不处理'
                }, {
                    value: 'Cancelled',
                    label: '已取消'
                }],
                //多选框勾选数组
                repairIdArr: [],
                //小区下拉框数据
                communityOptions: [],
                //维修人
                DeptPersons: [],
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
                // 报修信息表格数据
                repairList: [],
                //分派人id下拉框数据
                userOptions: [],
                // 弹出层标题
                title: "",
                communityId: "",
                //详情标志，是否显示弹出层
                open: false,
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    repairState: null,
                    assignmentTime: null,
                    receivingOrdersTime: null,
                    completeTime: null,
                    cancelTime: null,
                    doorTime: null,
                    completePhone: null,
                    completeName: null,
                    remark: null,
                    repairContent: null,
                    ownerRealName: null,
                    ownerPhoneNumber: null,
                    address: null,
                    communityId: null,
                },

                // 表单参数
                form: {},
                // 表单校验
                rules: {},
            };
        },
        created() {
            this.getRepairList();
            this.getCommunities();
        },
        methods: {
            //回显修理员数据
            async changeUserId() {
                const {data: res} = await this.$http.get('sysUser/queryUserByUserId?userId=' + this.queryParams.assignmentId);
                console.log(res)
                if (res.errorCode === 200) {
                    this.queryParams.completeName = res.data.nickName;
                    this.queryParams.completePhone = res.data.phonenumber;
                }
            },
            //获取指定维修部员工
            async queryAllUser() {
                const {data: res} = await this.$http.get('sysUser/getUserByDeptAndCommunityId?communityId=' + this.queryParams.communityId);
                console.log("queryAllUser"+res)
                if (res.errorCode === 200) {
                    this.userOptions = res.data;
                }
                this.userOptions = res.data.List;
            },
            /**查询所有小区*/
            async getCommunities() {
                const {data: com} = await this.$http.get('/zyCommunity/selectAll', {
                    params: {
                        communityName: this.queryParams.communityName,
                        communityCode: this.queryParams.communityCode,
                        pageNum: 0,
                        pageSize: 0,
                    }
                });
                if (com.meta.errorCode !== 200) {
                    return this.$message.error(com.meta.errorMsg)
                }
                this.options = com.data.zyCommunityList;
                this.queryParams.communityId = this.communityOptions[0].communityId;
                this.communityId = this.communityOptions[0].communityId
            },

            //时间格式化的方法
            // eslint-disable-next-line no-unused-vars
            dateFormat(row, column, cellValue, index) {
                const daterc = row[column.property]
                if (daterc != null) {
                    let date = new Date(daterc);
                    let year = date.getFullYear();
                    /* 在日期格式中，月份是从0开始，11结束，因此要加0
                     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
                     * */
                    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                    let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                    // 拼接
                    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
                }
            },
            //每页条数改变时触发 选择一页显示多少行
            handleSizeChange(val) {
                this.queryParams.pageNum = 1;
                this.queryParams.pageSize = val;
            },
            //当前页改变时触发 跳转其他页
            handleCurrentChange(val) {
                this.queryParams.pageNum = val;
                this.getlivestockInfo(val);
            },
            getlivestockInfo: async function (num1) {
                this.queryParams.pageNum = num1;
                await this.getRepairList();
            },

            // 类型翻译
            repairStatusFormat(row, column) {
                if (row.repairState === 'Pending') {
                    return '待处理';
                } else if (row.repairState === 'Allocated') {
                    return '已分派';
                } else if (row.repairState === 'Processing') {
                    return '处理中';
                } else if (row.repairState === 'Processed') {
                    return '已处理';
                } else if (row.repairState === 'No_Processed') {
                    return '不处理';
                } else if (row.repairState === 'Cancelled') {
                    return '已取消';
                }
            },

            /** 查询报修信息列表 */
            async getRepairList() {
                this.loading = true;
                //获取页面数据
                const {data: res} = await this.$http.get('zyRepair/getAllRepairs', {
                    params: {
                        pageNum: this.queryParams.pageNum,
                        pageSize: this.queryParams.pageSize,
                        repairState: this.queryParams.repairState,
                        ownerRealName: this.queryParams.ownerRealName,
                        ownerPhoneNumber: this.queryParams.ownerPhoneNumber,
                        communityId: this.queryParams.communityId
                    }
                })
                this.queryParams.pageNum = res.data.pageable.pageNum;
                this.queryParams.pageSize = res.data.pageable.pageSize;
                this.repairList = res.data.repairDtoList;
                this.total = res.data.pageable.total;
                this.loading = false;
            },
            //获取选中的小区
            selectedCommunity(value) {
                this.queryParams.communityId = value;
                this.getRepairList();
                this.communityId = value
            },
            // 取消按钮
            cancel() {
                this.open = false;
                this.reset();
            },
            // 表单重置
            reset() {
                this.form = {
                    repairId: null,
                    repairNum: null,
                    repairState: null,
                    assignmentTime: null,
                    receivingOrdersTime: null,
                    completeTime: null,
                    cancelTime: null,
                    doorTime: null,
                    assignmentId: null,
                    completeId: null,
                    completePhone: null,
                    completeName: null,
                    remark: null,
                    createBy: null,
                    createTime: null,
                    updateBy: null,
                    updateTime: null,
                    userId: null,
                    delFlag: null,
                    repairContent: null,
                    communityId: null,
                    address: null
                };
                this.resetForm("form");
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getRepairList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.resetForm("queryForm");
                this.handleQuery();
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.repairId);
                this.single = selection.length !== 1;
                this.multiple = !selection.length
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                this.value = row.repairState
                this.form = {
                    repairId: row.repairId,
                    repairNum: row.repairNum,
                    repairState: row.repairState,
                    ownerRealName: row.ownerRealName,
                    createTime: row.createTime,
                    assignmentTime: row.assignmentTime,
                    receivingOrdersTime: row.receivingOrdersTime,
                    completeTime: row.completeTime,
                    cancelTime: row.cancelTime,
                    doorTime: row.doorTime,
                    assignmentId: row.assignmentId,
                    completeName: row.completeName,
                    completePhone: row.completePhone,
                    repairContent: row.repairContent,
                    address: row.address,
                    remark: row.remark,
                    communityId: row.communityId
                };
                this.open = true;
                this.title = "报修详细信息";
            },
            /** 提交按钮 */
            saveForm: async function () {
                this.form.repairState = this.value
                const {data: res} = await this.$http.put('zyRepair/updateRepair', this.form);
                if (res.meta.errorCode !== 200) {
                    return this.$message.error(res.meta.errorMsg);
                }
                await this.getRepairList();
                this.reset();
                this.open = false;
                this.$message.success("修改成功");
                this.location.reload();

            },
            /** 删除按钮操作 */
            handleDelete(row) {
                const repairIds = row.repairId || this.ids;
                this.$confirm('是否确认删除报修信息编号为"' + repairIds + '"的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    return this.$http.delete("/zyRepair/deleteRepair", {data: repairIds})
                }).then(() => {
                    this.getRepairList();
                    this.$message.success("删除成功")
                })
            },

            /** 导出按钮操作 */
            handleExport() {
                //设置全局配置信息
                const config = {
                    method: 'get',
                    url: 'zyRepair/getExcel?repairIds=' + this.ids,
                    data: this.ids,
                    responseType: 'blob'
                };
                //发送请求
                axios(config).then(response => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', '报修信息.xls');
                        document.body.appendChild(link);
                        link.click();
                        if (response.data !== null) {
                            this.$message.success("导出成功");
                        }
                    }
                )
            },
        }
    };
</script>

<style scoped>

</style>
