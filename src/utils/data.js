// 主要用于存储获取常用数据的方法
//导入axios
import axios from "axios";

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
    return axios({
        url: '/sysDictData/getDict?dictType=' + dictType,
        method: 'get'
    })
}