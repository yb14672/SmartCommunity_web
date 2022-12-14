<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="类型" prop="complaintSuggestType">
        <el-select v-model="queryParams.complaintSuggestType" placeholder="请选择类型(投诉、建议)" clearable size="small">
          <el-option
            v-for="item in suggestOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5" :offset="16">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-col>
      <el-col :span="1.5">
        <el-select size="mini" v-model="communityId" placeholder="请选择" @change="changeCommunity">
          <el-option
            v-for="item in communities"
            :key="item.communityId"
            :label="item.communityName"
            :value="item.communityId">
          </el-option>
        </el-select>
      </el-col>
    </el-row>


    <el-table v-loading="loading" :data="suggestList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column label="创建者名称" align="center" prop="ownerRealName"/>
      <el-table-column label="创建者电话" align="center" prop="ownerPhoneNumber"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="filesUrl">
        <template slot-scope="scope">
          <el-image style="width: 30px; height: 30px" v-for="(item,index) in scope.row.filesUrl" :key="index"
                    :src="item" :preview-src-list="scope.row.filesUrl">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="类型" align="center" prop="complaintSuggestType" :formatter="suggestStatusFormat"/>
      <el-table-column label="内容" align="center" prop="complaintSuggestContent"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-picture"
            @click="handleMsg(scope.row)"
          >详细信息
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-picture"
            @click="showReply(scope.row)"
          >回复投诉/建议
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
    <!--详细信息-->
    <el-dialog :title="title" :visible.sync="dialogVisibleMsg" width="1200px" append-to-body>
      <el-table v-loading="loading" :data="suggestListAll" @selection-change="handleSelectionChange">
        <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column label="类型" align="center" prop="complaintSuggestType" :formatter="suggestStatusFormat"/>
        <el-table-column label="内容" align="center" prop="complaintSuggestContent"/>
        <el-table-column label="小区id" align="center" prop="communityId"/>
        <el-table-column label="投诉或建议的id" align="center" prop="complaintSuggestId"/>
        <el-table-column label="业主昵称" align="center" prop="createBy"/>
        <el-table-column label="修改人" align="center" prop="updateBy"/>
        <el-table-column label="修改时间" align="center" prop="updateTime"/>
        <el-table-column label="投诉人id" align="center" prop="userId"/>
        <el-table-column label="回复投诉/建议信息" align="center" prop="reply"/>
        <el-table-column label="业主真名" align="center" prop="ownerRealName"/>
        <el-table-column label="业主电话" align="center" prop="ownerPhoneNumber"/>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark"/>
      </el-table>
    </el-dialog>
    <!--回复投诉-->
    <el-dialog :title="title" :visible.sync="dialogVisibleReply" width="40%" append-to-body>
      <el-form ref="form" :model="replyForm" label-width="120px">
        <el-form-item label="回复投诉/建议">
          <el-input type="textarea" v-model="replyForm.replyContent"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleReply = false">取 消</el-button>
        <el-button type="primary" @click="reply">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>

export default {
  name: "Suggest",
  // components: { Editor },
  data() {
    return {
      replyForm: {
        replyContent: ""
      },
      communities: {},
      communityId: '',
      //详细信息
      dialogVisibleMsg: false,
      //回复投诉
      dialogVisibleReply: false,
      //绑定状态
      suggestOption: [{
        value: 'Complaint',
        label: '投诉'
      }, {
        value: 'Suggest',
        label: '建议'
      }],
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
      // 投诉建议 表格数据
      suggestList: [],
      suggestListAll: [],
      // 弹出层标题
      title: "",
      // 查询参数
      queryParams: {
        communityId: '1338423709557272577',
        pageNum: 1,
        pageSize: 10,
        complaintSuggestType: null,
        complaintSuggestContent: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      currentSuggestId: "",
      complaintSuggestType: "",
    };
  },
  created() {
    this.getCommunityList().then(()=>{
      this.getList();
    });
  },
  methods: {
    /** 修改小区id */
    changeCommunity(id) {
      this.communityId = id;
      this.queryParams.communityId = id
      this.getList();
    },
    //图片显示
    handlePic() {
      this.dialogVisiblePic = true;
    },
    //详细信息
    handleMsg(row) {
      this.dialogVisibleMsg = true;
      this.getAll(row);
    },
    showReply(row) {
      this.dialogVisibleReply = true;
      this.currentSuggestId = row.complaintSuggestId
      this.complaintSuggestType = row.complaintSuggestType
    },
    //回复投诉
    async reply() {
      const {data: res} = await this.$http.put('/zyComplaintSuggest/updateSuggest', {
        complaintSuggestId: this.currentSuggestId,
        reply: this.replyForm.replyContent
      })
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.$message({
        type: 'success',
        message: '修改成功!'
      });
      this.dialogVisibleReply = false;
    },
    // 分页每页多少条数据
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getList();
    },
    // 状态翻译
    suggestStatusFormat(row, column) {
      if (row.complaintSuggestType == 'Suggest') {
        return '建议';
      } else if (row.complaintSuggestType == 'Complaint') {
        return '投诉';
      }
    },
    /** 查询投诉建议 列表 */
    async getList() {
      this.loading = true;
      const {data: res} = await this.$http.get('/zyComplaintSuggest/selectSuggestLimit', {
        params: {
          communityId: this.queryParams.communityId,
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          //查询
          complaintSuggestType: this.queryParams.complaintSuggestType,
          complaintSuggestId: this.queryParams.complaintSuggestId,
        }
      });
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.suggestList = res.data.records;
      this.total = res.data.pageable.total;
      this.loading = false
    },
    //详细信息
    async getAll(row) {
      this.loading = true;
      const {data: res} = await this.$http.get('/zyComplaintSuggest/selectSuggestById', {
        params: {
          suggestId: row.complaintSuggestId,
        }
      });
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.suggestListAll = [res.data];
      this.loading = false
    },
    // 表单重置
    reset() {
      this.form = {
        complaintSuggestId: null,
        complaintSuggestType: null,
        complaintSuggestContent: null,
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
      this.ids = selection.map(item => item.complaintSuggestId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
      this.communityId = res.data.zyCommunityList[0].communityId;
      this.queryParams.communityId = res.data.zyCommunityList[0].communityId;
      this.communities = res.data.zyCommunityList;
      this.loading = false
    },
    /** 导出按钮操作 */
    handleExport() {
      //设置全局配置信息
      const config = {
        method: 'get',
        url: 'zyComplaintSuggest/getExcel?suggestIds=' + this.ids,
        responseType: 'blob'
      };
      //发送请求
      // eslint-disable-next-line no-undef
      this.$http(config).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', '投诉建议信息.xls');
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
