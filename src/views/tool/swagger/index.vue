<template>
  <div v-loading="loading" :style="'height:'+ height">
    <iframe :src="doc" frameborder="no" style="width: 100%;height: 100%" scrolling="auto"/>
  </div>
</template>
<script>
export default {
  name: "Swagger",
  data() {
    return {
      doc: "http://localhost:8080/doc.html",
      src: "http://localhost:8080/swagger-ui.html",
      height: document.documentElement.clientHeight - 94.5 + "px;",
      loading: true
    };
  },
  mounted: function () {
    setTimeout(() => {
      this.loading = false;
    }, 300);
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 94.5 + "px;";
    };
  }
};
</script>
