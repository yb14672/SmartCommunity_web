<template>
  <div class="app-container">
    <!-- 模糊查询-->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="楼栋/单元" label-width="85px">
        <el-cascader
          :v-model="toOptions"
          :prop="cascaderProps"
          :options="options1"
          @change="handleChange"
          clearable
        />
      </el-form-item>
      <el-form-item label="房屋状态" prop="roomStatus">
        <el-select v-model="queryParams.roomStatus" placeholder="请选择房屋状态" @change="statusChange()" clearable
                   @clear="statusChange()"
                   size="small">
          <el-option
            v-for="dict in roomStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--CRUD+导出按钮-->
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
      <el-col :span="1.5" :offset="14">
        <el-select v-model="queryParams.communityId" @change="selectedCommunity(queryParams.communityId)"
                   style="border: 0;position: relative;" filterable placeholder="请选择小区"
                   class="avatar-container right-menu-item hover-effect" size="mini" value="">
          <el-option
            v-for="item in options"
            :key="item.communityId"
            :label="item.communityName"
            :value="item.communityId">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <br>

    <!--    数据展示模块-->
    <el-table v-loading="loading" :data="roomList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column label="房间id" v-if="show" align="center" prop="zyRoom.roomId"/>
      <el-table-column label="小区名称" align="center" prop="zyCommunity.communityName"/>
      <el-table-column label="楼栋名称" align="center" prop="zyBuilding.buildingName"/>
      <el-table-column label="单元名称" align="center" prop="zyUnit.unitName"/>
      <el-table-column label="楼层" align="center" prop="zyRoom.roomLevel"/>
      <el-table-column label="房间名称" align="center" prop="zyRoom.roomName"/>
      <el-table-column label="房间编号" align="center" prop="zyRoom.roomCode"/>
      <el-table-column label="房屋建筑面积" align="center" prop="zyRoom.roomAcreage"/>
      <el-table-column label="算费系数" align="center" prop="zyRoom.roomCost"/>
      <el-table-column label="房屋状态" align="center" prop="zyRoom.roomStatusData.dictLabel">
        <template slot-scope="scope">
          <DictTag :options="roomStatusOptions" :value="scope.row.zyRoom.roomStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="是否商铺" align="center" prop="zyRoom.roomIsShop">
        <template slot-scope="scope">
          {{ scope.row.roomIsShop === "Y" ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="是否商品房" align="center" prop="zyRoom.roomSCommercialHouse">
        <template slot-scope="scope">
          {{ scope.row.roomSCommercialHouse === "Y" ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="房屋户型" width="100" align="center" prop="zyRoom.roomHouseTypeData.dictLabel">
        <template slot-scope="scope">
          <DictTag :options="roomHouseTypeOptions" :value="scope.row.zyRoom.roomHouseType"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="zyRoom.createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | moment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="zyRoom.remark"/>
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

    <!-- 分页器 -->
    <div class="block" style="margin-top:15px;float: right;">
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

    <!--添加、修改房屋对话框-->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="楼栋/单元" prop="unitId" label-width="85px">
          <el-cascader
            v-model="value1"
            :options="options1"
          />
        </el-form-item>
        <el-form-item label="楼层" prop="roomLevel">
          <el-input type="number" v-model="form.roomLevel" placeholder="请输入楼层"/>
        </el-form-item>
        <el-form-item label="房间名称" prop="roomName">
          <el-input v-model="form.roomName" placeholder="请输入房间名称"/>
        </el-form-item>
        <el-form-item label="建筑面积" prop="roomAcreage">
          <el-input v-model="form.roomAcreage" placeholder="请输入房屋建筑面积"/>
        </el-form-item>
        <el-form-item label="算费系数" prop="roomCost">
          <el-input v-model="form.roomCost" placeholder="请输入算费系数"/>
        </el-form-item>
        <el-form-item label="房屋状态" prop="roomStatus">
          <el-select v-model="form.roomStatus" placeholder="请选择房屋状态">
            <el-option
              v-for="dict in roomStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否商铺">
          <el-radio-group v-model="form.roomIsShop">
            <el-radio
              v-for="dict in roomIsShops"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否商品房" label-width="82px">
          <el-radio-group v-model="form.roomSCommercialHouse">
            <el-radio
              v-for="dict in roomIsShops"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="房屋户型" prop="roomHouseType">
          <el-select v-model="form.roomHouseType" placeholder="请选择房屋户型">
            <el-option
              v-for="dict in roomHouseTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
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
export default {
  data() {
    return {
      //修改/添加选中的楼栋+单元信息
      value1: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      roomIsShops: [
        {
          dictLabel: "是",
          dictValue: "Y"
        },
        {
          dictLabel: "否",
          dictValue: "N"
        }
      ],
      //级联组件
      cascaderProps: {
        value: 'value',
        label: 'label',
        children: 'children',
      },
      //级联选择
      options: [],
      options1: [],
      //选择的单元信息
      toOptions: [],
      //选中的小区id
      communityId: "",
      show: false,
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 选中数组
      ids: [],
      // 查询参数
      queryParams: {
        pageNum: 1,//总页码
        pageSize: 5,//每页显示条数
        roomStatus: null,//房屋状态
        buildingId: null,//楼栋id
        unitId: null,//单元id
        communityId: '',//小区id
      },
      // 显示搜索条件
      showSearch: true,
      // 房屋状态字典
      roomStatusOptions: [],
      // 房屋户型字典
      roomHouseTypeOptions: [],
      // 总条数
      total: 0,
      // 获取房屋信息
      roomList: [],
      // 小区信息表格数据
      communityList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        unitId: [
          {required: true, message: '楼栋/单元不能为空', trigger: 'blur'}
        ],
        buildingId: [
          {required: true, message: '楼栋/单元不能为空', trigger: 'blur'}
        ],
        roomName: [
          {required: true, message: '房间名称不能为空', trigger: 'blur'}
        ],
        roomLevel: [
          {required: true, message: "楼层不能为空", trigger: "blur"},
          {pattern: /^[1-9]\d*$/, message: '请输入正确的整数格式', trigger: "change"}
        ],
        roomHouseType: [
          {required: true, message: "房屋户型不能为空", trigger: "blur"}
        ],
        roomIsShop: [
          {required: true, message: "是否商品不能为空", trigger: "blur"}
        ],
        roomSCommercialHouse: [
          {required: true, message: "是否商品房不能为空", trigger: "blur"}
        ],
        roomStatus: [
          {required: true, message: "房屋不能为空", trigger: "blur"}
        ],
        roomAcreage: [
          {required: true, message: '面积不能为空', trigger: 'blur'},
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '请输入正确格式,可保留两位小数',
            trigger: "change"
          }
        ],
      }
    }
  },
  created() {
    this.getCommunities().then(() => {
      this.getList();
    }).then(() => {
      this.getBuildingAndUnitListByCommunityId();
    });
    //查询需要使用的字典
    this.getDicts("zy_room_state").then(response => {
      this.roomStatusOptions = response.data.data;
    });
    //查询需要使用的字典
    this.getDicts("zy_house_state").then(response => {
      this.roomHouseTypeOptions = response.data.data;
    });
  },
  methods: {
    /** 去除空树 */
    clearTree(data){
      if(data!=null){
        let tree = this.getTreeData(data);
        let tree1=[];
        for (let i = 0; i < tree.length; i++) {
          if(tree[i].children!==undefined){
            tree1.push(tree[i]);
          }
        }
        return tree1;
      }
    },
    /** 过滤树形结构 */
    getTreeData(data) {
      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].children.length < 1) {
            // children若为空数组，则将children设为undefined
            data[i].children = undefined;
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(data[i].children);
          }
        }
      }
      return data;
    },
    /** 获取楼栋单元下拉框 */
    async getBuildingAndUnitListByCommunityId() {
      const {data: res} = await this.$http.get("/zyBuilding/buildingList/" + this.queryParams.communityId);
      this.options1 = this.clearTree(res.data);
    },
    /** 表单重置*/
    reset() {
      this.form = {
        buildingId: this.value1[0],
        unitId: this.value1[1],
        remark: "",
        roomAcreage: "",
        roomCost: "",
        roomLevel: "",
        roomName: "",
        communityId: this.queryParams.communityId,
        roomStatus: "",
        roomIsShop: "Y",
        roomSCommercialHouse: "N",
        roomHouseType: "",
      };
      this.resetForm("form");
    },
    /**变换查询状态时时触发*/
    statusChange() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /**变换查询小区时触发*/
    selectedCommunity(value) {
      this.queryParams.communityId = value
      this.queryParams.pageNum = 1
      this.communityId = value
      this.getBuildingAndUnitListByCommunityId();
      this.getList();
    },
    /**楼栋单元选中变换时执行的方法*/
    handleChange(value) {
      this.toOptions = value;
      this.queryParams.buildingId = value[0];
      this.queryParams.unitId = value[1];
      this.options = value;
      this.getList();
    },
    /**查询所有小区*/
    async getCommunities() {
      const {data: com} = await this.$http.get('/zyCommunity/selectAll', {
        params: {
          communityName: this.queryParams.communityName,
          communityCode: this.queryParams.communityCode,
          pageNum: 0,
          pageSize: 0,
        }
      });
      if (com.meta.errorCode !== 200) {
        return this.$message.error(com.meta.errorMsg)
      }
      this.options = com.data.zyCommunityList;
      this.queryParams.communityId = this.options[0].communityId;
      this.communityId = this.options[0].communityId
    },
    /** 查询 小区 下 楼栋 单元 房间 列表 */
    async getList() {
      this.loading = true;
      const {data: res} = await this.$http.get("/zyRoom/", {
        params: {
          current: this.queryParams.pageNum,
          size: this.queryParams.pageSize,
          roomStatus: this.queryParams.roomStatus,
          buildingId: this.queryParams.buildingId,
          unitId: this.queryParams.unitId,
          communityId: this.queryParams.communityId,
        }
      });
      if (res.meta.errorCode === 1006) {
        this.roomList = [];
        this.total = 0;
        this.loading = false;
        return this.$message.warning(res.meta.errorMsg)
      }
      if (res.meta.errorCode !== 200) {
        return this.$message.error(res.meta.errorMsg)
      }
      this.roomList = res.data.records;
      this.total = res.data.total;
      this.loading = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.buildingId = '';
      this.queryParams.unitId = '';
      this.toOptions = [];
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /**当前页改变时触发 跳转其他页*/
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getList();
    },
    /** 分页每页多少条数据 */
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getList();
    },
    /**多选框选中数据*/
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.zyRoom.roomId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /**  新增按钮操作*/
    handleAdd() {
      this.reset();
      // eslint-disable-next-line no-undef
      if (this.options1.length === 0 || this.options1[0].children.length === 0) {
        this.$message.error("该小区暂无楼栋以及单元，无法注册房屋信息！");
      } else {
        this.value1 = [this.options1[0].value, this.options1[0].children[0].value];
        this.form.roomSCommercialHouse = "Y"
        this.form.roomIsShop = "Y"
        this.open = true;
        this.title = "添加房屋";
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = row;
      this.value1 = [row.buildingId, row.unitId]
      this.open = true;
      this.title = "修改房屋 ";
    },
    /** 提交按钮 */
    submitForm: async function () {
      this.form.buildingId = this.value1[0];
      this.form.unitId = this.value1[1];
      this.form.communityId = this.queryParams.communityId;
      await this.$refs["form"].validate(async valid => {
        if (valid) {
          if (this.form.roomId != undefined) {
            //修改
            const {data: res} = await this.$http.put("zyRoom/updateZyRoom", this.form);
            if (res.meta.errorCode != 200) {
              return this.$message.error(res.meta.errorMsg);
            }
            this.reset();
            this.open = false;
            this.$message.success("修改成功");
            await this.getList();
          } else {
            //新增
            const {data: res} = await this.$http.post("zyRoom/insertZyRoom", this.form);
            if (res.meta.errorCode !== 200) {
              return this.$message.error(res.meta.errorMsg)
            }
            this.reset();
            this.open = false;
            this.$message.success("新增成功")
            await this.getList();
          }
        }
      })
    },
    /** 取消 按钮*/
    cancel() {
      this.form = {
        remark: "",
        roomAcreage: "",
        roomCost: "",
        roomLevel: "",
        roomName: "",
        communityId: "",
        roomStatus: "",
        roomIsShop: "",
        roomSCommercialHouse: "",
        roomHouseType: "",
      };
      this.value1 = [this.options1[0].value, this.options1[0].children[0].value];
      this.open = false;
      this.getList();
    },
    /** 单删+批量删除按钮操作 */
    handleDelete(row) {
      if (row.roomId !== undefined) {
        this.ids = [row.roomId]
      }
      const dictIds = row.roomId || this.ids;
      if (dictIds.length === 0) {
        this.$message.error("请选择要删除的数据！");
      } else {
        this.$confirm('是否确认删除字典编号为"' + dictIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http.delete("/zyRoom/deleteZyRoom?idList=" + this.ids).then((resp) => {
            if (resp.data.meta.errorCode === 200) {
              this.$message.success(resp.data.meta.errorMsg);
            } else {
              this.$message.error(resp.data.meta.errorMsg);
            }
            this.getList();
          });
        }).catch(() => {
          this.getList()
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      //设置全局配置信息
      const config = {
        method: 'get',
        url: 'zyRoom/getExcel?ids=' + this.ids,
        responseType: 'blob'
      };
      //发送请求
      this.$http(config).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', '房屋信息.xls');
          document.body.appendChild(link);
          link.click();
          if (response.data !== null) {
            this.$message.success("导出成功");
          }
        }
      )
    },
  },
}
</script>

<style scoped>
#app-container {
  overflow: scroll;
}
</style>
