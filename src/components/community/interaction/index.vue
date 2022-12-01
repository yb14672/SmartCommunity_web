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
    <!--搜索显示隐藏+重置-->
    <el-row style="margin-bottom: 10px;margin-left: 6em">
      <el-col :offset="22">
        <RightToolbar :showSearch.sync="showSearch" @queryTable="getList"/>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="mb8">
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
      <el-col :span="1.5" :offset="16">
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
          <span>{{ scope.row.createTime | moment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center" prop="content"/>
      <el-table-column label="图片" align="center" prop="urlList">
        <template slot-scope="scope">
          <el-image style="width: 30px; height: 30px" :key="index" v-for="(item,index) in scope.row.urlList" :src="item"
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
            @click="openDetail(scope.row)"
            v-hasPermi="['wygl:interaction:edit']"
          >查看详情
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
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改社区互动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <div>
          <div class="author-title reply-father">
            <el-avatar class="header-img" :size="40" :src="form.ownerPortrait"></el-avatar>
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
                  <span class="author-name">{{ reply.ownerNickName }}</span>
                  <span class="author-time">{{ reply.createTime }}</span>
                </div>
                <div class="talk-box">
                  <p class="talk-box-new">
                    <span v-if="reply.passiveOwnerName!=null">
                      回复 {{ form.ownerName }}
                      <span>{{ reply.passiveOwnerName }}</span>:
                    </span>
                    <span class="reply">{{ reply.content }}</span>
                  </p>
                </div>
                <div class="reply-box">
                  <!--                  <el-button-->
                  <!--                    size="mini"-->
                  <!--                    type="text"-->
                  <!--                    icon="el-icon-edit"-->
                  <!--                    @click="handleAdd(reply)"-->
                  <!--                    v-hasPermi="['system:comment:add']"-->
                  <!--                  >回复-->
                  <!--                  </el-button>-->
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
      <el-card v-show="drawer">
        <div slot="header" class="clearfix">
          评论回复
        </div>
        <Editor ref="editor" v-model="context"></Editor>
        <el-button type="primary" style="margin-top: 10px" @click="submitForm">发表回复</el-button>
        <el-button style="margin-top: 10px">取消</el-button>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
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
      context: '',
      //抽屉打开方向
      direction: 'btt',
      //全局小区id
      communityId: '',
      //控制显示隐藏
      show: false,
      // 遮罩层
      loading: true,
      //控制回复抽屉是否显示
      drawer: false,
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
        current: 1,
        size: 2,
        communityId: null,
        ownerNickname: null,
        ownerRealName: null,
        ownerPhoneNumber: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //小区列表
      options: {},
    };
  },
  created() {
    this.getCommunityList().then(() => {
      this.getList();
    });
  },
  methods: {
    /** 查询社区互动列表 */
    getList(page) {
      this.loading = true;
      //判断是否有分页
      if (page) {
        this.queryParams.current = page.current;
        this.queryParams.size = page.size;
      }
      this.queryParams.communityId = this.communityId;
      this.listInteraction(this.queryParams).then(res => {
        if (res.data.data === "没有符合条件的数据") {
          this.interactionList = res.data.data.records;
          this.total = 0;
          this.loading = false;
          return this.$message.warning("没有符合条件的数据");
        }
        if (res.data.meta.errorCode != 200) {
          return this.$message.error(res.data.meta.errorMsg);
        }
        this.interactionList = res.data.data.records;
        this.total = res.data.data.pageable.total;
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
      this.queryParams.current = 1;
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
    handleAdd(reply) {
      this.drawer = true;
      // this.reset();
      // this.open = true;
      // this.title = "添加社区互动";
    },
    /** 打开评论 */
    openDetail(row) {
      this.reset();
      const interactionId = row.interactionId
      this.getInteraction(interactionId).then(res => {
        if (res.data.meta.errorCode !== 200) {
          return this.$message.error(res.data.meta.errorMsg);
        }
        this.form = res.data.data;
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
      }).then(async () => {
        return this.delComment(commentId);
      }).then(async res => {
        if (res.data.meta.errorCode !== 200) {
          return this.$message.error(res.data.meta.errorMsg);
        }
        this.$message.success("删除成功");
        this.getInteraction(interactionId).then(response => {
          this.form = response.data.data;
        });
      })
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.$refs.editor.currentValue, this.context)
      // this.$refs["form"].validate(valid => {
      //   if (valid) {
      //     addInteraction(this.form).then(response => {
      //       this.$message("新增成功");
      //       this.open = false;
      //       this.getList();
      //     });
      //   }
      // });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const interactionIds = row.interactionId || this.ids;
      this.$confirm('是否确认删除社区互动吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return this.delInteraction(interactionIds);
      }).then((res) => {
        if (res.data.meta.errorCode !== 200) {
          return this.$message.error(res.data.meta.errorMsg);
        }
        this.getList();
        this.$message.success("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      //设置全局配置信息
      const config = {
        method: 'get',
        url: '/system/interaction/export?ids=' + this.ids + "&communityId=" + this.communityId,
        responseType: 'blob'
      };
      //发送请求
      // eslint-disable-next-line no-undef
      this.$http(config).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', '互动信息.xls');
          document.body.appendChild(link);
          link.click();
          if (response.data !== null) {
            this.$message.success("导出成功");
          }
        }
      )
    },
    /** 获取所有社区互动信息 */
    listInteraction(query) {
      return this.$http({
        url: '/system/interaction/',
        method: 'get',
        params: query
      })
    },
    /** 删除评论 */
    delInteraction(interactionIds) {
      return this.$http({
        url: '/system/interaction/?ids=' + interactionIds,
        method: 'delete'
      })
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
      this.options = res.data.zyCommunityList;
      this.communityId = this.options[0].communityId;
      this.queryParams.communityId = this.options[0].communityId;
      this.loading = false;
    },
    /** 获取互动文章详情 */
    getInteraction(id) {
      return this.$http({
        url: '/system/interaction/' + id,
        method: 'get'
      })
    },
    /** 删除评论 */
    delComment(commentId) {
      return this.$http({
        url: '/system/comment/' + commentId,
        method: 'delete'
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
