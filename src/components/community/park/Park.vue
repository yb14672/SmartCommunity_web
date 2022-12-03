<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="昵称" prop="ownerNickname">
        <el-input
          v-model="queryParams.ownerNickname"
          placeholder="请输入昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="真实姓名" prop="ownerRealName">
        <el-input
          v-model="queryParams.ownerRealName"
          placeholder="请输入真实姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号码" prop="ownerIdCard" label-width="82px">
        <el-input
          v-model="queryParams.ownerIdCard"
          placeholder="请输入身份证号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="ownerPhoneNumber">
        <el-input
          v-model="queryParams.ownerPhoneNumber"
          placeholder="请输入手机号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" :offset="20">
        <el-select v-model="queryParams.communityId" @change="selectedCommunity(queryParams.communityId)"
                   style="border: 0;position: relative;" filterable placeholder="请选择小区"
                   class="avatar-container right-menu-item hover-effect" size="mini" value="">
          <el-option
            v-for="item in options"
            :key="item.communityId"
            :label="item.communityName"
            :value="item.communityId">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:owner:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="parkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column label="业主id" v-if="show" align="center" prop="ownerId"/>
      <el-table-column label="车位id" v-if="show" align="center" prop="parkId"/>
      <el-table-column label="昵称" align="center" prop="ownerNickname"/>
      <el-table-column label="真实姓名" align="center" prop="ownerRealName"/>
      <el-table-column label="性别" align="center" prop="ownerGender" :formatter="genderStatusFormat"/>
      <el-table-column label="年龄" align="center" prop="ownerAge"/>
      <el-table-column label="身份证号码" align="center" prop="ownerIdCard"/>
      <el-table-column label="手机号码" align="center" prop="ownerPhoneNumber"/>
      <el-table-column label="小区名称" align="center" prop="communityName"/>
      <el-table-column label="车位编号" align="center" prop="parkCode"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车位类型" align="center" prop="parkType" :formatter="parkTypeFormat">
        <template slot-scope="scope">
          <DictTag :options="parkTypeOptions" :value="scope.row.parkType"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-close"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:owner:remove']"
          >解绑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="float: right"
      :current-page="queryParams.current"
      :page-size="queryParams.size"
      :page-sizes="[1, 2, 5, 10]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>

</template>

<script>

    export default {
        name: "Owner",
        data() {
            return {
                // 小区列表
                options: [],
                parkTypeOptions: [],
                show: false,
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
                // 业主 表格数据
                parkList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 查询参数
                queryParams: {
                    pages: 1,
                    Size: 10,
                    ownerNickname: null,
                    ownerRealName: null,
                    ownerIdCard: null,
                    ownerPhoneNumber: null,
                },
                // 表单参数
                form: {},
                // 表单校验
                rules: {}
            };
        },
        created() {
            this.getList();
            this.getDicts("zy_parking_type").then(response => {
                this.parkTypeOptions = response.data.data;
            });
            // 查询所有小区
            this.getCommunities().then(()=>{
                this.getList();
            });
        },
        methods: {
            /**查询所有小区*/
            async getCommunities() {
                const {data: com} = await this.$http.get('/zyCommunity/selectAll', {
                    params: {
                        pageNum: 0,
                        pageSize: 0,
                    }
                });
                if (com.meta.errorCode !== 200) {
                    return this.$message.error(com.meta.errorMsg)
                }
                this.options = com.data.zyCommunityList;
                console.log(this.options)
                this.queryParams.communityId = this.options[0].communityId;
                this.communityId = this.options[0].communityId
            },
            /**变换查询小区时触发*/
            selectedCommunity(value) {
                this.queryParams.communityId = value
                this.queryParams.pageNum = 1
                this.communityId = value
                this.getList();
            },
            // 业主类型字典翻译
            parkTypeFormat(row) {
                return this.selectDictLabel(this.parkTypeOptions, row.parkType);
            },
            async getOwenType(deptType) {
                const {data: res} = await this.$http.get(`sysDictData/getDict?dictType=${deptType}`);
                this.parkTypeOptions = res.data;
            },

            //性别
            genderStatusFormat(row) {
                if (row.ownerGender == 'UnKnown') {
                    return '未知';
                } else if (row.ownerGender == 'Male') {
                    return '男';
                } else if (row.ownerGender == 'Female') {
                    return '女';
                }
            },
            /** 查询业主 列表 */
            async getList() {
                const {data: res} = await this.$http.get("zyOwnerPark/getOwnerParkList", {
                    params: {
                        current: this.queryParams.current,
                        size: this.queryParams.size,
                        ownerNickname: this.queryParams.ownerNickname,
                        ownerRealName: this.queryParams.ownerRealName,
                        ownerIdCard: this.queryParams.ownerIdCard,
                        ownerPhoneNumber: this.queryParams.ownerPhoneNumber,
                        communityId:this.queryParams.communityId
                    }
                });
                if (res.meta.errorCode !== 200) {
                    return this.$message.error(res.meta.errorMsg)
                }
                this.parkList = res.data.records;
                console.log(this.parkList)
                this.total = res.data.total;

            },
            // 取消按钮
            cancel() {
                this.open = false;
                this.reset();
            },
            // 表单重置
            reset() {
                this.form = {
                    ownerId: null,
                    ownerNickname: null,
                    ownerRealName: null,
                    ownerGender: null,
                    ownerAge: null,
                    ownerIdCard: null,
                    ownerPhoneNumber: null,
                    ownerOpenId: null,
                    ownerWechatId: null,
                    ownerQqNumber: null,
                    ownerBirthday: null,
                    ownerPortrait: null,
                    ownerSignature: null,
                    ownerStatus: "0",
                    ownerLogonMode: null,
                    ownerType: null,
                    ownerPassword: null,
                    createBy: null,
                    createTime: null,
                    updateBy: null,
                    updateTime: null,
                    remark: null
                };
                this.resetForm("form");
            },


            /** 分页每页多少条数据 */
            handleSizeChange(val) {
                this.queryParams.size = val;
                this.getList();
            },
            /** 点击切换上下页 */
            handleCurrentChange(val) {
                this.queryParams.current = val;
                this.getList();
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pages = 1;
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.resetForm("queryForm");
                this.handleQuery();
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.ownerParkId)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },
            /** 新增按钮操作 */
            handleAdd() {
                this.reset();
                this.open = true;
                this.title = "添加业主 ";
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                const ownerParkId = row.ownerParkId;
                this.$confirm('是否确认解绑该业主?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(async () => {
                    const {data: res} = await this.$http.delete('zyOwnerPark/deleteOwnerPark?ownerParkId='+ownerParkId);
                    if (res.meta.errorCode !== 200) {
                        return this.$message.error(res.meta.errorMsg)
                    }
                    await this.getList()
                    return this.$message.success(res.meta.errorMsg)
                })
            },
            /** 导出按钮操作 */
            handleExport() {
                //设置全局配置信息
                const config = {
                    method: 'get',
                    url: 'zyOwnerPark/export?ids=' + this.ids + "&communityId=" + this.communityId,
                    responseType: 'blob'
                };
                //发送请求
                // eslint-disable-next-line no-undef
                this.$http(config).then(response => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', '车位信息.xls');
                        document.body.appendChild(link);
                        link.click();
                        if (response.data !== null) {
                            this.$message.success("导出成功");
                        }
                    }
                )
            }
        }
    };
</script>
