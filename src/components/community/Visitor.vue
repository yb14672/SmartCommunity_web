<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="访客姓名" prop="visitorName">
        <el-input
          v-model="queryParams.visitorName"
          placeholder="请输入访客姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="访客手机号" prop="visitorPhoneNumber" label-width="85px">
        <el-input
          v-model="queryParams.visitorPhoneNumber"
          placeholder="请输入访客手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="到访时间" prop="visitorDate">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.visitorDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择到访时间">
        </el-date-picker>
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
        >导出
        </el-button>
      </el-col>
      <el-col :offset="18" :span="1.5">
        <el-select size="mini" v-model="communityId" placeholder="请选择" @change="changeCommunity">
          <el-option
            v-for="item in communities"
            :key="item.communityId"
            :label="item.communityName"
            :value="item.communityId">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-table :data="visitorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column label="id" v-if="show" align="center" prop="visitorId"/>
      <el-table-column label="访客姓名" align="center" prop="visitorName"/>
      <el-table-column label="访客手机号" align="center" prop="visitorPhoneNumber"/>
      <el-table-column label="小区名称" align="center" prop="communityName"/>
      <el-table-column label="到访时间" align="center" prop="visitorDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.visitorDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="是否允许进入小区" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="float: right"
      :current-page="queryParams.pageNum"
      :page-size="queryParams.pageSize"
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
  name: "Visitor",
  data() {
    return {
      communities: {},
      communityId: '1338423709557272577',
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
      // 访客邀请 表格数据
      visitorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        communityId: '1338423709557272577',
        pageNum: 1,
        pageSize: 10,
        visitorName: null,
        visitorPhoneNumber: null,
        visitorDate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getCommunityList().then(() => {
      this.getList();
    });
  },
  methods: {
    /** 修改小区id */
    changeCommunity(id) {
      this.communityId = id;
      this.queryParams.communityId = id
      this.getList();
    },
    /** 操作：是否允许进入小区 */
    handleStatusChange(row) {
      let text = row.status === "1" ? "允许" : "拒绝";
      this.$confirm('确认"' + text + '""' + row.visitorName + '"进入小区?"', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const {data: res} = await this.$http.put('zyVisitor/updateStatus', row);
        if (res.meta.errorCode !== 200) {
          return this.$message.error(res.meta.errorMsg)
        }
        this.getUserList();
        return this.$message.success(text + "成功");
      })
    },
    /** 查询访客邀请 列表 */
    async getList() {
      this.loading = true;
      const {data: res} = await this.$http.get("zyVisitor/getVisitorList", {
        params: {
          communityId: this.queryParams.communityId,
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          visitorName: this.queryParams.visitorName,
          visitorPhoneNumber: this.queryParams.visitorPhoneNumber,
          visitorDate: this.queryParams.visitorDate,
        }
      });
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.visitorList = res.data.visitorListDtos
      this.total = res.data.pageable.total
      this.loading = false;
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        visitorId: null,
        visitorName: null,
        visitorPhoneNumber: null,
        visitorDate: null,
        createById: null,
        createByOpenId: null,
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
      this.queryParams.pageSize = val;
      this.getList();
    },
    /** 点击切换上下页 */
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getList();
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
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.visitorId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加访客邀请 ";
    },
    /** 获取小区列表 */
    async getCommunityList() {
      this.loading = true;
      const {data: res} = await this.$http.get('/zyCommunity/selectAll', {
        params: {
          pageNum: 0,
          pageSize: 0,
          communityName: '',
        }
      });
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.communityId = res.data.zyCommunityList[0].communityId
      this.communities = res.data.zyCommunityList;
      this.loading = false
    },
    /** 导出按钮操作 */
    handleExport() {
      //设置全局配置信息
      const config = {
        method: 'get',
        url: 'zyVisitor/getExcel?visitorIds=' + this.ids + "&communityId=" + this.communityId,
        responseType: 'blob'
      };
      //发送请求
      // eslint-disable-next-line no-undef
      this.$http(config).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', '访客信息.xls');
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
