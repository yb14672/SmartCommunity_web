<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input
            v-model="queryParams.ipaddr"
            placeholder="请输入登录地址"
            clearable
            style="width: 240px;"
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            style="width: 240px;"
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="登录状态"
            clearable
            size="small"
            style="width: 240px"
        >
          <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="登录时间">
        <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['monitor:logininfor:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleClean"
            v-hasPermi="['monitor:logininfor:remove']"
        >清空
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['system:logininfor:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="访问编号" align="center" prop="infoId"/>
      <el-table-column label="用户名称" align="center" prop="userName"/>
      <el-table-column label="登录地址" align="center" prop="ipaddr" width="130" :show-overflow-tooltip="true"/>
      <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true"/>
      <el-table-column label="浏览器" align="center" prop="browser"/>
      <el-table-column label="操作系统" align="center" prop="os"/>
      <el-table-column label="登录状态" align="center" prop="status">
        <template slot-scope="scope">
          <DictTag :options="statusOptions" :value="scope.row.status"/>
        </template>
<!--        <template slot-scope="scope" v-for="item in statusOptions">-->
<!--          <div :key="item.dictCode" v-if="item.dictValue==scope.row.status">-->
<!--            <el-tag :type="item.listClass">-->
<!--              {{ statusFormat(scope.row) }}-->
<!--            </el-tag>-->
<!--          </div>-->
<!--          <div :key="item.dictCode" v-else>-->
<!--            <el-tag>-->
<!--              {{ statusFormat(scope.row) }}-->
<!--            </el-tag>-->
<!--          </div>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column label="操作信息" align="center" prop="msg"/>
      <el-table-column label="登录日期" align="center" prop="loginTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.loginTime | moment }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="queryParams.pageNum"
                   :page-sizes="[10, 20, 50, 80]"
                   :page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginInfo",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ipaddr: undefined,
        userName: undefined,
        status: undefined
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_common_status").then(response => {
      this.statusOptions = response.data.data;
    });
  },
  methods: {
    /** 查询登录日志列表 */
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getList();
    },
    /** 查询登录日志列表 */
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getList();
    },
    /** 查询登录日志列表 */
    async getList() {
      this.loading = true;
      const {data: res} = await this.$http.get("/sysLogininfor/queryLoginInfor", {
        params: {
          ipaddr: this.queryParams.ipaddr,
          userName: this.queryParams.userName,
          status: this.queryParams.status,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1],
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
        }
      })
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg);
      }
      this.list = res.data.logininforList
      this.queryParams.pageNum = res.data.pageable.pageNum
      this.total = res.data.pageable.total
      this.loading = false
    },
    /** 登录状态字典翻译 */
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.infoId)
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const infoIds = row.infoId || this.ids;
      this.$confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await this.$http.delete("/sysLogininfor/deleteByIds", {data: infoIds})
      }).then(() => {
        this.getList();
        this.$message.success("删除成功");
      })
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm('是否确认清空所有登录日志数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await this.$http.delete("/sysLogininfor/EmptyLogininfor");
      }).then(() => {
        this.getList();
        this.$message.success("清空成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      //设置全局配置信息
      const config = {
        method: 'post',
        url: 'sysLogininfor/getExcel',
        data: this.ids,
        responseType: 'blob'
      };
      this.$confirm('是否确认导出所有操作日志数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //发送请求
        // eslint-disable-next-line no-undef
        axios(config).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', '登录日志.xls');
          document.body.appendChild(link);
          link.click();
          if (response.data !== null) {
            this.$message.success("导出成功");
          }
        })
      })
    },
  }
};
</script>

