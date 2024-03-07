<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
    <view class="Mall4j con">
        <view class="h-tabs">
            <!-- 我的优惠券状态(优惠券状态 0:失效 1:有效 2:使用过) -->
            <view :class="'h-tab ' + (coupon_state == 'SENDED' ? 'on' : '')" data-type="SENDED" @tap="changeTab">可合并
            </view>
            <view :class="'h-tab ' + (coupon_state == 'MERGED' ? 'on' : '')" data-type="MERGED" @tap="changeTab">已合并
            </view>
        </view>

        <view class="container">
            <view class="item" v-for="(item, index) in 5" :key="index">
                <view class="left">
                    <image src="../../static/icon_delivery.png" mode="scaleToFill" />
                </view>
                <view class="right">
                    <view class="coupon-name">龙年首播鸡蛋卡(1)</view>
                    <view class="coupon-text" v-if="coupon_state == 'MERGED'">合成时间：2024-03-07</view>
                    <view class="coupon-text" v-if="coupon_state == 'SENDED'||coupon_state == 'MERGED'">领取时间：2024-03-07 08:00:00</view>
                </view>
                <view class="use" v-if="coupon_state == 'SENDED'">
                    <text class="text">合并</text>
                </view>

                <!-- <view class="use" v-if="coupon_state == 'MERGED'">核销</view> -->
                <view class="use used" v-if="coupon_state == 'MERGED' ">已核销</view>
            </view>
            <!-- 空列表或加载全部提示 -->
            <EmptyAllTips v-if="isLoaded" :isEmpty="!dataList.length" emptyTips="暂无数据" :isAll="isAll" />
        </view>
    </view>
</template>
<script>
//   const http = require("@/utils/http.js");
//   const util = require("@/utils/util.js");
import dayjs from "dayjs";
export default {
    data() {
        return {
            isLoaded: false,
            coupon_state: "SENDED", //SENDED：可用  USED：已核销 EXPIRED：已过期
            dataList: [],
            isAll: false,
            remark: "",
        };
    },
    computed: {},
    created() { },
    onLoad: function (options) {
    },
    onShow: function () {
        uni.setNavigationBarTitle({
            title: "我的卡包",
        });
    },
    onUnload() { },
    methods: {
        // 标签切换事件
        changeTab(e) {
            this.coupon_state = e.currentTarget.dataset.type
            // this.getCardPackage();
        },
    },
};
</script>
<style>
@import "./card-package.css";
</style>