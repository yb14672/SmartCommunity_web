<template>
  <div>
    <template v-for="(item, index) in options">
      <el-tag
          :type="item.listClass == 'primary' ? '' : item.listClass"
          v-if="item.dictValue==value"
          :key="item.dictValue"
          :index="index"
          :class="item.cssClass"
      >
        {{ item.dictLabel }}
      </el-tag>
    </template>
  </div>
</template>

<script>
export default {
  name: "DictTag",
  props: {
    options: {
      type: Array,
      default: null,
    },
    value: [Number, String, Array],
  },
};
</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>