<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="岗位编码" prop="postCode">
        <el-input
            v-model="queryParams.postCode"
            clearable
            placeholder="请输入岗位编码"
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="岗位名称" prop="postName">
        <el-input
            v-model="queryParams.postName"
            clearable
            placeholder="请输入岗位名称"
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" clearable placeholder="岗位状态" size="small">
          <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="cyan" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            icon="el-icon-plus"
            size="mini"
            type="primary"
            @click="handleAdd"
        >
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            :disabled="multiple"
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="handleDelete()"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            icon="el-icon-download"
            size="mini"
            type="warning"
            @click="handleExport"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column align="center" label="岗位编号" prop="postId"/>
      <el-table-column align="center" label="岗位编码" prop="postCode"/>
      <el-table-column align="center" label="岗位名称" prop="postName"/>
      <el-table-column align="center" label="岗位排序" prop="postSort"/>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.status"
              :disabled="scope.row.roleId === 1"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | moment }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button
              icon="el-icon-edit"
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
              icon="el-icon-delete"
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div align="right" class="block">
      <el-pagination
          :current-page="queryParams.pageNum"
          :page-size="queryParams.pageSize"
          :page-sizes="[1, 2, 5, 10]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称"/>
        </el-form-item>
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="form.postCode" placeholder="请输入编码名称"/>
        </el-form-item>
        <el-form-item label="岗位顺序" prop="postSort">
          <el-input-number v-model="form.postSort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
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
          <el-input v-model="form.remark" placeholder="请输入内容" type="textarea"/>
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
  name: "Post",
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
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        postCode: undefined,
        postName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        postName: [
          {required: true, message: "岗位名称不能为空", trigger: "blur"}
        ],
        postCode: [
          {required: true, message: "岗位编码不能为空", trigger: "blur"}
        ],
        postSort: [
          {required: true, message: "岗位顺序不能为空", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable");

  },
  methods: {
    /** 查询岗位列表 */
    //  getList() {
    //   this.loading = true;
    //   listPost(this.queryParams).then(response => {
    //     this.postList = response.rows;
    //     this.total = response.total;
    //     this.loading = false;
    //   });
    // },
    async getList() {
      const {data: res} = await this.$http.get("sysPost/getPostList", {
        params: {
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          postCode: this.queryParams.postCode,
          postName: this.queryParams.postName,
          status: this.queryParams.status,
        }
      });
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.message);
      }
      this.postList = res.data.sysPostList;
      this.total = res.data.pageable.total;
      this.loading = false;
    },
    // 岗位状态字典翻译
    async getDicts(deptType) {
      const {data: res} = await this.$http.get(`sysDictData/getDict?dictType=${deptType}`);
      this.statusOptions = res.data;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        postId: undefined,
        postCode: undefined,
        postName: undefined,
        postSort: 0,
        status: "0",
        remark: undefined
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加岗位";

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = JSON.parse(JSON.stringify(row));
      this.open = true;
      this.title = "修改岗位";
    },
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.postName + '"岗位?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const {data: res} = await this.$http.put(`/sysPost/updatePost`, row);
        console.log(res)
        if (res.meta.errorCode !== 200) {
          row.status = row.status === "0" ? "1" : "0";
          return this.$message.error(res.meta.errorMsg);
        }
        this.$message.success(text + "成功");
        await this.getList();
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          if (this.form.postId !== undefined) {
            const {data: res} = await this.$http.put("sysPost/updatePost", this.form)
            console.log(res)
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg);
            }
            this.$message.success("修改成功")
            this.open = false;
            await this.getList();
          } else {
            const {data: res} = await this.$http.post("sysPost/addPost", this.form)
            console.log(res)
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg);
            }
            this.$message.success("添加成功")
            this.open = false;
            await this.getList();

          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let postIds;
      if (row) {
        postIds = row.postId;
      } else {
        postIds = this.ids
      }

      this.$confirm('是否确认删除岗位编号为"' + postIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"

      }).then(async () => {
        const {data: res} = await this.$http.delete(`sysPost/deletePost?ids=${postIds}`);
        if (res.meta.errorCode !== 200) {
          return this.$message.error(res.meta.errorMsg)
        }
        this.getList();
        return this.$message.success("删除成功")

      })
    },
    /** 导出按钮操作 */
    handleExport() {
      //设置全局配置信息
      const config = {
        method: 'post',
        url: 'sysPost/getExcel',
        data: this.ids,
        responseType: 'blob'
      };
      //发送请求
      // eslint-disable-next-line no-undef
      axios(config).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '岗位管理.xls');
            document.body.appendChild(link);
            link.click();
            if (response.data !== null) {
              this.$message.success("导出成功");
            }
          }
      )
    }
  },

  /**  分页每页多少条数据 */
  handleSizeChange(val) {
    this.queryParams.pageSize = val;
    this.getList();
  },

  handleCurrentChange(val) {
    this.queryParams.pageNum = val;
    this.getList();
  },
}
</script>