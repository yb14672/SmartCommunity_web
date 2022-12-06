<template>
    <div v-loading="loading" :style="'height:'+ height">
        <iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                src: "http://192.168.31.218:3000/d/facCaLKVk/windows-node-fixed-for-v0-13-0?orgId=1&refresh=1m&from=1670290831084&to=1670301631084",
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
