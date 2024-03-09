<template>
    <view class="container">
        <view class="con">
            <view class="list">
                <view class="left-con">
                    <view class="name">03.04 衣服卡①</view>
                    <view class="time">发布时间：2024-03-04 13:39</view>
                </view>
                <view class="button">
                    立即领取
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    onShow: function () {
        uni.setNavigationBarTitle({ title: '领取礼品卡' })
    },

    onLoad: function (options) {
    },
    methods: {

    },
};
</script>

<style>
@import "./exchange-area.css";
</style>