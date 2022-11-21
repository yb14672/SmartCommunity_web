<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="绑定状态" prop="roomStatus">
        <el-select v-model="queryParams.roomStatus" placeholder="请选择绑定状态" clearable size="small">
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

    <el-table v-loading="loading" :data="roomList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
                  label="序号"
                  type="index"
                  width="50"
                  align="center">
              </el-table-column>
      <el-table-column v-if="show" label="房屋绑定id" align="center" prop="ownerRoomId" />
      <el-table-column label="小区名称" align="center" prop="communityName" />
      <el-table-column label="楼栋名称" align="center" prop="buildingName" />
      <el-table-column label="单元名称" align="center" prop="unitName" />
      <el-table-column label="房间名称" align="center" prop="roomName" />
      <el-table-column label="业主姓名" align="center" prop="ownerRealName" />
      <el-table-column label="业主类型" align="center" prop="ownerType" :formatter="ownerTypeFormat" />
      <el-table-column label="绑定状态" align="center" prop="roomStatus" :formatter="bindingStatusFormat"/>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <el-button v-if="scope.row.roomStatus === 'Auditing'"
            size="mini"
            type="text"
            icon="el-icon-thumb"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:ownerRoom:remove']"
          >审核</el-button>
          <el-button v-if="scope.row.roomStatus !== 'Auditing'"
                      size="mini"
                      type="text"
                      icon="el-icon-s-fold"
                      @click="handleLook(scope.row)"
                      v-hasPermi="['system:ownerRoom:remove']"
                    >审核记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->

    <!-- 审核记录全过程 -->
   <el-dialog :title="title" :visible.sync="examineRecord" width="800px" append-to-body>
      <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column
                  label="序号"
                  type="index"
                  width="50"
                  align="center">
      </el-table-column>
      <el-table-column label="业主姓名" align="center" prop="ownerRealName" />
      <el-table-column label="业主类型" align="center" prop="ownerType" :formatter="ownerTypeFormat" />
      <el-table-column label="绑定状态" align="center" prop="roomStatus" :formatter="bindingStatusFormat"/>
      <el-table-column label="审核意见" align="center" prop="recordAuditOpinion" />
      <el-table-column label="审核人姓名" align="center" prop="createByName" />
      <el-table-column label="审核人类型" align="center" prop="recordAuditType" :formatter="reviewerStatusFormat"/>
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>

   </el-dialog>
    <!-- 添加或修改房屋绑定 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="审核意见" prop="recordAuditOpinion">
          <el-input type="textarea" v-model="form.recordAuditOpinion" placeholder="请输入审核意见" />
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
      },{
        value: 'Binding',
        label: '已绑定'
      },{
        value: 'Reject',
        label: '已拒绝'
      }],

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
      roomList: [],
      //记录ID
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //审核记录全过程弹出层
      examineRecord: false,
      // 业主类型字典
      ownerTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ownerType: null,
        roomStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {

      }
    };
  },
  created() {
    this.getList();
    this.getDicts("zy_owner_state").then(response => {
      this.ownerTypeOptions = response.data;
    });
  },
  methods: {
    // 房屋状态字典翻译
      bindingStatusFormat(row, column) {
          if(row.roomStatus == 'Auditing'){
            return '审核中';
          }else if(row.roomStatus == 'Binding'){
            return '已绑定';
          }else if(row.roomStatus == 'Reject'){
            return '已拒绝';
          }else if(row.roomStatus == 'Unbind'){
            return '已揭榜';
          }
       },
      reviewerStatusFormat(row, column){
        if(row.recordAuditType == 'Web'){
            return '物业';
           }else if(row.recordAuditType == 'App'){
            return '业主';
        }
      },
    /** 查询房屋绑定列表 */
    getList() {

    },
    // 业主类型字典翻译
    ownerTypeFormat(row, column) {
      return this.selectDictLabel(this.ownerTypeOptions, row.ownerType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ownerRoomId: null,
        communityId: null,
        buildingId: null,
        unitId: null,
        roomId: null,
        ownerId: null,
        ownerType: null,
        roomStatus: null,
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
      this.ids = selection.map(item => item.ownerRoomId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加房屋绑定 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = row;
      this.open = true;
      this.title = "审核 ";
    },
    /** 审核记录按钮操作 */
    handleLook(row) {
      this.reset();
      this.form = row;
      this.examineRecord = true;
      getRoom(row.ownerRoomId).then(response => {
         this.recordList = response.rows;
         this.total = response.total;
         this.loading = false;
        });
      this.title = "审核记录全过程 ";
    },
    /** 提交按钮 */
    submitForm(type) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.ownerRoomId != null) {
           // this.form.roomStatus = type;
            let data = {
                ownerRoomId: this.form.ownerRoomId,
                recordAuditOpinion: this.form.recordAuditOpinion,
               roomStatus: type,
             };
            updateRoom(data).then(response => {
              console.log(response);
              this.msgSuccess("审核成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRoom(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ownerRoomIds = row.ownerRoomId || this.ids;
      this.$confirm('是否确认删除房屋绑定 编号为"' + ownerRoomIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRoom(ownerRoomIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有房屋绑定 数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRoom(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
