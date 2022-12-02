<template>
  <div class="app-container">
    <!--搜索表单-->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="车位类型" prop="parkType">
        <el-select v-model="queryParams.parkType" placeholder="车位类型" @change="statusChange()" clearable
                   @clear="statusChange()"
                   size="small">
          <el-option
            v-for="dict in parkingTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车位状态" prop="parkStatus">
        <el-select v-model="queryParams.parkStatus" placeholder="车位状态" @change="statusChange()" clearable
                   @clear="statusChange()"
                   size="small">
          <el-option
            v-for="dict in parkingStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否公共" prop="parkIsPublic">
        <el-select v-model="queryParams.parkIsPublic" placeholder="车位状态" @change="statusChange()" clearable
                   @clear="statusChange()"
                   size="small">
          <el-option
            v-for="dict in publicParkingOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--操作列表-->
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
    <!--数据渲染表格-->
    <el-table v-loading="loading" :data="parkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column v-if="show" label="车位id" align="center" prop="parkId"/>
      <el-table-column label="小区名称" align="center" prop="communityName"/>
      <el-table-column label="车位编号" align="center" prop="parkCode"/>
      <el-table-column label="车位类型" align="center" prop="parkType">
        <template slot-scope="scope">
          <DictTag :options="parkingTypeOptions" :value="scope.row.parkType"/>
        </template>
      </el-table-column>
      <el-table-column label="车位状态" align="center" prop="parkStatus">
        <template slot-scope="scope">
          <DictTag :options="parkingStatusOptions" :value="scope.row.parkStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="是否公共停车位" align="center" prop="parkIsPublic">
        <template slot-scope="scope">
          <DictTag :options="publicParkingOptions" :value="scope.row.parkIsPublic"/>
        </template>
      </el-table-column>
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
    <!-- 添加或修改车位 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item v-if="form.parkCode" label="车位编号" prop="parkType" size="small">
          <el-input v-model="form.parkCode" :disabled="true" style="width: 330px;margin-left: 20px"/>
        </el-form-item>
        <el-form-item label="所在小区" prop="communityId">
          <el-select v-model="form.communityId" placeholder="请选择" size="small" style="width: 330px;margin-left: 20px">
            <el-option
              v-for="item in options"
              :key="item.communityId"
              :label="item.communityName"
              :value="item.communityId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车位类型" prop="parkType">
          <el-select v-model="form.parkType" placeholder="车位类型" clearable size="small" style="width: 330px;margin-left: 20px">
            <el-option
              v-for="dict in parkingTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车位状态" prop="parkStatus">
          <el-select v-model="form.parkStatus" placeholder="车位类型" clearable size="small" style="width: 330px;margin-left: 20px">
            <el-option
              v-for="dict in parkingStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否公共" prop="parkIsPublic">
          <el-select v-model="form.parkIsPublic" placeholder="车位状态" clearable size="small" style="width: 330px;margin-left: 20px">
            <el-option
              v-for="dict in publicParkingOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark" size="small">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" style="width: 330px;margin-left: 20px"/>
        </el-form-item>
        <el-form-item v-if="!form.parkCode" label="添加数量" prop="number" size="small" style="margin-left: 20px">
          <el-input-number :min="1" :max="1000" v-model="form.number"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
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
  </div>
</template>

<script>
export default {
  name: "ParkInfo",
  data() {
    return {
      // 车位类型字典
      parkingTypeOptions: [],
      // 车位是否公共
      publicParkingOptions: [],
      // 车位状态
      parkingStatusOptions: [],
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
      // 车位 表格数据
      parkList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //选中小区
      communityId: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 2,
        parkType: null,
        parkStatus: null,
        parkIsPublic: null,
        communityId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parkStatus: [
          {required: true, message: "车位状态不能为空", trigger: "blur"}
        ],
        parkType: [
          {required: true, message: "车位类型不能为空", trigger: "blur"}
        ],
        parkIsPublic: [
          {required: true, message: "是否公共不能为空", trigger: "blur"}
        ],
        communityId: [
          {required: true, message: "所在小区不能为空", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.getCommunityList().then(() => {
      this.getList();
    });
    this.getDicts("zy_parking_type").then(response => {
      this.parkingTypeOptions = response.data.data;
    });
    this.getDicts("zy_public_parking").then(response => {
      this.publicParkingOptions = response.data.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.parkingStatusOptions = response.data.data;
    });
  },
  methods: {
    /**变换查询状态时时触发*/
    statusChange() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 分页每页多少条数据 */
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getList();
    },
    /** 改变当前页 */
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getList();
    },
    /** 查询车位列表 */
    async getList() {
      this.loading = true;
      const {data: res} = await this.$http.get('/zyPark/', {
        params: {
          current: this.queryParams.pageNum,
          size: this.queryParams.pageSize,
          parkType: this.queryParams.parkType,
          parkStatus: this.queryParams.parkStatus,
          parkIsPublic: this.queryParams.parkIsPublic,
          communityId: this.communityId,
        }
      });
      if (res.meta.errorCode === 1006) {
        this.parkList = [];
        this.total = 0;
        this.loading = false;
        return this.$message.warning(res.meta.errorMsg)
      }
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.parkList = res.data.records;
      this.total = res.data.total;
      this.loading = false
    },
    /** 查小区的信息 */
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
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        parkId:null,
        parkCode:null,
        communityId: '',
        parkType: null,
        parkStatus: null,
        parkIsPublic: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        number:1
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
      this.ids = selection.map(item => item.parkId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加车位 ";
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      const parkId = row.parkId;
      //获取数据
      const {data: res} = await this.$http.get('/zyPark/' + parkId);
      //判断是否执行成功
      if (res.meta.errorCode !== 200) {
        this.$message.error(res.meta.errorMsg)
      } else {
        this.form = JSON.parse(JSON.stringify(res.data))
        this.title = "修改车位";
        this.open = true;
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(async valid => {
        console.log(this.form)
        if (valid) {
          if (this.form.parkId != undefined) {
            delete this.form.number;
            const {data: res} = await this.$http.put('zyPark/updatePark', this.form);
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg)
            }
            this.open = false;
            await this.getList();
            return this.$message.success("修改成功！")
          } else {
            this.form.communityId = this.communityId;
            const {data: res} = await this.$http.post('zyPark/batchInsert', this.form,{
                params:{
                    number:this.form.number
                }
            })
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
      const parkIds = row.parkId || this.ids;
      this.$confirm('是否确认删除楼层编号为"' + parkIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return this.$http.delete(`/zyPark?parkIds=${parkIds}`);
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
