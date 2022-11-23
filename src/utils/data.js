// 主要用于存储获取常用数据的方法

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
    return this.$http({
        url: '/sysDictData/getDict?dictType=' + dictType,
        method: 'get'
    })
}