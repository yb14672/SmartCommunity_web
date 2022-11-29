<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="楼栋名称" prop="buildingName">
        <el-input
            v-model="queryParams.buildingName"
            placeholder="请输入楼栋名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="楼栋编码" prop="buildingCode">
        <el-input
            v-model="queryParams.buildingCode"
            placeholder="请输入楼栋编码"
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
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5" :offset="14">
        <!--下拉框，选小区的-->
        <el-select size="mini" v-model="communityId" placeholder="请选择" @change="getList()">
          <el-option
              v-for="item in options"
              :key="item.communityId"
              :label="item.communityName"
              :value="item.communityId">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="buildingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center">
      </el-table-column>
      <el-table-column v-if="show" label="楼栋id" align="center" prop="buildingId"/>
      <el-table-column label="楼栋名称" align="center" prop="buildingName"/>
      <el-table-column label="楼栋编码" align="center" prop="buildingCode"/>
      <el-table-column label="楼栋面积" align="center" prop="buildingAcreage"/>
      <el-table-column label="小区名称" align="center" prop="communityName"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | moment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
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
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改楼栋 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="楼栋名称" prop="buildingName">
          <el-input v-model="form.buildingName" placeholder="请输入楼栋名称"/>
        </el-form-item>

        <el-form-item label="楼栋面积" prop="buildingAcreage">
          <el-input v-model="form.buildingAcreage" placeholder="请输入楼栋面积"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
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
  </div>
</template>

<script>


export default {
  name: "Building",
  data() {
    return {
      // 选择小区
      options: [],
      //是否显示
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
      // 楼栋 表格数据
      buildingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //选中小区
      communityId: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        buildingId: null,
        buildingName: null,
        buildingCode: null,
        buildingAcreage: null,
        communityId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        buildingName: [
          {required: true, message: "楼栋名称不能为空", trigger: "blur"}
        ],
        buildingAcreage: [
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '请输入正确格式,可保留两位小数',
            trigger: "change"
          },
          {required: true, message: "楼栋面积不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getCommunityList();
    this.getList();
  },
  methods: {
    // 分页每页多少条数据
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getList();
    },
    /** 查询楼栋 列表 */
    async getList() {
      this.loading = true;
      const {data: res} = await this.$http.get('/zyBuilding/selectBuildLimit', {
        params: {
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          buildingName: this.queryParams.buildingName,
          buildingCode: this.queryParams.buildingCode,
          communityId: this.communityId,
        }
      });
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.buildingList = res.data.zyBuildingList;
      this.total = res.data.pageable.total;
      this.loading = false
    },
    // 查小区的信息
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
      this.options = res.data.zyCommunityList;
      this.communityId = res.data.zyCommunityList[0].communityId;
      this.loading = false
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        buildingId: null,
        buildingName: null,
        buildingCode: null,
        buildingAcreage: null,
        communityId: '',
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
      this.ids = selection.map(item => item.buildingId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加楼栋 ";
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      const buildingId = row.buildingId || this.ids;
      //获取数据
      const {data: res} = await this.$http.get('/zyBuilding/' + buildingId);
      //判断是否执行成功
      if (res.meta.errorCode !== 200) {
        this.$message.error(res.meta.errorMsg)
      } else {
        this.form = JSON.parse(JSON.stringify(res.data))
        this.title = "修改楼栋";
        this.open = true;
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          if (this.form.buildingId != undefined) {
            const {data: res} = await this.$http.put('zyBuilding/updateZyBuilding', this.form);
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg)
            }
            this.open = false;
            await this.getList();
            return this.$message.success("修改成功！")
          } else {
            this.form.communityId = this.communityId;
            const {data: res} = await this.$http.post('zyBuilding/addZyBuilding', this.form)
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg)
            }
            this.open = false;
            await this.getList();
            return this.$message.success("添加成功！")
          }
        }
      });
    },
    /** 删除按钮操作  */
    handleDelete(row) {
      const buildingIds = row.buildingId || this.ids;
      this.$confirm('是否确认删除楼层编号为"' + buildingIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return this.$http.delete(`/zyBuilding?idList=${buildingIds}`);
      }).then((res) => {
        if (res.data.meta.errorCode !== 200) {
          return this.$message.error(res.data.meta.errorMsg);
        }
        this.getList();
        this.$message.success("删除成功")
      })
    },
    /** 导出按钮操作  */
    handleExport() {
      //设置全局配置信息
      const config = {
        method: 'get',
        url: 'zyBuilding/getExcel?buildingIds=' + this.ids + "&communityId=" + this.communityId,
        responseType: 'blob'
      };
      //发送请求
      // eslint-disable-next-line no-undef
      this.$http(config).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '楼栋信息.xls');
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
