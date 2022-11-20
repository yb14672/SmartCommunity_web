<template>
  <div class="app-container">
    <h4 class="form-header h4">基本信息</h4>
    <hr/>
    <!--显示用户的基本信息-->
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="form.userName" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--分配角色的显示表格-->
    <h4 class="form-header h4">角色信息</h4>
    <hr/>
    <el-table v-loading="loading"
              :row-key="getRowKey"
              ref="table"
              :data="roles"
              @current-change="currentChange"
              @selection-change="chooseInstance">
      <el-table-column label="序号" type="index" align="center">
        <template slot-scope="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column type="selection" label="选择" width="55"></el-table-column>
      <el-table-column label="角色编号" align="center" prop="roleId"/>
      <el-table-column label="角色名称" align="center" prop="roleName"/>
      <el-table-column label="权限字符" align="center" prop="roleKey"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | moment }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div align="right">
      <el-pagination
          v-show="total>0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"/>
    </div>
    <!--操作-->
    <el-form label-width="100px">
      <el-form-item style="text-align: center;margin-left:-120px;margin-top:30px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "AuthRole",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 分页信息
      total: 0,
      pageNum: 1,
      pageSize: 10,
      // 选中角色编号
      roleId: '',
      // 角色信息
      roles: [],
      // 用户信息
      form: {}
    };
  },
  created() {
    //获取跳转过来时传过来的用户id
    const userId = this.$route.params && this.$route.params.userId;
    //若有用户ID则获取对应信息
    if (userId) {
      this.loading = true;
      //获取当前用户信息、已有角色
      this.getAuthRole(userId).then((res) => {
        if (res.data.meta.errorCode !== 200) {
          return this.$message.error(res.data.meta.errorMsg);
        }
        this.form = res.data.data;
      });
      //获取所有的角色
      this.getRoleList().then((res) => {
        if (res.data.meta.errorCode !== 200) {
          return this.$message.error(res.data.meta.errorMsg);
        }
        this.roles = res.data.data.records;
        this.total = res.data.data.total;
        this.pageNum = res.data.data.current;
        this.pageSize = res.data.data.size;
        this.$nextTick(() => {
          this.roles.forEach((row) => {
            for (let i = 0; i < this.form.roleList.length; i++) {
              if(this.form.roleList[i].roleId==row.roleId){
                this.$refs.table.toggleRowSelection(row,true);
              }
            }
          });
        });
      });
      this.loading = false;
    }
  },
  methods: {
    /** 查询当前选择的用户及其角色 */
    getAuthRole(userId) {
      return this.$http.get("/sysUser/authRole/" + userId)
    },
    /** 查询所有角色 */
    getRoleList() {
      return this.$http.get("/sysRole/getRoleList/", {
        params: {
          current: this.pageNum,
          size: this.pageSize,
        }
      })
    },
    /** 点击选择框切换 */
    chooseInstance (val) {
      if (val.length > 1) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(val.pop())
        this.roleId=val[0].roleId;
      }
    },
    /** 点击行就切换 */
    currentChange(currentRow, oldCurrentRow) {
      this.$refs.table.toggleRowSelection(currentRow)
      this.roleId=currentRow.roleId;
    },
    /** 保存选中的数据编号 */
    getRowKey(row) {
      return row.roleId;
    },
    /** 提交按钮 */
    async submitForm() {
      //当前的用户id
      const userId = this.form.userId;
      //修改后的角色id列表
      const roleId = this.roleId;
      const {data: res} = await this.$http.put('sysUser/authRole', {
        userId: userId,
        roleId: roleId
      });
      if(res.meta.errorCode!==200){
        this.$message.error(res.meta.errorMsg);
      }else{
        this.$message.success("分配成功");
        await this.$router.push('/system/user');
      }
    },
    /** 关闭按钮 */
    close() {
      this.$router.push('/system/user')
    },
    /**  分页每页多少条数据 */
    handleSizeChange(val) {
      this.pageSize = val;
      this.getRoleList().then((res) => {
        if (res.data.meta.errorCode !== 200) {
          return this.$message.error(res.data.meta.errorMsg);
        }
        this.roles = res.data.data.records;
        this.total = res.data.data.total;
        this.pageNum = res.data.data.current;
        this.pageSize = res.data.data.size;
      });
    },
    /** 点击切换上下页 */
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getRoleList().then((res) => {
        if (res.data.meta.errorCode !== 200) {
          return this.$message.error(res.data.meta.errorMsg);
        }
        this.roles = res.data.data.records;
        this.total = res.data.data.total;
        this.pageNum = res.data.data.current;
        this.pageSize = res.data.data.size;
      });
    },
  },
};
</script>
<style scoped lang="less">
::v-deep .el-table .has-gutter .el-checkbox .el-checkbox__inner {
  display: none;
}

::v-deep .el-table .cell::before {
  content: '';
  text-align: center;
  line-height: 37px;
}
</style>