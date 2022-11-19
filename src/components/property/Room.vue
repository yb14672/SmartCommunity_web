<!--<template>-->
<!--  <div class="app-container">-->
<!--    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">-->

<!--      <el-form-item label="单元/楼栋" prop="selected" label-width="85px">-->
<!--                        <el-cascader-->
<!--                          v-model="selectedSearchInfo"-->
<!--                          :props="cascaderProps"-->
<!--                          :options="SearchOptions"-->
<!--                          @change="selectedUnitBuilding"-->
<!--                        ></el-cascader>-->
<!--                     </el-form-item>-->
<!--      <el-form-item label="房屋状态" prop="roomStatus">-->
<!--        <el-select v-model="queryParams.roomStatus" placeholder="请选择房屋状态" clearable size="small">-->
<!--          <el-option-->
<!--            v-for="dict in roomStatusOptions"-->
<!--            :key="dict.dictValue"-->
<!--            :label="dict.dictLabel"-->
<!--            :value="dict.dictValue"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->


<!--      <el-form-item>-->
<!--        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

<!--    <el-row :gutter="10" class="mb8">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
<!--    </el-row>-->

<!--    <el-table v-loading="loading" :data="roomList" @selection-change="handleSelectionChange">-->
<!--      <el-table-column type="selection" width="55" align="center" />-->
<!--      <el-table-column-->
<!--                      label="序号"-->
<!--                      type="index"-->
<!--                      width="50"-->
<!--                      align="center">-->
<!--                  </el-table-column>-->
<!--      <el-table-column label="房间id" v-if="show" align="center" prop="roomId" />-->
<!--      <el-table-column label="小区名称" align="center" prop="communityName" />-->
<!--      <el-table-column label="楼栋名称" align="center" prop="buildingName" />-->
<!--      <el-table-column label="单元名称" align="center" prop="unitName" />-->
<!--      <el-table-column label="楼层" align="center" prop="roomLevel" />-->
<!--      <el-table-column label="房间名称" align="center" prop="roomName" />-->
<!--      <el-table-column label="房间编号" align="center" prop="roomCode" />-->
<!--      <el-table-column label="房屋建筑面积" align="center" prop="roomAcreage" />-->
<!--      <el-table-column label="算费系数" align="center" prop="roomCost" />-->
<!--      <el-table-column label="房屋状态" align="center" prop="roomStatus" :formatter="roomStatusFormat" />-->
<!--      <el-table-column label="是否商铺" align="center" prop="roomIsShop" :formatter="roomIsShopFormat" />-->
<!--      <el-table-column label="是否商品房" align="center" prop="roomSCommercialHouse" :formatter="roomSCommercialHouseFormat" />-->
<!--      <el-table-column label="房屋户型" align="center" prop="roomHouseType" :formatter="roomHouseTypeFormat" />-->
<!--      <el-table-column label="创建时间" align="center" prop="createTime" />-->
<!--      <el-table-column label="备注" align="center" prop="remark" />-->
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--          >删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->

<!--    &lt;!&ndash; 添加或修改房间 对话框 &ndash;&gt;-->
<!--    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>-->
<!--      <el-form ref="form" :model="form" :rules="rules" label-width="80px">-->
<!--        <el-form-item label="单元/楼栋" prop="selected" label-width="85px">-->
<!--                        <el-cascader-->
<!--                          v-model="selectedAreaInfo"-->
<!--                          :props="cascaderProps"-->
<!--                          :options="unitBuildingOptions"-->
<!--                          @change="selectedUnitBuilding"-->
<!--                        ></el-cascader>-->
<!--                     </el-form-item>-->
<!--        <el-form-item label="楼层" prop="roomLevel">-->
<!--          <el-input v-model="form.roomLevel" placeholder="请输入楼层" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="房间名称" prop="roomName">-->
<!--          <el-input v-model="form.roomName" placeholder="请输入房间名称" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="建筑面积" prop="roomAcreage">-->
<!--          <el-input v-model="form.roomAcreage" placeholder="请输入房屋建筑面积" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="算费系数" prop="roomCost">-->
<!--          <el-input v-model="form.roomCost" placeholder="请输入算费系数" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="房屋状态" prop="roomStatus">-->
<!--          <el-select v-model="form.roomStatus" placeholder="请选择房屋状态">-->
<!--            <el-option-->
<!--              v-for="dict in roomStatusOptions"-->
<!--              :key="dict.dictValue"-->
<!--              :label="dict.dictLabel"-->
<!--              :value="dict.dictValue"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="是否商铺">-->
<!--          <el-radio-group v-model="form.roomIsShop">-->
<!--            <el-radio-->
<!--              v-for="dict in roomIsShopOptions"-->
<!--              :key="dict.dictValue"-->
<!--              :label="dict.dictValue"-->
<!--            >{{dict.dictLabel}}</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="是否商品房" label-width="82px">-->
<!--          <el-radio-group v-model="form.roomSCommercialHouse">-->
<!--            <el-radio-->
<!--              v-for="dict in roomSCommercialHouseOptions"-->
<!--              :key="dict.dictValue"-->
<!--              :label="dict.dictValue"-->
<!--            >{{dict.dictLabel}}</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="房屋户型" prop="roomHouseType">-->
<!--          <el-select v-model="form.roomHouseType" placeholder="请选择房屋户型">-->
<!--            <el-option-->
<!--              v-for="dict in roomHouseTypeOptions"-->
<!--              :key="dict.dictValue"-->
<!--              :label="dict.dictLabel"-->
<!--              :value="dict.dictValue"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="备注" prop="remark">-->
<!--          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--        <el-button @click="cancel">取 消</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->

<!--export default {-->
<!--  name: "Room",-->
<!--  data() {-->
<!--    return {-->
<!--      show: false,-->
<!--      // 遮罩层-->
<!--      loading: true,-->
<!--      // 选中数组-->
<!--      ids: [],-->
<!--      // 非单个禁用-->
<!--      single: true,-->
<!--      // 非多个禁用-->
<!--      multiple: true,-->
<!--      // 显示搜索条件-->
<!--      showSearch: true,-->
<!--      // 总条数-->
<!--      total: 0,-->
<!--      roomList: [],-->
<!--      //选中的单元楼栋信息-->
<!--       selectedAreaInfo: [],-->
<!--       //搜索时单元楼栋信息-->
<!--       selectedSearchInfo: [],-->
<!--       //单元楼栋信息-->
<!--       unitBuildingOptions: [],-->
<!--       //搜索时单元楼栋-->
<!--       SearchOptions: [],-->
<!--      // 弹出层标题-->
<!--      title: "",-->
<!--      // 是否显示弹出层-->
<!--      open: false,-->
<!--      // 房屋状态字典-->
<!--      roomStatusOptions: [],-->
<!--      // 是否商铺字典-->
<!--      roomIsShopOptions: [],-->
<!--      // 是否商品房字典-->
<!--      roomSCommercialHouseOptions: [],-->
<!--      // 房屋户型字典-->
<!--      roomHouseTypeOptions: [],-->
<!--      //级联组件配置-->
<!--       cascaderProps: {-->
<!--       value: 'code',-->
<!--       label: 'name'-->
<!--      },-->
<!--      // 查询参数-->
<!--      queryParams: {-->
<!--        pageNum: 1,-->
<!--        pageSize: 10,-->
<!--        roomLevel: null,-->
<!--        roomCode: null,-->
<!--        roomAcreage: null,-->
<!--        roomCost: null,-->
<!--        roomStatus: null,-->
<!--        roomIsShop: null,-->
<!--        roomSCommercialHouse: null,-->
<!--        roomHouseType: null,-->
<!--      },-->
<!--      // 表单参数-->
<!--      form: {},-->
<!--      // 表单校验-->
<!--      rules: {-->
<!--       selected: [-->
<!--          { required: true, message: '楼栋/单元不能为空', trigger:  'blur' }-->
<!--        ],-->
<!--        roomName: [-->
<!--          { required: true, message: '房间名称不能为空', trigger:  'blur' }-->
<!--        ],-->
<!--        roomLevel: [-->
<!--          { required: true, message: "楼层不能为空", trigger: "blur" },-->
<!--          { pattern: /^[1-9]\d*$/, message: '请输入正确的整数格式',trigger: "change" }-->
<!--        ],-->
<!--         roomHouseType: [-->
<!--          { required: true, message: "房屋户型不能为空", trigger: "blur" }-->
<!--        ],-->
<!--        roomIsShop: [-->
<!--          { required: true, message: "是否商品不能为空", trigger: "blur" }-->
<!--        ],-->
<!--        roomSCommercialHouse: [-->
<!--          { required: true, message: "是否商品房不能为空", trigger: "blur" }-->
<!--        ],-->
<!--        roomStatus: [-->
<!--          { required: true, message: "房屋不能为空", trigger: "blur" }-->
<!--        ],-->
<!--         roomAcreage: [-->
<!--          { required: true, message: '面积不能为空', trigger:  'blur' },-->
<!--          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数',trigger: "change" }-->
<!--        ],-->
<!--      }-->
<!--    };-->
<!--  },-->
<!--  created() {-->
<!--    this.getList();-->
<!--    this.getDicts("zy_room_state").then(response => {-->
<!--      this.roomStatusOptions = response.data;-->
<!--    });-->
<!--    this.getDicts("sys_yes_no").then(response => {-->
<!--      this.roomIsShopOptions = response.data;-->
<!--    });-->
<!--    this.getDicts("sys_yes_no").then(response => {-->
<!--      this.roomSCommercialHouseOptions = response.data;-->
<!--    });-->
<!--    this.getDicts("zy_house_state").then(response => {-->
<!--      this.roomHouseTypeOptions = response.data;-->
<!--    });-->
<!--    queryPullDownRoom().then(response => {-->
<!--       this.unitBuildingOptions = response.data;-->
<!--       this.SearchOptions = response.data;-->
<!--     });-->
<!--  },-->
<!--  methods: {-->
<!--     //获取选中的单元楼栋-->
<!--     selectedUnitBuilding(detail) {-->
<!--        this.form.selected = detail-->
<!--        this.selectedAreaInfo = detail-->
<!--     },-->
<!--    /** 查询房间 列表 */-->
<!--    async getList() {-->
<!--      this.loading = true;-->
<!--      const {data: res} = await this.$http.get('/zyBuilding/selectBuildLimit', {-->
<!--        params: {-->
<!--          pageNum: this.queryParams.pageNum,-->
<!--          pageSize: this.queryParams.pageSize,-->
<!--          buildingName: this.queryParams.buildingName,-->
<!--          buildingCode: this.queryParams.buildingCode,-->
<!--          communityId: this.communityId,-->
<!--        }-->
<!--      });-->
<!--      if (res.meta.errorCode !== 200) {-->
<!--        return this.$message.error(res.meta.errorMsg)-->
<!--      }-->
<!--      this.buildingList = res.data.zyBuildingList;-->
<!--      this.total = res.data.pageable.total;-->
<!--      this.loading = false-->
<!--    },-->
<!--    // 房屋状态字典翻译-->
<!--    roomStatusFormat(row, column) {-->
<!--      return this.selectDictLabel(this.roomStatusOptions, row.roomStatus);-->
<!--    },-->
<!--    // 是否商铺字典翻译-->
<!--    roomIsShopFormat(row, column) {-->
<!--      return this.selectDictLabel(this.roomIsShopOptions, row.roomIsShop);-->
<!--    },-->
<!--    // 是否商品房字典翻译-->
<!--    roomSCommercialHouseFormat(row, column) {-->
<!--      return this.selectDictLabel(this.roomSCommercialHouseOptions, row.roomSCommercialHouse);-->
<!--    },-->
<!--    // 房屋户型字典翻译-->
<!--    roomHouseTypeFormat(row, column) {-->
<!--      return this.selectDictLabel(this.roomHouseTypeOptions, row.roomHouseType);-->
<!--    },-->
<!--    // 取消按钮-->
<!--    cancel() {-->
<!--      this.open = false;-->
<!--      this.reset();-->
<!--    },-->
<!--    // 表单重置-->
<!--    reset() {-->
<!--      this.form = {-->
<!--        roomId: null,-->
<!--        communityId: null,-->
<!--        buildingId: null,-->
<!--        unitId: null,-->
<!--        roomLevel: null,-->
<!--        roomCode: null,-->
<!--        roomAcreage: null,-->
<!--        roomCost: null,-->
<!--        roomStatus: null,-->
<!--        roomIsShop: 'Y',-->
<!--        roomSCommercialHouse: 'Y',-->
<!--        roomHouseType: null,-->
<!--        createBy: null,-->
<!--        createTime: null,-->
<!--        updateBy: null,-->
<!--        updateTime: null,-->
<!--        remark: null,-->
<!--        selected: null-->
<!--      };-->
<!--      this.resetForm("form");-->
<!--    },-->
<!--    /** 搜索按钮操作 */-->
<!--    handleQuery() {-->
<!--      this.queryParams.buildingId = this.selectedSearchInfo[0]-->
<!--      this.queryParams.unitId = this.selectedSearchInfo[1]-->
<!--      this.queryParams.pageNum = 1;-->
<!--      this.getList();-->
<!--    },-->
<!--    /** 重置按钮操作 */-->
<!--    resetQuery() {-->
<!--      this.resetForm("queryForm");-->
<!--      this.selectedSearchInfo = [];-->
<!--      this.handleQuery();-->
<!--    },-->
<!--    // 多选框选中数据-->
<!--    handleSelectionChange(selection) {-->
<!--      this.ids = selection.map(item => item.roomId)-->
<!--      this.single = selection.length!==1-->
<!--      this.multiple = !selection.length-->
<!--    },-->
<!--    /** 新增按钮操作 */-->
<!--    handleAdd() {-->
<!--      this.reset();-->
<!--      this.selectedAreaInfo = [],-->
<!--      queryPullDownRoom().then(response => {-->
<!--         this.unitBuildingOptions = response.data-->
<!--      });-->
<!--      this.open = true;-->
<!--      this.title = "添加房间 ";-->
<!--    },-->
<!--    /** 修改按钮操作 */-->
<!--    handleUpdate(row) {-->
<!--      this.reset();-->
<!--      const roomId = row.roomId || this.ids-->
<!--      getRoom(roomId).then(response => {-->
<!--        this.form = response.data;-->
<!--        this.selectedAreaInfo[0] = this.form.buildingId-->
<!--        this.selectedAreaInfo[1] = this.form.unitId-->
<!--        this.form.selected = this.selectedAreaInfo;-->
<!--        queryPullDownRoom().then(response => {-->
<!--            this.unitBuildingOptions = response.data-->
<!--         })-->
<!--        this.open = true;-->
<!--        this.title = "修改房间 ";-->
<!--      });-->
<!--    },-->
<!--    /** 提交按钮 */-->
<!--    submitForm() {-->
<!--      this.$refs["form"].validate(valid => {-->
<!--        if (valid) {-->
<!--          if (this.form.roomId != null) {-->
<!--             this.form.buildingId = this.selectedAreaInfo[0]-->
<!--             this.form.unitId = this.selectedAreaInfo[1]-->
<!--            updateRoom(this.form).then(response => {-->
<!--              this.msgSuccess("修改成功");-->
<!--              this.open = false;-->
<!--              this.getList();-->
<!--            });-->
<!--          } else {-->
<!--             this.form.buildingId = this.selectedAreaInfo[0]-->
<!--             this.form.unitId = this.selectedAreaInfo[1]-->
<!--             addRoom(this.form).then(response => {-->
<!--                this.msgSuccess("新增成功");-->
<!--                this.open = false;-->
<!--                this.getList();-->
<!--            });-->
<!--          }-->
<!--        }-->
<!--      });-->
<!--    },-->
<!--    /** 删除按钮操作 */-->
<!--    handleDelete(row) {-->
<!--      const roomIds = row.roomId || this.ids;-->
<!--      this.$confirm('是否确认删除房间 编号为"' + roomIds + '"的数据项?', "警告", {-->
<!--          confirmButtonText: "确定",-->
<!--          cancelButtonText: "取消",-->
<!--          type: "warning"-->
<!--        }).then(function() {-->
<!--          return delRoom(roomIds);-->
<!--        }).then(() => {-->
<!--          this.getList();-->
<!--          this.msgSuccess("删除成功");-->
<!--        })-->
<!--    },-->
<!--    /** 导出按钮操作 */-->
<!--    handleExport() {-->
<!--      const queryParams = this.queryParams;-->
<!--      this.$confirm('是否确认导出所有房间 数据项?', "警告", {-->
<!--          confirmButtonText: "确定",-->
<!--          cancelButtonText: "取消",-->
<!--          type: "warning"-->
<!--        }).then(function() {-->
<!--          return exportRoom(queryParams);-->
<!--        }).then(response => {-->
<!--          this.download(response.msg);-->
<!--        })-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->
