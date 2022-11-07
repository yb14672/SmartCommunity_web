<template>
  <el-card class="box-card" style="width: 100%;">
    <!--上方栏查询表单-->
    <div slot="header" class="clearfix">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }" class="el-icon-s-unfold"> 首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/system">系统管理</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="/menu">菜单管理</a></el-breadcrumb-item>
        <el-select v-model="value" placeholder="请选择地址" style="position: absolute; right: 130px;">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-breadcrumb>
      菜单名称:
      <el-select
          v-model="value"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入菜单名称"
          :remote-method="remoteMethod"
          :loading="loading">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <div style="margin: 20px 0px">
        <el-button type="primary" @click="addMenu()">+新增</el-button>
      </div>
    </div>
    <!--下方渲染数据-->
    <div>
      <el-table
          :data="tableData"
          style="width: 100%">
        <el-table-column
            prop="menuName"
            label="系统名称"
            width="180">
        </el-table-column>
        <el-table-column prop="icon" label="图标" align="center" width="100">
          <template slot-scope="scope">
            <i :class="'el-icon-'+scope.row.icon"/>
          </template>
        </el-table-column>
        <el-table-column
            prop="orderNum"
            label="排序">
        </el-table-column>
        <el-table-column
            prop="perms"
            label="权限标识">
        </el-table-column>
        <el-table-column
            prop="component"
            label="组件路径">
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态">
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间">
        </el-table-column>
        <el-table-column
            prop=""
            label="操作">
          <template slot-scope="scope">
            <!--scope.row回调，把那一行的数据拿到-->
            <el-button @click="updateMenu(scope.row)" type="text" size="small" class="el-icon-edit">修改</el-button>
            <el-button @click="addMenu()" type="text" size="small" class="el-icon-plus">新增</el-button>
            <!--<el-button @click="delMenu(scope.row.id)" type="text" size="small" class="el-icon-document-delete">
              删除
            </el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加表单-->
    <el-dialog
        title="添加"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <el-form ref="form" :model="menuForm" label-width="80px">
        <el-form-item label="系统名称">
          <el-input v-model="menuForm.menuName"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input type="textarea" v-model="menuForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input type="textarea" v-model="menuForm.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input type="textarea" v-model="menuForm.component"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input type="textarea" v-model="menuForm.status"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input type="textarea" v-model="menuForm.createTime"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMenu">确 定</el-button>
            </span>
    </el-dialog>
    <!--修改表单-->
    <el-dialog
        title="修改菜单"
        :visible.sync="dialogVisible1"
        width="40%">
      <el-form ref="form" :model="menuForm" label-width="80px">
        <el-form-item label="上级菜单">
          <el-select v-model="menuForm.region" placeholder="请选择活动菜单">
            <el-option label="系统管理" value="shanghai"></el-option>
            <el-option label="菜单管理" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio v-model="radio" label="1">目录</el-radio>
          <el-radio v-model="radio" label="2">菜单</el-radio>
          <el-radio v-model="radio" label="3">按钮</el-radio>
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="menuForm.menuIcon"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="menuForm.menuName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="name">
              <el-input type="number" v-model="menuForm.menuName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否外链">
              <el-radio v-model="radio" label="1">是</el-radio>
              <el-radio v-model="radio" label="2">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址" prop="name">
              <el-input v-model="menuForm.menuAddress"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组件路径" prop="name">
              <el-input v-model="menuForm.menuPath"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限标识" prop="name">
              <el-input v-model="menuForm.menuAddress"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="显示状态">
              <el-radio v-model="radio" label="1">显示</el-radio>
              <el-radio v-model="radio" label="2">隐藏</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单状态">
              <el-radio v-model="radio" label="1">正常</el-radio>
              <el-radio v-model="radio" label="2">停用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="是否缓存">
          <el-radio v-model="radio" label="1">缓存</el-radio>
          <el-radio v-model="radio" label="2">不缓存</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateMenu">确定</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      loading: false,
      menuForm: {
        menuName: '',
        icon: '',
        orderNum: '',
        perms: '',
        component: '',
        menuType: '',
        createTime: '',
        sysMenu: ""
      },

      tableData: [{
        date: '',
        name: '',
        address: '',
      },],
      options: [{
        value: '选项1',
        label: '恒大城二期'
      }, {
        value: '选项2',
        label: '恒大城三期'
      },
      ],
      value: ''
    }
  },
  created() {
    this.getMenuInfo();
  },
  methods: {
    // 修改
    updateMenu: async function () {
      this.dialogVisible1 = true
      // this.menuForm把对象带过去进行修改
      await this.axios.put("/updateMenu", this.menuForm).then((res1) => {
        console.log("res1" + res1)
        if (res1) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          // 关闭出来的弹窗
          this.dialogVisible1 = false
          this.getMenuInfo()
        } else {
          this.$message({
            message: '修改失败',
            type: 'error'
          });
        }
      })
    },
    remoteMethod() {
    },
    async getMenuInfo() {
      const {data: res} = await this.$http.get("sysMenu/getMenu", {});
      this.tableData = res.data;
      console.log(res)
    },
    addMenu(row) {
      this.dialogVisible = true
      console.log(row);
      this.menuForm.menuName = row.menuName
      this.menuForm.icon = row.icon
      this.menuForm.orderNum = row.orderNum
      this.menuForm.perms = row.perms
      this.menuForm.component = row.component
      this.menuForm.menuType = row.menuType
      this.menuForm.createTime = row.createTime
      this.menuForm.sysMenu = row.sysMenu
    },
    delMenu: function (id) {
      console.log(id);
      //调用接口删除指定数据
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // eslint-disable-next-line no-undef
        // 通过方法？带参
        this.axios.delete("/delMenu?menuId=" + id).then(() => {
          this.$message.success("删除成功");
          // 重新获取页面
          this.getMenuInfo()
        })

      })
          // 取消删除
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
    },
  }
}

</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

</style>
