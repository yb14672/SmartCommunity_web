<template>
  <div class="app-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>字典管理</el-breadcrumb-item>
    </el-breadcrumb>
    <br>

    <!--模糊查询-->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="字典名称" prop="dictName">
        <el-input
            v-model="queryParams.dictName"
            placeholder="请输入字典名称"
            clearable
            @clear="getDictList"
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input
            v-model="queryParams.dictType"
            placeholder="请输入字典类型"
            clearable
            size="small"
            style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="字典状态"
            clearable
            @clear="getDictList"
            size="small"
            style="width: 240px">
          <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd"
                        type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--        CRUD+导出按钮-->
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
            @click="handleDeletes"
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
            type="danger"
            icon="el-icon-refresh"
            size="mini"
        >清理缓存
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getDictList"></right-toolbar>
    </el-row>
    <br>

    <!--      字典类型数据展示-->
    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="字典编号" align="center" prop="dictId"/>
      <el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true"/>
      <el-table-column label="字典类型" align="center" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          <router-link :to="'/dict/type/data/' + scope.row.dictType" class="link-type" style="text-decoration: none">
            <el-link type="primary" :underline="null" v-if="scope.row.status==1?false:true">{{ scope.row.dictType }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="200">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status=='0'?'success':'info'">
            {{ scope.row.status == 0 ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180"/>
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
              @click="handleDelete(scope.row.dictId)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="block" style="margin-top:15px;">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.nowPage"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="queryParams.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>

    <!--         添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称"/>
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型"/>
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
  inject: ['reload'],
  data() {
    return {
      total: 5, // 总条数
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
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        createTime: '',
        endCreateTime: '',
        dictName: '',
        dictType: '',
        status: '',
        nowPage: 1,
        pageSize: 5,
        beginTime: '',
        endTime: ''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          {required: true, message: "字典名称不能为空", trigger: "blur"}
        ],
        dictType: [
          {required: true, message: "字典类型不能为空", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    //列表
    this.getDictList();
  },
  mounted() {
    this.getlivestockInfo(1);
  },
  methods: {
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryParams.nowPage = 1;
      this.queryParams.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryParams.nowPage = val;
      this.getlivestockInfo(val);
    },
    getlivestockInfo: async function (num1) {
      this.queryParams.nowPage = num1;
      await this.getDictList();
    },

    //重置按钮
    resetQuery() {
      this.reload();
    },


    /** 查询字典类型列表 */
    async getDictList() {
      // this.loading = true;
      // //获取状态
      // const {data: getStats} = await this.$http.get('SysDictData/getDict')
      // this.statusOptions = getStats;
      // if (this.dateRange != null) {
      //   this.queryParams.createTime = this.dateRange[0]
      //   this.queryParams.endCreateTime = this.dateRange[1];
      // } else {
      //   this.queryParams.createTime = ''
      //   this.queryParams.endCreateTime = ''
      // }
      // const {data: res} = await this.$http.post('system/dict/type/list', {
      //   nowPage: this.queryParams.nowPage,
      //   pageSize: this.queryParams.pageSize,
      //   dictName: this.queryParams.dictName,
      //   dictType: this.queryParams.dictType,
      //   status: this.queryParams.status,
      // });
      // this.typeList = res.list;
      // this.queryParams.nowPage = res.nowPage;
      // this.pages = res.pages;
      // this.total = res.total;
      // this.queryParams.pageSize = res.pageSize;
      // this.loading = false;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictId: "",
        dictName: "",
        dictType: "",
        status: "0",
        remark: ""
      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      //获取开始日期
      this.queryParams.beginTime = this.dateRange[0]
      //获取结束日期
      this.queryParams.endTime = this.dateRange[1]
      this.getDictList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.reset();
      // this.open = true;
      // this.title = "添加字典类型";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // this.ids = selection.map(item => item.dictId)
      // this.single = selection.length != 1
      // this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      //
      // this.reset();
      // this.open = true;
      // this.title = "修改字典类型";
      // for (let i = 0; i < this.typeList.length; i++) {
      //   // console.log(this.dataList[i])
      //   if (this.typeList[i].dictId == row.dictId) {
      //     this.form = this.typeList[i]
      //     break;
      //   }
      // }
    },
    /** 提交按钮 */
    submitForm: async function () {
      // if (this.form.dictId != "") {
      //   const {data: res} = await this.$http.post('system/dict/type/updateDictType', this.form);
      //   if (res.status.status !== 'success') {
      //     this.$message.error(res.msg);
      //     this.getDictList();
      //   } else {
      //     this.$message.success("修改成功")
      //     this.open = false;
      //     this.getDictList();
      //   }
      // } else {
      //   const {data: res} = await this.$http.post('system/dict/type/addDictType', this.form);
      //   if (res.status.status !== 'success') {
      //     this.$message.error(res.msg);
      //   } else {
      //
      //     this.$message.success("添加成功");
      //     this.open = false;
      //     this.getDictList();
      //   }
      // }
    },

    /** 数组删*/
    handleDeletes(row) {
      // const dictIds = row.dictId || this.ids;
      // let axin = this;
      // this.$confirm('是否确认删除字典编号为"' + dictIds + '"的数据项?', "警告", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // }).then(async () => {
      //   const {data: res} = await axin.$http.post('system/dict/type/delDictTypeById', dictIds)
      //   if (res.status.status !== 'success') {
      //     this.$message.error(res.msg);
      //   } else {
      //     this.$message.success('删除成功！');
      //     this.getDictList();
      //   }
      // }).catch(() => {
      //   this.getDictList();
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   });
      // });
    },
    /** 删除按钮操作 */
    handleDelete: async function (id) {
      // const confirmResult = await this.$messagebox.confirm(
      //     '此操作将永久删除, 是否继续?',
      //     '提示',
      //     {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }
      // ).catch(err => err)
      // // 如果用户确认删除，则返回值为字符串 confirm
      // // 如果用户取消了删除，则返回值为字符串 cancel
      // // console.log(confirmResult)
      // if (confirmResult !== 'confirm') {
      //   return this.$message.info('已取消删除')
      // }
      // const {data: res} = await this.$http.delete('system/dict/type/delDictType?dictId=' + id)
      // if (res.status.status !== 'success') {
      //   this.$message.error(res.msg);
      // } else {
      //   this.$message.success('删除成功！');
      //   this.getDictList();
      // }
    },

    /** 导出按钮操作 */
    handleExport() {
      // // window.location='http://localhost:8080/excel/get'
      // //设置全局配置信息
      // const config = {
      //   method: 'post',
      //   url: 'system/dict/type/getExcel',
      //   data: this.ids,
      //   responseType: 'blob'
      // };
      // //发送请求
      // // eslint-disable-next-line no-undef
      // axios(config).then(response => {
      //       const url = window.URL.createObjectURL(new Blob([response.data]));
      //       const link = document.createElement('a');
      //       link.href = url;
      //       link.setAttribute('download', '字典类型.xls');
      //       document.body.appendChild(link);
      //       link.click();
      //       if (response.data !== null) {
      //         this.$message.success("导出成功");
      //       }
      //     }
      // )
    }
    // /** 清理缓存按钮操作 */
    // handleClearCache() {
    //     clearCache().then(response => {
    //         this.msgSuccess("清理成功");
    //     });
    // }


  }
};
</script>
