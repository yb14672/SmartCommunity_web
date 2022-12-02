<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="绑定状态" prop="parkOwnerStatus">
        <el-select v-model="queryParams.parkOwnerStatus" placeholder="请选择绑定状态" clearable size="small">
          <el-option
            v-for="item in bindingOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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

    <el-table v-loading="loading" :data="parkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column v-if="show" label="房屋绑定id" align="center" prop="ownerParkId"/>
      <el-table-column label="小区名称" align="center" prop="communityName"/>
      <el-table-column label="车位编号" align="center" prop="parkCode"/>
      <el-table-column label="车位类型" align="center" prop="parkType" :formatter="ownerTypeFormat">
        <template slot-scope="scope">
          <DictTag :options="parkingTypeOptions" :value="scope.row.parkType"/>
        </template>
      </el-table-column>
      <el-table-column label="是否公共停车位" align="center" prop="parkIsPublic" :formatter="ownerTypeFormat">
        <template slot-scope="scope">
          <DictTag :options="publicParkingOptions" :value="scope.row.parkIsPublic"/>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="createBy"/>
      <el-table-column label="车牌号" align="center" prop="carNumber"/>
      <el-table-column label="绑定状态" align="center" prop="parkOwnerStatus" :formatter="bindingStatusFormat"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.parkOwnerStatus === 'Auditing'"
                     size="mini"
                     type="text"
                     icon="el-icon-thumb"
                     @click="handleUpdate(scope.row)"
          >审核
          </el-button>
          <el-button v-if="scope.row.parkOwnerStatus !== 'Auditing'"
                     size="mini"
                     type="text"
                     icon="el-icon-s-fold"
                     @click="handleLook(scope.row)"
          >审核记录
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="block" align="right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!-- 审核记录全过程 -->
    <el-dialog :title="title" :visible.sync="examineRecord" width="1000px" append-to-body>
      <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
        <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column label="车位编号" align="center" prop="parkCode"/>
        <el-table-column label="小区名称" align="center" prop="communityName"/>
        <el-table-column label="车位类型" align="center" prop="parkType" :formatter="ownerTypeFormat">
          <template slot-scope="scope">
            <DictTag :options="parkingTypeOptions" :value="scope.row.parkType"/>
          </template>
        </el-table-column>
        <el-table-column label="车位状态" align="center" prop="parkStatus">
          <template slot-scope="scope">
            <DictTag :options="parkingStatusOptions" :value="scope.row.parkStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="是否公共停车位" align="center" prop="parkIsPublic" :formatter="ownerTypeFormat">
          <template slot-scope="scope">
            <DictTag :options="publicParkingOptions" :value="scope.row.parkIsPublic"/>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" prop="updateBy"/>
        <el-table-column label="车牌号" align="center" prop="carNumber"/>
        <el-table-column label="审核时间" align="center" prop="updateTime"/>
        <el-table-column label="绑定状态" align="center" prop="parkBundingStatus" :formatter="bindingStatusFormat"/>
        <el-table-column label="记录审计意见" align="center" prop="recordAuditOpinion"/>
        <el-table-column label="备注" align="center" prop="remark"/>
      </el-table>
    </el-dialog>
    <!-- 审核车位 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="审核意见" prop="recordAuditOpinion">
          <el-input type="textarea" v-model="form.recordAuditOpinion" placeholder="请输入审核意见"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('Binding')">同 意</el-button>
        <el-button @click="submitForm('Reject')">拒 绝</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "Room",
  data() {
    return {
      //绑定状态
      bindingOption: [{
        value: 'Auditing',
        label: '审核中'
      }, {
        value: 'Binding',
        label: '已绑定'
      }, {
        value: 'Reject',
        label: '已拒绝'
      }],
      // 小区列表
      options: [],
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
      // 房屋绑定 表格数据
      parkList: [],
      //记录ID
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //审核记录全过程弹出层
      examineRecord: false,
      // 车位类型字典
      parkingTypeOptions: [],
      // 车位是否公共
      publicParkingOptions: [],
      // 车位状态
      parkingStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ownerType: null,
        parkOwnerStatus: null,
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
      this.parkingTypeOptions = response.data.data;
    });
    this.getDicts("zy_public_parking").then(response => {
      this.publicParkingOptions = response.data.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.parkingStatusOptions = response.data.data;
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
    // 分页每页多少条数据
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getList();
    },
    // 房屋状态字典翻译
    bindingStatusFormat(row,column) {
      if (row.parkOwnerStatus == 'Auditing') {
        return '审核中';
      } else if (row.parkOwnerStatus == 'Binding') {
        return '已绑定';
      } else if (row.parkOwnerStatus == 'Reject') {
        return '已拒绝';
      } else if (row.parkOwnerStatus == 'Unbind') {
        return '已解绑';
      } else if (row.parkBundingStatus == 'Auditing') {
        return '审核中';
      } else if (row.parkBundingStatus == 'Binding') {
        return '已绑定';
      } else if (row.parkBundingStatus == 'Reject') {
        return '已拒绝';
      } else if (row.parkBundingStatus == 'Unbind') {
        return '已解绑';
      }
    },
    async getList() {
      this.loading = true;
      const {data: res} = await this.$http.get('/zyOwnerPark/selectAllParkLimit', {
        params: {
          current: this.queryParams.pageNum,
          size: this.queryParams.pageSize,
          //搜索
          parkOwnerStatus: this.queryParams.parkOwnerStatus,
          communityId:this.queryParams.communityId
        }
      });
      if (res.data === "没有符合条件的数据") {
        this.parkList = [];
        this.total = 0;
        this.loading = false
        return this.$message.warning("没有符合条件的数据")
      }
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.parkList = res.data.records;
      this.total = res.data.total;
      this.loading = false
    },
    // 业主类型字典翻译
    ownerTypeFormat(row, column) {
      return this.selectDictLabel(this.parkingTypeOptions, row.ownerType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ownerParkId: null,
        communityId: null,
        parkCode: null,
        parkType: null,
        parkIsPublic: null,
        parkOwnerStatus: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
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
      this.title = "添加房屋绑定";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = row;
      this.open = true;
      this.title = "审核";
    },
    /** 审核记录按钮操作 */
    async handleLook(row) {
      this.reset();
      this.form = row;
      this.examineRecord = true;
      const {data: res} = await this.$http.get("zyOwnerParkRecord/selectOwnerParkById", {
        params: {
          //把id带给后端查询字段
          ownerParkId: row.ownerParkId,
        }
      });
      this.recordList = res.data;
      this.title = "审核车位记录全过程 ";
    },
    /** 提交按钮  */
    submitForm(type) {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          if (this.form.ownerParkId != null) {
            // 修改业主审核的状态为审核失败
            const {data: res} = await this.$http.put('zyOwnerPark/updateOwnerParkStatus', this.form, {
              params: {
                status: type,
                recordAuditOpinion: this.form.recordAuditOpinion,
                updateBy: this.form.updateBy,
              }
            });
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg)
            }
            this.open = false;
            await this.getList();
            return this.$message.success("修改成功！")
          }
        }
      });
    },
  }
};
</script>
