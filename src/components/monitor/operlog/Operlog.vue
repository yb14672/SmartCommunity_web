<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
             label-width="68px">
      <el-form-item label="系统模块" prop="title">
        <el-input
            v-model="queryParams.title"
            placeholder="请输入系统模块"
            clearable
            style="width: 240px;"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="operName">
        <el-input
            v-model="queryParams.operName"
            placeholder="请输入操作人员"
            clearable
            style="width: 240px;"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="businessType">
        <el-select
            v-model="queryParams.businessType"
            placeholder="操作类型"
            clearable
            style="width: 240px"
        >
          <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="操作状态"
            clearable
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
      <el-form-item label="操作时间">
        <el-date-picker
            v-model="dateRange"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"

        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="handleClean"
        >清空
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['monitor:operlog:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange ">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="日志编号" align="center" prop="operId"/>
      <el-table-column label="系统模块" align="center" prop="title"/>
      <el-table-column label="操作类型" :formatter="businessTypeFormat" align="center" prop="businessType">
        <template slot-scope="scope">
          <DictTag :options="typeOptions" :value="scope.row.businessType"/>
        </template>
      </el-table-column>
      <el-table-column label="请求方式" align="center" prop="requestMethod"/>
      <el-table-column label="操作人员" align="center" prop="operName" width="100" :show-overflow-tooltip="true"/>
      <el-table-column label="操作地址" align="center" prop="operIp" width="130" :show-overflow-tooltip="true"/>
      <el-table-column label="操作地点" align="center" prop="operLocation" :show-overflow-tooltip="true"/>
      <el-table-column label="操作状态" :formatter="statusFormat" align="center" prop="status">
        <template slot-scope="scope">
          <DictTag :options="statusOptions" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作日期"
                       align="center"
                       prop="operTime"
                       width="180">

        <template slot-scope="scope">
          <span>{{ scope.row.operTime |moment }}</span>
        </template>
      </el-table-column>


      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleView(scope.row,scope.index)"
          >详细
          </el-button>
        </template>
      </el-table-column>

      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryParams.pageNum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="this.total">
      </el-pagination>
      <!-- 操作日志详细 -->
      <el-dialog title="操作日志详细" :visible.sync="open" width="700px" append-to-body>
        <el-form ref="form" :model="form" label-width="100px" size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
              <el-form-item
                  label="登录信息："
              >{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
              <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作状态：" :formatter="statusFormat">
                <div v-if="form.status === 0">正常</div>
                <div v-else-if="form.status === 1">失败</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作时间：">{{ form.operTime | moment }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="open = false">关 闭</el-button>
        </div>
      </el-dialog>
    </el-table>


    <div align="right" class="block">
      <el-pagination
          :current-page="queryParams.pageNum"
          :page-size="queryParams.pageSize"
          :page-sizes="[1, 2, 5, 10]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
    </div>
  </div>


</template>

<script>



export default {
  name: "Operlog",
  data() {
    return {
      defaultSort: {prop: 'operTime', order: 'descending'},
      //字典放值
      businessTypeList: [],
      statusList: [],
      typeOptions: [],
      statusOptions: [],
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
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 默认排序
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined,
        startTime: '',
        endTime: '',
        orderByColumn: '',
        isAsc: '',
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_oper_type");
    this.getStatus("sys_common_status");
  },
  methods: {

    businessTypeFormat(row) {
      return this.selectDictLabel(this.typeOptions, row.businessType);
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },

    async getStatus(logType) {
      const {data: res} = await this.$http.get(`sysDictData/getDict?dictType=${logType}`);
      this.statusOptions = res.data;
    },

    async getDicts(logType) {
      const {data: res} = await this.$http.get(`sysDictData/getDict?dictType=${logType}`);
      this.typeOptions = res.data;
    },
    /** 查询登录日志 */
    async getList() {
      this.queryParams.startTime = this.dateRange[0];
      this.queryParams.endTime = this.dateRange[1];
      this.loading = true;
      const {data: res} = await this.$http.get("sysOperLog/getOperLogList", {
        params: {
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          title: this.queryParams.title,
          operName: this.queryParams.operName,
          businessType: this.queryParams.businessType,
          status: this.queryParams.status,
          startTime: this.queryParams.startTime,
          endTime: this.queryParams.endTime,
          orderByColumn: this.queryParams.orderByColumn,
          isAsc: this.orderByColumn
        }
      });
      if (res.meta.errorCode !== 200) {
        return res.$message.error("获取列表失败")
      }
      this.list = res.data.sysOperLogs;
      this.total = res.data.pageable.total;
      this.loading = false;
    },
    // 操作日志类型字典翻译
    typeFormat(row) {
      // return this.selectDictLabel( this.getDicts("sys_oper_type"), row.businessType);
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
      this.queryParams.pageNum = 1;
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
      this.getList();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.operId)
      this.multiple = !selection.length
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 删除按钮操作 */
    async handleDelete(row) {
      const operIds = row.operId || this.ids;
      this.$confirm('是否确认删除日志编号为"' + operIds + '"的数据项？', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 通过方法？带参
        this.$http.delete(`/sysOperLog/deleteLog?idList=${operIds}`)
            .then((res) => {
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
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm('是否确认清空所有操作日志数据项？', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 通过方法？带参
        this.$http.delete("sysOperLog/deleteLog?idList=" + this.ids)
            .then((res) => {
              if (res.data.meta.errorCode === 200) {
                // 重新获取页面
                this.getList();
                this.$message.success("清空成功");
              } else {
                this.$message.warning(res.data.meta.errorMsg);
              }
            })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      //设置全局配置信息
      const config = {
        method: 'get',
        url: 'sysOperLog/getExcel?operLogIds='+this.ids,
        responseType: 'blob'
      };
      //发送请求
      // eslint-disable-next-line no-undef
      this.$http(config).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '操作日志.xls');
            document.body.appendChild(link);
            link.click();
            if (response.data !== null) {
              this.$message.success("导出成功");
            }
          }
      )
    },
    /** 每页显示的条数 */
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.queryParams.pageSize = val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 显示第几页 */
    handleCurrentChange(val) {
      // 改变默认的页数
      this.queryParams.pageNum = val
      this.getList()
    },
  }
};
</script>

