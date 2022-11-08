<template>
  <div class="app-container">
    <!-- 上方查询菜单表单 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
            v-model="queryParams.menuName"
            placeholder="请输入菜单名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.visible" placeholder="菜单状态" clearable size="small">
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
    <!-- 上方新增和批量删除按钮 -->
    <el-row :gutter="10" class="mb8" style="margin-bottom: 10px">
      <el-col :span="1.5">
        <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
        >新增
        </el-button>
        <el-button
            type="primary"
            icon="el-icon-delete"
            size="mini"
            @click="handleDel"
        >删除
        </el-button>
      </el-col>
    </el-row>
    <!--渲染所有菜单-->
    <el-table
        v-loading="loading"
        :data="menuList"
        row-key="menuId"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <i :class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="80"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
          >新增
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


    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                  v-model="form.parentId"
                  :options="menuOptions"
                  :normalizer="normalizer"
                  :show-count="true"
                  placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'F'" label="菜单图标">
              <icon-picker v-model="form.icon"></icon-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="是否外链">
              <el-radio-group v-model="form.isFrame">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'M'" label="权限标识" prop="perms">
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="显示状态">
              <el-radio-group v-model="form.visible">
                <el-radio
                    v-for="dict in visibleOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="菜单状态">
              <el-radio-group v-model="form.status">
                <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType == 'C'" label="是否缓存">
              <el-radio-group v-model="form.isCache">
                <el-radio :label="0">缓存</el-radio>
                <el-radio :label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--批量删除对话框-->
    <el-dialog
        title="删除"
        :visible.sync="dialogVisibleDel"
        width="30%">
      <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
      </el-input>
      <el-tree
          :data="menuTreeList"
          show-checkbox
          node-key="menuId"
          ref="tree"
          highlight-current
          :filter-node-method="filterNode"
          :props="defaultProps">
      </el-tree>
      <div class="buttons">
        <el-button @click="getCheckedKeys">确认删除</el-button>
        <el-button @click="resetChecked">清空</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";

export default {
  name: "Menu",
  components: {Treeselect},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 是否显示弹出层
      open: false,
      //显示删除列表
      dialogVisibleDel: false,
      // 弹出层标题
      title: "",
      //批量删除查询的文本
      filterText: '',
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      //批量删除列表
      menuTreeList: [],
      // 显示状态数据字典
      visibleOptions: [],
      // 菜单状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // 表单参数
      form: {},
      // 修改表单参数
      form1: {},
      // 表单校验
      rules: {
        menuName: [
          {required: true, message: "菜单名称不能为空", trigger: "blur"}
        ],
        orderNum: [
          {required: true, message: "菜单顺序不能为空", trigger: "blur"}
        ],
        path: [
          {required: true, message: "路由地址不能为空", trigger: "blur"}
        ],
        component: [
          {required: true, message: "组件路径不能为空", trigger: "blur"}
        ],
        perms: [
          {required: true, message: "权限标识不能为空", trigger: "blur"}
        ]
      },
      //用于初始化批量删除
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },

    };
  },
  created() {
    this.getList();
    this.visibleOptions = this.getDict('sys_show_hide')
    this.statusOptions = this.getDict('sys_normal_disable')
    // this.getDicts("sys_show_hide").then(response => {
    //   this.visibleOptions = response.data;
    // });
    // this.getDicts("sys_normal_disable").then(response => {
    //   this.statusOptions = response.data;
    // });
  },
  methods: {
    // 选择图标
    // selected(name) {
    //   this.form.icon = name;
    // },
    /**获取字典列表*/
    async getDict(deptType) {
      if (deptType === 'sys_show_hide') {
        const {data: res} = await this.$http.get(`sysDictData/getDict?dictType=${deptType}`);
        this.visibleOptions = res.data
      } else {
        const {data: res} = await this.$http.get(`sysDictData/getDict?dictType=${deptType}`);
        this.statusOptions = res.data
      }
    },
    /** 查询菜单列表 */
    async getList() {
      const {data: res} = await this.$http.get('sysMenu/queryMenus', {
        params: {
          menuName: this.queryParams.menuName,
          visible: this.queryParams.visible
        }
      });
      // console.log(this.queryParams.visible)
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.menuList = res.data;
      this.menuTreeList = res.data;
      this.loading = false
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    async getTreeselect() {
      this.menuOptions = [];
      const menu = {menuId: 0, menuName: '主类目', children: []};
      const {data: res} = await this.$http.get('sysMenu/queryMenus');
      menu.children = res.data;
      this.menuOptions.push(menu)
    },
    /** 显示状态字典翻译*/
    visibleFormat(row) {
      if (row.menuType == "F") {
        return "";
      }
      return this.selectDictLabel(this.visibleOptions, row.visible);
    },
    /** 菜单状态字典翻译*/
    statusFormat(row) {
      // console.log(row)
      if (row.menuType == "F") {
        return "";
      }
      return this.selectDictLabel(this.statusOptions, row.visible);
    },
    /** 取消按钮*/
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置*/
    reset() {
      this.form = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: "M",
        orderNum: undefined,
        isFrame: "1",
        isCache: "0",
        visible: "0",
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.menuName = undefined
      this.queryParams.visible = undefined
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.open = true;
      this.reset();
      this.getTreeselect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加菜单";
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      await this.getTreeselect();
      const {data: res} = await this.$http.get(`sysMenu/${row.menuId}`);
      if (res.code !== 0) {
        return this.$message.error("获取失败！")
      }
      this.open = true;
      this.form = res.data;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          if (this.form.menuId != undefined) {
            const {data: res} = await this.$http.put("sysMenu/updateMenu", this.form);
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg)
            }
            this.open = false;
            await this.getList();
            return this.$message.success("修改成功！")
          } else {
            const {data: res} = await this.$http.post("sysMenu/addMenu", this.form);
            console.log(res);
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg);
            }
            this.$message.success("新增成功");
            this.open = false;
            await this.getList();
          }
        }
      });
    },
    /**删除单个菜单*/
    async handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() =>{
        // 通过方法？带参
        this.$http.delete("/sysMenu/deleteById?id=" + row.menuId)
          .then((res) => {
            console.log(res)
            console.log(res.data.meta.errorCode)
            if (res.data.meta.errorCode === 200) {
              // 重新获取页面
              this.getList();
              this.$message.success("删除成功");
            } else {
              this.$message.warning(res.data.meta.errorMsg);
            }
          })
      })
    },
    /** 显示批量删除 */
    handleDel: function () {
      this.dialogVisibleDel = true;
    },
    /** 批量删除 */
    getCheckedKeys() {
      //获取的id列表
      //console.log(this.$refs.tree.getCheckedKeys());
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //判断是否空删除
        if (this.$refs.tree.getCheckedKeys()[0] !== undefined) {
          // 通过方法？带参
          this.$http.delete("/sysMenu?idList=" + this.$refs.tree.getCheckedKeys())
              .then((res) => {
                console.log(res.data.meta.errorCode)
                if (res.data.meta.errorCode === 200) {
                  // 重新获取页面
                  this.getList();
                  this.$message.success("删除成功");
                  this.dialogVisibleDel = false;
                } else {
                  this.$message.warning(res.data.meta.errorMsg);
                }
              })
        } else {
          this.$message.warning("未选择要删除的菜单");
        }
      })
          // 取消删除
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
    },
    /** 重置批量删除选择 */
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    /**批量删除中的查询*/
    filterNode(value, data) {
      return data.menuName.indexOf(value) !== -1;
    },
  },
  watch: {
    //使用监听器监听批量删除菜单的查询栏
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
};
</script>