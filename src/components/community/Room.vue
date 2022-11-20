<template>
    <div class="app-container">
<!--        &lt;!&ndash; 面包屑导航 &ndash;&gt;-->
<!--        <el-breadcrumb separator=">">-->
<!--            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>-->
<!--            <el-breadcrumb-item>社区资产</el-breadcrumb-item>-->
<!--            <el-breadcrumb-item>房屋信息</el-breadcrumb-item>-->
<!--        </el-breadcrumb>-->

        <!-- 模糊查询-->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-select v-model="queryParams.communityId" @change="selectedCommunity(queryParams.communityId)"
                       style="border: 0;position: relative;margin-left: 1000px" filterable placeholder="请选择小区"
                       class="avatar-container right-menu-item hover-effect" value="">
              <el-option
                      v-for="item in options"
                      :key="item.communityId"
                      :label="item.communityName"
                      :value="item.communityId">
              </el-option>
            </el-select>
            <el-form-item label="楼栋/单元" prop="selected" label-width="85px">
                <el-cascader
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


        <!--    CRUD+导入按钮-->
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
                        type="success"
                        icon="el-icon-edit"
                        size="mini"
                        :disabled="single"
                        @click="handleUpdate"
                >修改
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
            <el-table-column label="房间id" v-if="show" align="center" prop="roomId"/>
            <el-table-column label="小区名称" align="center" prop="zyCommunity.communityName"/>
            <el-table-column label="楼栋名称" align="center" prop="zyBuilding.buildingName"/>
            <el-table-column label="单元名称" align="center" prop="zyUnit.unitName"/>
            <el-table-column label="楼层" align="center" prop="roomLevel"/>
            <el-table-column label="房间名称" align="center" prop="roomName"/>
            <el-table-column label="房间编号" align="center" prop="roomCode"/>
            <el-table-column label="房屋建筑面积" align="center" prop="roomAcreage"/>
            <el-table-column label="算费系数" align="center" prop="roomCost"/>
            <el-table-column label="房屋状态" align="center" prop="roomStatusData.dictLabel"/>
            <el-table-column label="是否商铺" align="center" prop="roomIsShop">
                <template slot-scope="scope">
                    {{ scope.row.roomIsShop === "Y" ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column label="是否商品房" align="center" prop="roomSCommercialHouse">
                <template slot-scope="scope">
                    {{ scope.row.roomSCommercialHouse === "Y" ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column label="房屋户型" align="center" prop="roomHouseTypeData.dictLabel"/>
            <el-table-column label="创建时间" align="center" prop="createTime"/>
            <el-table-column label="备注" align="center" prop="remark"/>
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
        <div class="block" style="margin-top:15px;">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="queryParams.pageNum"
                    :page-size="queryParams.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>

        <!--    添加、修改房屋对话框-->
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

    import {Axios as axios} from "axios";

    export default {
        // 全局刷新
        inject: ['reload'],

        data() {
            return {
                //修改/添加选中的楼栋+单元信息
                value1: [],

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
                //级联选择
                options1: [],
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
                    communityId: null,//小区id
                },
                // 显示搜索条件
                showSearch: true,

                // 表格数据
                list: [],
                // 房屋状态字典
                roomStatusOptions: [],

                // 房屋户型字典
                roomHouseTypeOptions: [],

                // 总条数
                total: 0,

                // 获取房屋信息
                roomList: [],

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
            })

        },
        mounted() {
            // this.getlivestockInfo(1);
        },
        methods: {
            /**变换查询状态时时触发*/
            statusChange() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            /**变换查询小区时触发*/
            selectedCommunity(value) {
                this.queryParams.communityId = value
                this.queryParams.pageNum = 1
                this.getList();
                this.communityId = value
            },

            /**查询所有小区*/
            async getCommunities() {

                const {data: com} = await this.$http.get('zyRoom')
                console.log(com)
                this.options = com.data.records
                console.log(this.options)
                this.queryParams.communityId = this.options[0].communityId
                this.communityId = this.options[0].communityId
            },
            /**楼栋单元选中变换时执行的方法*/
            handleChange(value) {
                this.queryParams.buildingId = value[0]
                this.queryParams.unitId = value[1]
                this.queryParams.pageNum = 1
                this.getList();
            },


            /** 查询 小区 下 楼栋 单元 房间 列表 */
            async getList() {
                this.loading = true;
                console.log(this.queryParams)
                const {data: res} =await this.$http.get("zyRoom", {
                    params:{
                        current: this.queryParams.pageNum,
                        size: this.queryParams.pageSize,
                        roomStatus:this.queryParams.roomStatus,
                        buildingId: this.queryParams.buildingId,
                        unitId: this.queryParams.unitId,
                        communityId:this.queryParams.communityId,
                    }
                });
                console.log(res)
                if (res.meta.errorCode !== 200) {
                    return res.$message.error("获取列表失败")
                }
                this.list = res.data.records;
                this.total = res.data.total;
                this.loading = false;

    },

            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.reload();
            },

            /**当前页改变时触发 跳转其他页*/
            handleCurrentChange(val) {
                this.queryParams.pageNum = val;
                this.getList();
            },

            /**多选框选中数据*/
            handleSelectionChange(selection) {

                this.ids = selection.map(item => item.roomId)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },


            /**  新增按钮操作*/
            handleAdd() {
                if (this.options1.length === 0 || this.options1[0].children.length === 0) {
                    this.$message.error("该小区暂无楼栋以及单元，无法注册房屋信息！");
                } else {
                    console.log(this.options1);
                    this.value1 = [this.options1[0].value, this.options1[0].children[0].value];
                    this.form = {
                        buildingId: this.value1[0],
                        unitId: this.value1[1],
                        remark: "",
                        roomAcreage: "",
                        roomCost: "",
                        roomLevel: "",
                        roomName: "",
                        communityId: this.queryParams.communityId,
                        roomStatus: "none",
                        roomIsShop: "Y",
                        roomSCommercialHouse: "N",
                        roomHouseType: "other",
                    }

                    this.open = true;
                    this.title = "添加房屋";
                }

            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                console.log("row")
                console.log(row)
                this.form = row;
                this.value1 = [row.buildingId, row.unitId]
                this.open = true;
                this.title = "修改房屋 ";
            },
            /** 提交按钮 */
            submitForm: async function () {
                this.form.buildingId = this.value1[0];
                this.form.unitId = this.value1[1];
                await this.$refs["form"].validate(async valid => {
                    if (valid) {
                        let msg = (this.form.roomId !== undefined && this.form.roomId !== "") ? "修改" : "添加";
                        axios.post("/zyRoom/updateAndSaveZyRoom", this.form).then((res) => {
                            if (res.data.msg === "1") {
                                this.$message.error(msg + "失败,该小区楼栋单元下此房间已存在！")
                            } else {
                                this.$message.success(msg + "成功！")
                                this.getList();
                                this.open = false;
                            }
                        });
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

            /**  单删+批量删除按钮操作*/
            handleDelete(row) {
                if (row.roomId !== undefined) {
                    this.ids = [row.roomId]
                }
                const dictIds = row.roomId || this.ids;
                console.log(row.dictCode)
                if (dictIds.length === 0) {
                    this.$message.error("请选择要删除的数据！");
                } else {
                    this.$confirm('是否确认删除字典编号为"' + dictIds + '"的数据项?', "警告", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        if (row.roomStatus === "none") {
                            axios.post("/zyRoom/delZyRoom", this.ids).then((resp) => {
                                console.log("resp")
                                console.log()
                                if (resp.data.code === 200) {
                                    this.$message.success(resp.data.msg);
                                } else {
                                    this.$message.error(resp.data.msg);
                                }
                                this.getList();
                            });
                        } else {
                            this.$message.error('存在已被业主购买的房屋！不可删除！')
                        }
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
                    method: 'post',
                    url: 'zyRoom/getExcel',
                    data: this.ids,
                    responseType: 'blob'
                };
                //发送请求
                axios(config).then(response => {
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

</style>
