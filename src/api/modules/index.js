/*
 * @Author: daidai
 * @Date: 2021-12-23 11:18:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-28 15:10:45
 * @FilePath: \web-pc\src\api\modules\index.js
 */
import * as API from "../api";

export const paramType ={
    'big1':"/bigScreen/getRoomStatuses", //房屋总览
    'big2':"/bigScreen/getSuggestInMonth", //投诉建议
    'big3':"/bigScreen/getProvinces", //小区分布
    'big4':"/bigScreen/getTheNumberOfHouseBindings", //房屋绑定率
    'big5':'/bigScreen/getInteractionInMonth',//获取互动
}
/******************      通用增删改查       ********************* */
/**
 * 通用列表
 * @param {*} param
 */
 export const currentList =  (key,param)=> {
    return API.GET(paramType[key]+"/list", param)
};
export const currentPage =  (key,param)=> {
    return API.GET(paramType[key]+"/page", param)
};
/**
 * 查询可选择的列表
 * @param {*} param
 */
 export const currentSelectList=  (key,param)=> {
    return API.GET(paramType[key]+"/selectList", param)
};


/**
 * 通用新增
 * @param {*} param
 */
 export const currentSave= (key,param)=> {
    return API.POST(paramType[key]+"/save", param)
};
/**
 * 通用修改
 * @param {*} param
 */
 export const currentUpdate=  (key,param) => {
    return API.POST(paramType[key]+"/update", param)
};

/**
 * 通用删除
 * @param {*} param
 */
 export const currentDelete= (key,param) => {
    return API.POST(paramType[key]+"/delete", param)
};

/**
 * 通用获取所有不分页
 * @param {*} param
 */
 export const currentSelect=  (key,param)=> {
    return API.GET(paramType[key]+"/select", param)
};

/**
 * 通用GET
 * @param {*} param
 */
 export const currentGET = (key,param)=> {
    return API.GET(paramType[key], param)
};
/**
 * 通用POST
 * @param {*} param
 */
 export const currentPOST=  (key,param)=> {
    return API.POST(paramType[key], param)
};
// 通用接口集合
export const currentApi={
    currentList,
    currentPage,
    currentSave,
    currentUpdate,
    currentDelete,
    currentSelect,
    currentSelectList,
    currentPOST,
    currentGET
};
