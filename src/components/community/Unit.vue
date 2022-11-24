<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单元名称" prop="unitName">
        <el-input
            v-model="queryParams.unitName"
            placeholder="请输入单元名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单元编号" prop="unitCode">
        <el-input
            v-model="queryParams.unitCode"
            placeholder="请输入单元编号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否有电梯" prop="unitHaveElevator" label-width="120px">
        <el-select v-model="queryParams.unitHaveElevator" placeholder="请选择是否有电梯" clearable size="small">
          <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="所属楼栋" prop="buildingId">
        <el-select v-model="queryParams.buildingId" placeholder="所属楼栋" clearable size="small">
          <el-option
              v-for="item in options"
              :key="item.buildingId"
              :label="item.buildingName"
              :value="item.buildingId">
          </el-option>
        </el-select>
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
        <el-select size="mini" v-model="communityId" placeholder="请选择" style="float: right" @change="changeCommunity">
          <el-option
              v-for="item in communities"
              :key="item.communityId"
              :label="item.communityName"
              :value="item.communityId">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="unitList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center">
      </el-table-column>
      <el-table-column label="单元id" v-if="show" align="center" prop="unitId"/>
      <el-table-column label="小区名称" align="center" prop="communityName"/>
      <el-table-column label="单元编号" align="center" prop="unitCode"/>
      <el-table-column label="楼栋" align="center" prop="buildingName"/>
      <el-table-column label="单元名称" align="center" prop="unitName"/>
      <el-table-column label="层数" align="center" prop="unitLevel"/>
      <el-table-column label="建筑面积" align="center" prop="unitAcreage"/>
      <el-table-column label="是否有电梯" align="center" prop="unitHaveElevator">
        <template slot-scope="scope">
          <DictTag :options="statusOptions" :value="scope.row.unitHaveElevator"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          {{ scope.row.createTime | moment }}
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
    <!-- 添加或修改单元 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="楼栋" prop="buildingId">
          <el-select v-model="form.buildingId" filterable placeholder="请选择楼栋" @change="selectedBuildingId"
                     class="avatar-container right-menu-item hover-effect">
            <el-option
                v-for="item in options"
                :key="item.buildingId"
                :label="item.buildingName"
                :value="item.buildingId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单元名称" prop="unitName">
          <el-input v-model="form.unitName" placeholder="请输入单元名称"/>
        </el-form-item>
        <el-form-item label="层数" prop="unitLevel">
          <el-input v-model="form.unitLevel" placeholder="请输入层数"/>
        </el-form-item>
        <el-form-item label="建筑面积" prop="unitAcreage">
          <el-input v-model="form.unitAcreage" placeholder="请输入建筑面积"/>
        </el-form-item>
        <el-form-item label="是否有电梯" label-width="82px">
          <el-radio-group v-model="form.unitHaveElevator">
            <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
            >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
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
  name: "Unit",
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
      // 单元 表格数据
      unitList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //是否有电梯
      statusOptions: [],
      communities: {},
      communityId: '1338423709557272577',
      //楼栋数组
      options: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 1,
        unitId: null,
        communityId: null,
        buildingId: null,
        unitName: null,
        unitCode: null,
        unitLevel: null,
        unitAcreage: null,
        unitHaveElevator: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        unitName: [
          {required: true, message: "单元名称不能为空", trigger: "blur"}
        ],
        buildingId: [
          {required: true, message: "请选择楼栋", trigger: "blur"}
        ],
        unitLevel: [
          {required: true, message: "层数不能为空", trigger: "blur"},
          {pattern: /^[1-9]\d*$/, message: '请输入正确的整数格式', trigger: "change"}
        ],
        unitHaveElevator: [
          {required: true, message: "是否有电梯不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_yes_no").then(response => {
      this.statusOptions = response.data.data;
    });
    this.getCommunityList();
    this.getBuildingList();
  },
  methods: {
    /** 修改小区id */
    changeCommunity(id) {
      this.communityId = id;
      this.getBuildingList();
      this.getList();
    },
    /** 修改楼栋id */
    selectedBuildingId(id) {
      this.form.buildingId = id;
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
    /** 查询单元 列表 */
    async getList() {
      this.loading = true;
      const {data: res} = await this.$http.get("zyUnit/getUnitList", {
        params: {
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          unitId: this.queryParams.unitId,
          communityId: this.communityId,
          buildingId: this.queryParams.buildingId,
          unitName: this.queryParams.unitName,
          unitCode: this.queryParams.unitCode,
          unitLevel: this.queryParams.unitLevel,
          unitAcreage: this.queryParams.unitAcreage,
          unitHaveElevator: this.queryParams.unitHaveElevator,
        }
      });
      if (res.meta.errorCode !== 200) {
        return res.$message.error(res.meta.errorMsg)
      }
      this.unitList = res.data.unitListDtos;
      this.total = res.data.pageable.total;

      this.loading = false;
    },
    /** 获取楼栋列表 */
    async getBuildingList() {
      this.loading = true
      const {data: res} = await this.$http.get('/zyUnit/getBuildingList', {
        params: {communityId: this.communityId}
      })
      if (res.meta.errorCode !== 200) {
        return res.$message.error(res.meta.errorMsg)
      }
      this.options = res.data;
      this.loading = false;
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
      this.communities = res.data.zyCommunityList;
      this.loading = false
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        unitId: null,
        communityId: null,
        buildingId: null,
        unitName: null,
        unitCode: null,
        unitLevel: null,
        unitAcreage: null,
        unitHaveElevator: "0",
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
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.unitId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getBuildingList();
      this.form.unitHaveElevator="Y"
      this.open = true;
      this.title = "添加单元 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getBuildingList();
      this.form = JSON.parse(JSON.stringify(row));
      this.form.unitId = row.unitId
      this.open = true;
      this.title = "修改单元 ";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          if (this.form.unitId != null) {
            const {data: res} = await this.$http.put("zyUnit/updateUnit", this.form);
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg)
            }
            this.$message.success(res.meta.errorMsg)
            this.open = false
            await this.getList();
          } else {
            const {data: res} = await this.$http.post("zyUnit/insertUnit", this.form);
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg)
            }
            this.$message.success(res.meta.errorMsg)
            this.open = false;
            this.getList();
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let unitIds;
      if (row.unitId !== undefined) {
        unitIds = [row.unitId];
      } else {
        unitIds = this.ids
      }

      this.$confirm('是否确认删除单元 编号为"' + unitIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const {data: res} = await this.$http.delete("zyUnit/deleteUnit", {data: unitIds});
        return res;
      }).then((res) => {
        if (res.meta.errorCode !== 200) {
          return this.$message.error(res.meta.errorMsg)
        }
        this.getList();
        return this.$message.success("删除成功");


      })
    },
    /** 导出按钮操作 */
    handleExport() {
      //设置全局配置信息
      const config = {
        method: 'get',
        url: 'zyUnit/getExcel?unitIds=' + this.ids+"&communityId="+this.communityId,
        responseType: 'blob'
      };
      //发送请求
      // eslint-disable-next-line no-undef
      this.$http(config).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '单元用户.xls');
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
<style scoped>
#app-container{
  overflow: scroll;
}
</style>
