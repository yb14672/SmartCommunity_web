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
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:owner:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ownerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center">
      </el-table-column>
      <el-table-column label="业主id" v-if="show" align="center" prop="ownerId" />
      <el-table-column label="昵称" align="center" prop="ownerNickname" />
      <el-table-column label="真实姓名" align="center" prop="ownerRealName" />
      <el-table-column label="性别" align="center" prop="ownerGender" :formatter="genderStatusFormat"/>
      <el-table-column label="年龄" align="center" prop="ownerAge" />
      <el-table-column label="身份证号码" align="center" prop="ownerIdCard" />
      <el-table-column label="手机号码" align="center" prop="ownerPhoneNumber" />
      <el-table-column label="小区名称" align="center" prop="communityName" />
      <el-table-column label="楼栋名称" align="center" prop="buildingName" />
      <el-table-column label="单元名称" align="center" prop="unitName" />
      <el-table-column label="房间名称" align="center" prop="roomName" />
      <el-table-column label="出生日期" align="center" prop="ownerBirthday" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ownerBirthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业主类型" align="center" prop="ownerType" :formatter="ownerTypeFormat"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-close"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:owner:remove']"
          >解绑</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改业主 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="昵称" prop="ownerNickname">
          <el-input v-model="form.ownerNickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="ownerRealName">
          <el-input v-model="form.ownerRealName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="性别0默认1男2女" prop="ownerGender">
          <el-input v-model="form.ownerGender" placeholder="请输入性别0默认1男2女" />
        </el-form-item>
        <el-form-item label="年龄" prop="ownerAge">
          <el-input v-model="form.ownerAge" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="身份证号码" prop="ownerIdCard">
          <el-input v-model="form.ownerIdCard" placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item label="手机号码" prop="ownerPhoneNumber">
          <el-input v-model="form.ownerPhoneNumber" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="openid" prop="ownerOpenId">
          <el-input v-model="form.ownerOpenId" placeholder="请输入openid" />
        </el-form-item>
        <el-form-item label="微信号" prop="ownerWechatId">
          <el-input v-model="form.ownerWechatId" placeholder="请输入微信号" />
        </el-form-item>
        <el-form-item label="qq号码" prop="ownerQqNumber">
          <el-input v-model="form.ownerQqNumber" placeholder="请输入qq号码" />
        </el-form-item>
        <el-form-item label="出生日期" prop="ownerBirthday">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.ownerBirthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="头像" prop="ownerPortrait">
          <el-input v-model="form.ownerPortrait" placeholder="请输入头像" />
        </el-form-item>
        <el-form-item label="个性签名" prop="ownerSignature">
          <el-input v-model="form.ownerSignature" placeholder="请输入个性签名" />
        </el-form-item>
        <el-form-item label="禁用状态enable启用-disable禁用">
          <el-radio-group v-model="form.ownerStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="注册方式" prop="ownerLogonMode">
          <el-input v-model="form.ownerLogonMode" placeholder="请输入注册方式" />
        </el-form-item>
        <el-form-item label="业主类型" prop="ownerType">
          <el-select v-model="form.ownerType" placeholder="请选择业主类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "Owner",
  data() {
    return {
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
      ownerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ownerNickname: null,
        ownerRealName: null,
        ownerIdCard: null,
        ownerPhoneNumber: null,
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
  // 业主类型字典翻译
    ownerTypeFormat(row, column) {
      return this.selectDictLabel(this.ownerTypeOptions, row.ownerType);
    },
    //性别
    genderStatusFormat(row, column){
      if(row.ownerGender == 'UnKnown'){
         return '未知';
        }else if(row.ownerGender == 'Male'){
          return '男';
        }else if(row.ownerGender == 'Female'){
          return '女';
        }
     },
    /** 查询业主 列表 */
    getList() {
      this.loading = true;
      listOwner(this.queryParams).then(response => {
        this.ownerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
      this.ids = selection.map(item => item.ownerId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加业主 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ownerId = row.ownerId || this.ids
      getOwner(ownerId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改业主 ";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.ownerId != null) {
            updateOwner(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOwner(this.form).then(response => {
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
      const ownerRoomId = row.ownerRoomId;
      this.$confirm('是否确认解绑该业主?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOwner(ownerRoomId);
        }).then(() => {
          this.getList();
          this.msgSuccess("解绑成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有业主 数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportOwner(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
