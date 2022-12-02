<template>
    <div v-loading="loading" :style="'height:'+ height">
        <iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                src: "http://localhost:3000/d/w6s1tQdVk/1-windows_exporter-for-prometheus-dashboard-cn-v20201012?orgId=1",
                height: document.documentElement.clientHeight - 69.5 + "px;",
                loading: true
            };
        },
        mounted: function() {
            setTimeout(() => {
                this.loading = false;
            }, 230);
            const that = this;
            window.onresize = function temp() {
                that.height = document.documentElement.clientHeight - 69.5 + "px;";
            };
        }
    };
</script>

<style>
</style>
