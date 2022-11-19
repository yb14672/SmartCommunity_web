<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="小区名称" prop="communityName">
        <el-input
            v-model="queryParams.communityName"
            placeholder="请输入小区名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="小区编码" prop="communityCode">
        <el-input
            v-model="queryParams.communityCode"
            placeholder="请输入小区编码"
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
            v-hasPermi="['system:community:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:community:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:community:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['system:community:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="communityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center">
      </el-table-column>
      <el-table-column v-if="show" label="ID" align="center" prop="communityId" />
      <el-table-column label="小区名称" align="center" prop="communityName" />
      <el-table-column label="小区编码" align="center" prop="communityCode" />
      <el-table-column label="省" align="center" prop="communityProvenceName" />
      <el-table-column label="市" align="center" prop="communityCityName" />
      <el-table-column label="区/县" align="center" prop="communityTownName" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:community:edit']"
          >修改</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:community:remove']"
          >删除</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-setting"
              @click="replaceProperty(scope.row)"
              v-hasPermi="['system:community:remove']"
          >更换物业</el-button>
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
    <!-- 更换物业 -->
    <el-dialog :title="title" :visible.sync="property" width="700px" append-to-body>
      <el-table
          v-loading="loading"
          :data="deptList"
          row-key="deptId"
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="deptName" label="物业名称" width="260"></el-table-column>
        <el-table-column prop="status" label="状态" :formatter="statusFormat" width="100"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="200">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                v-if="scope.row.parentId === 100 && scope.row.deptId !== selectedDeptId"
                icon="el-icon-success"
                @click="replacePropertyAction(scope.row)"
                v-hasPermi="['system:dept:add']"
            >选择</el-button>
            <el-button
                size="mini"
                type="text"
                v-else-if="scope.row.deptId === selectedDeptId"
                icon="el-icon-success"
            >已选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 添加或修改 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="小区名称" prop="communityName">
          <el-input v-model="form.communityName" placeholder="请输入小区名称" />
        </el-form-item>
        <el-form-item label="详细地址" prop="communityDetailedAddress">
          <el-input v-model="form.communityDetailedAddress" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="所属区划" prop="selected">
          <el-cascader
              v-model="selectedAreaInfo"
              :props="cascaderProps"
              :options="areaOptions"
              @change="selectedAreas"
          ></el-cascader>
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

import axios from "axios";

export default {
  name: "Community",
  components: {
  },
  data() {
    return {
      show: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 表格树数据
      deptList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 小区信息表格数据
      communityList: [],
      //选中的区划信息
      selectedAreaInfo: [],
      //区划信息
      areaOptions: [],
      //级联组件配置
      cascaderProps: {
        value: 'code',
        label: 'name'
      },
      // 弹出层标题
      title: "",
      //小区ID
      publicCommunityId:"",
      //已选择
      selectedDeptId:"",
      // 是否显示弹出层
      open: false,
      // 是否显示更换物业弹出层
      property: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        communityName: null,
        communityCode: null,
        communityProvenceCode: null,
        communityCityCode: null,
        communityTownCode: null,
        longitude: null,
        latitude: null,
        deptId: null,
        sort: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        communityName: [
          { required: true, message: '小区名称不能为空', trigger: 'blur' }
        ],
        communityDetailedAddress: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ],
        selected: [
          { required: true, message: '请选择区划', trigger:  'blur' }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data.data;
    });
  },
  methods: {
    //获取省市区三级联动
    async getAreaTree(){
      const {data: res} = await this.$http.get("/sysArea/queryAreaTree");
      console.log(res)
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.areaOptions = this.getTreeData(res.data)
    },
    //切换每页数据
    handleSizeChange(val){
      this.queryParams.pageSize = val;
      this.getList();
    },
    //上一页下一页
    handleCurrentChange(val){
      this.queryParams.pageNum = val;
      this.getList();
    },
    //过滤树形结构
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    //获取选中的区划信息
    selectedAreas(detail) {
      this.form.selected = detail
      this.selectedAreaInfo = detail
    },
    /** 查询小区信息列表 */
    async getList() {
      this.loading = true;
      const {data: res} = await this.$http.get("/zyCommunity/selectAll", {
        params:{
          pageNum : this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          communityName: this.queryParams.communityName,
          communityCode: this.queryParams.communityCode
        }});
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.communityList = res.data.zyCommunityList
      this.total = res.data.pageable.total
      this.queryParams.pageNum = res.data.pageable.pageNum
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
        communityId: null,
        communityName: null,
        communityCode: null,
        communityProvenceCode: null,
        communityCityCode: null,
        communityTownCode: null,
        longitude: null,
        latitude: null,
        deptId: null,
        sort: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        selected: null,
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
      this.ids = selection.map(item => item.communityId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.selectedAreaInfo = []
      this.getAreaTree();
      this.open = true;
      this.title = "添加小区信息";
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      await this.getAreaTree();
      if (row) {
        const id = this.ids[0];
        this.selectedAreaInfo = []
        const {data: res} = await this.$http.get(`zyCommunity/${id}`)
        console.log(res)
        this.form = res.data
      } else {
        this.selectedAreaInfo = []
        this.form = JSON.parse(JSON.stringify(row))
      }
      this.selectedAreaInfo[0] = this.form.communityProvenceCode
      this.selectedAreaInfo[1] = this.form.communityCityCode
      this.selectedAreaInfo[2] = this.form.communityTownCode
      this.form.selected = this.selectedAreaInfo;
      console.log(this.form.selected)
      this.open = true;
      this.title = "修改小区信息";
    },
    /** 更换物业按钮操作 */
    async replaceProperty(row) {
      this.loading = true;
      this.selectedDeptId = row.deptId;
      this.publicCommunityId = row.communityId;
      this.property = true;
      const {data: res} = await this.$http.get("sysDept/getDeptList")
      console.log(res)
      if (res.meta.errorCode !== 200){
        return this.$message.error(res.meta.errorMsg);
      }
      this.deptList = res.data
      this.title = "更换物业";
      this.loading = false
    },
    //更换物业选择方法
    replacePropertyAction(row) {
      this.reset();
      this.form.communityId = this.publicCommunityId;
      this.form.deptId = row.deptId;
      this.$confirm('是否确认更换成该物业?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
            const {data: res} = await this.$http.put("zyCommunity/updateCommunity", this.form);
            if (res.meta.errorCode !== 200){
              return this.$message.error(res.meta.errorMsg)
            }
            await this.getList();
            this.$message.success("更换物业成功")
            this.property = false;
          }
      )
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(async valid => {
        console.log(this.form)
        if (valid) {
          if (this.form.communityId != undefined) {
            //修改
            this.form.communityProvenceCode = this.selectedAreaInfo[0]
            this.form.communityCityCode = this.selectedAreaInfo[1]
            this.form.communityTownCode = this.selectedAreaInfo[2]
            const {data: res} = await this.$http.put("zyCommunity/updateCommunity", this.form);
            if (res.meta.errorCode != 200){
              return this.$message.error(res.meta.errorMsg);
            }
            this.open = false;
            this.$message.success("修改成功");
            await this.getList();
          } else {
            //新增
            this.form.communityProvenceCode = this.selectedAreaInfo[0]
            this.form.communityCityCode = this.selectedAreaInfo[1]
            this.form.communityTownCode = this.selectedAreaInfo[2]
            const {data: res} = await this.$http.post("zyCommunity/insertCommunity", this.form);
            console.log(res)
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg)
            }
            this.open = false;
            this.$message.success("新增成功")
            await this.getList();
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const communityIds = this.ids;
      console.log(this.ids)
      this.$confirm('是否确认删除小区信息编号为"' + communityIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await this.$http.delete("/zyCommunity/deleteCommunity",{data:communityIds})
      }).then(() => {
        this.getList();
        this.$message.success("删除成功")
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      //设置全局配置信息
      const config = {
        method: 'post',
        url: 'zyCommunity/getExcel',
        data: this.ids,
        responseType: 'blob'
      };
      this.$confirm('是否确认导出所有小区信息数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        //发送请求
        // eslint-disable-next-line no-undef
        axios(config).then(response => {
          console.log(response)
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', '小区信息.xls');
          document.body.appendChild(link);
          link.click();
          if (response.data !== null) {
            this.$message.success("导出成功");
          }
        })
      })
    }
  }
};
</script>
