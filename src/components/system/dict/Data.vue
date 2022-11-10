<template>
  <div class="app-container">
    <!--查询条件表单-->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="字典名称" prop="dictType">
        <el-select v-model="queryParams.dictType" size="small">
          <el-option
              v-for="item in typeOptions"
              :key="item.dictId"
              :label="item.dictName"
              :value="item.dictType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签" prop="dictLabel">
        <el-input
            v-model="queryParams.dictLabel"
            placeholder="请输入字典标签"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="数据状态" clearable size="small">
          <el-option
              v-for="dict in statusOptions"
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
    <!--操作相关-->
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
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
        >修改
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
      <el-col :span="1.5">
        <el-button
            type="info"
            icon="el-icon-back"
            size="mini"
            @click="exitData"
        >返回
        </el-button>
      </el-col>
    </el-row>
    <!--渲染数据表格-->
    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="字典编码" align="center" prop="dictCode"/>
      <el-table-column label="字典标签" align="center" prop="dictLabel"/>
      <el-table-column label="字典键值" align="center" prop="dictValue"/>
      <el-table-column label="字典排序" align="center" prop="dictSort"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.listClass">{{ statusFormat(scope.row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | moment }}</span>
        </template>
      </el-table-column>
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
    <!--分页-->
    <div style="display: block" align="right">
      <el-pagination
          v-show="total>0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.current"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryParams.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典类型">
          <el-input v-model="form.dictType" :disabled="true"/>
        </el-form-item>
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input v-model="form.dictLabel" placeholder="请输入数据标签"/>
        </el-form-item>
        <el-form-item label="数据键值" prop="dictValue">
          <el-input v-model="form.dictValue" placeholder="请输入数据键值"/>
        </el-form-item>
        <el-form-item label="样式属性" prop="cssClass">
          <el-input v-model="form.cssClass" placeholder="请输入样式属性"/>
        </el-form-item>
        <el-form-item label="显示排序" prop="dictSort">
          <el-input-number v-model="form.dictSort" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="回显样式" prop="listClass">
          <el-select v-model="form.listClass" placeholder="请选择回显样式">
            <el-option
                v-for="item in listClasses"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
            >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
  name: "Data",
  data() {
    return {
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
      // 字典表格数据
      dataList: [],
      // 默认字典类型
      defaultDictType: "",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        //页码号
        current: 1,
        //每页数据量
        size: 10,
        //字典名称
        dictName: '',
        //字典类型
        dictType: '',
        //状态（0正常 1停用）
        status: '',
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictLabel: [
          {required: true, message: "数据标签不能为空", trigger: "blur"}
        ],
        dictValue: [
          {required: true, message: "数据键值不能为空", trigger: "blur"}
        ],
        dictSort: [
          {required: true, message: "数据顺序不能为空", trigger: "blur"}
        ]
      },
      //导出列表
      exportList: {
        dictType: '',
        ids: [],
      },
      //回显样式列表
      listClasses: [{
        value: 'default',
        label: '默认(default)'
      }, {
        value: 'primary',
        label: '主要(primary)'
      }, {
        value: 'success',
        label: '成功(success)'
      }, {
        value: 'info',
        label: '信息(info)'
      }, {
        value: 'warning',
        label: '警告(warning)'
      }, {
        value: 'danger',
        label: '危险(danger)'
      }]
    };
  },
  //初始化数据
  created() {
    //获取刚进来时的字典类型ID
    const dictId = this.$route.params && this.$route.params.dictId;
    //获取当前类型的详情和对应的data
    this.getType(dictId);
    //获取所有的字典类型
    this.getTypeList();
    //查询需要使用的字典
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data.data;
    });
  },
  methods: {
    /** 返回到字典列表 */
    async exitData(){
      //清空值
      this.defaultDictType='';
      this.queryParams.dictType = {};
      this.exportList.dictType = {};
      await this.$router.push('/system/dict')
    },
    /**  分页每页多少条数据 */
    handleSizeChange(val) {
      this.queryParams.size = val;
      this.getDictDataList();
    },
    /** 点击切换上下页 */
    handleCurrentChange(val) {
      this.queryParams.current = val;
      this.getDictDataList();
    },
    /** 查询字典类型详细 */
    async getType(dictId) {
      //获取数据
      const {data: res} = await this.$http.get('/sysDictType/' + dictId);
      //判断是否执行成功
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      //将值回显
      this.queryParams.dictType = res.data.dictType;
      this.defaultDictType = res.data.dictType;
      this.exportList.dictType = res.data.dictType;
      //查询当前字典的data
      await this.getDictDataList();
    },
    /** 查询字典类型列表 */
    async getTypeList() {
      //获取数据
      const {data: res} = await this.$http.get('/sysDictType');
      //判断是否执行成功
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.typeOptions = res.data;
    },
    /** 查询字典数据列表 */
    async getDictDataList() {
      this.loading = true;
      const {data: res} = await this.$http.get('/sysDictData/', {
        params: {
          current: this.queryParams.current,
          size: this.queryParams.size,
          dictLabel: this.queryParams.dictLabel,
          dictType: this.queryParams.dictType,
          status: this.queryParams.status,
        }
      });
      //判断是否执行成功
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.dataList = res.data.records;
      this.total = res.data.total;
      this.exportList.dictType = this.queryParams.dictType;
      this.loading = false;
    },
    /** 数据状态字典翻译 */
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        dictCode: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        dictSort: 0,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      console.log(this.queryParams)
      this.getDictDataList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.dictType = this.defaultDictType;
      this.exportList.dictType = this.defaultDictType;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典数据";
      this.form.dictType = this.queryParams.dictType;
      this.form.listClass='default';
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictCode)
      this.exportList.ids = selection.map(item => item.dictCode)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      const dictCode = row.dictCode || this.ids;
      //获取数据
      const {data: res} = await this.$http.get('/sysDictData/' + dictCode);
      console.log(res)
      //判断是否执行成功
      if (res.meta.errorCode !== 200) {
        this.$message.error(res.meta.errorMsg)
      } else {
        this.form = res.data;
        this.open = true;
        this.title = "修改字典数据";
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          if (this.form.dictCode != undefined) {
            const {data: res} = await this.$http.put("/sysDictData", this.form);
            if (res.meta.errorCode !== 200) {
              this.$message.error(res.meta.errorMsg)
            } else {
              this.open = false;
              this.$message.success("修改成功！");
              //查询当前字典的data
              await this.getDictDataList();
            }
          } else {
            const {data: res} = await this.$http.post("/sysDictData", this.form);
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg);
            } else {
              this.$message.success("新增成功");
              this.open = false;
              //查询当前字典的data
              await this.getDictDataList();
            }
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictCodes = row.dictCode || this.ids;
      this.$confirm('是否确认删除字典编码为"' + dictCodes + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return this.$http.delete(`/sysDictData?idList=${dictCodes}`);
      }).then((res) => {
        if (res.data.meta.errorCode !== 200) {
          return this.$message.error(res.data.meta.errorMsg);
        }
        this.getDictDataList();
        this.$message.success("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      //设置全局配置信息
      const config = {
        method: 'get',
        url: 'sysDictData/export?ids=' + this.exportList.ids + '&dictType=' + this.exportList.dictType,
        responseType: 'blob'
      };
      console.log(config.data)
      this.$confirm('是否确认导出所有数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return axios(config);
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '字典数据.xls');
        document.body.appendChild(link);
        link.click();
        if (response.data !== null) {
          this.$message.success("导出成功");
        }
      })
    }
  }
};
</script>