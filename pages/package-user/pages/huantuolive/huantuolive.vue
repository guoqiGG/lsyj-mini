<template>
    <web-view :src="urls"></web-view>
</template>
<script>
export default {
    data() {
        return {
            urls: null
        }
    },
    onLoad(options) {
        if (options.urls) {
            this.urls = decodeURIComponent(options.urls)
            console.log(this.urls)
        }
    },
    methods: {
        goHome() {
            uni.switchTab({ url: "/pages/index/index" });
        }
    },

}
</script>
<style></style>