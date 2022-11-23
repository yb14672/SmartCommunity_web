<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="业主昵称" prop="ownerNickname">
        <el-input
          v-model="queryParams.ownerNickname"
          placeholder="请输入业主昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业主姓名" prop="ownerRealName">
        <el-input
          v-model="queryParams.ownerRealName"
          placeholder="请输入业主姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业主电话" prop="ownerPhoneNumber">
        <el-input
          v-model="queryParams.ownerPhoneNumber"
          placeholder="请输入业主姓名"
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
    <!--搜索重置+小区选择-->
    <el-row :gutter="10" class="mb8">
      <RightToolbar :showSearch.sync="showSearch" @queryTable="getList"/>
    </el-row>
    <!--数据渲染表格-->
    <el-table v-loading="loading" :data="interactionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column label="id" v-if="show" align="center" prop="interactionId"/>
      <el-table-column label="业主昵称" align="center" prop="ownerNickname"/>
      <el-table-column label="业主姓名" align="center" prop="ownerRealName"/>
      <el-table-column label="业主电话" align="center" prop="ownerPhoneNumber"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center" prop="content"/>
      <el-table-column label="图片" align="center" prop="urlList">
        <template slot-scope="scope">
          <el-image style="width: 30px; height: 30px" v-for="item in scope.row.urlList" :src="item"
                    :preview-src-list="scope.row.urlList">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-tools"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wygl:interaction:edit']"
          >更多操作
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:interaction:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改社区互动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <div>
          <div class="author-title reply-father">
            <el-avatar class="header-img" :size="40" :src="form.avatar"></el-avatar>
            <div class="author-info">
              <span class="author-name">{{ form.ownerNickname }}</span>
              <span class="author-time">{{ form.createTime }}</span>
            </div>
            <div class="talk-box">
              <p>
                <span class="reply">{{ form.content }}</span>
              </p>
            </div>
            <div class="reply-box">
              <div v-for="(reply,j) in form.zyCommentList" :key="j" class="author-title">
                <el-avatar class="header-img" :size="40" :src="reply.ownerPortrait"></el-avatar>
                <div class="author-info">
                  <span class="author-name">{{ reply.ownerName }}</span>
                  <span class="author-time">{{ reply.createTime }}</span>
                </div>
                <div class="talk-box">
                  <p class="talk-box-new">
                    <span>回复 {{ form.ownerName }}<span>{{ reply.passiveOwnerName }}</span>:</span>
                    <span class="reply">{{ reply.content }}</span>
                  </p>
                </div>
                <div class="reply-box">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="commentDelete(reply.commentId,form.interactionId)"
                    v-hasPermi="['system:interaction:remove']"
                  >删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Editor from '@/components/Editor';

export default {
  name: "Interaction",
  components: {Editor},
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
      // 社区互动表格数据
      interactionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        communityId: null,
        ownerNickname: null,
        ownerRealName: null,
        ownerPhoneNumber: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询社区互动列表 */
    getList() {
      this.loading = true;
      this.listInteraction(this.queryParams).then(res => {
        this.interactionList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        interactionId: null,
        communityId: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        content: null,
        filesId: null,
        delFlag: null
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
      this.ids = selection.map(item => item.interactionId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加社区互动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const interactionId = row.interactionId || this.ids
      getInteraction(interactionId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "社区互动详情";
      });
    },
    /** 评论删除按钮操作 */
    commentDelete(commentId, interactionId) {
      this.$confirm('是否确认删除社区互动评论编号为"' + commentId + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delComment(commentId);
      }).then(() => {
        //this.commentList(commentId);
        console.log(commentId, interactionId);
        getInteraction(interactionId).then(response => {
          this.form = response.data;
        });
        this.msgSuccess("删除成功");
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.interactionId != null) {
            updateInteraction(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInteraction(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const interactionIds = row.interactionId || this.ids;
      this.$confirm('是否确认删除社区互动吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delInteraction(interactionIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有社区互动数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportInteraction(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    /** 获取所有社区互动信息 */
    listInteraction(query) {
      return this.$http({
        url: '/system/interaction/list',
        method: 'get',
        params: query
      })
    }
  }
};
</script>
<style lang="css" scoped>

.header-img {
  display: inline-block;
  vertical-align: top;
}

.author-title:not(:last-child) {
  border-bottom: 1px solid rgba(178, 186, 194, .3)
}

.author-title {
  padding: 10px
}

.header-img {
  display: inline-block;
  vertical-align: top
}

.author-info {
  display: inline-block;
  margin-left: 5px;
  width: 60%;
  height: 40px;
  line-height: 20px;
}

.author-name {
  display: block;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.author-time {
  display: block;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.author-name {
  color: #000;
  font-size: 18px;
  font-weight: bold
}

.author-time {
  font-size: 14px
}

.talk-box {
  margin: 0 50px
}

.talk-box-new {
  margin: 0
}

.reply {
  font-size: 16px;
  color: #000
}

.reply-box {
  margin: 10px 0 0 50px;
  background-color: #efefef
}
</style>
